import Login from "./components/Login";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Landing from "./components/Landing";
import AuthorPapers from "./components/AuthorPapers";
import Upload from "./components/Upload";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/my-papers" element={<AuthorPapers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
