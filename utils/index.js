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

export { generateResponseBody };
