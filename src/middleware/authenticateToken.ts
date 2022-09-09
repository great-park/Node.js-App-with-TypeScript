import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import { response, errResponse } from '../interface/response/response';
import { message } from '../interface/response/responseMessage';
dotenv.config();

export const authToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('x-auth-token');

  // If token not found, send error message
  if (!token) {
    res.status(401).send(errResponse(message.TOKEN_EMPTY));
  } else {
    // Authenticate token
    try {
      const user: any = await jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
      );
      req.body.user = user.email;
      next();
    } catch (error) {
      res.status(403).send(errResponse(message.TOKEN_VERIFICATION_FAILURE));
    }
  }
};
