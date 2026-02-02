import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendAxiosRequest } from "../utils/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const req = await sendAxiosRequest({
        method: "post",
        body: formData,
        url: "/users/register",
      });
      if (!req || !req.success) {
        setErrorMsg("Invalid response from server");
        return;
      }

      if (req.success) {
        navigate("/login");
      } else {
        setErrorMsg(req.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Register error:", error);

      if (error.response) {
        setErrorMsg(
          error.response.data?.message ||
            `Error: ${error.response.status} - Invalid credentials`,
        );
      } else if (error.request) {
        setErrorMsg("No response from server. Please check your connection.");
      } else {
        setErrorMsg("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-400 min-h-screen   flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="  p-6">
            <h1 className="text-3xl font-bold  text-center">Create Account</h1>
            <p className="text-amber-50 text-center mt-2">
              Join us today and get started
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
                type="text"
                name="name"
                id="name"
                disabled={Loading}
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
                type="email"
                name="email"
                id="email"
                disabled={Loading}
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
                type="password"
                name="password"
                id="password"
                disabled={Loading}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                disabled={Loading}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              className="w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-amber-500 hover:to-orange-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
              disabled={Loading}
              type="submit"
            >
              Create Account
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-amber-600 hover:text-amber-700 font-medium"
              >
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
