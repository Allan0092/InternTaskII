import jwt from "jsonwebtoken";
import { generateResponseBody } from "../utils/index.js";

const authenticateToken = (token) => {
  //   const token = ctx.request.header("Authorization")?.split(" ")[1];
  console.log(`Authorization token: ${token}`);
  if (!token) {
    return false;
  }
  try {
    const verify = jwt.verify(token, process.env.SECRET_KEY);
    console.log(verify);
    return verify;
  } catch (e) {
    ctx.response.status = 400;
    ctx.body = generateResponseBody({ message: "Invalid token" });
    return false;
  }
};

const authoriseRole = (token, role) => {
  try {
    const user = authenticateToken(token);
    return user.role === role;
  } catch (e) {
    return false;
  }
};

const authorizeAdminRequest = async (ctx, next) => {
  try {
    const token = ctx.header["authorization"].split(" ")[1];
    const isValid = authoriseRole(token, "ADMIN");
    if (!isValid) throw new Error("Action not authorized");

    await next();
  } catch (e) {
    console.error(
      `Error in authorizing role: ${e.message ?? "Error in authorising role"}`,
    );
    ctx.body = generateResponseBody({
      error: e.message ?? "Error in authorising role",
    });
  }
};

const authorizeUserEmail = async (ctx, next) => {
  try {
    const { email } = ctx.request.body;
    const token = ctx.header["authorization"].split(" ")[1];

    if (!jwt.verify(token, process.env.SECRET_KEY)) {
      ctx.body = generateResponseBody({ message: "Invalid token" });
      return false;
    }
    const decoded = jwt.decode(token);
    if (decoded.email === email) await next();
  } catch (e) {
    ctx.body = generateResponseBody({ message: "error in authorizing email" });
  }
};

export {
  authenticateToken,
  authoriseRole,
  authorizeAdminRequest,
  authorizeUserEmail,
};
