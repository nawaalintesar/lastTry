import styles from "./ProfileUpdateConfirmationL.module.css";

const ProfileUpdateConfirmationL = ({ onClose }) => {
  return (
    <div className={styles.profileupdateconfirmationL}>
      <div className={styles.profileupdateconfirmationLChild} />
      <div className={styles.updated}>Updated</div>
      <div className={styles.yourInformationHas}>
        Your information has been updated successfully!
      </div>
      <img
        className={styles.pagecrossIcon}
        alt=""
        src="/pagecross.svg"
        onClick={onClose}
      />
    </div>
  );
};

export default ProfileUpdateConfirmationL;
