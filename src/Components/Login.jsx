import React, { useState, useEffect } from "react";
import FormInput from "./Ui/FormInput";
import { useDispatch } from "react-redux";
import { LoginAction } from "../store/loginAction.js";
import { useNavigate } from "react-router-dom";
import SignUp from "../Components/Ui/SignUp.jsx";
import {encrypt} from '../utils/EncryptionAndDecreption.js'
export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: false, password: false });
  const [message, setMessage] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
      }, 2000);

      return () => clearTimeout(timer); 
    }
  }, [showError]);

  const Loginhandle = () => {
    if (username && password) {
      dispatch(LoginAction(username, password))
        .then((response) => {
          if (!response) {
            setError("Email or Password is not correct.");
            setShowError(true);
            return;
          } else {
            setError("Login successful.");
            setShowError(true);
           localStorage.setItem("token", encrypt(response.token))
           localStorage.setItem("UserRole", encrypt(response.role));
           localStorage.setItem("userInfo", encrypt(JSON.stringify(response.user)))
           
            navigate("/Profile");
          }
        })
        .catch((error) => {
          setError("Email or Password is not correct: " + error.message);
          setShowError(true);
        });
    } else {
      setError("Username or password is missing.");
      setShowError(true);
    }
  };

  const handleSignUpClick = () => {
    setIsFlipped(true);
  };

  const handleLoginClick = () => {
    setIsFlipped(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      username: !username,
      password: !password,
    };

    if (newErrors.username || newErrors.password) {
      setError("Please fill out all fields.");
      setErrors(newErrors);
      setShowError(true);
      return;
    }

    Loginhandle();
  };

  const handleSignUpSuccess = (message) => {
    setError(message);
    setIsFlipped(false);
  };

  return (
    <div className="mt-8 login-bg mt-4">
      <div className="row justify-content-center align-items-center">

      <div className="col-md-5 d-flex justify-content-center align-items-center" style={{height:"90vh"}}>
          <div className={`card mt-2 login-card ${isFlipped ? "flipped" : ""} `}>
            <div className={`card-body front ${isFlipped ? "flipped" : ""} `}>
              {!isFlipped && (
                <>
                  <h1 className="card-title m-3 mt-5 mb-5">Login</h1>
                  {showError && (
                    <div className="alert alert-danger" style={{ color: "red" }}>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <FormInput
                      className="form_inpot"
                      label="Email"
                      type="email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      error={errors.username}
                      placeholder="Enter username"
                    />
                
                    <FormInput
                      label="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={errors.password}
                      placeholder="Enter password"
                    />
                
                    <div
                      className="row justify-content-center mt-2 mb-5"
                      style={{ color: "red", fontSize: "20px" }}
                    >
                    </div>
                    <div className="row justify-content-center mt-5 mb-5">
                      <button
                        className="btn btn-danger w-50 mb-3"
                        type="button"
                        onClick={handleSignUpClick}
                      >
                        Sign Up
                      </button>
                      <button className="btn btn-primary w-50" type="submit">
                        Login
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
            <div className={`card-body back ${isFlipped ? "flipped" : ""}`}>
              {isFlipped && (
                <SignUp
                  onBackToLogin={handleLoginClick}
                  onSuccess={handleSignUpSuccess}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
