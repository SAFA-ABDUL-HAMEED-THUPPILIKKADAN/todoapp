import React, { useState } from "react";
import styles from "./Signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [userExists, setUserExists] = useState("");

  const storeData = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/signup",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Show success message
      toast.success("Signup successful! Redirecting to login...", {
        position: "top-right",
        autoClose: 3000,
      });

      console.log("Signup Successful:", response.data);

      // Redirect to login page after successful signup
      setTimeout(() => {
        navigate("/login"); // Make sure this URL matches the actual login route
      }, 3000); // Adjust the time if necessary
    } catch (error) {
      console.error("Signup Failed:", error.response?.data || error.message);

      // Handle error (show message)
      if (error.response && error.response.data) {
        setUserExists(
          error.response.data.detail || "Signup failed. Try again."
        );
        toast.error(error.response.data.detail || "Signup failed!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        setUserExists("Something went wrong. Please try again later.");
        toast.error("Something went wrong!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.formContainer}>
        <input
          type="text"
          value={userData.name}
          onChange={(e) => {
            setUserData({ ...userData, name: e.target.value });
          }}
          required
          placeholder="Enter Your Full Name"
          className={styles.userFullNameInput}
        />

        <input
          type="email"
          value={userData.email}
          onChange={(e) => {
            setUserData({ ...userData, email: e.target.value });
          }}
          required
          placeholder="Enter Your Email Address"
          className={styles.userEmailInput}
        />

        <input
          type="password"
          value={userData.password}
          onChange={(e) => {
            setUserData({ ...userData, password: e.target.value });
          }}
          required
          placeholder="Enter Your Account Password"
          className={styles.userPasswordInput}
        />

        <button onClick={storeData} className={styles.submitButton}>
          Signup
        </button>
      </div>
      <Link className={styles.link} to="/login">
        <p>Already have an account? Login Now!</p>
      </Link>
      <div className={styles.error}>{userExists}</div>

      <ToastContainer />
    </div>
  );
};

export default Signup;
