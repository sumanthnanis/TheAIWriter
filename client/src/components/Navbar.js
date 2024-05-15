import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Dropdown from "./Dropdown.js";
import logo from "./img/logoo.svg";
import styles from "./Navbar.module.css";
import MenuItems from "./MenuItems.js";

function Navbar({ state, user, setSortBy, setCategory }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesDropdown, setCategoriesDropdown] = useState(false);

  const handleClick = () => setMenuOpen(!menuOpen);
  const closeMobileMenu = () => setMenuOpen(false);

  const toggleCategoriesDropdown = () =>
    setCategoriesDropdown(!categoriesDropdown);

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

  return (
    <nav id={styles.nav}>
      <img className={styles.logo} src={logo} alt="logo" />
      <div className={styles.menu} onClick={handleClick}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div id={styles.navPart2}>
        <ul className={menuOpen ? styles.open : ""}>
          {state === "landing" && (
            <li>
              <NavLink to="/login" className={styles.navLinks}>
                Login
              </NavLink>
            </li>
          )}

          {(state === "user" || state === "author") && (
            <li className={styles.navLinks} onClick={handleMostViewedClick}>
              Most Viewed
            </li>
          )}
          {(state === "user" || state === "author") && (
            <li className={styles.navLinks} onClick={handleMostCitedClick}>
              Most Cited
            </li>
          )}

          {(state === "user" || state === "author") && (
            <li
              className={styles.navLinks}
              onClick={() => {
                closeMobileMenu();
                toggleCategoriesDropdown();
              }}
            >
              Categories <i className="fas fa-caret-down" />
              {categoriesDropdown && (
                <Dropdown
                  items={MenuItems}
                  handleCategoryClick={handleCategoryClick}
                />
              )}
            </li>
          )}
          {state === "author" && (
            <li>
              <NavLink to="/my-papers" className={styles.button} state={user}>
                My Papers
              </NavLink>
            </li>
          )}
          {(state === "author" || state === "author-papers") && (
            <li>
              <NavLink to="/upload" className={styles.button} state={user}>
                Publish
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
