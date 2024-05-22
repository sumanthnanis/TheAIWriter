import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import PaperList from "./Paper";
import axios from "axios";
import styles from "./Home.module.css";
import ProfileDetails from "./ProfileDetails";
import { useLocation } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { useData } from "../DataContext";

const Author = () => {
  const { profileData } = useData();
  const { state } = useLocation();
  const { authorName } = useParams();
  const [papers, setPapers] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchPapersByAuthor = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/get-papers?authorName=${encodeURIComponent(
            authorName
          )}`
        );
        const papersData = response.data;
        setPapers(papersData);

        // Initialize bookmarks state based on the fetched papers
        setBookmarks(
          papersData.map((paper) => paper.bookmarkedBy.includes(authorName))
        );
      } catch (error) {
        console.error("Error fetching papers:", error);
      }
    };

    fetchPapersByAuthor();
  }, [authorName]);

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

  const toggleBookmark = async (index, id, username) => {
    const newBookmarks = [...bookmarks];
    newBookmarks[index] = !newBookmarks[index];

    try {
      const response = await axios.post(
        `http://localhost:8000/api/toggle-bookmark`,
        {
          paperId: id,
          username,
          bookmarked: newBookmarks[index],
        }
      );

      if (response.status === 200) {
        setBookmarks(newBookmarks);
        if (newBookmarks[index]) {
          toast.success("Bookmarked successfully!");
        } else {
          toast.info("Bookmark removed successfully!");
        }
      } else {
        console.error("Failed to update bookmark status");
      }
    } catch (error) {
      console.error("Error updating bookmark status:", error);
    }
  };

  const handleCitePopup = (paper) => {
    setSelectedPaper(paper);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedPaper(null);
    setCopySuccess(false);
  };

  const handleCiteThisPaper = async () => {
    if (!selectedPaper) return;

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

  return (
    <div className={styles.outputDiv}>
      <Toaster richColors position="top-right" /> {/* Add Toaster component */}
      <Navbar state={state.role} hideCategoriesFilter={true} user={state} />
      <ProfileDetails authorname={authorName} />
      <PaperList
        className={styles.allPapersDiv}
        papers={papers}
        bookmarks={bookmarks}
        toggleBookmark={(index, id) => toggleBookmark(index, id, authorName)}
        showPdf={showPdf}
        handleCitePopup={handleCitePopup}
        state={{ username: authorName }}
      />
      {showPopup && selectedPaper && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <span className={styles.close} onClick={handleClosePopup}>
              &times;
            </span>
            <h2 className={styles.citePaper}>Cite Paper</h2>
            <p>
              {selectedPaper.uploadedBy}. {selectedPaper.title}
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

export default Author;
