import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaBookmark } from "react-icons/fa";
import styles from "./Home.module.css";
import logo from "./img/myself.jpg";

import axios from "axios";

const PaperList = ({
  papers,
  bookmarks,
  toggleBookmark,
  showPdf,
  handleCitePopup,
  handleDelete,
  handleDraft,
  state,
  showButtons,
  showBookmark = true,
}) => {
  const [profiles, setProfiles] = useState([]);

  const fetchProfiles = async () => {
    const url = `http://localhost:8000/api/profile`;
    try {
      const response = await axios.get(url);
      setProfiles(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const getProfileImage = (username) => {
    const profile = profiles.find((profile) => profile.username === username);
    return profile ? `http://localhost:8000${profile.profileImage}` : logo;
  };

  return (
    <div>
      {papers.map((data, index) => (
        <div
          key={index}
          className={`${styles.paper} ${
            bookmarks[index] ? styles.bookmarked : ""
          }`}
        >
          <div className={styles.innerDiv}>
            <div className={styles.profilepicture}>
              <div>
                <img
                  src={getProfileImage(data.uploadedBy)}
                  alt={data.uploadedBy}
                  className={styles.profileImag}
                />
              </div>
              <div className={styles.upperpart}>
                <NavLink
                  to={`/user/${encodeURIComponent(data.uploadedBy)}`}
                  className={styles.navlnk}
                  state={state}
                >
                  <h5 className={styles.uploadedBy}> {data.uploadedBy}</h5>
                </NavLink>
                <h5 className={styles.papertype}>Added an {data.paperType}</h5>
              </div>
            </div>
            <NavLink
              to={`/paper/${data._id}`}
              className={styles.navlink}
              state={state}
            >
              <h3 className={styles.truncatedTitle}>{data.title}</h3>
            </NavLink>
            <div className={styles.details}>
              <h5 className={styles.h5} id={styles.paperType}>
                {data.paperType}
              </h5>
              {data.publicationDate && (
                <h5 className={styles.h5}>
                  {new Date(data.publicationDate).toLocaleDateString(
                    undefined,
                    { month: "long", year: "numeric" }
                  )}
                </h5>
              )}
              <h5 className={styles.h5}>Citations {data.citations}</h5>
              <h5 className={styles.h5}>Reads {data.count}</h5>
            </div>

            <button
              className={styles.btnPrimary}
              onClick={() => showPdf(data.pdf)}
            >
              <i
                className="fa fa-file-pdf-o"
                aria-hidden="true"
                id={styles.pdf}
              >
                <span> PDF </span>
              </i>
            </button>
            {showBookmark && ( // Conditionally render the bookmark button
              <button
                className={`${styles.btnBookmark} ${
                  bookmarks[index] ? styles.bookmarked : ""
                }`}
                onClick={() => toggleBookmark(index, data._id)}
              >
                <FaBookmark />
                <span className={styles.tooltip}>Bookmark</span>
              </button>
            )}
            <button
              className={styles.citeButton}
              onClick={() => handleCitePopup(data)}
            >
              <i className="fa fa-quote-right" aria-hidden="true"></i>
              <span className={styles.tooltip}>Cite</span>
            </button>
            {showButtons && ( // Conditionally render buttons
              <div className={styles.listButtons}>
                {data.draft ? (
                  // If paper is a draft, show delete and publish buttons
                  <div>
                    <button
                      onClick={() => handleDelete(data._id)}
                      className={`${styles.deleteButton} ${styles.draftButton}`}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleDraft(data.pdf, 0)}
                      className={`${styles.publishButton} ${styles.draftButton}`}
                    >
                      Publish
                    </button>
                  </div>
                ) : (
                  // If paper is unpublished, show the unpublish button
                  <button
                    onClick={() => handleDraft(data.pdf, 1)}
                    className={styles.unpublishButton}
                  >
                    Unpublish
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaperList;
