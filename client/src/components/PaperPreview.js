import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import styles from "./PaperPreview.module.css";

const PaperPreview = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const [paper, setPaper] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [buttonText, setButtonText] = useState("Cite this paper");
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchPaperDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/get-paper/${id}`
        );
        setPaper(response.data);
      } catch (error) {
        console.error("Error fetching paper details:", error);
      }
    };

    fetchPaperDetails();
  }, [id]);

  const handleCitePopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleCiteThisPaper = async () => {
    try {
      await axios.post(`http://localhost:8000/api/increase-citations/${id}`);

      setPaper((prevPaper) => ({
        ...prevPaper,
        citations: prevPaper.citations + 1,
      }));

      const citationText = `Title: ${paper.title}, Author: ${paper.uploadedBy}`;
      await navigator.clipboard.writeText(citationText);
      console.log("Citation copied to clipboard:", citationText);
      setButtonText("Cited");
      setCopySuccess(true);
    } catch (error) {
      console.error("Error citing paper:", error);
    }
  };

  if (!paper) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className={styles.paperpreviewcontainer}>
        <div className={styles.citationscontainer}>
          <div className={styles.papertitle}>{paper.title}</div>
          <div className={styles.innercontainer}>
            <div className={styles.citations}>Citations: {paper.citations}</div>
            <div className={styles.reads}>Reads: {paper.count}</div>
          </div>
        </div>
        <div className={styles.paperauthor}>Author: {paper.uploadedBy}</div>
        <div className={styles.paperdescription}>
          Description<div className={styles.descriptionline}></div>{" "}
          {paper.description}
          <br></br>
          <button className={styles.citebutton} onClick={handleCitePopup}>
            {buttonText}
          </button>
        </div>
      </div>
      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupcontent}>
            <span className={styles.close} onClick={handleClosePopup}>
              &times;
            </span>
            <h2 className={styles.citepaper}>Cite Paper</h2>
            <p>
              {paper.uploadedBy}.{paper.title}
            </p>
            <button className={styles.copybutton} onClick={handleCiteThisPaper}>
              {buttonText}
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

export default PaperPreview;
