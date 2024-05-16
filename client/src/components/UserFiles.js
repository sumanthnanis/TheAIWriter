import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import styles from "./UserFiles.module.css";
import { useLocation, NavLink } from "react-router-dom";
import Pagination from "./Pagination";

let PageSize = 5;

const UserFiles = () => {
  const { state } = useLocation();
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedFiles = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return files.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, files]);

  const removeFile = async (file) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/user-files/${state.username}/${file._id}`
      );

      if (response.status === 200) {
        fetchUserFiles();
        console.log("File removed successfully");
      } else {
        console.error("Failed to remove file");
      }
    } catch (error) {
      console.error("Error removing file:", error);
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

  const fetchUserFiles = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/user-files/${state.username}`
      );
      if (response.status === 200) {
        setFiles(response.data.files);
      } else {
        console.error("Failed to fetch user files");
      }
    } catch (error) {
      console.error("Error fetching user files:", error);
    }
  };
  useEffect(() => {
    fetchUserFiles();
  }, [state.username]);

  return (
    <div className={styles.userFiles}>
      <h2>Files for {state.username}</h2>
      <ul className={styles.list}>
        {paginatedFiles.length === 0 ? (
          <p>No files found</p>
        ) : (
          paginatedFiles.map((file, index) => (
            <div className={styles.button} key={index}>
              <li className={styles.paper}>
                <NavLink to={`/paper/${file._id}`} className={styles.navlink}>
                  <h3>Title: {file.title}</h3>
                </NavLink>
                <NavLink
                  to={`/user/${encodeURIComponent(file.uploadedBy)}`}
                  className={styles.navlink}
                >
                  <h5 className={styles.h5}>Author: {file.uploadedBy}</h5>
                </NavLink>
                <button
                  className={styles.btnPrimary}
                  onClick={() => showPdf(file)}
                >
                  Show Pdf
                </button>
                <button
                  className={styles.btnPrimary}
                  onClick={() => removeFile(file)}
                >
                  Remove from list
                </button>
              </li>
            </div>
          ))
        )}
      </ul>
      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={files.length}
        pageSize={PageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default UserFiles;
