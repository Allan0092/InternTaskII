import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sendAxiosRequest } from "../utils/api";

const ResetPassword = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [serverRes, setServerRes] = useState("");
  const [resOK, setResOk] = useState(null);
  const [formData, setFormData] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
    resetToken: token,
  });

  const handleChange = (e) => {
    setServerRes("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(`dataTosend: ${formData}`);
    setLoading(true);
    try {
      const res = await sendAxiosRequest({
        method: "post",
        url: "profiles/password/reset",
        body: formData,
      });
      setServerRes(res.data?.message);
    } catch (e) {
      console.error(e);
      setServerRes(e.res.data?.error);
    } finally {
      setLoading(false);
    }
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
          <div className={resOK ? "bg-green-400 tes" : "bg-red-400"}>
            {serverRes}
          </div>
          <div>Otp:</div>
          <div>
            <input
              id="otp"
              name="otp"
              value={formData.otp}
              className="border"
              type="text"
              onChange={handleChange}
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>
        </div>
        <div>
          <button
            className=" rounded-2xl border p-2 font-bold bg-blue-400 my-5"
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
