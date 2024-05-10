import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import styles from "./Home.module.css";

const Home = () => {
  const { state } = useLocation();
  const [papers, setPapers] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    fetchPapers();
  }, [sortBy]);

  const fetchPapers = async () => {
    try {
      let url = "http://localhost:8000/api/get-papers";
      if (sortBy === "mostViewed") {
        url += "?sortBy=viewCount";
      }
      const response = await axios.get(url);
      setPapers(response.data);
    } catch (error) {
      console.error("Error fetching papers:", error);
    }
  };

  useEffect(() => {
    if (searchQuery === "") {
      fetchPapers();
      return;
    }
    const getPapers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/search?search=${searchQuery}`
        );
        setPapers(response.data);
      } catch (error) {
        console.error("Error fetching papers:", error);
      }
    };
    getPapers();
  }, [searchQuery]);

  function handleSearch(e) {
    setSearchQuery(e.target.value);
  }

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
    <div>
      <Navbar state={state.role} user={state} setSortBy={setSortBy} />
      <div>
        <input
          type="text"
          placeholder="Search By PaperName/Author"
          value={searchQuery}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.outputDiv}>
        {papers == null
          ? ""
          : papers.map((data, index) => {
              return (
                <div className={styles.innerDiv} key={index}>
                  <h3>Title: {data.title}</h3>
                  <h5 className={styles.h5}>Description: {data.description}</h5>
                  <button
                    className={styles.btnPrimary}
                    onClick={() => showPdf(data.pdf)}
                  >
                    Show Pdf
                  </button>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Home;
