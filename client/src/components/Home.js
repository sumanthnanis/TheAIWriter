import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import styles from "./Home.module.css";
import PaperList from "./Paper";
import { toast, Toaster } from "sonner";
import Navbar from "./Navbar";
import BookmarksContext from "../BookmarksContext";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
  const { bookmarkedPapers, setBookmarkedPapers } =
    useContext(BookmarksContext);
  const [papers, setPapers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [category, setCategory] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [role, setRole] = useState("");
  const [userProfile,setUserProfile] =useState([])
  const dispatch = useDispatch();
  const data = useSelector((prev) => prev.auth.user);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCitePopup = (paper) => {
    setSelectedPaper(paper);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedPaper(null);
    setCopySuccess(false);
  };

  const handleCiteThisPaper = async () => {
    if (!selectedPaper) return;

    try {
      await axios.post(
        `http://localhost:8000/api/increase-citations/${selectedPaper._id}`
      );

      setPapers((prevPapers) =>
        prevPapers.map((paper) =>
          paper._id === selectedPaper._id
            ? { ...paper, citations: paper.citations + 1 }
            : paper
        )
      );

      const citationText = `Title: ${selectedPaper.title}, Author: ${selectedPaper.uploadedBy}`;
      await navigator.clipboard.writeText(citationText);
      console.log("Citation copied to clipboard:", citationText);
      setCopySuccess(true);
    } catch (error) {
      console.error("Error citing paper:", error);
    }
  };
  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/profile");
      const profilesData = response.data;
      setProfiles(profilesData);
      setUserProfile(profilesData)
      console.log("these are profiles", profilesData);
      fetchPapers();
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };
  useEffect(() => {
    fetchPapers();
  }, [sortBy, category]);
  const fetchPapers = async () => {
    try {
      console.log("dgdgddh");
      let url = "http://localhost:8000/api/get-papers";
      const params = new URLSearchParams();

      params.append("sortBy", "publicationDate");
      params.append("order", "desc");

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
      const papersData = response.data;
      console.log(papersData);

      const userProfile = profiles.find(
        (profile) => profile.username === data.username
      );
      console.log("profile", userProfile);
      const userSkillsString = userProfile
        ? userProfile.skills.toLowerCase()
        : "";
      const userSkills = userSkillsString ? userSkillsString.split(",") : [];
      console.log("hiiiiiiiiiiiiiii", userSkills);

      const matchedPapers = papersData.filter((paper) => {
        const paperCategories = paper.categories.map((category) =>
          category.toLowerCase()
        );
        return (
          userSkills &&
          userSkills.some((skill) => paperCategories.includes(skill))
        );
      });

      matchedPapers.sort(
        (a, b) => new Date(b.publicationDate) - new Date(a.publicationDate)
      );

      setPapers(matchedPapers.length > 0 ? matchedPapers : papersData);

      setBookmarkedPapers(
        papersData.filter((paper) => paper.bookmarkedBy.includes(data.username))
      );
    } catch (error) {
      console.error("Error fetching papers:", error);
    }
  };

  useEffect(() => {
    const getPapersBySearch = async () => {
      try {
        if (searchQuery === "") {
          // If search query is empty, fetch all papers
          await fetchPapers();
          await fetchProfiles();
        } else {
          const response = await axios.get(
            `http://localhost:8000/api/search?search=${searchQuery}`
          );
          const { papers, profiles } = response.data;
          setPapers(papers);
          setProfiles(profiles);
          console.log(profiles);
          setBookmarkedPapers(
            papers.filter((paper) => paper.bookmarkedBy.includes(data.username))
          );
        }
      } catch (error) {
        console.error("Error fetching papers:", error);
      }
    };

    getPapersBySearch();
  }, [searchQuery]);



  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
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

  const aggregatedProfiles = profiles
    .map((profile) => {
      const authorPapers = papers.filter(
        (paper) => paper.uploadedBy === profile.username
      );

      // Calculate totals
      const totalPapers = authorPapers.length;
      const totalCitations = authorPapers.reduce(
        (sum, paper) => sum + paper.citations,
        0
      );
      const totalReads = authorPapers.reduce(
        (sum, paper) => sum + paper.count,
        0
      );

      if (totalPapers > 0) {
        return {
          username: profile.username,
          totalPapers,
          totalCitations,
          totalReads,
          profileImage: profile.profileImage,
          institution: profile.institution,
        };
      } else {
        return null;
      }
    })
    .filter((profile) => profile !== null);

  console.log("Aggregated Profiles:", aggregatedProfiles);

  const toggleBookmark = async (index, id) => {
    const paper = papers[index];
    const bookmarked = !bookmarkedPapers.some((bp) => bp._id === paper._id);

    try {
      const response = await axios.post(
        `http://localhost:8000/api/toggle-bookmark`,
        {
          paperId: id,
          username: data.username,
          bookmarked,
        }
      );

      if (response.status === 200) {
        const updatedPaper = response.data.paper;
        setPapers((prevPapers) =>
          prevPapers.map((paper) =>
            paper._id === updatedPaper._id ? updatedPaper : paper
          )
        );

        if (bookmarked) {
          setBookmarkedPapers((prev) => [...prev, updatedPaper]);
          toast.success("Bookmarked successfully!");
        } else {
          setBookmarkedPapers((prev) =>
            prev.filter((paper) => paper._id !== updatedPaper._id)
          );
          toast.info("Bookmark removed successfully!");
        }
      } else {
        console.error("Failed to update bookmark status");
      }
    } catch (error) {
      console.error("Error updating bookmark status:", error);
    }
  };

  useEffect(() => {
    localStorage.setItem("role", role);
    console.log(role);
  }, [role]);

  const filteredProfiles = searchQuery
    ? aggregatedProfiles.filter((profile) =>
        profile.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : aggregatedProfiles;

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className={styles["home-root"]}>
        <div className={styles["nav-div"]}>
          <Navbar
            setSortBy={setSortBy}
            setCategory={setCategory}
            handleChange={handleSearch}
            searchQuery={searchQuery}
            hideCategoriesFiler={true}
          />
        </div>
        <div className={styles.page}>
          <div className={styles.outputDiv}>
            <div className={styles.paperheader}>
              {searchQuery ? (
                <span className={styles.paperSearch}>
                  Search Results for {searchQuery} in Papers
                </span>
              ) : category ? (
                <span className={styles.paperCategory}>
                  Showing Papers On {category}
                </span>
              ) : sortBy ? (
                <span className={styles.paperFilter}>{sortBy} Papers</span>
              ) : (
                <span></span>
              )}
            </div>
            <PaperList
              papers={papers}
              bookmarks={papers.map((paper) =>
                bookmarkedPapers.some((bp) => bp._id === paper._id)
              )}
              toggleBookmark={toggleBookmark}
              showPdf={showPdf}
              handleCitePopup={handleCitePopup}
            />
          </div>
          <div className={styles.total}>
            {filteredProfiles.length > 0 && (
              <div className={styles.authorDiv}>
                <div className={styles.header}>
                  <span className={styles.authorSearch}>
                    {searchQuery
                      ? `Search Results for ${searchQuery} in Authors`
                      : ""}
                  </span>
                </div>
              </div>
            )}
            {filteredProfiles.map((profile, index) => (
              <NavLink
                key={index}
                className={styles.authorCard}
                to={`/user/${encodeURIComponent(profile.username)}`}
              >
                <div className={styles.card}>
                  <div className={styles.profileContainer}>
                    <div className={styles.imageContainer}>
                      {profile.profileImage && (
                        <img
                          src={`http://localhost:8000${profile.profileImage}`}
                          alt={profile.username}
                          className={styles.profileImage}
                        />
                      )}
                    </div>
                    <div className={styles.detailsOverlay}>
                      <div className={styles.userInfo}>
                        <h4 className={styles.userName}>{profile.username}</h4>
                        <p className={styles.userInstitution}>
                          {profile.institution}
                        </p>
                      </div>
                      <div className={styles.stats}>
                        <div className={styles.statItem}>
                          <span className={styles.statNumber}>
                            {profile.totalPapers}
                          </span>
                          <span className={styles.statLabel}>Publications</span>
                        </div>
                        <div className={styles.statDivider}></div>
                        <div className={styles.statItem}>
                          <span className={styles.statNumber}>
                            {profile.totalCitations}
                          </span>
                          <span className={styles.statLabel}>Citations</span>
                        </div>
                        <div className={styles.statDivider}></div>
                        <div className={styles.statItem}>
                          <span className={styles.statNumber}>
                            {profile.totalReads}
                          </span>
                          <span className={styles.statLabel}>Reads</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
        {showPopup && selectedPaper && (
          <div className={styles.popup}>
            <div className={styles.popupContent}>
              <span className={styles.close} onClick={handleClosePopup}>
                &times;
              </span>
              <h2 className={styles.citePaper}>Cite Paper</h2>
              <p>
                {selectedPaper.uploadedBy}. {selectedPaper.title}
              </p>
              <button
                className={styles.copyButton}
                onClick={() => handleCiteThisPaper(selectedPaper)}
              >
                Copy Citation
              </button>
              {copySuccess && (
                <p className={styles.successMessage}>Copied to clipboard!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
