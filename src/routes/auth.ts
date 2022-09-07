/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import { users } from '../../database';
const router = express.Router();
dotenv.config();

// Sign up
router.post(
  '/signup',
  [
    check('email', 'Invalid email').isEmail(),
    check('password', 'Password must be at least 6 chars long').isLength({
      min: 6,
    }),
  ],
  async (req: any, res: any) => {
    const { email, password } = req.body;

    // Validate user input
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    // Validate if user already exists
    const user = users.find((user) => {
      return user.email === email;
    });

    if (user) {
      // 422 Unprocessable Entity: server understands the content type of the request entity
      // 200 Ok: Gmail, Facebook, Amazon, Twitter are returning 200 for user already exists
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

    // Do not include sensitive information in JWT
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
  }
);

// Error status code
// 401 Unauthorized: it’s for authentication, not authorization. Server says "you're not authenticated".
// 403 Forbidden: it's for authorization. Server says "I know who you are,
//                but you just don’t have permission to access this resource".

///////////////////////////

// Get all users
router.get('/users', (req, res) => {
  res.json(users);
});

// Log in
router.post('/login', async (req, res) => {
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

  //To do : db에 refreshToken 저장
  // Set refersh token in refreshTokens array
  refreshTokens.push(refreshToken);
  res.json({
    accessToken,
    refreshToken,
  });
});

//db에서 가져온 refreshToken - 예시용
const refreshTokens: Array<string> = [];

//Create new access token from refresh token
router.post('/token', async (req: any, res: any) => {
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
});

module.exports = router;
