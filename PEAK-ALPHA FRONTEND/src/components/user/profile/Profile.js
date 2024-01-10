import React, { useState, useEffect } from "react";
import "./profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAtlassian } from "@fortawesome/free-brands-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faShoppingCart, faHome } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import HamburgerMenu from "react-hamburger-menu";
import { Navigate, useNavigate } from "react-router-dom";

import EditProfileForm from "../editprofile/EditProfileForm";
import AddressForm from "../address/AddressForm";

function Profile() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Profile");
  const navigate = useNavigate();

  const toggleMenu = () => {
    console.log("Toggle menu");
    setIsOpen(!isOpen);
    // setIsDropdownOpen(false); // You can remove this line if it's not being used
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
    setIsDropdownOpen(false);
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    console.log("isOpen:", isOpen);
  }, [isOpen]);

  return (
    <div className="profilepage">
      <header>
        <button className="backbutton" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div className="left-section">
          <h1>
            PEAK
            <FontAwesomeIcon icon={faAtlassian} style={{ color: "#132e35" }} />
            LPHA
          </h1>
        </div>
        {/* <div className="hamburger-menu">
          <HamburgerMenu
            isOpen={isOpen}
            menuClicked={toggleMenu}
            width={30}
            height={20}
            strokeWidth={3}
            rotate={0}
            color="#132e35"
            borderRadius={0}
            animationDuration={0.5}
          />
          {isOpen && (
            <div className="dropdown-menu hamburger-dropdown">
              <ul>
                <li onClick={() => handleItemClick("Profile")}>
                  <FontAwesomeIcon icon={faUser} />
                  PROFILE
                </li>
                <li onClick={() => handleItemClick("Address")}>
                  <FontAwesomeIcon icon={faShoppingCart} />
                  ADDRESS
                </li>
              </ul>
            </div>
          )}
        </div> */}
      </header>
      <div className="main">
        <div className="sidebar">
          <ul>
            <li
              className={activeItem === "Profile" ? "active" : ""}
              onClick={() => handleItemClick("Profile")}
            >
              Profile
            </li>
            <li
              className={activeItem === "Address" ? "active" : ""}
              onClick={() => handleItemClick("Address")}
            >
              Address
            </li>
          </ul>
        </div>
        <div className="content">
          {activeItem === "Profile" && <ProfileContent />}
          {activeItem === "Address" && <AddressContent />}
        </div>
      </div>
    </div>
  );
}

// Sample content components for Profile and Address
const ProfileContent = () => {
  return (
    <div>
      <EditProfileForm />
    </div>
  );
};

const AddressContent = () => {
  return(

    <div>
    <AddressForm />
  </div>
  );
  
};

export default Profile;
