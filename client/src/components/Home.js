import React, { useEffect, useState, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import styles from "./Home.module.css";
import Pagination from "./Pagination";
let PageSize = 5;

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { state } = useLocation();
  const [papers, setPapers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [category, setCategory] = useState("");
  const [authors, setAuthors] = useState([]);

  const paginatedPapers = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return papers.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, papers]);

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

        const uniqueAuthors = [
          ...new Set(response.data.map((paper) => paper.uploadedBy)),
        ];
        setAuthors(uniqueAuthors);
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
        setPapers(response.data);

        const uniqueAuthors = [
          ...new Set(response.data.map((paper) => paper.uploadedBy)),
        ];
        setAuthors(uniqueAuthors);
      } catch (error) {
        console.error("Error fetching papers:", error);
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
          {authors.map(
            (author, index) =>
              includeSearchQuery(author, searchQuery) && (
                <NavLink
                  key={index}
                  className={styles.author}
                  to={`/user/${encodeURIComponent(author)}`}
                >
                  <h4>Author: {author}</h4>
                </NavLink>
              )
          )}
        </div>
      )}

      <div className={styles.outputDiv}>
        {paginatedPapers.length === 0 ? (
          <p>No papers found</p>
        ) : (
          paginatedPapers.map((data, index) => (
            <div key={index}>
              <div className={styles.innerDiv}>
                <NavLink to={`/paper/${data._id}`} className={styles.navlink}>
                  <h3>Title: {data.title}</h3>
                </NavLink>
                <NavLink
                  to={`/user/${encodeURIComponent(data.uploadedBy)}`}
                  className={styles.navlink}
                >
                  <h5 className={styles.h5}>Author: {data.uploadedBy}</h5>
                </NavLink>
                <button
                  className={styles.btnPrimary}
                  onClick={() => showPdf(data.pdf)}
                >
                  Show Pdf
                </button>
                <button
                  className={styles.btnPrimary}
                  onClick={() => addList(data._id, state.username)}
                >
                  Add to list
                </button>
              </div>
            </div>
          ))
        )}
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={papers.length}
          pageSize={PageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default Home;
