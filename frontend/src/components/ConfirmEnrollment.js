import styles from "./ConfirmEnrollment.module.css";

const ConfirmEnrollment = ({ onClose }) => {
  return (
    <div className={styles.confirmEnrollment}>
      <div className={styles.youAreAbout}>
        You are about to enroll in this tutorial
      </div>
      <button className={styles.explorebutton} onClick={onClose}>
        <div className={styles.confirm}>Confirm</div>
        
      </button>
      <div className={styles.pleaseConfirmBefore}>
        Please confirm before you start your journey
      </div>
      <img
        className={styles.pagecrossIcon}
        alt=""
        src="/pagecross21.svg"
        onClick={onClose}
      />
    </div>
  );
};

export default ConfirmEnrollment;
