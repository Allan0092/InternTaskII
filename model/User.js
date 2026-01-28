import bcrypt from "bcryptjs";
import { prisma } from "../prisma/prisma.ts";

const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({ orderBy: { role: "asc" } });
    console.log(users);
    return users;
  } catch (e) {
    console.error(e.message);
    return false;
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  } catch (e) {
    console.error(e.message);
    return false;
  }
};

const addNewUser = async ({ email, name, password }) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const conn = await prisma.user.create({
      data: { email: email, password: hashedPassword, name: name },
    });
    return true;
  } catch (e) {
    console.error(e.message);
    return false;
  }
};

export { addNewUser, getAllUsers, getUserByEmail };
