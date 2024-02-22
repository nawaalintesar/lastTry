import { useState, useCallback, useEffect } from "react";
import LogOutPopOutL from "../components/LogOutPopOutL";
import PortalPopup from "../components/PortalPopup";
import ProjectPopUPp from "../components/ProjectPopUPp";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Property1Default from "../components/Property1Default";
import Property1Closed from "../components/Property1Closed";
import styles from "./Dashboard.module.css";
import DashbordCardJavaRP from "../components/DashbordCardJavaRP";

import FilteredFormCard from "../components/FilteredFormCard";
import ContinueLearningSection from "../components/ContinueLearningSection"; // Import the new component
import { useAuthContext } from "../hooks/useAuthContext";

import { useProjectsContext } from "../hooks/useProjectsContext.js";
const Dashboard = () => {
  const [isProjectPopUPpOpen, setProjectPopUPpOpen] = useState(false);
  const [isLogOutPopOutLPopupOpen, setLogOutPopOutLPopupOpen] = useState(false);
  const [isLogOutPopOutLPopup1Open, setLogOutPopOutLPopup1Open] = useState(false);
  const navigate = useNavigate();
  const { projects, dispatch } = useProjectsContext();
  const user = useAuthContext();

  const onFrameButtonClick = useCallback((ProjectId) => {
    // Please sync "Code Editor- after login" to the project
    navigate("/CodeEditor", { state: { ProjectId } });
  }, [navigate]);

  const onFrameContainer3Click = useCallback(() => {
    navigate("/Tutorials");
  }, [navigate]);

  const onFrameIconClick = useCallback(() => {
    // Please sync "MyProjects-L" to the project
    if (user.user) {
      navigate("/Projects");
    }
    else { console.log("Not working"); }
  }, [navigate]);

  const onUsericonClick = useCallback(() => {
    navigate("/Profile");
  }, [navigate]);

  const onDashoboardSMContainerClick = useCallback(() => {
    navigate("/Dashboard");
  }, [navigate]);

  const onCodeEditorclick=useCallback(() => {
    navigate("/CodeEditor");
  }, [navigate]);

  const RecentProjectsContainer = () => {
    const [isProjectPopUPpOpen, setProjectPopUPpOpen] = useState(false);
  }
  const openProjectPopUPp = useCallback(() => {
    setProjectPopUPpOpen(true);
  }, []);

  const closeProjectPopUPp = useCallback(() => {
    setProjectPopUPpOpen(false);
  }, []);

  const onVoopClick = useCallback(() => {
    // Please sync "Sign in-L" to the project
    navigate("/Dashboard");
  }, [navigate]);

  useEffect(() => {
    const fetchProjects = async () => {
      // const response = await fetch('/api/projects')
      const response = await fetch('/api/projects', {
        headers: { 'Authorization': `Bearer ${user.user.token}` }
      });
      const json = await response.json()
      console.log(json)
      if (response.ok) {
        dispatch({ type: 'GET_PROJECTS', payload: json })
      }
    }


    if (user.user.userEmail) {
      console.log("HEllo user from inside DASHBOARD")
      console.log(user.user)
      fetchProjects();
    }
  }, [user, dispatch]);
  console.log(projects)
  return (
    <div className={styles.dashboard}>
      <div className={styles.dashbaordwelcParent}>
        <div className={styles.dashbaordwelc}>
          <img
            className={styles.dashbaordwelcChild}
            alt=""
            src="/group-33561@2x.png"
          />
          <div className={styles.welcomeToYour}>Welcome To Your Dashboard, {user.user.firstName}</div>
        </div>
        <>
          <div className={styles.recentprojects}>
            <div className={styles.recentProjects}>Recent Projects</div>
            <buttton onClick={openProjectPopUPp}>
              <div className={styles.newproject}>
                <div className={styles.iconParent}>
                  <img
                    className={styles.icon}
                    alt=""
                    src="/icon@2x.png"
                  />
                  <div className={styles.newProject}>New Project</div>
                </div>
              </div >
            </buttton>

            {projects && projects.slice(0, 2).map((project, index) => (
              <div key={project.id}>
                <DashbordCardJavaRP
                  key={project.id}
                  project={project}
                  index={index}
                />
              </div>
            ))}

          </div>

          <div className={styles.continueLearning}>Continue learning</div>
          <div className={styles.continueLearning} styles={{ marginleft: '20px' }}> <ContinueLearningSection />   </div>

          {isProjectPopUPpOpen && (
            <PortalPopup
              overlayColor="rgba(113, 113, 113, 0.3)"
              placement="Centered"
              onOutsideClick={closeProjectPopUPp}
            >
              <ProjectPopUPp onClose={closeProjectPopUPp} />
            </PortalPopup>
          )}
        </>


      </div>
      <Footer />
      <Property1Default
        onFrameButtonClick={onCodeEditorclick}
        onVoopClick={onVoopClick}
      />
      <Property1Closed
        onFrameContainerClick={onFrameContainer3Click}
        onFrameIconClick={onFrameIconClick}
        onUsericonContainerClick={onUsericonClick}
        onDashoboardSMContainerClick={onDashoboardSMContainerClick} />
    </div>
  );
};

export default Dashboard;
