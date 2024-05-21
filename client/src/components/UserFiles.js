import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import styles from "./UserFiles.module.css";
import { useLocation, NavLink } from "react-router-dom";
import Pagination from "./Pagination";
import PaperList from "./Paper";
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
          <PaperList
            papers={paginatedFiles}
            bookmarks={[]}
            toggleBookmark={() => {}}
            showPdf={() => {}}
            handleCitePopup={() => {}}
            state={state}
          />
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
