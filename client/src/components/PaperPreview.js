import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import styles from "./PaperPreview.module.css";
import PaperList from "./Paper";

const PaperPreview = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const [paper, setPaper] = useState(null);
  const [relatedPapers, setRelatedPapers] = useState([]);
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

  useEffect(() => {
    if (paper) {
      fetchRelatedPapers(paper.categories);
    }
  }, [paper]);

  const fetchRelatedPapers = async () => {
    try {
      const categoriesString = paper.categories.join(",");
      const response = await axios.get(
        `http://localhost:8000/api/get-related-papers/${categoriesString}`
      );

      const filteredRelatedPapers = response.data.filter(
        (relatedPaper) => relatedPaper._id !== id
      );
      setRelatedPapers(filteredRelatedPapers);
    } catch (error) {
      console.error("Error fetching related papers:", error);
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
        <div className={styles.paperdetails}>
          <div className={styles.uppercon}>
            <div className={styles.citationscontainer}>
              <div className={styles.papertypecon}>
                <h5 className={styles.paperType}>{paper.paperType}</h5>
                <div className={styles.papertitle}>{paper.title}</div>
              </div>
              <div className={styles.innercontainer}>
                <div className={styles.citations}>
                  Citations: {paper.citations}
                </div>
                <div className={styles.reads}>Reads: {paper.count}</div>
              </div>
            </div>
            <div className={styles.paperauthor}>Author: {paper.uploadedBy}</div>
            <div className={styles.date}>
              {" "}
              <h5 className={styles.h5}>
                {new Date(paper.publicationDate).toLocaleDateString(undefined, {
                  month: "long",
                  year: "numeric",
                })}
              </h5>
            </div>
          </div>
          <div className={styles.paperdescription}>
            Description<div className={styles.descriptionline}></div>{" "}
            {paper.description}
            <br></br>
            <button className={styles.citebutton} onClick={handleCitePopup}>
              {buttonText}
            </button>
            <button
              className={styles.btnPrimary}
              onClick={() => showPdf(paper.pdf)}
            >
              <i
                className="fa fa-file-pdf-o"
                aria-hidden="true"
                id={styles.pdf}
              >
                <span> PDF </span>
              </i>
            </button>
          </div>
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

      <div className={styles.relatedPapers}>
        <h3 className={styles.h3}>Related Papers</h3>

        <PaperList
          papers={relatedPapers}
          bookmarks={[]}
          toggleBookmark={() => {}}
          showPdf={() => {}}
          handleCitePopup={() => {}}
          state={state}
        />
      </div>
    </div>
  );
};

export default PaperPreview;
