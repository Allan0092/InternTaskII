import multer from "@koa/multer";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getAvatarURl,
  getOTPCode,
  getOtpExpireDate,
  setAvatarURL,
  setOtpCodeAndExpiry,
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

const generateOtpDigitsAndExpiry = ({ validMinutes = 10, digits = 6 } = {}) => {
  try {
    const generatedOtp = Math.floor(
      10 ** (digits - 1) + Math.random() * (9 * 10 ** (digits - 1)),
    ).toString(); // 6 digits
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + validMinutes); // 10 minutes
    return { otp: generatedOtp, validFor: expiryDate };
  } catch (e) {
    return;
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
    if (!getUserByEmail(email)) throw new Error("email not found.");

    const { otp: generatedOtp, validFor: generatedExpiry } =
      generateOtpDigitsAndExpiry();

    const mailsent = await sendOtpMail({
      email: email,
      otp: generatedOtp,
      expiry: "",
    });

    if (!mailsent) throw new Error("Please provide valid email.");

    const result = setOtpCodeAndExpiry(email, generatedOtp, generatedExpiry);

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

const verifyOTP = (ctx) => {
  try {
    const { email, otp: providedOtp } = ctx.request.body;

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

    ctx.body = generateResponseBody({
      success: true,
      message: "OTP code matches!",
    });
  } catch (e) {
    ctx.body = generateResponseBody({ error: e.message });
  }
};

export {
  getAvatarURl,
  provideAvatarURL,
  saveAvatarUrl,
  sendOtp,
  upload,
  verifyOTP,
};
