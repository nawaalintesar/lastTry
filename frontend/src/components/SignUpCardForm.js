import { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { TextField, InputAdornment, Icon, IconButton } from "@mui/material";
import styles from "./SignUpCardForm.module.css";
import { useSignup } from "../hooks/useSignup"
import { useCallback } from "react";
const SignUpCardForm = () => {

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:"334238565950-sjl4l8psvm5aed9nvd1ael1guhpfnkjl.apps.googleusercontent.com",
      callback: handleCallbackResponse
    })
  
    google.accounts.id.renderButton(
      document.getElementById("Google"),
      {theme: "outline", size: "large", width: "355px"}
    );
  }, []);
  

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { signup, error, isLoading } = useSignup();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call the signup function with all form fields
    console.log("Submitted!: ", firstName, lastName, email, password, confirmPassword)
    await signup(firstName, lastName, email, password, confirmPassword);
    navigate("/Login");

  }

  const handleLoginClick = useCallback(() => {
    navigate("/Login");
  }, [navigate]);

  async function handleCallbackResponse(response){
    console.log("Encoded jwt id:"  + response.credential);
    var userObject= jwtDecode(response.credential);
    console.log(userObject);
    if(userObject.email_verified){
      await signup(userObject.given_name, userObject.family_name, userObject.email, true, true);
      navigate("/Dashboard");
    
    } 
    
    }
    

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className={styles.signupform}>
      <div className={styles.frame}>
        <b className={styles.signUp}>{`Sign up `}</b>
      </div>
      <form onSubmit={handleSubmit} >

        <TextField
          className={styles.frame2}
          color="secondary"
          label="Last Name "
          placeholder="Last Name"
          required={true}
          sx={{ width: 199 }}
          variant="filled"
          type="text"
          onChange={(e) => setLastName(e.target.value)}

        />
        <TextField
          className={styles.frame3}
          color="secondary"
          label="First Name "
          placeholder="First Name"
          required={true}
          sx={{ width: 199 }}
          variant="filled"
          onChange={(e) => setFirstName(e.target.value)}

        />
        <TextField
          className={styles.email}
          color="secondary"
          name="Email address"
          label=" Email address "
          placeholder="Email address"
          required={true}
          sx={{ width: 415 }}
          variant="filled"
          onChange={(e) => setEmail(e.target.value)}

        />
        <TextField
          className={styles.password}
          color="secondary"
          name="Password "
          label="Password "
          placeholder="Password "
          required={true}
          variant="filled"
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleShowPasswordClick}
                  aria-label="toggle password visibility"
                >
                  <Icon>{showPassword ? "visibility_off" : "visibility"}</Icon>
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={(e) => setPassword(e.target.value)}

        />
        <TextField
        className={styles.confirmPassword}
        color="secondary"
        name="confirmPassword "
        label="Confirm Password "
        placeholder="Confirm Password "
        required={true}
        variant="filled"
        type={showPassword ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleShowPasswordClick}
                aria-label="toggle password visibility"
              >
                <Icon>{showPassword ? "visibility_off" : "visibility"}</Icon>
              </IconButton>
            </InputAdornment>
          ),
        }}
        onChange={(e) => setConfirmPassword(e.target.value)}

      />
        {error && <div className="error">{error}</div>}

        <div id="Google" className={styles.Google}></div>

        <div className={styles.joinVoop}>
            {`Already have an account? `}
            <span className={styles.loginLink} onClick={handleLoginClick}>Login now</span>
          </div>


        <button type="submit" className={styles.button}>Register</button>
      </form>
    </div >
  );
};

export default SignUpCardForm;
