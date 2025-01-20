import React, { useState } from "react";
import styles from "./Signup.module.css";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [userExists, setUserExists] = useState("");
  const [showToast, setShowToast] = useState(false);

  const storeData = () => {
    let userDatas = JSON.parse(localStorage.getItem("userDatas"));
    if (!userDatas) {
      userDatas = [];
    }
    if (userDatas.some((obj) => obj.email == userData.email)) {
      setUserExists("User Already Exists");
      return;
    }

    userDatas.push(userData);
    localStorage.setItem("userDatas", JSON.stringify(userDatas));

    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
      navigate("/login"); // Navigate to login page
    }, 3000);
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

      {/* Toast message */}
      {showToast && (
        <div className={styles.error}>
          <p>User Created Successfully!</p>
        </div>
      )}
    </div>
  );
};

export default Signup;
