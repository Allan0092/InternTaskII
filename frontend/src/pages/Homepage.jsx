import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendAxiosRequest } from "../api";

const Homepage = () => {
  const [blogs, setblogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const blogs = await sendAxiosRequest({ method: "get" });
      console.log(blogs);
      setblogs(blogs.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchBlogs();
  }, []);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`Form submitted with data`, formData);
    try {
      const res = await sendAxiosRequest({ method: "post", body: formData });
      setFormData({ title: "", content: "" });
      await fetchBlogs();
    } catch (e) {
      console.error(`Error in sending form data\n${e.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <title>Homepage</title>

      <header className="bg-white shadow-sm">
        <div className="flex-row flex-wrap">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900 ">Blog Platform</h1>
          </div>
          <div className="">
            <button
              className="border-2 p-3 w-auto"
              onClick={() => navigate("/login")}
            >
              login
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Blog List Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-6 ">Recent Blogs</h2>

              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading blogs...</p>
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No blogs yet. Create one!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {blogs.map((blog) => (
                    <div
                      key={blog.slug}
                      onClick={() => navigate(`/blog/${blog.slug}`)}
                      className="p-4 border border-gray-200 rounded-lg "
                    >
                      <h3 className="text-lg font-medium text-gray-900">
                        {blog.title}
                      </h3>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Create New Blog
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter blog title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 "
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Write your blog content..."
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 "
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg "
                >
                  Publish Blog
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
