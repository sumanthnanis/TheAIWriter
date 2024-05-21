import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import Navbar from "./Navbar";
import PaperList from "./Paper";
import axios from "axios";
import styles from "./Home.module.css";
import ProfileDetails from "./ProfileDetails";

const Author = () => {
  const { authorName } = useParams();
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    const fetchPapersByAuthor = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/get-papers?authorName=${encodeURIComponent(
            authorName
          )}`
        );

        setPapers(response.data);
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

  return (
    <div className={styles.outputDiv}>
      <Navbar />

      <ProfileDetails authorname={authorName} />
      <PaperList
        className={styles.allPapersDiv}
        papers={papers}
        bookmarks={[]}
        toggleBookmark={() => {}}
        showPdf={() => {}}
        handleCitePopup={() => {}}
        state={""}
      />
    </div>
  );
};

export default Author;
