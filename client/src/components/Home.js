import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import styles from "./Home.module.css";

import { FaBookmark } from "react-icons/fa";

const Home = () => {
  const { state } = useLocation();
  const [papers, setPapers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [category, setCategory] = useState("");
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
        const { papers, profiles } = response.data;
        setPapers(papers);
        setProfiles(profiles);
        console.log(profiles);
        setBookmarks(Array(papers.length).fill(false));
      } catch (error) {
        console.error("Error fetching papers and profiles:", error);
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

  const toggleBookmark = async (index, id, username) => {
    const newBookmarks = [...bookmarks];
    newBookmarks[index] = !newBookmarks[index];
    setBookmarks(newBookmarks);

    if (!newBookmarks[index]) {
      await addList(id, username);
    }
  };

  const aggregatedProfiles = profiles.map((profile) => {
    const authorPapers = papers.filter(
      (paper) => paper.uploadedBy === profile.username
    );
    const totalPapers = authorPapers.length;
    const totalCitations = authorPapers.reduce(
      (sum, paper) => sum + paper.citations,
      0
    );
    const totalReads = authorPapers.reduce(
      (sum, paper) => sum + paper.count,
      0
    );

    return {
      ...profile,
      totalPapers,
      totalCitations,
      totalReads,
    };
  });

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

      {searchQuery && aggregatedProfiles.length > 0 && (
        <div className={styles.authorDiv}>
          {aggregatedProfiles.map((profile, index) => (
            <NavLink
              key={index}
              className={styles.authorCard}
              to={`/user/${encodeURIComponent(profile.username)}`}
            >
              <div className={styles.card}>
                <div className={styles.profileContainer}>
                  <div className={styles.imageContainer}>
                    {profile.profileImage && (
                      <img
                        src={`http://localhost:8000${profile.profileImage}`}
                        alt={profile.username}
                        className={styles.profileImage}
                      />
                    )}
                  </div>
                  <div className={styles.detailsOverlay}>
                    <div className={styles.userInfo}>
                      <h4 className={styles.userName}>{profile.username}</h4>
                      <p className={styles.userInstitution}>
                        {profile.institution}
                      </p>
                    </div>
                    <div className={styles.stats}>
                      <div className={styles.statItem}>
                        <span className={styles.statNumber}>
                          {profile.totalPapers}
                        </span>
                        <span className={styles.statLabel}>Publications</span>
                      </div>
                      <div className={styles.statDivider}></div>
                      <div className={styles.statItem}>
                        <span className={styles.statNumber}>
                          {profile.totalCitations}
                        </span>
                        <span className={styles.statLabel}>Citations</span>
                      </div>
                      <div className={styles.statDivider}></div>
                      <div className={styles.statItem}>
                        <span className={styles.statNumber}>
                          {profile.totalReads}
                        </span>
                        <span className={styles.statLabel}>Reads</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </NavLink>
          ))}
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
                <h5 className={styles.h5}>Citations: {data.citations}</h5>
                <h5 className={styles.h5}>Reads: {data.count}</h5>

                <NavLink
                  to={`/user/${encodeURIComponent(data.uploadedBy)}`}
                  className={styles.navlnk}
                >
                  <h5 className={styles.h5}> {data.uploadedBy}</h5>
                </NavLink>
                <h5 className={styles.h5}>{data.paperType}</h5>
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
                  <i className="fa fa-quote-right" aria-hidden="true"></i>
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

export default Home;
