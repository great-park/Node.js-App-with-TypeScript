import { users, refreshTokens } from '../../database';
import JWT from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
/**
 * 함수는 일급 객체이므로 함수 리터럴로 생성한 함수 객체를 변수에 할당할 수 있다.
 * 이러한 정의 방식을 함수 표현식이라고 한다.
 */

/**
 * 회원가입 API
 * @param req
 * @param res
 * @returns
 */
export const signUp = async function (req: any, res: any) {
  const { email, password } = req.body;

  // Validate if user already exists
  const user = users.find((user) => {
    return user.email === email;
  });

  if (user) {
    return res.status(200).json({
      errors: [
        {
          email: user.email,
          msg: 'The user already exists',
        },
      ],
    });
  }

  // Hash password before saving to database
  const salt: string = await bcrypt.genSalt(10);
  console.log('salt:', salt);
  const hashedPassword: string = await bcrypt.hash(password, salt);
  console.log('hashed password:', hashedPassword);

  // Save email and password to database/array
  users.push({
    email,
    password: hashedPassword,
  });

  const accessToken = await JWT.sign(
    { email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '10s',
    }
  );

  res.json({
    accessToken,
  });
};

/**
 * 로그인 API
 * @param req
 * @param res
 * @returns
 */
export const login = async function (req: any, res: any) {
  const { email, password } = req.body;

  // Look for user email in the database
  const user = users.find((user) => {
    return user.email === email;
  });

  // If user not found, send error message
  if (!user) {
    return res.status(400).json({
      errors: [
        {
          msg: 'Invalid credentials',
        },
      ],
    });
  }

  // Compare hased password with user password to see if they are valid
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      errors: [
        {
          msg: 'Email or password is invalid',
        },
      ],
    });
  }

  // Send JWT access token
  const accessToken = await JWT.sign(
    { email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '10s', //예제를 위해 유효기간을 10초로. 보통은 10~15분
    }
  );
  const refreshToken = await JWT.sign(
    { email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '1m', //보통은 14일 정도
    }
  );

  refreshTokens.push(refreshToken);
  res.json({
    accessToken,
    refreshToken,
  });
};

export const getAccessToken = async function (req: any, res: any) {
  const refreshToken = req.header('x-auth-token');
  // If token is not provided, send error message
  if (!refreshToken) {
    res.status(401).json({
      errors: [
        {
          msg: 'Token not found',
        },
      ],
    });
  }
  // If token does not exist, send error message
  else if (!refreshTokens.includes(refreshToken)) {
    res.status(403).json({
      errors: [
        {
          msg: 'Invalid refresh token_1',
        },
      ],
    });
  } else {
    try {
      const user: any = await JWT.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      const { email } = user;

      const accessToken = await JWT.sign(
        { email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10s' }
      );
      res.json({ accessToken });
    } catch (error) {
      res.status(403).json({
        errors: [
          {
            msg: error,
            result: error.toString(),
          },
        ],
      });
    }
  }
};
