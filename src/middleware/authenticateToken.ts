import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { logger } from '../../config/winston';
dotenv.config();

export const authToken = async (req: any, res: any, next: any) => {
  // Option 1
  // const authHeader = req.headers["authorization"];
  // const token = authHeader && authHeader.split(" ")[1]; // Bearer Token

  // Option 2
  const token = req.header("x-auth-token");
  logger.debug(`진입`);

  // If token not found, send error message
  if (!token) {
    res.status(401).json({
      errors: [
        {
          msg: "Token not found",
        },
      ],
    });
  } else {
    // Authenticate token
    try {
      const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      // req.user = user.email;
      logger.debug(`user : ${user}`);
      logger.debug(`user type : ${typeof(user)}`);
      next();
    } catch (error) {
      res.status(403).json({
        errors: [
          {
            msg: "Invalid token",
          },
        ],
      });
    }
  }
};
