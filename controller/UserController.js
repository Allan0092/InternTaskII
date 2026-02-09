import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authoriseRole } from "../middleware/Auth.js";
import { addNewUser, getAllUsers, getUserByEmail } from "../model/User.js";
import { generateResponseBody } from "../utils/index.js";

const registerUser = async (ctx) => {
  try {
    const { email, name, password } = ctx.request.body;
    console.log(`New user to register: ${email}`);
    const success = await addNewUser({
      email: email,
      name: name,
      password: password,
    });
    if (!success) {
      ctx.response.status = 500;
      ctx.body = generateResponseBody({ message: "User not registered" });
      return;
    }

    ctx.response.status = 201;
    ctx.body = generateResponseBody({
      success: true,
      message: "User registered successfully.",
    });
  } catch (e) {
    ctx.response.status = 500;
    ctx.body = generateResponseBody({
      error: "Something went wrong. try again later.",
    });
  }
};

const getUsers = async (ctx) => {
  try {
    // ADMIN validation
    const token = ctx.header.authorization?.split(" ")[1];
    if (!authoriseRole(token, "ADMIN")) {
      ctx.response.status = 403;
      ctx.body = generateResponseBody({ message: "Insufficient permission" });
      return;
    }

    const users = await getAllUsers();
    if (!users) {
      ctx.response.status = 500;
      ctx.body = generateResponseBody({ message: "Could not get users" });
      return;
    }
    ctx.body = generateResponseBody({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
    console.log(`Users retrieved: ${users}`);
  } catch (e) {
    ctx.response.body = 500;
    ctx.body = generateResponseBody({ error: "Could not retrieve users." });
  }
};

const login = async (ctx) => {
  try {
    const { email, password } = ctx.request.body;
    const user = await getUserByEmail(email);
    if (!user) {
      ctx.response.status = 401;
      ctx.response.body = generateResponseBody({
        message: "User email cannot be found",
      });
      return;
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      ctx.response.status = 401;
      ctx.response.body = generateResponseBody({
        message: "Password incorrect",
      });
      return;
    }
    const token = jwt.sign(
      { email: email, name: user.name, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "12h" },
    );
    ctx.body = generateResponseBody({
      success: true,
      message: "User login successful",
      data: { token: token, role: user.role, name: user.name },
    });
  } catch (e) {
    console.error(`Login error: ${e.message}`);
    ctx.response.body = 500;
    ctx.body = generateResponseBody({ error: e.message });
  }
};

export { getUsers, login, registerUser };
