import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import FormInput from "../Ui/FormInput.jsx";
import { SignUpAction } from "../../store/loginAction.js";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

const SignUp = ({ onBackToLogin, onSuccess }) => {
  const REACT_APP_GOOGLECAPTCHER_KEY = process.env.REACT_APP_GOOGLECAPTCHER_KEY;
  const [email, setEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [recaptchaValue, setRecaptchaValue] = useState("");
  const [shoMessage, setshoMessage] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) => password.length >= 6;
  const validateConfirmPassword = (password, confirmPassword) =>
    password === confirmPassword;

  const genderMap = {
    male: 1,
    female: 2,
  };

  const SignUphandle = () => {
    const genderId = genderMap[gender] || 0;

    if (
      validateEmail(email) &&
      validatePassword(signupPassword) &&
      validateConfirmPassword(signupPassword, confirmPassword)
    ) {
      SignUpAction(
        firstName,
        lastName,
        email,
        genderId,
        email,
        signupPassword,
        2
      )
        .then((response) => {
          if (response.id === -1) {
            setError("Username already exists.");
            return;
          } else {
            onSuccess("Sign-up successful.");
          
          }
        })
        .catch((error) => {
          setError("Sign-up failed: " + error.message);
        });
    } else {
      setError("Please correct the errors in the form.");
    }
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!validateEmail(email)) validationErrors.email = true;
    if (!signupPassword) validationErrors.password = true;
    if (!validateConfirmPassword(signupPassword, confirmPassword)){
      validationErrors.confirmPassword = true;
    }
     
    if (!firstName) validationErrors.firstName = true;
    if (!lastName) validationErrors.lastName = true;
    if (!gender) validationErrors.gender = true;
    if (!recaptchaValue) validationErrors.recaptcha = true;

    // Check password strength
    if (!Object.values(passwordValidation).every((isValid) => isValid)) {
      validationErrors.passwordStrength = true;
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setError("Please fill out all fields and meet password requirements.");
    } else {
      setErrors({});
      setError("");
      SignUphandle();
    }
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };

  // Password Validation Functions
  const checkPassword = (password) => {
    return {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
    };
  };

  const passwordValidation = checkPassword(signupPassword);

  return (
    <div className="card-body " >
      <h1 className="card-title mb-2">Sign Up</h1>
      { error && (
        <div className="alert alert-danger" style={{ color: "red" }}>
          {error}
        </div>
      )}
   <form onSubmit={handleSignUpSubmit}>
 
    <div className="row">
      <div className="col-md-6">
        <FormInput
          label="First Name"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className={errors.firstName ? "is-invalid" : ""}
          placeholder="Enter first name"
        />
      </div>
      <div className="col-md-6">
        <FormInput
          label="Last Name"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className={errors.lastName ? "is-invalid" : ""}
          placeholder="Enter last name"
        />
      </div>
      <div className="col-md-6 mt-3">
        <FormControl
          fullWidth
          variant="outlined"
          error={!!errors.gender}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "white !important",
              "& fieldset": {
                borderColor: "white !important",
              },
              "&:hover fieldset": {
                borderColor: "white !important",
              },
              "&.Mui-focused fieldset": {
                borderColor: "white !important",
              },
            },
            "& .MuiInputLabel-root": {
              color: "white !important",
            },
            "& .MuiFormHelperText-root": {
              color: "white !important",
            },
          }}
        >
          <InputLabel id="gender-label">Gender</InputLabel>
          <Select
            labelId="gender-label"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            label="Gender"
          >
            <MenuItem value="">
              <em>Select gender</em>
            </MenuItem>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </Select>
          {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
        </FormControl>
      </div>
      <div className="col-md-6">
        <FormInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={errors.email ? "is-invalid" : ""}
          placeholder="Enter email"
        />
      </div>
      <div className="col-md-6">
        <FormInput
          label="Password"
          type="password"
          value={signupPassword}
          onChange={(e) => setSignupPassword(e.target.value)}
          className={errors.password ? "is-invalid" : ""}
          placeholder="Enter password"
        />
      </div>
      <div className="col-md-6">
        <FormInput
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={errors.confirmPassword ? "is-invalid" : ""}
          placeholder="Confirm password"
        />
      </div>
    </div>

    <div className="row">
  <div className="col-md-6">
    <ul style={{ listStyleType: "none", padding: 0 }}>
      <li style={{ color: passwordValidation.length ? "green" : "red" }}>
        {passwordValidation.length ? "✔" : "✘"} Must contain at least 8 characters
      </li>
      <li style={{ color: passwordValidation.lowercase ? "green" : "red" }}>
        {passwordValidation.lowercase ? "✔" : "✘"} Must contain a lowercase letter
      </li>
      <li style={{ color: passwordValidation.uppercase ? "green" : "red" }}>
        {passwordValidation.uppercase ? "✔" : "✘"} Must contain an uppercase letter
      </li>
    </ul>
  </div>
  <div className="col-md-6">
    <ul style={{ listStyleType: "none", padding: 0 }}>
   
      <li style={{ color: passwordValidation.number ? "green" : "red" }}>
        {passwordValidation.number ? "✔" : "✘"} Must contain a number
      </li>
      <li style={{ color: passwordValidation.specialChar ? "green" : "red" }}>
        {passwordValidation.specialChar ? "✔" : "✘"} Must contain a special character
      </li>
    </ul>
  </div>
</div>


    <div className="row">
      <div className="col-md-12">
        <ReCAPTCHA 
          sitekey={REACT_APP_GOOGLECAPTCHER_KEY}
          onChange={handleRecaptchaChange}
        />
      </div>
    </div>

    <div className="row justify-content-center mt-4">
      <div className="col-6 d-flex justify-content-end">
        <button
          className="btn btn-danger w-100"
          type="button"
          onClick={onBackToLogin}
        >
          Back to Login
        </button>
      </div>
      <div className="col-6 d-flex justify-content-start">
        <button className="btn btn-primary w-100" type="submit">
          Sign Up
        </button>
      </div>
    </div>

</form>

    </div>
  );
};

export default SignUp;
