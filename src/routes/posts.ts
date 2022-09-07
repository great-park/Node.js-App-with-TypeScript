import express from 'express';
import { publicPosts, privatePosts } from '../../database';
import { authToken } from '../middleware/authenticateToken';

const router = express.Router();

/**
 * 5. pulic 게시글 조회 API
 */
router.get('/public', (req, res) => {
  res.json(publicPosts);
});

/**
 * 6. private 게시글 조회 API (회원용)
 */
router.get('/private', authToken, (req, res) => {
  res.json(privatePosts);
});

module.exports = router;
