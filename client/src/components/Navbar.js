import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Dropdown from "./Dropdown.js";

import logo from "./img/logoo.svg";
import "./Landing.css";
import { MenuItems, CatItems } from "./MenuItems.js";

function Navbar({ state, user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [categoriesDropdown, setCategoriesDropdown] = useState(false);

  const handleClick = () => setMenuOpen(!menuOpen);
  const closeMobileMenu = () => setMenuOpen(false);

  const toggleServicesDropdown = () => setServicesDropdown(!servicesDropdown);
  const toggleCategoriesDropdown = () =>
    setCategoriesDropdown(!categoriesDropdown);

  return (
    <nav id="nav">
      <img className="logo" src={logo} alt="logo" />
      <div className="menu" onClick={handleClick}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div id="nav-part2">
        <div id="links">
          <ul className={menuOpen ? "open" : ""}>
            {state === "landing" && (
              <li>
                <NavLink to="/login" className="button">
                  Login
                </NavLink>
              </li>
            )}

            {(state === "user" || state === "author") && (
              <li
                className="nav-links"
                onClick={() => {
                  closeMobileMenu();
                  toggleServicesDropdown();
                }}
              >
                Services <i className="fas fa-caret-down" />
                {servicesDropdown && <Dropdown items={CatItems} />}
              </li>
            )}

            {(state === "user" || state === "author") && (
              <li
                className="nav-links"
                onClick={() => {
                  closeMobileMenu();
                  toggleCategoriesDropdown();
                }}
              >
                Categories <i className="fas fa-caret-down" />
                {categoriesDropdown && <Dropdown items={MenuItems} />}
              </li>
            )}

            {state === "author" && (
              <li>
                <NavLink to="/upload" className="button" state={user}>
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
