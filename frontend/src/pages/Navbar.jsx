import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const items = [
    {
      name: "Homepage",
      href: "/",
    },
    { name: "Admin", href: "/admin" },
    { name: "Login", href: "/login" },
    { name: "Register", href: "/register" },
  ];
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate("/");
      }}
      className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-blue-400 justify-center items-center"
    >
      <h1 className="text-3xl font-bold text-gray-900 ">Blog Platform</h1>
    </div>
  );
};

export default Navbar;
