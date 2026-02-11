import multer from "@koa/multer";
import bcrypt from "bcryptjs";
import "dotenv/config.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { v4 } from "uuid";

import {
  changeUserPassword,
  clearResetPasswordData,
  getAvatarURl,
  getOtpAndExpireDateByToken,
  getOTPCode,
  getOtpExpireDate,
  setAvatarURL,
  setOtpCodeAndExpiryAndToken,
} from "../model/Profile.js";
import { getUserByEmail } from "../model/User.js";
import { extractEmailFromToken, generateResponseBody } from "../utils/index.js";
import { sendOtpMail } from "./MailController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

const saveAvatarUrl = async (ctx) => {
  try {
    const file = ctx.request.file;
    if (!file) throw new Error("No file uploaded.");

    const token = ctx.header["authorization"]?.split(" ")[1];
    if (!token) throw new Error("Token not provided.");

    const email = await extractEmailFromToken(token);
    if (!email) throw new Error("Email not provided in token");

    const fileName = file.filename;
    const result = await setAvatarURL(email, fileName);

    if (!result) throw new Error("Failed to save avatar URL");

    ctx.body = generateResponseBody({
      success: true,
      message: "Image uploaded successfully",
      data: { avatarURL: fileName },
    });
  } catch (e) {
    console.error(`Error in saving avatar url: ${e.message}`);

    ctx.body = generateResponseBody({
      error: e.message ?? "Could not save image",
    });
  }
};

const generateOtpDigitsAndExpiryAndToken = ({
  validMinutes = 10,
  digits = 6,
} = {}) => {
  try {
    const generatedOtp = Math.floor(
      10 ** (digits - 1) + Math.random() * (9 * 10 ** (digits - 1)),
    ).toString(); // 6 digits

    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + validMinutes); // 10 minutes

    const token = v4();

    return { otp: generatedOtp, validFor: expiryDate, token: token };
  } catch (e) {
    throw e;
  }
};

const provideAvatarURL = async (ctx) => {
  try {
    // const { email } = ctx.request.body;
    const token = ctx.header["authorization"]?.split(" ")[1];
    const email = await extractEmailFromToken(token);
    const url = await getAvatarURl(email);
    if (!url) {
      ctx.response.status = 404;
      throw new Error("failed to retrieve avatar url");
    }
    ctx.body = generateResponseBody({
      success: true,
      message: "Avatar image url retrieved successfully",
      data: { avatarURL: url },
    });
  } catch (e) {
    console.error(e.message);
    ctx.body = generateResponseBody({
      error: e.message ?? "Error in retrieving avatar url",
    });
  }
};
const sendOtp = async (ctx) => {
  try {
    const { email } = ctx.request.body;
    const user = await getUserByEmail(email);
    if (!user) throw new Error("email not found.");

    const {
      otp: generatedOtp,
      validFor: generatedExpiry,
      token,
    } = generateOtpDigitsAndExpiryAndToken();

    const resetURL = `${process.env.FRONTEND_URL}/reset/${token}`;

    const mailsent = await sendOtpMail({
      email: email,
      otp: generatedOtp,
      expiry: "",
      resetURL: resetURL,
    });

    if (!mailsent) throw new Error("Please provide valid email.");

    const result = setOtpCodeAndExpiryAndToken(
      email,
      generatedOtp,
      generatedExpiry,
      token,
    );

    if (!result) throw new Error("otp cannot be stored");

    ctx.body = generateResponseBody({
      success: true,
      message: "otp sent",
      data: { otp: generatedOtp, expiry: generatedExpiry },
    });
  } catch (e) {
    console.error(e.message);
    ctx.body = generateResponseBody({ error: e.message });
  }
};

const verifyOTPwithEmail = async (ctx, next) => {
  try {
    const { email, otp: providedOtp } = ctx.request.body;

    const expiryDate = await getOtpExpireDate(email);
    if (!expiryDate) {
      ctx.body = generateResponseBody({ message: "otp has not been sent" });
      return;
    }
    const now = new Date();
    if (now > expiryDate) {
      ctx.body = generateResponseBody({ message: "the otp code has expired" });
      return;
    }

    const otp = await getOTPCode(email);
    if (!otp) {
      ctx.body = generateResponseBody({
        message: "Otp code has not been generated",
      });
      return;
    }

    if (otp !== providedOtp) {
      ctx.body = generateResponseBody({ message: "Invalid otp" });
      return;
    }

    ctx.body = generateResponseBody({
      success: true,
      message: "OTP code matches!",
    });
    await next();
  } catch (e) {
    ctx.body = generateResponseBody({ error: e.message });
  }
};

const verifyOTP = async (ctx, next) => {
  try {
    const { otp: providedOtp } = ctx.request.body;

    const expiryDate = getOtpExpireDate(email);
    if (!expiryDate) {
      ctx.body = generateResponseBody({ message: "otp has not been sent" });
      return;
    }
    const now = new Date();
    if (now > expiryDate) {
      ctx.body = generateResponseBody({ message: "the otp code has expired" });
      return;
    }

    const otp = getOTPCode(email);
    if (!otp) {
      ctx.body = generateResponseBody({
        message: "Otp code has not been generated",
      });
      return;
    }

    if (otp !== providedOtp) {
      ctx.body = generateResponseBody({ message: "Invalid otp" });
      return;
    }

    // ctx.body = generateResponseBody({
    //   success: true,
    //   message: "OTP code matches!",
    // });
    await next();
  } catch (e) {
    ctx.body = generateResponseBody({ error: e.message });
  }
};

const resetPassword = async (ctx) => {
  try {
    const { resetToken, password, confirmPassword } = ctx.request.body; //TODO: resetToken
    if (!password || !confirmPassword)
      throw new Error("Password or confirm Password missing.");
    if (!password === confirmPassword)
      throw new Error("Password and confirm Password does not match.");

    if (!resetToken) throw new Error("Reset token not provided.");

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await changeUserPassword(resetToken, hashedPassword);
    if (!result) throw new Error("Could not change password.");
    const flush = await clearResetPasswordData(resetToken);
    if (!flush) throw new Error("Could not erase data after password reset.");

    ctx.body = generateResponseBody({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (e) {
    ctx.body = generateResponseBody({ error: e.message });
  }
};

const verifyOTPwithToken = async (ctx, next) => {
  try {
    const { resetToken, otp: providedOtp } = ctx.request.body;

    const { resetPasswordExpire: expiryDate, otp } =
      await getOtpAndExpireDateByToken(resetToken);
    if (!expiryDate) {
      ctx.body = generateResponseBody({ message: "otp has not been sent" });
      return;
    }
    const now = new Date();
    if (now > expiryDate) {
      ctx.body = generateResponseBody({ message: "the otp code has expired" });
      return;
    }

    if (!otp) {
      ctx.body = generateResponseBody({
        message: "Otp code has not been generated",
      });
      return;
    }

    if (otp !== providedOtp) {
      ctx.body = generateResponseBody({ message: "Invalid otp" });
      return;
    }

    ctx.body = generateResponseBody({
      success: true,
      message: "OTP code matches!",
    });
    await next();
  } catch (e) {
    ctx.body = generateResponseBody({ error: e.message });
  }
};
export {
  getAvatarURl,
  provideAvatarURL,
  resetPassword,
  saveAvatarUrl,
  sendOtp,
  upload,
  verifyOTP,
  verifyOTPwithEmail,
  verifyOTPwithToken,
};
