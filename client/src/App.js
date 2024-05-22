// import Login from "./components/Login";
// import Home from "./components/Home";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import "./App.css";

// import AuthorPapers from "./components/AuthorPapers";
// import Upload from "./components/Upload";
// import PaperPreview from "./components/PaperPreview";
// import Author from "./components/Author";
// import Profile from "./components/Profile";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/home" element={<Home />} />
//         <Route path="/upload" element={<Upload />} />
//         <Route path="/my-papers" element={<AuthorPapers />} />
//         <Route path="/paper/:id" element={<PaperPreview />} />
//         <Route path="/user/:authorName" element={<Author />} />
//         <Route path="/user/profile" element={<Profile />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
import Login from "./components/Login";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import AuthorPapers from "./components/AuthorPapers";
import Upload from "./components/Upload";
import PaperPreview from "./components/PaperPreview";
import Author from "./components/Author";
import Profile from "./components/Profile";
import { BookmarksProvider } from "./BookmarksContext";

function App() {
  return (
    <BrowserRouter>
      <BookmarksProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/my-papers" element={<AuthorPapers />} />
          <Route path="/paper/:id" element={<PaperPreview />} />
          <Route path="/user/:authorName" element={<Author />} />
          <Route path="/user/profile" element={<Profile />} />
        </Routes>
      </BookmarksProvider>
    </BrowserRouter>
  );
}

export default App;
