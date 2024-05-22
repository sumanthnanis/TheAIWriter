// App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { DataProvider } from "./DataContext";
import Login from "./components/Login";
import Home from "./components/Home";
import AuthorPapers from "./components/AuthorPapers";
import Upload from "./components/Upload";
import PaperPreview from "./components/PaperPreview";
import Author from "./components/Author";
import Profile from "./components/Profile";
import { BookmarksProvider } from "./BookmarksContext";

function App() {
  return (
    <BrowserRouter>
      <DataProvider>
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
      </DataProvider>
    </BrowserRouter>
  );
}

export default App;
