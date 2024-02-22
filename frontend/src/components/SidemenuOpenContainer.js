import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SidemenuOpenContainer.module.css";

const SidemenuOpenContainer = () => {
  const navigate = useNavigate();

  const onDashboardSMContainerClick = useCallback(() => {
    navigate("/Dashboard");
  }, [navigate]);

  const onMytutorialSMContainerClick = useCallback(() => {
    navigate("/Tutorials");
  }, [navigate]);

  const onMyProjectSMContainerClick = useCallback(() => {
    // Please sync "MyProjects-L" to the project
    navigate("/Projects");
  }, [navigate]);

  const onUserProfileSMContainerClick = useCallback(() => {
    // Please sync "User Profile Page-L" to the project
    navigate("/Profile");
  }, [navigate]);

  const onUsericonContainerClick = useCallback(() => {
    // Please sync "User Profile Page- L" to the project
    navigate("/Profile");
  }, [navigate]);

   const onUserIconClick = useCallback(() => {
    navigate("/Profile");
    // Please sync "My Projects-L" to the project
   }, [navigate]);

  return (
    <div className={styles.dashboardsmParent}>
      <div className={styles.dashboardsm} onClick={onDashboardSMContainerClick}>
        <img
          className={styles.layoutgrid4Icon}
          alt=""
          src="/layoutgrid4@2x.png"
        />
        <div className={styles.dashboard}>Dashboard</div>
      </div>
      <div
        className={styles.mytutorialsm}
        onClick={onMytutorialSMContainerClick}
      >
        <img
          className={styles.interfaceEssentialbookIcon}
          alt=""
          src="/interface-essentialbook1@2x.png"
        />
        <div className={styles.myTutorials}>My Tutorials</div>
      </div>
      <div className={styles.myprojectsm} onClick={onMyProjectSMContainerClick}>
        <div className={styles.foldermultiFolderParent}>
          <img
            className={styles.foldermultiFolderIcon}
            alt=""
            src="/foldermultifolder@2x.png"
          />
          <div className={styles.myProjects}>My Projects</div>
        </div>
      </div>
      <div
        className={styles.dashboardsm}
        onClick={onUserProfileSMContainerClick}
      >
        <div className={styles.usericon} onClick={onUsericonContainerClick}>
          <button
            className={styles.usericon1}
            id="projectIcon"
            onClick={onUserIconClick}
          />
          <img className={styles.usericonom} alt="" src="/usericonom@2x.png" />
        </div>
        <div className={styles.userProfile}>User Profile</div>
      </div>
    </div>
  );
};

export default SidemenuOpenContainer;
