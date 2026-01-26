import Koa from "koa";
import Parser from "koa-bodyparser";
import Router from "koa-router";
import { addBlog, getAllBlog, getBySlug } from "./controller/BlogController.js";

const app = new Koa();
const router = new Router();

router.post("/blog", addBlog);
router.get("/blog/:slug", getBySlug);
router.get("/blog", getAllBlog);

app.use(Parser());
app.use(router.routes());
app.listen(3001);
