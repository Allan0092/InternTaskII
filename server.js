import cors from "@koa/cors";
import "dotenv/config.js";
import Koa from "koa";
import Parser from "koa-bodyparser";
import Router from "koa-router";

import blogRouter from "./routes/BlogRoute.js";

const app = new Koa();
const router = new Router({ prefix: "/api" });

router.use(blogRouter.routes());

// router.post("/blog", addBlog);
// router.get("/blog/:slug", getBySlug);
// router.get("/blog", getAllBlog);

app.use(cors());
app.use(Parser());

app.use(router.routes());

console.log(`Server listening on port ${process.env.SERVER_PORT}`);
app.listen(process.env.SERVER_PORT);
