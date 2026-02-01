import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sendAxiosRequest } from "../utils/api";

const Blog = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await sendAxiosRequest({
          method: "get",
          url: `/blog/${slug}`,
        });
        console.log(res.data);
        setBlog(res.data);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-blue-600 px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            {blog.title}
          </h1>
        </div>

        {/* Author Section */}
        <div className="px-8 py-6 bg-gray-100 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {blog.author?.charAt(0).toUpperCase() || "A"}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Written by</p>
              <p className="font-semibold text-gray-900">{blog.author}</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-8 py-12">
          <div className="text-lg text-gray-700 leading-relaxed">
            <p className="whitespace-pre-wrap">{blog.content}</p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default Blog;
