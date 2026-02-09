import { useState } from "react";

const Profile = () => {
  const [formData, setFormData] = useState({});
  const [imageURL, setImageURL] = useState("");

  const prefill = () => {};

  return (
    <div>
      <div>
        <h1>User Profile</h1>
      </div>
      <div>
        <img src={imageURL} alt="" />
        <div></div>
      </div>
    </div>
  );
};

export default Profile;
