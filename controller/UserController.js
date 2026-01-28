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
      message: "Something went wrong. try again later.",
    });
  }
};

const getUsers = async (ctx) => {
  try {
    const users = await getAllUsers();
    if (!users) {
      ctx.response.status = 500;
      ctx.body = generateResponseBody({ message: "Could not get users" });
      return;
    }
    ctx.body = users;
    console.log(`Users retrieved: ${users}`);
  } catch (e) {
    ctx.response.body = 500;
    ctx.body = generateResponseBody("Could not retrieve users.");
  }
};

const login = async (ctx) => {
  try {
    const { email, password } = ctx.request.body;
    const user = await getUserByEmail(email);
    if (!user) {
      console.error(`Login error: ${e.message}`);
      ctx.response.body = 500;
      ctx.body = generateResponseBody({
        message: "User email cannot be found",
      });
    }
  } catch (e) {
    console.error(`Login error: ${e.message}`);
    ctx.response.body = 500;
    ctx.body = generateResponseBody();
  }
};

export { getUsers, registerUser };
