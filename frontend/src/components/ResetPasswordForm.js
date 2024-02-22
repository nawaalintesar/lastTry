import { useState } from "react";
import { TextField, InputAdornment, Icon, IconButton } from "@mui/material";
import styles from "./ResetPasswordForm.module.css";

const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className={styles.frameforresetpass}>
      <div className={styles.resetPassword}>Reset Password</div>
      <div className={styles.enterYourNew}>Enter your new password</div>
      <TextField
        className={styles.frameforresetpassChild}
        color="secondary"
        placeholder="Enter password"
        sx={{ width: 331 }}
        variant="outlined"
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
      />
      <div className={styles.confirmPassword}>Confirm password</div>
      <TextField
        className={styles.frameforresetpassItem}
        color="secondary"
        placeholder="Confirm password"
        sx={{ width: 331 }}
        variant="outlined"
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
      />
    </div>
  );
};

export default ResetPasswordForm;
