import React, { useState, useEffect } from "react";
import "./index.css";
import { useNavigate, useParams } from "react-router-dom";
import Products from "../products/Products";
import Users from "../../admin/users/Users";
import Feedback from "../feedback/Feedback";
import AdminProfile from "../profile/AdminProfile";
import Bookings from "../Bookings/Bookings";

function Home() {
  const [activeItem, setActiveItem] = useState("Products");
  const { id } = useParams();
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const handleLogout = () => {
    // Implement your logout logic here
    navigate("/");
    console.log("Logout clicked");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {};
    document.body.addEventListener("click", handleClickOutside);
    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="adminpage">
      <div className="navbar">
        <div className="left-section">
          <h1>ADMIN DASHBOARD</h1>
        </div>
      </div>
      <div className="main">
        <div className="sidebar">
          <ul>
            <li
              className={activeItem === "Products" ? "active" : ""}
              onClick={() => handleItemClick("Products")}
            >
              Products
            </li>
            <li
              className={activeItem === "Bookings" ? "active" : ""}
              onClick={() => handleItemClick("Bookings")}
            >
              Bookings
            </li>
            <li
              className={activeItem === "Cancellations" ? "active" : ""}
              onClick={() => handleItemClick("Cancellations")}
            >
              Cancellations
            </li>
            <li
              className={activeItem === "Feedbacks" ? "active" : ""}
              onClick={() => handleItemClick("Feedbacks")}
            >
              Feedbacks
            </li>
            <li
              className={activeItem === "Users" ? "active" : ""}
              onClick={() => handleItemClick("Users")}
            >
              Users
            </li>
          </ul>
          <div className="bottom-section">
            <ul>
              <li
                className={
                  activeItem === "Profile"
                    ? "active profile-logout"
                    : "profile-logout"
                }
                onClick={() => handleItemClick("Profile")}
              >
                Profile
              </li>
              <li className="logout" onClick={handleLogout}>
                Logout
              </li>
            </ul>
          </div>
        </div>

        <div className="content">
          {activeItem === "Products" && <Products />}
          {activeItem === "Users" && <Users />}
          {activeItem === "Feedbacks" && <Feedback />}
          {activeItem === "Profile" && <AdminProfile />}
          {activeItem === "Bookings" && <Bookings />}


        </div>
      </div>
    </div>
  );
}

export default Home;
