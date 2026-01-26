import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Blog from "./Blog";
import Homepage from "./Homepage";

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
