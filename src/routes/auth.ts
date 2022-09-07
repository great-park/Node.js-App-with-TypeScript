/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { users } from '../../database';
import * as auth from '../controllers/authController';

const router = express.Router();

/**
 * 1. 회원가입 API
 */
router.post('/signup', auth.signUp);

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
router.post('/token', auth.getAccessToken);

module.exports = router;
