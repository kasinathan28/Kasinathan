// AdminProfile.js

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./adminProfile.css";
import adminAvatar from "../../../assets/admin avatar.png"

function AdminProfile() {
  const { id } = useParams();
  const [adminData, setAdminData] = useState();

  useEffect(() => {
    const getAdmin = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/getAdmin/${id}`
        );
        setAdminData(response.data);
      } catch (error) {
        console.log("Error fetching the admin Data", error);
      }
    };
    getAdmin();
  }, [id]);

  return (
    <div className="adminProfilePage">
      <div className="admin-heading">
        <h1>Admin Profile</h1>
      </div>
      <div className="admin-profile-card">
        <div className="adminAvatar">
          {/* Display the avatar image */}
          <img src={adminAvatar} alt="Admin Avatar" />
        </div>
        <div className="admin-info">
            <div className="admin-info-sub">

          <label>Name:</label>
          <p>{adminData && adminData.adminUsername}</p>
            </div>
            <div className="admin-info-sub">

          <label>Password:</label>
          <p>{adminData && adminData.adminPassword}</p>
            </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
