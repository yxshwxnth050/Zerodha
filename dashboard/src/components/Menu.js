import React, { useState } from "react";
import { Link } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", to: "/" },
  { label: "Orders", to: "/orders" },
  { label: "Holdings", to: "/holdings" },
  { label: "Positions", to: "/positions" },
  { label: "Funds", to: "/funds" },
  { label: "Apps", to: "/apps" },
];

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleProfileClick = () => {
    setIsProfileDropdownOpen((open) => !open);
  };

  return (
    <div className="menu-container">
      <img src="logo.png" alt="Logo" style={{ width: "32px" }} />

      <div className="menus">
        <ul>
          {menuItems.map((item, index) => (
            <li key={item.to}>
              <Link
                style={{ textDecoration: "none" }}
                to={item.to}
                onClick={() => setSelectedMenu(index)}
              >
                <p className={selectedMenu === index ? "menu selected" : "menu"}>
                  {item.label}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <hr />

        <div
          className="profile"
          onClick={handleProfileClick}
          role="button"
          tabIndex={0}
          aria-haspopup="true"
          aria-expanded={isProfileDropdownOpen}
        >
          <div className="avatar">ZU</div>
          <p className="username">USERID</p>
        </div>
      </div>
    </div>
  );
};

export default Menu;