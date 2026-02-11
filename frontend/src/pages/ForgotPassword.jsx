import { useState } from "react";
import { sendAxiosRequest } from "../utils/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await sendAxiosRequest({
        method: "post",
        url: "/profiles/otp",
        body: { email: email },
      });
    } catch (e) {
      console.warn(e.response);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="flex flex-row items-center ">
        <h1>Forgot Password</h1>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex flex-row">
          <div>Email:</div>
          <input
            name="email"
            id="email"
            type="email"
            placeholder="something@email.com"
            disabled={loading}
            onChange={handleChange}
            className="border"
          />
        </div>
        <button
          className="border bg-blue-400 rounded-2xl p-2 m-2"
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          send OTP
        </button>
      </div>
    </>
  );
};

export default ForgotPassword;
