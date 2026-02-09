import Router from "koa-router";
import { sendMail } from "../controller/MailController.js";
import { sendOtp, verifyOTP } from "../controller/ProfileController.js";
import { authorizeUserEmail } from "../middleware/Auth.js";

const profileRouter = new Router({ prefix: "/profiles" });

profileRouter.get("/");
profileRouter.post("/otp", authorizeUserEmail, sendOtp); // generate otp, set expiry
profileRouter.post("/verify-otp", verifyOTP);
profileRouter.post("/mail", sendMail);

export default profileRouter;
