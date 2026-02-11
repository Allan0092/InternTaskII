import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Blog from "./pages/Blog";
import ForgotPassword from "./pages/ForgotPassword";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Navbar from "./pages/Navbar";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import AdminPanel from "./private/AdminPanel";
import Profile from "./private/Profile";

const App = () => {
  // const [userRole, setUserRole] = useState("");
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/blog/:slug" element={<Blog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset/:token" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
