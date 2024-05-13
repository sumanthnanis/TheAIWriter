import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import styles from "./Home.module.css";

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
      <h2>Papers by {authorName}</h2>

      {papers.map((paper, index) => (
        <div key={index} className={styles.paperDiv}>
          <div key={index} className={styles.innerDiv}>
            <NavLink to={`/paper/${paper._id}`} className={styles.navlink}>
              <h3>Title: {paper.title}</h3>
            </NavLink>
            <button
              className={styles.btnPrimary}
              onClick={() => showPdf(paper.pdf)}
            >
              Show PDF
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Author;
