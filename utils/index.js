import jwt from "jsonwebtoken";
import path from "node:path";

const generateResponseBody = ({
  success = false,
  message = "An error occured",
  data = {},
  error = "",
} = {}) => {
  return success
    ? { success: success, message: message, data: data }
    : { success: success, message: message, data: data, error: error };
};

const extractEmailFromToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded.email) throw new Error("Email not provided in token");

    return decoded.email;
  } catch (e) {
    console.error(`Error extracting email from token: ${e.message}`);
    return false;
  }
};

const generateUniqueFileName = (file) => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const ext = path.extname(file.originalname);
  return `${file.fieldname}-${uniqueSuffix}${ext}`;
};

export { extractEmailFromToken, generateResponseBody, generateUniqueFileName };
