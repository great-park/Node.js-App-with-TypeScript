/**
 * 간단한 API 테스트를 위한 sample 데이터
 */

const users = [
  {
    email: "kim@gmail.com",
    password: "KimPassword",
  },
  {
    email: "park@gmail.com",
    password: "JackPassword",
  },
];

//jwt없이 조회 가능 posts
const publicPosts = [
  {
    title: "Post 1",
    content: "Post 1 is free",
  },
  {
    title: "Post 2",
    content: "Post 2 is free",
  },
];

//jwt있어야 조회 가능 posts
const privatePosts = [
  {
    title: "Post 3",
    content: "Post 3 is private",
  },
  {
    title: "Post 4",
    content: "Post 4 is private",
  },
];

module.exports = { users, publicPosts, privatePosts };
