import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendAxiosRequest } from "../utils/api";
import { getToken, isLoggedIn } from "../utils/auth";

const Profile = () => {
  const [imageURL, setImageURL] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(isLoggedIn());
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: file,
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await sendAxiosRequest({
        method: "post",
        url: "/profiles/image",
        header: {
          authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      console.log("Uploaded:", res);
      alert("Image uploaded successfully!");
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };

  const prefill = () => {};
  const navigate = useNavigate();

  const handleLogout = () => {
    // setAdminUser(false);
    setIsSignedIn(false);
    logout();
    navigate("/");
  };

  return (
    <div>
      <div className="flex flex-row-reverse">
        <div className="">
          {!isSignedIn ? (
            <button
              className="border-2 py-3 px-10 m-15 w-auto bg-green-300 text-stone-900 rounded-2xl font-bold"
              onClick={() => navigate("/login")}
            >
              login
            </button>
          ) : (
            <button
              className="border-2 py-3 px-10 w-auto bg-red-500 text-white rounded-2xl font-bold"
              onClick={handleLogout}
            >
              logout
            </button>
          )}
        </div>
      </div>
      <div>
        <h1>User Profile</h1>
      </div>
      <div>
        {/* <img src={imageURL} alt="" /> */}
        <div className="flex flex-col">
          <div className="my-7">
            <input
              className="border box-border"
              type="file"
              onChange={handleFileChange}
            />
          </div>
          <div className="m-7">
            <button
              className="border bg-blue-400 rounded-2xl p-2 "
              onClick={handleUpload}
            >
              Upload Avatar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
