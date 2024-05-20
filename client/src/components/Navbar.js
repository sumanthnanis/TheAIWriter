import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Dropdown from "./Dropdown.js";
import logo from "./img/logo.jpg";
import styles from "./Navbar.module.css";
import MenuItems from "./MenuItems.js";
import Search from "./Search.js";

function Navbar({
  state,
  user,
  setSortBy,
  setCategory,
  handleChange = null,
  searchQuery = null,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [authors, setAuthors] = useState([]);

  const handleClick = () => setMenuOpen(!menuOpen);
  const closeMobileMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleMostViewedClick = () => {
    setSortBy("mostViewed");
    closeMobileMenu();
  };

  const handleMostCitedClick = () => {
    setSortBy("mostCited");
    closeMobileMenu();
  };

  const handleCategoryClick = (category) => {
    setCategory(category);
    closeMobileMenu();
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleMouseLeaveDropdown = () => {
    setActiveDropdown(null);
  };

  return (
    <nav id={styles.nav}>
      <div className={styles.logocontainer}>
        <img className={styles.logo} src={logo} alt="logo" />
      </div>
      <div className={styles.menu} onClick={handleClick}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div id={styles.navPart2}>
        <ul className={menuOpen ? styles.open : ""} id={styles.ul}>
          <Search
            authors={authors}
            setAuthors={setAuthors}
            className={styles.search}
            handleChange={handleChange}
            searchQuery={searchQuery}
          />
          {state === "landing" && (
            <li className={styles.li}>
              <NavLink to="/login" className={styles.navLinks}>
                Login
              </NavLink>
            </li>
          )}

          {(state === "user" || state === "author") && (
            <li
              className={`${styles.navLinks} ${styles.dropdownToggle}`}
              onMouseEnter={() => toggleDropdown("categories")}
              onMouseLeave={handleMouseLeaveDropdown}
            >
              Categories <i className="fas fa-caret-down" />
              {activeDropdown === "categories" && (
                <Dropdown
                  className={styles.dropdown}
                  items={MenuItems}
                  handleCategoryClick={handleCategoryClick}
                  onMouseLeave={handleMouseLeaveDropdown}
                />
              )}
            </li>
          )}

          {(state === "user" || state === "author") && (
            <li
              className={`${styles.navLinks} ${styles.dropdownToggle}`}
              onMouseEnter={() => toggleDropdown("filter")}
              onMouseLeave={() => setTimeout(handleMouseLeaveDropdown, 100)}
            >
              Filter <i className="fas fa-caret-down" />
              {activeDropdown === "filter" && (
                <ul
                  className={styles.filterDropdown}
                  onMouseLeave={handleMouseLeaveDropdown}
                >
                  <li
                    className={styles.filterItem}
                    onClick={handleMostViewedClick}
                  >
                    Most Viewed
                  </li>
                  <li
                    className={styles.filterItem}
                    onClick={handleMostCitedClick}
                  >
                    Most Cited
                  </li>
                </ul>
              )}
            </li>
          )}

          {state === "author" && (
            <li className={styles.navLinks}>
              <NavLink to="/my-papers" className={styles.linked} state={user}>
                My Papers
              </NavLink>
            </li>
          )}

          {(state === "author" || state === "author-papers") && (
            <li className={styles.navLinks}>
              <NavLink to="/upload" className={styles.linked} state={user}>
                Publish
              </NavLink>
            </li>
          )}

          {(state === "user" || state === "author") && (
            <>
              <button
                onClick={() => toggleDropdown("userMenu")}
                className={isOpen ? "Close" : "Open"}
                id={styles.button}
              >
                <div className={styles.icons}>
                  <i className="fa fa-bars padd" id={styles.icon}></i>
                  <i className="fas fa-user" id={styles.icon}></i>
                </div>
              </button>

              {activeDropdown === "userMenu" && (
                <ul
                  className={styles.menudrop}
                  onMouseLeave={handleMouseLeaveDropdown}
                >
                  <li className={styles.listdrop}>
                    <NavLink
                      className={styles.navitem}
                      to="/user/profile"
                      state={user}
                    >
                      Your profile
                    </NavLink>
                  </li>
                  <li className={styles.listdrop}>
                    <NavLink
                      className={styles.navitem}
                      to="/user-files/:username"
                      state={user}
                    >
                      My list
                    </NavLink>
                  </li>
                  <li
                    className={styles.navitem}
                    id={styles.listdrop}
                    onClick={() => handleLogout()}
                  >
                    Logout
                  </li>
                </ul>
              )}
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
