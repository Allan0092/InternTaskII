import Router from "koa-router";
import { getUsers, registerUser } from "../controller/UserController.js";

const userRouter = new Router({
  prefix: "/user",
});

userRouter.get("/all", getUsers);
userRouter.post("/register", registerUser);

export default userRouter;
