import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { logger } from '../../config/winston';
dotenv.config();

export const authToken = async (req: any, res: any, next: any) => {
  const token = req.header('x-auth-token');

  // If token not found, send error message
  if (!token) {
    res.status(401).json({
      errors: [
        {
          msg: 'Token not found',
        },
      ],
    });
  } else {
    // Authenticate token
    try {
      const user: any = await jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
      );
      req.user = user.email;
      next();
    } catch (error) {
      res.status(403).json({
        errors: [
          {
            msg: 'Invalid token',
          },
        ],
      });
    }
  }
};
