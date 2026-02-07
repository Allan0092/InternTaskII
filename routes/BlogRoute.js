import Router from "koa-router";
import {
  addBlog,
  deleteBlog,
  getAllBlog,
  getBySlug,
} from "../controller/BlogController.js";
import { authorizeAdminRequest } from "../middleware/Auth.js";

const blogRouter = new Router({
  prefix: "/blogs",
});

blogRouter.get("/", getAllBlog);
blogRouter.get("/:slug", getBySlug);
blogRouter.post("/", addBlog);
blogRouter.delete("/:id", authorizeAdminRequest, deleteBlog);

export default blogRouter;
