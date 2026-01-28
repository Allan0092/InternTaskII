const generateResponseBody = ({
  success = false,
  message = "An error occured",
  data = {},
} = {}) => {
  return { success: success, message: message, data: data };
};

export { generateResponseBody };
