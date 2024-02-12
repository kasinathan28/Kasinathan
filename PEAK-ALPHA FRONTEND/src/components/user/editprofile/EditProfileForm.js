import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./editprofile.css";
import axios from "axios";
import { useParams } from "react-router-dom";

const EditProfileForm = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const demoProfileId = useParams();
  const profileId = demoProfileId.profileId;

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show loading state
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const formData = new FormData();
      formData.append("profileId", profileId); // Add this line to include the username
      formData.append("name", name);
      formData.append("phoneNumber", phoneNumber);
      formData.append("password", password);
      formData.append("email", email);

      // Only append profile picture if it is not null
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      console.log("FormData Content:", formData);

      const response = await axios.post(
        "http://localhost:5000/updateprofile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Check the response and handle accordingly
      if (response.status === 200) {
        const { message, user } = response.data;

        // Show success toast
        toast.success(message);

        // Update local state with the new profile picture path
        setProfilePicture(user.profilePicture.path);
      } else {
        // Show error toast
        toast.error("Failed to update profile. Please try again later.");
      }
    } catch (error) {
      // Show error toast
      toast.error("Failed to update profile. Please try again later.");
    } finally {
      // Hide loading state
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post(`http://localhost:5000/getUserData/${profileId}`, {
          profileId: profileId,
        });
        console.log(profileId);

        const userData = response.data;
        console.log("User Data:", userData);
        console.log("Profile Picture:", userData.profilePicture);
        setName(userData.name || "");
        setPhoneNumber(userData.phoneNumber || "");
        setEmail(userData.email || "");
        setPassword(userData.password || "");
        setProfilePicture(userData.profilePicture && userData.profilePicture.path || "");
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div>
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <h2>Edit Profile</h2>

        <div className="form-row">
          <div className="form-column">
            <div className="profile-picture">
              <img
                src={`http://localhost:5000/${profilePicture}`}
                alt="Profile"
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-column">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-column">
            <label>Phone Number:</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-column">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-column">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-column">
            <label>Profile Picture:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
            />
          </div>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default EditProfileForm;
