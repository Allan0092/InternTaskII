import { prisma } from "../prisma/prisma.ts";

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
