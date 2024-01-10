import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import axios from "axios";
import "./users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);


  const LoadingOverlay = () => (
    <div className="loading-overlay">
      <div className="loading-bar-container">
        <div className="loading-bar"></div>
      </div>
      <p>Loading...</p>
    </div>
  );
  

useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const response = await axios.get('http://localhost:5000/users');
        setUsers(response.data);
        console.log('Users fetched successfully:', response.data);
        // toast.success("Fetched Successfully");
      } catch (error) {
        console.error('Error fetching users:', error);

        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.error('Server responded with status:', error.response.status);
            console.error('Response data:', error.response.data);
          } else {
            console.error('No response received from the server.');
          }
        } else {
          console.error('Error setting up the request:', error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="users-admin">
      <h2>User Table</h2>

      <div>
        <table className="users">
          <thead>
            <tr>
              <th>Profile Picture</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Address</th>
              <th>Created At</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  {user.profilePicture && (
                    <img
                      src={`http://localhost:5000/${user.profilePicture.path}`}
                      alt="Profile"
                    />
                  )}
                </td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>

                <td>
                  {user.addressId ? (
                    <>
                      <p>City: {user.addressId.city}</p>
                      <p>House Name: {user.addressId.houseName}</p>
                      <p>Pincode: {user.addressId.pincode}</p>{" "}
                    </>
                  ) : (
                    ""
                  )}
                </td>
                <td>{new Date(user.createdAt).toLocaleString()}</td>
                {/* <td></td> */}
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <LoadingOverlay />}

      </div>
      <ToastContainer position="bottom-right" />

    </div>
  );
}

export default Users;
