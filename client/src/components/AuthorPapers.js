import React, { useState, useEffect } from "react";
import PaperList from "./Paper";
import Navbar from "./Navbar";
import { useLocation, NavLink } from "react-router-dom";
import axios from "axios";
import styles from "./AuthorPapers.module.css";

const AuthorPapers = () => {
  const { state } = useLocation();
  const [draft0Papers, setDraft0Papers] = useState([]);
  const [draft1Papers, setDraft1Papers] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  const fetchPapers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/papers/${state.username}`
      );

      const draft0 = response.data.filter((paper) => paper.draft === 0);
      const draft1 = response.data.filter((paper) => paper.draft === 1);

      setDraft0Papers(draft0);
      setDraft1Papers(draft1);
    } catch (error) {
      console.error("Error fetching papers:", error);
    }
  };

  useEffect(() => {
    if (state.username) {
      fetchPapers();
    }
  }, [state.username]);

  const handleDelete = async (paperId) => {
    try {
      await axios.delete(`http://localhost:8000/api/papers/${paperId}`);

      setDraft0Papers(draft0Papers.filter((paper) => paper._id !== paperId));
      setDraft1Papers(draft1Papers.filter((paper) => paper._id !== paperId));
    } catch (error) {
      console.error("Error deleting paper:", error);
    }
  };

  const handleDraft = async (filename, newDraftStatus) => {
    try {
      await axios.put(
        `http://localhost:8000/api/papers/${encodeURIComponent(filename)}`,
        {
          draft: newDraftStatus,
        }
      );

      if (newDraftStatus === 0) {
        setDraft1Papers((prevDrafts) =>
          prevDrafts.map((paper) =>
            paper.filename === filename ? { ...paper, draft: 0 } : paper
          )
        );
      } else {
        setDraft0Papers((prevDrafts) =>
          prevDrafts.map((paper) =>
            paper.filename === filename ? { ...paper, draft: 1 } : paper
          )
        );
      }

      // Fetch papers again after updating the draft status
      fetchPapers();
    } catch (error) {
      console.error("Error updating paper:", error);
    }
  };

  const allPapers = [...draft0Papers, ...draft1Papers];

  return (
    <div className={styles.container}>
      <Navbar state={state.role} user={state} />
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${
            activeTab === "all" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Papers
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "published" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("published")}
        >
          Published Papers
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "drafts" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("drafts")}
        >
          Drafts
        </button>
      </div>
      {activeTab === "all" && (
        <div>
          <ul className={styles.paperList}>
            <PaperList
              className={styles.allPapersDiv}
              papers={allPapers}
              bookmarks={[]}
              toggleBookmark={() => {}}
              showPdf={() => {}}
              handleCitePopup={() => {}}
              state={""}
            />
          </ul>
        </div>
      )}
      {activeTab === "published" && (
        <div>
          <ul className={styles.paperList}>
            <PaperList
              className={styles.draftPapersDiv}
              papers={draft0Papers}
              bookmarks={[]}
              toggleBookmark={() => {}}
              showPdf={() => {}}
              handleCitePopup={() => {}}
              state={""}
            />
            {draft0Papers.map((paper) => (
              <li key={paper._id} className={styles.paperItem}>
                <div className={styles.innerDiv}>
                  <NavLink
                    to={`/paper/${paper._id}`}
                    className={styles.paperLink}
                  >
                    {paper.title}
                  </NavLink>
                  <button
                    onClick={() => handleDraft(paper.pdf, 1)}
                    className={styles.deleteButton}
                  >
                    Unpublish
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {activeTab === "drafts" && (
        <div>
          <ul className={styles.paperList}>
            <PaperList
              className={styles.draftPapersDiv}
              papers={draft1Papers}
              bookmarks={[]}
              toggleBookmark={() => {}}
              showPdf={() => {}}
              handleCitePopup={() => {}}
              state={""}
            />
            {draft1Papers.map((paper) => (
              <li key={paper._id} className={styles.paperItem}>
                <div className={styles.innerDiv}>
                  <NavLink
                    to={`/paper/${paper._id}`}
                    className={styles.paperLink}
                  >
                    {paper.title}
                  </NavLink>
                  <button
                    onClick={() => handleDelete(paper._id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleDraft(paper.pdf, 0)}
                    className={styles.deleteButton}
                  >
                    Publish
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AuthorPapers;
