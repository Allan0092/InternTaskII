import Router from "koa-router";
import {
  addBlog,
  getAllBlog,
  getBySlug,
} from "../controller/BlogController.js";

const blogRouter = new Router({
  prefix: "/blogs",
});

blogRouter.get("/", getAllBlog);
blogRouter.get("/:slug", getBySlug);
blogRouter.post("/", addBlog);

export default blogRouter;
