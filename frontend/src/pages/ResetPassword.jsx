import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const [loading, isLoading] = useState(false);
  const [formData, setFormData] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefult();

    console.log(`dataTosend: ${formData}`);
  };

  useEffect(() => {
    // for verifying if token is valid
    console.log(`The token is: ${token}`);
  }, []);
  return (
    <>
      <div className="flex flex-col items-center text-2xl">
        <h1>Reset Password</h1>
      </div>
      <div className="flex border items-center flex-col">
        <div>
          <div>Otp:</div>
          <div>
            <input
              id="otp"
              name="otp"
              value={formData.otp}
              className="border"
              type="number"
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <div>Password:</div>
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              id="password"
              onChange={handleChange}
              className="border"
            />
          </div>
        </div>
        <div>
          <div>Confirm Password:</div>
          <div>
            <input
              type="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              id="confirmPassword"
              onChange={handleChange}
              className="border "
            />
          </div>
        </div>
        <div>
          <button
            className=" rounded-2xl border p-2 font-bold bg-blue-400 my-5"
            type="submit"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
