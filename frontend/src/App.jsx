import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Blog from "./pages/Blog";
import Homepage from "./pages/Homepage";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/blog/:slug" element={<Blog />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
