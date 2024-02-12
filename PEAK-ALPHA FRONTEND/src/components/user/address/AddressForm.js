import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "./addressform.css";
import { useParams } from "react-router-dom";

function AddressForm() {
  const demoProfileId = useParams();
  const profileId = demoProfileId.profileId;
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [houseName, setHouseName] = useState("");
  const [landmark, setLandmark] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState("");

  // Fetch user's address when the component mounts
  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const username = localStorage.getItem("username");
        const response = await axios.get(`http://localhost:5000/getUserAddress/${profileId}`);

        if (response.status === 200) {
          const { address } = response.data;
          setCity(address.city);
          setPincode(address.pincode);
          setHouseName(address.houseName);
          setLandmark(address.landmark);
        } else {
          toast.error("Failed, Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching user's address:", error);
        toast.error("Failed to fetch user's address. Please try again later.");
      }
    };

    fetchUserAddress();
  }, []); 

  
  // function to submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const username = localStorage.getItem("username");

      const response = await axios.put(`http://localhost:5000/updateAddress/${username}`, {
        pincode,
        city,
        houseName,
        landmark,
      });
      
      if (response.status === 200) {
        const { message, address } = response.data;

        toast.success(message);

        console.log("Updated Address:", address);
      } else {
        toast.error("Failed to update address. Please try again later.");
      }
    } catch (error) {
      toast.error("Failed to update address. Please try again later.");
    }
  };

  // Function to fetch city from pincode
  const fetchCityFromPincode = async (enteredPincode) => {
    // Ensure that the pincode is a valid 6-digit number
    const isSixDigitPincode = /^\d{6}$/.test(enteredPincode);
    if (!isSixDigitPincode) {
      console.warn("Invalid pincode format. Please enter a 6-digit pincode.");
      return;
    }

    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${enteredPincode}`
      );
      const data = await response.json();

      // Check if the response is valid and contains city information
      if (
        Array.isArray(data) &&
        data.length > 0 &&
        data[0].Status === "Success"
      ) {
        const cityFromPincode = data[0].PostOffice[0].Name;
        setCity(cityFromPincode);
      } else {
        // Handle the case where the pincode lookup is unsuccessful
        console.error("Failed to fetch city from pincode");
        toast.error("Failed to fetch city from pincode. Please try again.");
      }
    } catch (error) {
      // Handle any errors that occurred during the fetch
      console.error("Error fetching city from pincode:", error);
      toast.error("Error fetching city from pincode. Please try again.");
    }
  };

  // Use useEffect to trigger the pincode lookup when pincode changes
  useEffect(() => {
    // Check if the pincode is a 6-digit number before triggering the lookup
    if (pincode.length === 6 && !useCurrentLocation) {
      fetchCityFromPincode(pincode);
    }
  }, [pincode, useCurrentLocation]);

  const updateLocation = () => {
    return new Promise((resolve, reject) => {
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

                const pincode =
                  data.results[0]?.components.postcode || "Unknown Pincode";

                const locationDetails = {
                  area,
                  pincode,
                };
                console.log(locationDetails);

                resolve(locationDetails);
              })
              .catch((error) => {
                console.error("Error fetching location:", error);
                reject(error);
              });
          },
          (error) => {
            console.error("Error getting location:", error.message);
            reject(error.message);
          }
        );
      } else {
        const errorMessage = "Geolocation is not supported by this browser.";
        console.error(errorMessage);
        reject(errorMessage);
      }
    });
  };

  const handleCheckboxChange = async (e) => {
    setUseCurrentLocation(e.target.checked);
  
    if (e.target.checked) {
      try {
        const locationDetails1 = await updateLocation();
        setCurrentLocation(locationDetails1);
        
        const tempPincode = locationDetails1.pincode;
  
        // Wait for the updateLocation function to complete before setting the state
        setPincode(tempPincode);
  
        // Log the updated values
        console.log(tempPincode);
      } catch (error) {
        console.error("Error fetching current location:", error);
        // Handle error, show a toast, etc.
      }
    } else {
      // Clear current location when checkbox is unchecked
      setCurrentLocation({ latitude: null, longitude: null, area: null });
  
      // Reset city and pincode to empty strings or initial values
      setCity(""); // Clear city field
      setPincode(""); // Clear pincode field
    }
  };
  
  return (
    <div>
      <form className="address-form" onSubmit={handleSubmit}>
        <h2>Edit Address</h2>

        <div className="form-row">
          <div className="form-column">
            <label>Pincode:</label>
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              maxLength={6} // Restrict the input to 6 characters
            />
          </div>

          <div className="form-column">
            <label>City:</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-column">
            <label>House Name:</label>
            <input
              type="text"
              value={houseName}
              onChange={(e) => setHouseName(e.target.value)}
            />
          </div>

          <div className="form-column">
            <label>Landmark:</label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-column1">
            <label>Use Current Location:</label>
            <input
              type="checkbox"
              checked={useCurrentLocation}
              onChange={handleCheckboxChange}
            />
          </div>
        </div>

        <button type="submit">Save Changes</button>
      </form>

      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default AddressForm;
