import React, { useState, useEffect, useRef } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  faUserPlus,
  faClock,
  faMapMarker,
  faRightToBracket,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { faAtlassian } from "@fortawesome/free-brands-svg-icons";
import "./index.css";
import {
  faWhatsapp,
  faFacebook,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { BarLoader } from "react-spinners";

// importing needed images
import car1 from "../../assets/car1.jpg";
import car2 from "../../assets/car2.jpg";
import car3 from "../../assets/car3.jpg";
import about1 from "../../assets/about1.png";
import about2 from "../../assets/about2.png";
import bmw from "../../assets/bmw.png";
import vect1 from "../../assets/vect1.png";
import vect2 from "../../assets/vect2.png";
import vect3 from "../../assets/vect3.png";
import vect4 from "../../assets/vect4.png";
import vect5 from "../../assets/vect5.png";
import mot from "../../assets/mot.png";
import diag from "../../assets/diag.png";
import wheel from "../../assets/wheel.png";
import tyre from "../../assets/tyre.png";
import remaping from "../../assets/remaping.png";
import repairing from "../../assets/repairing.png";
import diag2 from "../../assets/diag2.png";
import card1 from "../../assets/card1.png";
import card2 from "../../assets/card2.png";
import card3 from "../../assets/card3.png";
import card4 from "../../assets/card4.png";
import card5 from "../../assets/card5.png";
import card6 from "../../assets/card6.png";
import call from "../../assets/call.png";
import EmailVect from "../../assets/email.png";
import CardLoader from "../../assets/carloader.gif";
import Loader from "../loader/Loader";
const images = [car1, car2, car3];

function Index() {
  const homeRef = useRef(null);
  const servicesRef = useRef(null);
  const contactsRef = useRef(null);
  const feedbackRef = useRef(null);
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [message, setmessage] = useState("");

  // for admin login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


// set loading time
  useEffect(() => {

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timeout); 
  }, []);


// Handle admin Login 
  const handleLogin = async (e) => {
    e.preventDefault();

    setAdminLoginLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/admin/login", {
        adminUsername: username,
        adminPassword: password,
      });
      toast.success("Login Success");

      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (response.status === 200) {
        const id = (response.data.admin._id);
        console.log(id);
        navigate(`/admin/${id}`);
      } else {
        toast.error("Login Failed.");

        console.error("Admin login failed");
      }
    } catch (error) {
      console.error("Error during admin login:", error);
    } finally {
      setAdminLoginLoading(false);
    }
  };

  const scrollToRef = (ref) => {
    const navbarHeight = document.querySelector(".navbar").offsetHeight;

    if (ref && ref.current) {
      const yOffset = ref.current.getBoundingClientRect().top - 100 - 50;

      window.scrollTo({
        top: yOffset,
        behavior: "smooth",
      });
    }
  };

  const [currentTime, setCurrentTime] = useState("");
  const [currentLocation, setCurrentLocation] = useState("Your Location");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const navigate = useNavigate();

  const signup = () => {
    navigate("/signup");
  };
  const login = () => {
    navigate("/login");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    const submitFeedback = async () => {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout exceeded")), 10000)
        );

        const feedbackPromise = axios.post(
          "http://localhost:5000/submit-feedback",
          {
            name,
            email,
            message,
          }
        );

        const response = await Promise.race([feedbackPromise, timeoutPromise]);

        if (response && response.status === 201) {
          toast.success(response.data.message);
        } else {
          toast.error("Failed to submit feedback. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting feedback:", error);
        toast.error("An error occurred while submitting feedback");
      } finally {
        setLoading(false);

        const minimumLoadingTime = 2000;

        await new Promise((resolve) => setTimeout(resolve, minimumLoadingTime));
      }
    };

    submitFeedback();
  };

  const updateTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const timeString = `${hours}:${minutes} ${ampm}`;
    setCurrentTime(timeString);
  };

  const updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const apiKey = "73d78780b3e3498ca6d63be39e4d119e";

          fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
          )
            .then((response) => response.json())
            .then((data) => {
              const area =
                data.results[0]?.components.city ||
                data.results[0]?.components.town ||
                data.results[0]?.components.suburb ||
                "Unknown Location";
              setCurrentLocation(area);
            })
            .catch((error) => {
              console.error("Error fetching location:", error);
            });
        },
        (error) => {
          console.error("Error getting location:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const updateImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const renderSlideIndicators = () => {
    return images.map((_, index) => (
      <div
        key={index}
        className={`slide-indicator ${
          index === currentImageIndex ? "active" : ""
        }`}
        onClick={() => setCurrentImageIndex(index)}
      />
    ));
  };

  useEffect(() => {
    updateTime();
    updateLocation();
    const interval = setInterval(updateTime, 1000);
    const imageInterval = setInterval(updateImage, 3000);
    return () => {
      clearInterval(interval);
      clearInterval(imageInterval);
    };
  }, []);

  if (loading) {
    return <Loader loading={loading} />;
  }

  
  return (
    <div className="indexpage">
      {loading && <div className="loading-spinner">Loading...</div>}

      <div className="navbar">
        <div>
          <div className="logo">
            PEAK
            <FontAwesomeIcon icon={faAtlassian} style={{ color: "#dfc8ea" }} />
            LPHA
            <img className="logoImg" src={CardLoader}/>
          </div>
        </div>

        <div className="div1">
          <div className="div2">
            <button onClick={signup}>
              Become A Member
              <FontAwesomeIcon icon={faUserPlus} />
            </button>
          </div>
          <div className="div3">
            <button onClick={login}>
              LOGIN
              <FontAwesomeIcon icon={faRightToBracket} />
            </button>
          </div>
          <div className="div4">
            <span className="timestamp">
              <FontAwesomeIcon icon={faClock} /> {currentTime}
            </span>
          </div>
          <div className="div5">
            <span className="location">
              <FontAwesomeIcon icon={faMapMarker} /> {currentLocation}
            </span>
          </div>
        </div>

        <div className="div6">
          <button className="navButton" onClick={() => scrollToRef(homeRef)}>
            HOME
          </button>
          <button
            className="navButton"
            onClick={() => scrollToRef(servicesRef)}
          >
            SERVICES
          </button>{" "}
          <button
            className="navButton"
            onClick={() => scrollToRef(contactsRef)}
          >
            CONTACTS
          </button>{" "}
          <button
            className="navButton"
            onClick={() => scrollToRef(feedbackRef)}
          >
            FEEDBACK
          </button>{" "}
        </div>
      </div>

      <div ref={homeRef} className="banner">
        <div className="slide-indicators-container">
          {renderSlideIndicators()}
        </div>
        <img
          src={images[currentImageIndex]}
          alt={`Image ${currentImageIndex + 1}`}
        />
      </div>

      <div className="about">
        <h2>Wake the Automotive in you..</h2>
        <div className="main">
          <div className="div1">
            <p>
              Discover the perfect vehicle and all the body parts you need in
              one convenient place! At "<strong>
                Peak
              <FontAwesomeIcon icon={faAtlassian} className="logo" />
              lpha </strong>", we understand that finding the right vehicle and sourcing
              quality body parts can be a challenge. That's why we've created a
              user-friendly platform that simplifies the process.
            </p>
          </div>

          <div className="div2">
            <img src={about1} alt="about1" className="about-image" />
          </div>
        </div>
        <div className="main2">
          <div className="div3">
            <img src={about2} alt="about2" className="about-image" />
          </div>
          <div className="div4">
            <p>
              Explore a diverse range of vehicles to suit your preferences and
              needs. Our comprehensive inventory includes a wide selection of
              makes and models, ensuring you find the perfect ride.
            </p>
          </div>
        </div>
      </div>

      <div ref={servicesRef} className="bmwmain">
        <div className="bmwvect">
          <div className="bmw">
            <img src={bmw} alt="bmw" />
          </div>
          <div className="vectors">
            <div className="card">
              <img src={vect1} alt="vect1" />
              <p>Testing Station</p>
              <h3>MOT</h3>
            </div>
            <div className="card">
              <img src={vect2} alt="vect2" />
              <p>Cars & Vans Repair</p>
              <h3>REPAIR</h3>
            </div>
            <div className="card">
              <img src={vect3} alt="vect3" />
              <p>Automobiles</p>
              <h3>REPAIR</h3>
            </div>
            <div className="card">
              <img src={vect4} alt="vect4" />
              <p>ECU</p>
              <h3>REMAPING</h3>
            </div>
            <div className="card">
              <img src={vect5} alt="vect5" />
              <p>Supplied & Fitted</p>
              <h3>TYRES</h3>
            </div>
          </div>
        </div>
      </div>

      {/* service */}
      <div className="services">
        <div className="div1">
          <h2>What we do</h2>
        </div>
        <div className="div2">
          <p>Our services</p>
        </div>
      </div>

      <div className="card-container">
        <div className="cards">
          <div className="card">
            <div className="content">
              <img src={mot} alt="mot" />
              <div className="content1">
                <img src={card1} alt="card1" />
                <h2>MOT TESTING</h2>
                <p>
                  If you need an MOT, get in touch with our team. We take care
                  of everything and ensure that your vehicle is running
                  perfectly.
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="content">
              <img src={repairing} alt="mot" />
              <div className="content1">
                <img src={card4} alt="card1" />
                <h2>REPAIRS</h2>
                <p>
                  We can offer an almost limitless range of quality car and
                  vehicle repairs. All at a fair and competitive price.
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="content">
              <img src={tyre} alt="mot" />
              <div className="content1">
                <img src={card3} alt="card1" />
                <h2>TYRES</h2>
                <p>
                  We are your local, independent tyre dealer, and we specialize
                  in car tyres, van tyres, 4x4 tyres & high-performance tyres.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="cards">
          <div className="card">
            <div className="content">
              <img src={remaping} alt="mot" />
              <div className="content1">
                <img src={card2} alt="card1" />
                <h2>REMAPING</h2>
                <p>
                  We provide a professional ECU remapping service to meet your
                  needs. For all makes & models, Petrol or Diesel.
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="content">
              <img src={wheel} alt="mot" />
              <div className="content1">
                <img src={card6} alt="card1" />
                <h2>WHEEL ALIGNMENT</h2>
                <p>
                  We specialize in reducing your tyre wear, giving you better
                  fuel mileage, improved handling from drifting tyres and a
                  safer driving experience.
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="content">
              <img src={diag} alt="mot" />
              <div className="content1">
                <img src={card5} alt="card1" />
                <h2>DIAGNOSTICS</h2>
                <p>
                  Our technicians are equipped with state-of-the-art diagnostic
                  equipment to ensure that your vehicle is diagnosed right the
                  first time, every time.
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="content">
              <img src={diag2} alt="mot" />
              <div className="content1">
                <img src={card2} alt="card1" />
                <h2>POWERS</h2>
                <p>
                  A turbocharger gives an engine extra power without sacrificing
                  fuel efficiency. It is typically added to smaller engines to
                  improve performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref={contactsRef} className="contacts">
        <h1>CONTACT US</h1>
        <div className="main">
          <div className="circle">
            <div className="sub1">
              <div className="subcircle">
                <img src={call} alt="call" />
              </div>
              <ul>
                <li>+91 6235837610</li>
                <li>+91 9037213522</li>
                <li>+91 9048375677</li>
              </ul>
            </div>

            <div className="sub1">
              <div className="subcircle">
                <img src={EmailVect} alt="email" />
              </div>
              <ul>
                <li>peakalpha2024@gmail.com</li>
                <li>way2kasinathb35@gmail.com</li>
                <li>Demo@gmail.com</li>
              </ul>
            </div>
          </div>
          <div className="card">
            <p>
              24/7 customer support in an online car garage ensures that vehicle
              owners have constant and reliable assistance at any time of the
              day or night. This service goes beyond traditional business hours,
              offering a seamless and accessible experience for customers.
              Here's a detailed description of what 24/7 customer support in an
              online car garage might entail:
            </p>
          </div>
        </div>
      </div>
      <footer ref={feedbackRef} className="footer">
        <div className="div1">
          <div>
            <h1>
              PEAK
              <FontAwesomeIcon icon={faAtlassian} />
              LPHA
            </h1>
            <p>
              This website is developed for the display to the final year
              student Kasinathan.B in Carmel Polytechnic College.
            </p>
            <h2>
              <u>Socials</u>
            </h2>
            <div className="social-icons">
              <a
                href="https://wa.me/+916235837610"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faWhatsapp} />
                <span>WhatsApp</span>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100069141276681"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faFacebook} />
                <span>Facebook</span>
              </a>
            </div>
            <div className="social-icons">
              <a
                href="https://www.instagram.com/kasi_na_than__"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faInstagram} />
                <span>Instagram</span>
              </a>
              <a
                href="https://twitter.com/@KasinathanB1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faTwitter} />
                <span>Twitter</span>
              </a>
            </div>
          </div>
        </div>
        <div className="div2">
          <div className="admin-login-container">
            <p>Get Admin privileges</p>

            <div className="profile-picture">
              <FontAwesomeIcon icon={faUserTie} />
            </div>

            <form onSubmit={handleLogin}>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit" disabled={adminLoginLoading}>
                {adminLoginLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
        <div className="div3">
          <h2>Feedback Form</h2>
          <form className="feedback-form" onSubmit={handleSubmit}>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setname(e.target.value)}
              placeholder="Enter your name"
              required
            />

            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              placeholder="Enter your email"
              required
            />

            <textarea
              id="message"
              name="message"
              value={message}
              onChange={(e) => setmessage(e.target.value)}
              placeholder="Enter your message"
              rows="4"
              required
            ></textarea>

            <button type="submit">
              {loading ? (
                <BarLoader color="#ffffff" loading={loading} height={4} />
              ) : (
                "Submit Feedback"
              )}
            </button>
          </form>
        </div>
      </footer>
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

export default Index;
