// GET localhost:3001/blog
// POST localhost:3001/blog {title:"", content: ""}
// GET localhost:3001/blog/:slug

import axios from "axios";

// const URL = import.meta.env.VITE_SERVER_URL;

const getAllBlog = async () => {
  const req = await axios.get("http://localhost:3001/blog");
  if (req.status === axios.HttpStatusCode.Ok) {
    console.log(`Get All Blogs: ${req}`);

    return req.data?.message;
  } else {
    console.error(req);
  }
};
const createBlog = async (blog) => {
  const request = await axios.post("localhost:3001/blog", blog);
  if (request.status === axios.HttpStatusCode.Created) {
    return request.data?.message || "Blog added successfully";
  } else {
    console.error(request);
  }
};
const getBySlug = async (slug) => {
  const req = await axios.get(`localhost:3001/blog/`);
  if (req.status === axios.HttpStatusCode.Ok) {
    return req.data?.data;
  }
};

export { createBlog, getAllBlog, getBySlug };
