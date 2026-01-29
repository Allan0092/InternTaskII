import jwt from "jsonwebtoken";
import { generateResponseBody } from "../utils/index.js";

const authenticateToken = (token) => {
  //   const token = ctx.request.header("Authorization")?.split(" ")[1];
  console.log(`Authorization token: ${token}`);
  if (!token) {
    ctx.response.status = 401;
    ctx.body = generateResponseBody({ message: "No token provided" });
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

export { authenticateToken, authoriseRole };
