import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAtlassian } from "@fortawesome/free-brands-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { BarLoader } from "react-spinners";
import girl from "../../../assets/girl.png";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    navigate("/");
  };

  const signup = () => {
    navigate("/signup");
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
  
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
  
      // Check the response and handle accordingly
      if (response.status === 200) {
        const { token, message, user } = response.data;
        const profileId = user._id;
  
        setTimeout(() => {
          toast.success(message);
          navigate(`/dashboard/${profileId}`);
        }, 2000);
      } else {
        // Introduce a minimum timeout of 2 seconds for the error toast
        setTimeout(() => {
          toast.error("Login failed. Please check your credentials.");
        }, 2000);
      }
    } catch (error) {
      console.error("Error during login:", error);
  
      // Introduce a minimum timeout of 2 seconds for the error toast
      setTimeout(() => {
        toast.error("An error occurred during login");
      }, 2000);
    } finally {
      // Introduce a minimum loading timeout of 2 seconds
      setTimeout(() => {
        setLoading(false); // Stop loading
      }, 2000);
    }
  };
  
  

  return (
    <div className="loginpage">
      <div className="navbar">
        <button className="back" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div className="logo">
          PEAK
          <FontAwesomeIcon icon={faAtlassian} />
          LPHA
        </div>
        <div className="signup-btn">
          <button className="signup" onClick={signup}>
            Sign Up
          </button>
        </div>
      </div>

      <div className="banner">
        <div className="loginform">
          <h2>Welcome back Amigoo</h2>
          <form>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>

            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <button type="button" onClick={handleLogin}>
              {loading ? (
                <BarLoader color="#ffffff" loading={loading} height={4} />
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p>
            Don't have an account? <button onClick={signup}>Sign Up</button>
          </p>
        </div>
        <img src={girl} alt="Girl image" />
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default Login;
