import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import styles from "./Home.module.css";

const Home = () => {
  const { state } = useLocation();
  const [papers, setPapers] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [category, setCategory] = useState("");
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    fetchPapers();
  }, [sortBy, category]);

  const fetchPapers = async () => {
    try {
      let url = "http://localhost:8000/api/get-papers";
      const params = new URLSearchParams();
      if (sortBy === "mostViewed") {
        url += "?sortBy=viewCount";
      }
      if (sortBy === "mostCited") {
        url += "?sortBy=citationCount";
      }
      if (category) {
        const trimmedCategory = category.trim();
        params.append("category", trimmedCategory);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
        console.log(url);
      }
      const response = await axios.get(url);
      setPapers(response.data);

      const uniqueAuthors = [
        ...new Set(response.data.map((paper) => paper.uploadedBy)),
      ];
      setAuthors(uniqueAuthors);
    } catch (error) {
      console.error("Error fetching papers:", error);
    }
  };

  useEffect(() => {
    if (searchQuery === "") {
      return;
    }
    const getPapers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/search?search=${searchQuery}`
        );
        setPapers(response.data);

        const uniqueAuthors = [
          ...new Set(response.data.map((paper) => paper.uploadedBy)),
        ];
        setAuthors(uniqueAuthors);
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
      <Navbar
        state={state.role}
        user={state}
        setSortBy={setSortBy}
        setCategory={setCategory}
      />
      <div>
        <input
          type="text"
          placeholder="Search By PaperName/Author"
          value={searchQuery}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </div>

      {searchQuery && authors.length > 0 && (
        <div className={styles.authorDiv}>
          {authors.map((author, index) => (
            <NavLink
              key={index}
              className={styles.author}
              to={`/user/${encodeURIComponent(author)}`}
            >
              <h4>Author: {author}</h4>
            </NavLink>
          ))}
        </div>
      )}

      <div className={styles.outputDiv}>
        {papers == null
          ? ""
          : papers.map((data, index) => (
              <div key={index}>
                <div className={styles.innerDiv}>
                  <NavLink to={`/paper/${data._id}`} className={styles.navlink}>
                    <h3>Title: {data.title}</h3>
                  </NavLink>
                  <h5 className={styles.h5}>Author: {data.uploadedBy}</h5>
                  <button
                    className={styles.btnPrimary}
                    onClick={() => showPdf(data.pdf)}
                  >
                    Show Pdf
                  </button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Home;
