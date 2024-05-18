import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from "./Search.module.css";

// const Search = ({ handleSearch, authors, setAuthors, setPapers }) => {
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     if (searchQuery === "") {
//       return;
//     }
//     const getPapersBySearch = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8000/api/search?search=${searchQuery}`
//         );
//         setPapers(response.data);

//         const uniqueAuthors = [
//           ...new Set(response.data.map((paper) => paper.uploadedBy)),
//         ];
//         setAuthors(uniqueAuthors);
//       } catch (error) {
//         console.error("Error fetching papers:", error);
//       }
//     };
//     getPapersBySearch();
//   }, [searchQuery, setPapers, setAuthors]);

//   const handleChange = (e) => {
//     setSearchQuery(e.target.value);
//     handleSearch(e.target.value);
//   };

//   const includeSearchQuery = (authorName, searchQuery) => {
//     return authorName.toLowerCase().includes(searchQuery.toLowerCase());
//   };

//   return (
//     <div className={styles.searchContainer}>
//       <div className={styles.searchBar}>
//         <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
//         <input
//           type="text"
//           placeholder="Search By PaperName/Author"
//           value={searchQuery}
//           onChange={handleChange}
//           className={styles.searchInput}
//         />
//       </div>
//       {searchQuery && authors.length > 0 && (
//         <div className={styles.authorDiv}>
//           {authors.map(
//             (author, index) =>
//               includeSearchQuery(author, searchQuery) && (
//                 <NavLink
//                   key={index}
//                   className={styles.author}
//                   to={`/user/${encodeURIComponent(author)}`}
//                 >
//                   <h4>Author: {author}</h4>
//                 </NavLink>
//               )
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

const Search = ({ handleChange, searchQuery }) => {
  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchBar}>
        <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search By PaperName/Author"
          value={searchQuery}
          onChange={handleChange}
          className={styles.searchInput}
        />
      </div>
    </div>
  );
};

export default Search;
