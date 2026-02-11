import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendAxiosRequest } from "../utils/api";
import { getCurrentName, getToken, isLoggedIn, logout } from "../utils/auth";

const Profile = () => {
  const [imageURL, setImageURL] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(isLoggedIn());
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: getCurrentName(),
    email: "",
    avatar: file,
  });

  const fetchImage = async () => {
    try {
      const res = await sendAxiosRequest({
        method: "get",
        url: "/profiles/avatar",
      });
    } catch (e) {
      console.error(`Error in fetching user image: ${e}`);
    }
  };

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
          <button
            className="border-2 py-3 px-10 w-auto bg-red-500 text-white rounded-2xl font-bold"
            onClick={handleLogout}
          >
            logout
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="">
          <div className="font-bold text-2xl text-center m-4">
            <h1>User Profile</h1>
          </div>
          <div className="flex items-center justify-center">
            <img src={imageURL} alt="" />
            <div className="flex flex-col border shadow justify-center text-center p-7">
              <div className="flex my-5 border">Name: {formData.name}</div>
              <h1>Avatar Image Upload</h1>
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
      </div>
    </div>
  );
};

export default Profile;
