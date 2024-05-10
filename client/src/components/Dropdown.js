import React from "react";
import axios from "axios";
import "./Dropdown.css";

function Dropdown({ items }) {
  const handleClick = async (title) => {
    try {
      const response = await axios.get(
        `/api/papers-by-category?category=${title}`
      );

      console.log(response.data);
    } catch (error) {
      console.error("Error fetching papers by category:", error);
    }
  };

  const renderMenu = (items) => {
    return (
      <ul className="dropdown-menu">
        {items.map((item, index) => (
          <li
            key={index}
            className={item.cName}
            onClick={() => handleClick(item.title)}
          >
            {item.title}
          </li>
        ))}
      </ul>
    );
  };

  return renderMenu(items);
}

export default Dropdown;
