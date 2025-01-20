import React, { useEffect, useState } from "react";
import styles from "../Signup/Signup.module.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (localStorage.getItem("loggedInUser")) {
      navigate("/todo");
    }
  });

  const loginUser = () => {
    let userDatas = JSON.parse(localStorage.getItem("userDatas"));
    if (!userDatas) {
      userDatas = [];
    }
    // if (userDatas.some((obj) => obj.email == userData.email)) {
    //   if (userDatas.some((obj) => obj.password == userData.password)) {
    //     setErrorMessage("Password is Incorrect");
    //   }

    //   const user = userDatas.filter((obj) => obj.email == userData.email)[0];
    //   localStorage.setItem("loggedInUser", JSON.stringify(user));
    //   navigate("/todo");
    // } else {
    //   setErrorMessage("Email does not exist");
    // }

    const user = userDatas.find((obj) => obj.email === userData.email);

    if (!user) {
      setErrorMessage("Email does not exist");
    } else if (user.password !== userData.password) {
      setErrorMessage("Password is Incorrect");
    } else {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      navigate("/todo");
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.formContainer}>
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

        <button onClick={loginUser} className={styles.submitButton}>
          Login
        </button>
      </div>
      <Link className={styles.link} to="/signup">
        <p>Don't have an account? Signup Now!</p>
      </Link>
      <div className={styles.error}>{errorMessage}</div>
    </div>
  );
};

export default Login;
