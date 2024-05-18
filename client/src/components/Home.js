import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import styles from "./Home.module.css";
import LazyLoader from "./LazyLoader";
import { FaBookmark } from "react-icons/fa";

const Home = () => {
  const { state } = useLocation();
  const [papers, setPapers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [category, setCategory] = useState("");
  const [authors, setAuthors] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCitePopup = (paper) => {
    setSelectedPaper(paper);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedPaper(null); // Reset selected paper
    setCopySuccess(false); // Reset copy success flag
  };

  const handleCiteThisPaper = async () => {
    if (!selectedPaper) return; // Ensure there is a selected paper

    try {
      await axios.post(
        `http://localhost:8000/api/increase-citations/${selectedPaper._id}`
      );

      setPapers((prevPapers) =>
        prevPapers.map((paper) =>
          paper._id === selectedPaper._id
            ? { ...paper, citations: paper.citations + 1 }
            : paper
        )
      );

      const citationText = `Title: ${selectedPaper.title}, Author: ${selectedPaper.uploadedBy}`;
      await navigator.clipboard.writeText(citationText);
      console.log("Citation copied to clipboard:", citationText);
      setCopySuccess(true);
    } catch (error) {
      console.error("Error citing paper:", error);
    }
  };

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        let url = "http://localhost:8000/api/get-papers";
        const params = new URLSearchParams();
        if (sortBy === "mostViewed") {
          params.append("sortBy", "viewCount");
        }
        if (sortBy === "mostCited") {
          params.append("sortBy", "citationCount");
        }
        if (category) {
          params.append("category", category.trim());
        }
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        const response = await axios.get(url);
        setPapers(response.data);

        const uniqueAuthors = [
          ...new Set(response.data.map((paper) => paper.uploadedBy)),
        ];
        setAuthors(uniqueAuthors);

        // Initialize bookmark states for each paper
        setBookmarks(Array(response.data.length).fill(false));
      } catch (error) {
        console.error("Error fetching papers:", error);
      }
    };

    fetchPapers();
  }, [sortBy, category]);

  useEffect(() => {
    if (searchQuery === "") {
      return;
    }
    const getPapersBySearch = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/search?search=${searchQuery}`
        );
        setPapers(response.data);

        const uniqueAuthors = [
          ...new Set(response.data.map((paper) => paper.uploadedBy)),
        ];
        setAuthors(uniqueAuthors);

        // Initialize bookmark states for each paper
        setBookmarks(Array(response.data.length).fill(false));
      } catch (error) {
        console.error("Error fetching papers:", error);
      }
    };
    getPapersBySearch();
  }, [searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const addList = async (id, username) => {
    const url = `http://localhost:8000/api/add-file`;
    try {
      const response = await axios.post(url, {
        username,
        id,
      });
      console.log(response.data);
      if (response.status === 200) {
        console.log("File added to list successfully");
      } else {
        console.error("Failed to add file to list");
      }
    } catch (error) {
      console.error("Error adding file to list:", error);
    }
  };

  const showPdf = async (fileName) => {
    const url = `http://localhost:8000/files/${fileName}`;

    try {
      const response = await axios.get(url, {
        responseType: "blob",
      });
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  };

  const includeSearchQuery = (authorName, searchQuery) => {
    return authorName.toLowerCase().includes(searchQuery.toLowerCase());
  };

  // Function to toggle bookmark status for a specific paper
  const toggleBookmark = async (index, id, username) => {
    const newBookmarks = [...bookmarks];
    newBookmarks[index] = !newBookmarks[index];
    setBookmarks(newBookmarks);

    if (!newBookmarks[index]) {
      await addList(id, username);
    }
  };

  return (
    <div className={styles["home-root"]}>
      <div className={styles["nav-div"]}>
        <Navbar
          state={state.role}
          user={state}
          setSortBy={setSortBy}
          setCategory={setCategory}
          handleChange={handleSearch}
          searchQuery={searchQuery}
        />
      </div>
      {/* <div>
        <input
          type="text"
          placeholder="Search By PaperName/Author"
          value={searchQuery}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </div> */}

      {searchQuery && authors.length > 0 && (
        <div className={styles.authorDiv}>
          {authors.map(
            (author, index) =>
              includeSearchQuery(author, searchQuery) && (
                <NavLink
                  key={index}
                  className={styles.author}
                  to={`/user/${encodeURIComponent(author)}`}
                >
                  <h4> {author}</h4>
                </NavLink>
              )
          )}
        </div>
      )}

      <div className={styles.outputDiv}>
        <>
          {papers.map((data, index) => (
            <div key={index}>
              <div className={styles.innerDiv}>
                <NavLink to={`/paper/${data._id}`} className={styles.navlink}>
                  <h3 className={styles.truncatedTitle}>{data.title}</h3>
                </NavLink>
                <h5 className={styles.h5}>Citations:{data.citations}</h5>
                <h5 className={styles.h5}>reads:{data.count}</h5>

                <NavLink
                  to={`/user/${encodeURIComponent(data.uploadedBy)}`}
                  className={styles.navlnk}
                >
                  <h5 className={styles.h5}> {data.uploadedBy}</h5>
                </NavLink>
                {data.publicationDate && (
                  <h5>
                    Published Year:{" "}
                    {new Date(data.publicationDate).getFullYear()}
                  </h5>
                )}
                <button
                  className={styles.btnPrimary}
                  onClick={() => showPdf(data.pdf)}
                >
                  <i className="fa fa-file-pdf-o" aria-hidden="true">
                    PDF
                  </i>
                </button>
                <button
                  className={`${styles.btnBookmark} ${
                    bookmarks[index] && styles.bookmarked
                  }`}
                  onClick={() =>
                    toggleBookmark(index, data._id, state.username)
                  }
                >
                  <FaBookmark />
                  <span className={styles.tooltip}>Bookmark</span>
                </button>

                <button
                  className={styles.citeButton}
                  onClick={() => handleCitePopup(data)}
                >
                  <i class="fa fa-quote-right" aria-hidden="true"></i>
                  <span className={styles.tooltip}>Cite</span>
                </button>
              </div>
            </div>
          ))}
        </>
      </div>
      {showPopup && selectedPaper && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <span className={styles.close} onClick={handleClosePopup}>
              &times;
            </span>
            <h2 className={styles.citePaper}>Cite Paper</h2>
            <p>
              {selectedPaper.uploadedBy}.{selectedPaper.title}
            </p>
            <button
              className={styles.copyButton}
              onClick={() => handleCiteThisPaper(selectedPaper)}
            >
              Copy Citation
            </button>
            {copySuccess && (
              <p className={styles.successMessage}>Copied to clipboard!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
