/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import { users, refreshTokens } from '../../database';
import * as auth from '../controllers/authController';
// import { check, validationResult } from 'express-validator';

const router = express.Router();
dotenv.config();

/**
 * 1. 회원가입 API
 */
router.post('/signup', auth.signUp);

// Error status code
// 401 Unauthorized: it’s for authentication, not authorization. Server says "you're not authenticated".
// 403 Forbidden: it's for authorization. Server says "I know who you are,
//                but you just don’t have permission to access this resource".

///////////////////////////

/**
 * 2. 회원 조회 API
 */
router.get('/users', (req, res) => {
  res.json(users);
});

/**
 * 3. 로그인 API
 */
router.post('/login', auth.login);

/**
 * 4. access token 재발급 API
 */
//Create new access token from refresh token
router.post('/token', auth.getAccessToken);

module.exports = router;
