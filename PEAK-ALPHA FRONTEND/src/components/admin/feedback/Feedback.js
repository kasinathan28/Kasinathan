import React, { useState, useEffect } from "react";
import axios from "axios";
import "./feedback.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getFeedbacks");
        setFeedbacks(response.data);
        toast.success("Fetched Successfully", {
          autoClose: 3000,
        });
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        toast.error("Failed to fetch feedbacks", {
          autoClose: 3000,
        });
      }
    };

    fetchFeedbacks();
  }, []);

  
  const DeleteFeedback = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/deleteFeedBack/${id}`);
      setFeedbacks(prevFeedbacks => prevFeedbacks.filter(feedback => feedback._id !== id));
      console.log("Feedback deleted successfully");
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  return (
    <div className="feedback">
      <div>
        <h2>Feedbacks</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Timestamp</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((feedback) => (
            <tr key={feedback._id}>
              <td>{feedback.name}</td>
              <td>{feedback.email}</td>
              <td>{feedback.message}</td>
              <td>{new Date(feedback.createdAt).toLocaleString()}</td>
              <td>
                <button onClick={() => DeleteFeedback(feedback._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer position="bottom-left" />
    </div>
  );
}

export default Feedback;
