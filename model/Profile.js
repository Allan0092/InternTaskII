import { prisma } from "../prisma/prisma.ts";
import { getUserByEmail } from "./User.js";

const getAvatarURl = async (email) => {
  try {
    const { id: userId } = await prisma.user.findUnique({
      where: { email: email },
      select: { id: true },
    });

    const result = await prisma.profile.findUnique({
      where: { userId: userId },
      select: {
        avatarURL: true,
      },
    });
    return result?.avatarURL || null;
  } catch (e) {
    console.error(`error in getAvatarURL: ${e.message}`);
    return false;
  }
};

const setAvatarURL = async (email, url) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      include: { profile: true },
    });

    if (!user) throw new Error("User not found");

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });
    if (profile) {
      await prisma.profile.update({
        where: { userId: user.id },
        data: { avatarURL: url },
      });
    } else {
      await prisma.profile.create({
        data: {
          userId: user.id,
          avatarURL: url,
        },
      });
    }
    return true;
  } catch (e) {
    console.error(`error in setAvatarURL: ${e.message}`);
    return false;
  }
};

const getOtpExpireDate = async (email) => {
  try {
    const user = await getUserByEmail(email);
    if (!user) throw new Error("User not found.");

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: {
        resetPasswordExpire: true,
      },
    });
    if (!profile) throw new Error("User profile not found.");
    return profile.resetPasswordExpire;
  } catch (e) {
    console.error(`getPasswordExpireDate error: ${e.message}`);
    return false;
  }
};

const setOtpExpireDate = async (email, datetime = new Date()) => {
  try {
    console.log(`updating otp expiry ${email} : ${datetime}`);
    await prisma.profile.update({
      where: { email: email },
      data: { resetPasswordExpire: datetime },
    });
    return true;
  } catch (e) {
    console.error(`error in setOtpExpireDate: ${e.message}`);
    return false;
  }
};

const getOTPCode = async (email) => {
  try {
    const user = await getUserByEmail(email);
    if (!user) throw new Error("User not found.");

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { otp: true },
    });
    if (!profile) throw new Error("User Profile not found.");
    return profile.otp;
  } catch (e) {
    console.error(`error in getOTPCode: ${e.message}`);
    return false;
  }
};

const setOTPCode = async (email, code) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { id: true },
    });
    if (!user) throw new Error("User not found");
    await prisma.profile.update({
      where: { userId: user.id },
      data: { otp: code },
    });
    return true;
  } catch (e) {
    console.error(`Error in setOTPCode: ${e.message}`);
    return false;
  }
};

const setOtpCodeAndExpiry = async (email, otp, datetime) => {
  try {
    await prisma.profile.update({
      where: { email: email },
      data: { otp: otp, resetPasswordExpire: datetime },
    });
    return true;
  } catch (e) {
    console.error(`Error in setOtpCodeAndExpiry: ${e.message}`);
    return false;
  }
};

const setOtpCodeAndExpiryAndToken = async (email, otp, datetime, token) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { id: true },
    });

    if (!user) throw new Error("User not found");

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });
    if (profile) {
      await prisma.profile.update({
        where: { userId: user.id },
        data: { resetPasswordExpire: datetime, otp: otp, resetToken: token },
      });
    } else {
      await prisma.profile.create({
        data: {
          userId: user.id,
          resetPasswordExpire: datetime,
          otp: otp,
          resetToken: token,
        },
      });
    }
    return true;
  } catch (e) {
    console.error(`Error: ${e.message}`);
    throw e;
  }
};

const changeUserPassword = async (resetToken, password) => {
  try {
    const profile = await prisma.profile.findFirst({
      where: { resetToken: resetToken },
      select: { userId: true },
    });
    if (!profile) throw new Error("User reset token invalid");
    await prisma.user.update({
      where: { id: profile.userId },
      data: { password: password },
    });
    return true;
  } catch (e) {
    console.error(`Error: ${e.message}`);
    return false;
  }
};

const clearResetPasswordData = async (resetToken) => {
  try {
    await prisma.profile.update({
      where: { resetToken: resetToken },
      data: {
        otp: null,
        resetToken: null,
        resetPasswordExpire: null,
      },
    });
    return true;
  } catch (e) {
    console.error(`Error in clearResetPasswordData: ${e.message}`);
    return false;
  }
};

export {
  changeUserPassword,
  clearResetPasswordData,
  getAvatarURl,
  getOTPCode,
  getOtpExpireDate,
  setAvatarURL,
  setOTPCode,
  setOtpCodeAndExpiry,
  setOtpCodeAndExpiryAndToken,
  setOtpExpireDate,
};
