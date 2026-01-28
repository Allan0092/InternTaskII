import Router from "koa-router";
import { getUsers, login, registerUser } from "../controller/UserController.js";

const userRouter = new Router({
  prefix: "/user",
});

userRouter.get("/all", getUsers);
userRouter.post("/register", registerUser);
userRouter.post("/login", login);

export default userRouter;
