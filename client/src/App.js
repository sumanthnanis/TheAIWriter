import Login from "./components/Login";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Landing from "./components/Landing";
import AuthorPapers from "./components/AuthorPapers";
import Upload from "./components/Upload";
import PaperPreview from "./components/PaperPreview";
import Author from "./components/Author";
import Profile from "./components/Profile";
import UserFiles from "./components/UserFiles";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Landing />} /> */}
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/my-papers" element={<AuthorPapers />} />
        <Route path="/paper/:id" element={<PaperPreview />} />
        <Route path="/user/:authorName" element={<Author />} />
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/user-files/:username" element={<UserFiles />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
