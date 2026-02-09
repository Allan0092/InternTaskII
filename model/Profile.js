import { prisma } from "../prisma/prisma.ts";

const getAvatarURl = async (email) => {
  try {
    const avatarURL = await prisma.profile.findUnique({
      where: { email: email },
      select: {
        profile: {
          select: {
            avatarURL: true,
          },
        },
      },
    });
    return avatarURL;
  } catch (e) {
    console.error(`error in getAvatarURL: ${e.message}`);
    return false;
  }
};

const setAvatarURL = async (email, url) => {
  await prisma.profile.update({
    where: { email: email },
    data: { avatarURL: url },
  });
};

const getOtpExpireDate = async (email) => {
  try {
    return await prisma.profile.findUnique({
      where: { email: email },
      select: {
        resetPasswordExpire: true,
      },
    });
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
    return await prisma.profile.findUnique({
      where: { email: email },
      select: { otp: true },
    });
  } catch (e) {
    console.error(`error in getOTPCode: ${e.message}`);
    return false;
  }
};

const setOTPCode = async (email, code) => {
  try {
    await prisma.profile.update({
      where: { email: email },
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

export {
  getAvatarURl,
  getOTPCode,
  getOtpExpireDate,
  setAvatarURL,
  setOTPCode,
  setOtpCodeAndExpiry,
  setOtpExpireDate,
};
