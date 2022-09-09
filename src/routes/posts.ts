import express, { Request, Response } from 'express';
import { publicPosts, privatePosts, users } from '../../database';
import { authToken } from '../middleware/authenticateToken';
import { response, errResponse } from '../interface/response/response';
import { message } from '../interface/response/responseMessage';
const router = express.Router();

/**
 * 5. pulic 게시글 조회 API
 */
router.get('/public', (req: Request, res: Response) => {
  res.send(response(message.SUCCESS, publicPosts));
});

/**
 * 6. private 게시글 조회 API (회원용)
 */
router.get('/private', authToken, (req, res) => {
  res.send(response(message.SUCCESS, privatePosts));
});

module.exports = router;
