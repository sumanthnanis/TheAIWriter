import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import styles from "./UserFiles.module.css";
import { useLocation, NavLink } from "react-router-dom";
import Pagination from "./Pagination";
import PaperList from "./Paper";
import { toast } from "sonner";

let PageSize = 5;

const UserFiles = () => {
  const { state } = useLocation();
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedPapers, setBookmarkedPapers] = useState([]);

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

  const fetchPapers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/papers/${state.username}`
      );

      const unBookmarked = response.data.filter(
        (paper) => paper.bookmarks === 0
      );
      const Bookmarked = response.data.filter((paper) => paper.bookmarks === 1);

      console.log("Server response:", response.data); // Log the server response

      // Check if each paper object has a 'filename' property
      const hasFilenameProperty = response.data.every((paper) =>
        paper.hasOwnProperty("filename")
      );
      console.log(
        'All papers have a "filename" property:',
        hasFilenameProperty
      );

      setBookmarkedPapers(Bookmarked);
    } catch (error) {
      console.error("Error fetching papers:", error);
    }
  };

  const handleBookmarkRemoval = async (index, filename) => {
    if (!filename) {
      console.error("Error: filename is undefined");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8000/api/papers/${encodeURIComponent(filename)}`,
        {
          bookmarks: 0,
        }
      );

      setBookmarkedPapers((prevBookmarks) =>
        prevBookmarks.filter((paper) => paper.filename !== filename)
      );
      toast.info("Bookmark removed successfully!");

      fetchPapers();
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  const handleBookmark = async (filename, newBookmarkStatus) => {
    if (!filename) {
      console.error("Error: filename is undefined");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8000/api/papers/${encodeURIComponent(filename)}`,
        {
          bookmarks: newBookmarkStatus,
        }
      );
      if (newBookmarkStatus === 0) {
        setBookmarkedPapers((prevBookmarks) =>
          prevBookmarks.map((paper) =>
            paper.filename === filename ? { ...paper, bookmarks: 0 } : paper
          )
        );
        toast.success("Paper published successfully");
      } else {
        setBookmarkedPapers((prevBookmarks) =>
          prevBookmarks.map((paper) =>
            paper.filename === filename
              ? { ...paper, bookmarkedPapers: 1 }
              : paper
          )
        );
        toast.success("Paper unpublished successfully");
      }
      fetchPapers();
    } catch (error) {
      console.error("Error updating paper:", error);
    }
  };

  useEffect(() => {
    if (state.username) {
      fetchPapers();
    }
  }, [state.username]);

  return (
    <div className={styles.userFiles}>
      <h2 className={styles.filesHeading}>Files for {state.username}</h2>
      <div className={styles.listBody}>
        <ul className={styles.list}>
          <PaperList
            papers={bookmarkedPapers}
            bookmarks={bookmarkedPapers.map(() => true)}
            toggleBookmark={(index, id) => handleBookmark(id, 0)}
            showPdf={showPdf}
            handleCitePopup={() => {}}
            state={state}
          />
          {bookmarkedPapers.length === 0 ? (
            <p>No Bookmarked files found</p>
          ) : (
            <PaperList
              papers={bookmarkedPapers}
              bookmarks={bookmarkedPapers.map(() => true)}
              toggleBookmark={handleBookmarkRemoval}
              showPdf={showPdf}
              handleCitePopup={() => {}}
              // handleBookmarkRemoval={handleBookmarkRemoval}
              handleBookmark={handleBookmark}
              state={state}
            />
          )}
        </ul>
      </div>
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
