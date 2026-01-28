import { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {};

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div>
        <button className="border-2 border-black" onClick={() => navigate("/")}>
          Go Back to Homepage
        </button>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-900 ">Login Page</h1>
      </div>
      <div>
        <form action="" method="post">
          <div>
            email
            <input
              className="border"
              type="email"
              name="email"
              id="email"
              onChange={handleChange}
            />
          </div>
          <div>
            password
            <input
              className="border"
              type="password"
              name="password"
              id="password"
              onChange={handleChange}
            />
          </div>
          <button className="border" type="submit" onSubmit={handleSubmit}>
            Log In
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
