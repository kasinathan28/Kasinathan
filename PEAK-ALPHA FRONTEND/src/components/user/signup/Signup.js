import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./signup.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAtlassian } from "@fortawesome/free-brands-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpGenerated, setIsOtpGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = async () => {
    try {
      setIsLoading(true);
  
      if (!isOtpGenerated) {
        // Generate and send OTP
        const generatedOtp = generateOtp();
        console.log("Generated OTP:", generatedOtp);
  
        // Send the generated OTP to the server
        const otpResponse = await axios.post(
          "http://localhost:5000/generateAndSendOtp",
          {
            phoneNumber,
            otp: generatedOtp,
          }
        );
  
        console.log("OTP Response:", otpResponse.data);
        setIsOtpGenerated(true);
        toast.success("OTP generated. Please check your email or phone.");
      } else {
        if (!otp) {
          toast.error("Please enter the OTP");
          return;
        }
  
        const signupResponse = await axios.post(
          "http://localhost:5000/signup",
          {
            username,
            password,
            // location,
            phoneNumber,
            email,
            otp,
          }
        );
  
        console.log("Signup Response:", signupResponse.data);
  
        // Check if the signup was successful
        if (signupResponse.status === 201) {
          // Additional logic after a successful signup
  
          // For example, redirect the user to the login page after a successful signup
          toast.success("Signup successful. Redirecting to login page...");
  
          // Set a timeout to navigate to the login page after 3000 milliseconds (3 seconds)
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          // Handle other response statuses or error messages from the server
          toast.error(`Signup failed: ${signupResponse.data.error}`);
        }
      }
    } catch (error) {
      console.error("Error during signup:", error);
  
      // Check for specific error conditions and provide user-friendly messages
      if (error.response) {
        // The request was made, but the server responded with an error status
        toast.error(`Server error: ${error.response.data.error}`);
      } else if (error.request) {
        // The request was made, but no response was received
        toast.error("No response from the server");
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error("An error occurred during signup");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateOtp = () => {
    // Generate a 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  return (
    <div className="signuppage">
      <div className="navbar">
        <button className="back" onClick={handleLogin}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div className="logo">
          PEAK
          <FontAwesomeIcon icon={faAtlassian} />
          LPHA
        </div>
      </div>

      <div className="banner">
        <div className="signupform">
          <h2>Create an Account</h2>
          <form>
            {!isOtpGenerated ? (
              <div className="form-row">
                <div className="form-column">
                  <label>
                    Username:
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </label>
                </div>

                <div className="form-column">
                  <label>
                    Password:
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>
                </div>
              </div>
            ) : null}

            {!isOtpGenerated ? (
              <div className="form-row">
                <div className="form-column">
                  <label>
                    Confirm Password:
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </label>
                </div>
                <div className="form-column">
                  <label>
                    Phone Number:
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </label>
                </div>

                {/* <div className="form-column">
                  <label>
                    Location:
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </label>
                </div> */}
              </div>
            ) : null}

            {!isOtpGenerated ? (
              <div className="form-row">
                

                <div className="form-column">
                  <label>
                    Email:
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                </div>
              </div>
            ) : null}

            {isOtpGenerated ? (
              <div className="form-row">
                <div className="form-column">
                  <label>
                    OTP:
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </label>
                </div>
              </div>
            ) : null}

            <button type="button" onClick={handleSignup} disabled={isLoading}>
              {isLoading
                ? "Loading..."
                : isOtpGenerated
                ? "Verify OTP"
                : "Generate OTP"}
            </button>
          </form>

          <p>
            {isOtpGenerated
              ? "Didn't receive OTP? Click here to resend."
              : "Already have an account? "}
            <button onClick={handleLogin} disabled={isLoading}>
              Login
            </button>
          </p>
        </div>
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

export default Signup;
