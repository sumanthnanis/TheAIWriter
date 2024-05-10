import React from "react";
import "./Dropdown.css";

function Dropdown({ items }) {
  const renderSubMenu = (submenu) => {
    return (
      <ul className="dropdown-menu">
        {submenu.map((item, index) => (
          <li key={index} className={item.cName}>
            {item.title}
          </li>
        ))}
      </ul>
    );
  };

  const renderMenu = (items) => {
    return (
      <ul className="dropdown-menu">
        {items.map((item, index) => (
          <li key={index} className={item.cName}>
            {item.title}
            {item.submenu && renderSubMenu(item.subMenu)}{" "}
          </li>
        ))}
      </ul>
    );
  };

  return renderMenu(items);
}

export default Dropdown;
