import cors from "@koa/cors";
import "dotenv/config.js";
import Koa from "koa";
import Parser from "koa-bodyparser";
import Router from "koa-router";

import blogRouter from "./routes/BlogRoute.js";
import userRouter from "./routes/UserRoute.js";

const app = new Koa();
const router = new Router({ prefix: "/api" });

const printRes = async (ctx, next) => {
  await next();
  console.log("Print Response");
  console.log(ctx.response);
};

const printReq = async (ctx, next) => {
  console.log("Print Request");
  console.log(ctx.request);
  await next();
};

router.use(blogRouter.routes());
router.use(userRouter.routes());

// router.post("/blog", addBlog);
// router.get("/blog/:slug", getBySlug);
// router.get("/blog", getAllBlog);

app.use(cors());
app.use(Parser());

app.use(printReq);
app.use(printRes);
app.use(router.routes());

console.log(`Server listening on port ${process.env.SERVER_PORT}`);
app.listen(process.env.SERVER_PORT);
