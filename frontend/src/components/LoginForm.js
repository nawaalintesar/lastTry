import { useState, useCallback, useEffect} from "react";
import {jwtDecode} from "jwt-decode";
import { TextField, InputAdornment, Icon, IconButton } from "@mui/material";
import ForgotPassPop from "./ForgotPassPop";
import PortalPopup from "./PortalPopup";
import { useNavigate } from "react-router-dom";
// import ButtonRegister from "./ButtonRegister";
import styles from "./LoginForm.module.css";
import { useLogin } from "../hooks/useLogin";



const LoginForm = () => {

  
useEffect(() => {
  
  /* global google */
  google.accounts.id.initialize({
    client_id:"334238565950-sjl4l8psvm5aed9nvd1ael1guhpfnkjl.apps.googleusercontent.com",
    callback: handleCallbackResponse

  })

  google.accounts.id.renderButton(
    document.getElementById("signInDiv"),
    {theme: "outline", size: "large", width: "355px"}
  );
}, []);

  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassPopPopupOpen, setForgotPassPopPopupOpen] = useState(false);
  const navigate = useNavigate();

  const handleShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };

  // const onLogInButtonClick = useCallback(() => {
  //   // Please sync "Dashboard-L" to the project
  //   navigate("/Dashboard");
  // }, [navigate]);

  const onNewToVoopContainerClick = useCallback(() => {
    navigate("/signIn");
  }, [navigate]);

  const onNewToVoopClick = useCallback(() => {
    navigate("/signIn");
  }, [navigate]);

  const handleLoginClick = useCallback(() => {
    navigate("/Signin");
  }, [navigate]);

  const openForgotPassPopPopup = useCallback(() => {
    setForgotPassPopPopupOpen(true);
  }, []);

  const closeForgotPassPopPopup = useCallback(() => {
    setForgotPassPopPopupOpen(false);
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useLogin();

  async function handleCallbackResponse(response){
    console.log("Encoded jwt id:"  + response.credential);
    var userObject= jwtDecode(response.credential);
    console.log(userObject);
    if(userObject.email_verified){
    
      await login(userObject.email, true);
      navigate("/Dashboard");
    
    }
    
    
    
    }
    

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call the signup function with all form fields
    console.log("Submitted in login!: ", email, password)
    await login(email, password);
    navigate("/Dashboard");
  }


  return (
    <>
      <div className={styles.login}>
        {/* <div className={styles.loginChild} /> */}
        <div className={styles.login1}>
          <b className={styles.logIn}>{`Log in `}</b>
        </div>
        
        <form onSubmit={handleSubmit}>

          <TextField
            className={styles.username}
            color="secondary"
            name="email"
            label="Email"
            placeholder="Email"
            required={true}
            sx={{ width: 357 }}
            variant="filled"
            onChange={(e) => setEmail(e.target.value)}

          />
          <TextField
            className={styles.password}
            color="secondary"
            name="Password"
            label="Password"
            placeholder="Password"
            required={true}
            sx={{ width: 357 }}
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
          <div className={styles.remebermeforgetpass}>
            <div className={styles.frame}>
              <button
                className={styles.forgotPassword}
                onClick={openForgotPassPopPopup}
              >
                Forgot Password?
              </button>
              <div className={styles.rememberMe}> Remember me</div>
              <input
                className={styles.materialSymbolsLightsquare}
                type="checkbox"
              />
            </div>
          </div>
          <a className={styles.loginwithgoogle}>
            <div className={styles.frame1}>
              <div className={styles.wrapperRectangle45}>
                {/* <img
                  className={styles.wrapperRectangle45Child}
                  alt=""
                  src="/rectangle-45@2x.png"
                /> */}
              </div>
              <div id="signInDiv" ></div>
              {/* <img className={styles.googleIcon} alt="" src="/google@2x.png" /> */}
            </div>
          </a>

          <div> <button type="submit" className={styles.button}>Login</button></div>


          {error && <div className="error">{error}</div>}


         

          </form>

          <div className={styles.joinVoop}>

            {`New to Voop? `}
            <span  className={styles.joinNowtosignup} onClick={handleLoginClick}>Join now</span>

          </div>





        {/* <div className={styles.newtovoop}>

          <button
            className={styles.newToVoopContainer}
            onClick={onNewToVoopClick}
          >
            <span className={styles.newToVoopContainer1}>
              {`New to Voop? `}
              <span className={styles.joinNow}>Join now</span>
            </span>
          </button>

          </div>
 */}


      </div>
      {isForgotPassPopPopupOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.4)"
          placement="Centered"
          onOutsideClick={closeForgotPassPopPopup}
        >
          <ForgotPassPop onClose={closeForgotPassPopPopup} />
        </PortalPopup>
      )}
    </>
  );
};

export default LoginForm;
