import { users, refreshTokens } from '../../database';
import { NextFunction, Request, Response } from 'express';
import { response, errResponse } from '../interface/response/response';
import { message } from '../interface/response/responseMessage';
import JWT from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
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
export const signUp = async function (req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (user) {
    return res
      .status(200)
      .send(errResponse(message.SIGNUP_USER_ALREADY_EXISTS));
  }

  // Hash password before saving to database
  const salt: string = await bcrypt.genSalt(10);
  const hashedPassword: string = await bcrypt.hash(password, salt);

  const addUser = {
    email: email,
    password: hashedPassword,
    refreshTokens: '',
  };
  await prisma.user.create({
    data: addUser,
  });

  const accessToken = await JWT.sign(
    { email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '10s',
    }
  );

  res.send(response(message.SUCCESS, accessToken));
};

/**
 * 로그인 API
 * @param req
 * @param res
 * @returns
 */
export const login = async function (req: Request, res: Response) {
  const { email, password } = req.body;

  // Look for user email in the database
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  // If user not found, send error message
  if (!user) {
    return res.status(400).send(errResponse(message.SIGNIN_EMAIL_NOT_EXISTS));
  }

  // Compare hased password with user password to see if they are valid
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res
      .status(401)
      .send(errResponse(message.SIGNIN_EMAIL_PASSWORD_INVALID));
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

  const updateUser = await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      refreshToken: refreshToken,
    },
  });

  res.send(response(message.SUCCESS, { accessToken, refreshToken }));
};

export const getAccessToken = async function (req: Request, res: Response) {
  const refreshToken = req.header('x-auth-token');
  // If token is not provided, send error message
  if (!refreshToken) {
    res.status(401).send(errResponse(message.TOKEN_EMPTY));
  }
  // If token does not exist, send error message
  else if (!refreshTokens.includes(refreshToken)) {
    res.status(403).send(errResponse(message.TOKEN_VERIFICATION_FAILURE));
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

      res.send(response(message.SUCCESS, { accessToken: accessToken }));
    } catch (error) {
      //others
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
