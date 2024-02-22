import { useState } from "react";
import { TextField, InputAdornment, Icon, IconButton } from "@mui/material";
import ResetPasswordForm from "./ResetPasswordForm";
import styles from "./ForgotPassPop.module.css";

const ForgotPassPop = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className={styles.forgotpassPop}>
      <div className={styles.buttondone}>
        <div className={styles.button} onClick={onClose}>
          <div className={styles.save}>Done</div>
        </div>
      </div>
      <ResetPasswordForm />
      <div className={styles.frameforforgetpass}>
        <div className={styles.forgotPasswordParent}>
          <div className={styles.forgotPassword}>Forgot Password?</div>
          <div className={styles.notToWorryContainer}>
            <p className={styles.notToWorry}>{`Not to worry! `}</p>
            <p className={styles.notToWorry}>
              Enter the verification code sent to your email to change your
              password
            </p>
          </div>
          <TextField
            className={styles.frameChild}
            color="secondary"
            placeholder="Enter OTP"
            sx={{ width: 331 }}
            variant="outlined"
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleShowPasswordClick}
                    aria-label="toggle password visibility"
                  >
                    <Icon>
                      {showPassword ? "visibility_off" : "visibility"}
                    </Icon>
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>
      <div className={styles.frameforcross}>
        <img
          className={styles.pagecrossIcon}
          alt=""
          src="/pagecross1.svg"
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default ForgotPassPop;
