import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <>
      <div>
        <h1>Forgot Password</h1>
      </div>
      <div className="flex">
        <div className="flex flex-col">
          <div>Email:</div>
          <input
            name="email"
            id="email"
            type="email"
            placeholder="something@email.com"
            disabled={!loading}
            onChange={handleChange}
          />
        </div>
        <button
          className="border bg-blue-400 rounded-2xl"
          type="submit"
          onSubmit={handleSubmit}
        >
          send OTP
        </button>
      </div>
    </>
  );
};

export default ForgotPassword;
