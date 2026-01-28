import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sendAxiosRequest } from "./api";

const Blog = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await sendAxiosRequest({ method: "get", url: `/${slug}` });
      console.log(res.data);
      setBlog(res.data);
    };
    fetchBlog();
  }, []);
  return (
    <div className="flex">
      <div className="w-full h-full">
        <h1>{blog.title}.</h1>
      </div>
      <div className="flex">
        <p>{blog.content}</p>
      </div>
    </div>
  );
};

export default Blog;
