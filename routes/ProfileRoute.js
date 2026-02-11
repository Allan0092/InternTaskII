import Router from "koa-router";
import {
  provideAvatarURL,
  resetPassword,
  saveAvatarUrl,
  sendOtp,
  upload,
  verifyOTPwithToken,
} from "../controller/ProfileController.js";
import { verifyEmailExists } from "../middleware/Auth.js";

const profileRouter = new Router({ prefix: "/profiles" });

profileRouter.get("/");
profileRouter.post("/otp", verifyEmailExists, sendOtp); // generate otp, set expiry
// profileRouter.post("/verify-otp", verifyOTPwithEmail, resetPassword);
profileRouter.post("/password/reset", verifyOTPwithToken, resetPassword);
// profileRouter.post("/password/reset", verifyOTP, resetPassword);

// profileRouter.post("/mail", sendMail);
profileRouter.get("/avatar", provideAvatarURL);
profileRouter.post("/image", upload.single("avatar"), saveAvatarUrl);

export default profileRouter;
