import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useLocation, NavLink } from "react-router-dom";
import axios from "axios";
import styles from "./AuthorPapers.module.css";

const AuthorPapers = () => {
  const { state } = useLocation();
  const [draft0Papers, setDraft0Papers] = useState([]);
  const [draft1Papers, setDraft1Papers] = useState([]);

  // Define fetchPapers function outside of useEffect
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

  const handleDraft = async (filename) => {
    try {
      await axios.put(
        `http://localhost:8000/api/papers/${encodeURIComponent(filename)}`,
        {
          draft: 0,
        }
      );

      setDraft1Papers((prevDrafts) =>
        prevDrafts.map((paper) =>
          paper.filename === filename ? { ...paper, draft: 0 } : paper
        )
      );

      // Fetch papers again after publishing a draft
      fetchPapers();
    } catch (error) {
      console.error("Error publishing paper:", error);
    }
  };

  return (
    <div>
      <Navbar state={state.role} user={state} />
      <div>
        <h2 className={styles.heading}>Published papers</h2>
        <ul className={styles.paperList}>
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
                  onClick={() => handleDelete(paper._id)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className={styles.heading}>Drafts</h2>
        <ul className={styles.paperList}>
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
                  onClick={() => handleDraft(paper.pdf)}
                  className={styles.deleteButton}
                >
                  Publish
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AuthorPapers;
