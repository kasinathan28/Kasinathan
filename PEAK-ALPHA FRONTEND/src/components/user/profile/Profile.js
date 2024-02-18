import React, { useState, useEffect } from "react";
import "./profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAtlassian } from "@fortawesome/free-brands-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faShoppingCart, faHome } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import HamburgerMenu from "react-hamburger-menu";
import {  useNavigate, useParams } from "react-router-dom";

import EditProfileForm from "../editprofile/EditProfileForm";
import AddressForm from "../address/AddressForm";
import Bookings from "../bookings/Bookings";

function Profile() {
  const profileId = useParams();
  console.log(profileId);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Profile");
  const navigate = useNavigate();

  const toggleMenu = () => {
    console.log("Toggle menu");
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
    setIsDropdownOpen(false);
  };

  const handleBack = () => {
    navigate(-1);
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
            <li
              className={activeItem === "Bookings" ? "active" : ""}
              onClick={() => handleItemClick("Bookings")}
            >
              Bookings
            </li>
          </ul>
        </div>
        <div className="content">
          {activeItem === "Profile" && <ProfileContent />}
          {activeItem === "Address" && <AddressContent />}
          {activeItem === "Bookings" && <Bookings />}
        </div>
      </div>
    </div>
  );
}

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
