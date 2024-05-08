import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

import logo from "./img/logoo.svg";

import "./Landing.css";

function Navbar({ state }) {
  console.log(state);
  const [menuOpen, setMenuOpen] = useState(false);
  const [papers, setPapers] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    fetchPapers();
  }, [searchQuery]);

  const fetchPapers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/get-papers?search=${searchQuery}`
      );
      setPapers(response.data);
    } catch (error) {
      console.error("Error fetching papers:", error);
    }
  };
  function handleSearch(e) {
    setSearchQuery(e.target.value);
  }

  return (
    <nav id="nav">
      <img className="logo" src={logo} alt="logo" />
      <div
        className="menu"
        onClick={() => {
          setMenuOpen(!menuOpen);
        }}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div id="nav-part2">
        <div id="links">
          {/* <div>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
          </div> */}

          <ul className={menuOpen ? "open" : ""}>
            {state === "landing" && (
              <li>
                <NavLink to="/login" className="button">
                  Login
                </NavLink>
              </li>
            )}
            {state === "landing" && (
              <li>
                <NavLink to="/home" className="button">
                  Try Now
                </NavLink>
              </li>
            )}
            {(state === "user" || state === "author") && [
              <li>
                <NavLink to="/home" className="button">
                  Trending
                </NavLink>
              </li>,
              <li>
                <NavLink to="/home" className="button">
                  Explore
                </NavLink>
              </li>,
            ]}

            {state === "author" && (
              <li>
                <NavLink to="/upload" className="button">
                  Publish
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
