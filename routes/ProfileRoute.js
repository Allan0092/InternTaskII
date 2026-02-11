import Router from "koa-router";
import {
  provideAvatarURL,
  saveAvatarUrl,
  sendOtp,
  upload,
  verifyOTPwithEmail,
} from "../controller/ProfileController.js";
import { authorizeUserEmail } from "../middleware/Auth.js";

const profileRouter = new Router({ prefix: "/profiles" });

profileRouter.get("/");
profileRouter.post("/otp", authorizeUserEmail, sendOtp); // generate otp, set expiry
profileRouter.post("/verify-otp", verifyOTPwithEmail);
// profileRouter.post("/mail", sendMail);
profileRouter.get("/avatar", provideAvatarURL);
profileRouter.post("/image", upload.single("avatar"), saveAvatarUrl);

export default profileRouter;
