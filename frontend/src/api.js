// GET localhost:3001/blog
// POST localhost:3001/blog {title:"", content: ""}
// GET localhost:3001/blog/:slug

import axios from "axios";

const URL = import.meta.env.VITE_SERVER_URL;

const sendAxiosRequest = async ({
  method,
  url = URL,
  body = {},
  query = {},
  header = {},
}) => {
  const api = axios.create({
    baseURL: `${URL}`,
    headers: header,
    url: url,
    method: method,
  });
  try {
    const response = await axios({
      method: method.toLowerCase(),
      baseURL: URL,
      url: url,
      params: query,
      data: body,
      headers: {
        "Content-Type": "application/json",
        ...header,
      },
    });
    return response.data;
  } catch (e) {
    console.error("error in sendAxiosRequest: ", e);
  }
};

const getAllBlog = async () => {
  //   const req = await axios.get("http://localhost:3001/blog");
  //   if (req.status === axios.HttpStatusCode.Ok) {
  //     console.log(`Get All Blogs: ${req}`);

  //     return req.data?.message;
  //   } else {
  //     console.error(req);
  //   }
  const blogs = await sendAxiosRequest((method = "get"));
  return blogs;
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

export { createBlog, getAllBlog, getBySlug, sendAxiosRequest };
