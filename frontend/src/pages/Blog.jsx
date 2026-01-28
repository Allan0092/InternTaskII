import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { sendAxiosRequest } from "../api";

const Blog = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await sendAxiosRequest({ method: "get", url: `/${slug}` });
      console.log(res.data);
      setBlog(res.data);
    };
    fetchBlog();
  }, []);
  return (
    <div className="flex-row">
      <div>
        <button className="border-2 border-black" onClick={() => navigate("/")}>
          Go Back to Homepage
        </button>
      </div>
      <div className="w-full h-full text-5xl bg-blue-300 text-center mb-6 font-bold">
        <h1>{blog.title}</h1>
      </div>
      <div className="flex ">
        <p>{blog.content}</p>
      </div>
    </div>
  );
};

export default Blog;
