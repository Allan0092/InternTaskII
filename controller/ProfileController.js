import {
  getAvatarURl,
  getOTPCode,
  getOtpExpireDate,
  setOtpCodeAndExpiry,
} from "../model/Profile.js";
import { getUserByEmail } from "../model/User.js";
import { generateResponseBody } from "../utils/index.js";
import { sendOtpMail } from "./MailController.js";

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
    const { email } = ctx.request.body;
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
      message: e.message ?? "Error in retrieving avatar url",
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
    ctx.body = generateResponseBody();
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
    ctx.body = generateResponseBody();
  }
};

export { provideAvatarURL, sendOtp, verifyOTP };
