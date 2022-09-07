import express from "express";
import { publicPosts, privatePosts } from "../../database";
import {authToken} from "../middleware/authenticateToken";


const router = express.Router();

router.get("/public", (req, res) => {
  res.json(publicPosts);
});

router.get("/private", authToken, (req, res) => {
  res.json(privatePosts);
});

module.exports = router;
