//projects
import { useState, useCallback, dispatch, useEffect } from "react";
import { TextField, InputAdornment, Icon, IconButton } from "@mui/material";
import LogOutPopOutL from "../components/LogOutPopOutL";
import DeleteProject from "../components/DeleteProject";
import SideMenu from "../components/SideMenu";
import PortalDrawer from "../components/PortalDrawer";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container";
import ProjectFrame from "../components/ProjectFrame";
import styles from "./Projects.module.css";
import Footer from "../components/Footer";
import Property1Default from "../components/Property1Default";
import Property1Closed from "../components/Property1Closed";
import { useProjectsContext } from "../hooks/useProjectsContext.js";
import ProjectPopUPp from "../components/ProjectPopUPp";
import PortalPopup from "../components/PortalPopup";
import { useAuthContext } from "../hooks/useAuthContext";
import React from "react";
import {  message } from "antd";

const Projects = () => {
  const [isProjectPopUPpOpen, setProjectPopUPpOpen] = useState(false);

  const [isLogOutPopOutLPopupOpen, setLogOutPopOutLPopupOpen] = useState(false);
  const [isLogOutPopOutLPopup1Open, setLogOutPopOutLPopup1Open] =
    useState(false);
  const [isDeleteProjectOpen, setDeleteProjectOpen] = useState(false);
  const [isSideMenuOpen, setSideMenuOpen] = useState(false);
  const navigate = useNavigate();

  const openLogOutPopOutLPopup1 = useCallback(() => {
    setLogOutPopOutLPopup1Open(true);
  }, []);

  const closeLogOutPopOutLPopup1 = useCallback(() => {
    setLogOutPopOutLPopup1Open(false);
  }, []);

  const openLogOutPopOutLPopup = useCallback(() => {
    setLogOutPopOutLPopupOpen(true);
  }, []);

  const closeLogOutPopOutLPopup = useCallback(() => {
    setLogOutPopOutLPopupOpen(false);
  }, []);

  const openSideMenu = useCallback(() => {
    setSideMenuOpen(true);
  }, []);

  const closeSideMenu = useCallback(() => {
    setSideMenuOpen(false);
  }, []);

  const onFrameButtonClick = useCallback((ProjectId) => {
    // Please sync "Code Editor- after login" to the project
    navigate("/CodeEditor", { state: { ProjectId } });
  }, [navigate]);

  const onCodeEditorclick=useCallback(() => {
    navigate("/CodeEditor");
  }, [navigate]);

  const onFrameContainer3Click = useCallback(() => {
    navigate("/Tutorials");
  }, [navigate]);

  const onFrameIconClick = useCallback(() => {
    // Please sync "MyProjects-L" to the project
    navigate("/Projects");
  }, [navigate]);

  const onUsericonClick = useCallback(() => {
    navigate("/Profile");
  }, [navigate]);

  const onDashoboardSMContainerClick = useCallback(() => {
    navigate("/Dashboard");
  }, [navigate]);

  const onVoopClick = useCallback(() => {
    navigate("/Dashboard");
  }, [navigate]);

  const openDeleteProject = useCallback(() => {
    setDeleteProjectOpen(true);
  }, []);

  const closeDeleteProject = useCallback(() => {
    setDeleteProjectOpen(false);
  }, []);
  const openProjectPopUPp = useCallback(() => {
    setProjectPopUPpOpen(true);
  }, []);

  const closeProjectPopUPp = useCallback(() => {
    setProjectPopUPpOpen(false);
  }, []);

  const user =useAuthContext();

  const onSearch = async (value) => {
    const fetchSearchResults = async () => {
      console.log("response heree", value);
      try {
        const response = await fetch('/api/projects/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.user.token}` },
          body: JSON.stringify({ text: value }),
        });

        if (response.ok) {
          const matchingProjects = await response.json();
          console.log(matchingProjects)
          if (matchingProjects?.matchingProjects) {
            dispatch({ type: 'GET_PROJECTS', payload: matchingProjects?.matchingProjects });
            console.log("respnose", matchingProjects?.matchingProjects)
          }
          else{
            console.log(matchingProjects.message)
           message.info(matchingProjects.message);
          dispatch({ type: 'GET_PROJECTS', payload: null });
          }
        } else {
          console.error('Error fetching search results:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };
  
    if (user.user.userEmail) {
      try {
        // Await the fetchSearchResults function
        await fetchSearchResults();
      } catch (error) {
        console.error('Error in onSearch:', error);
      }
    }
  };
  

  const { projects, dispatch } = useProjectsContext();
  useEffect(() => {
    // const fetchProjects = async () => {
    //   const response = await fetch('/api/projects', {
    //     headers: {'Authorization': `Bearer ${user.token}`},
    //   })
    //   const json = await response.json()

    //   if (response.ok) {
    //     dispatch({ type: 'GET_PROJECTS', payload: json })
    //   }
    // }
    
    // if (user.user){
    //   console.log("HEllo user from inside projects")
    //   console.log(user.user)
    //   fetchProjects()

    // }
    const fetchProjects = async () => {
      
        const response = await fetch('/api/projects', {
          headers: { 'Authorization': `Bearer ${user.user.token}` }
        });
        const json = await response.json()

       if (response.ok) {
         dispatch({ type: 'GET_PROJECTS', payload: json })
       }
     }
    

    if (user.user.userEmail) {
      console.log("HEllo user from inside projects")
      console.log(user.user)
      fetchProjects();
    }
  },
  //  [dispatch, user]
  [user, dispatch]
  );

  return (
    <>
      <div className={styles.Projects}>



        <div className={styles.innerthings}>
          {/* <img
            className={styles.innerthingsChild}
            alt=""
            src="/rectangle-27@2x.png"
          /> */}
        
           <div className={styles.recentProjectProject1Parent}>
          
          {projects && projects.slice(0, 3).map((project, index) => (
            <button style={{ background: 'transparent', border: 'none'}} > <Container onclick={() => onFrameButtonClick(project._id)} key={project._id} project={project} /></button>
          ))}
          

          <div className={styles.addingbox} onClick={openProjectPopUPp }>
            <div className={styles.addingboxChild} />
            <button className={styles.editPlus} id="PlusButton">
              <img className={styles.coolicon} alt="" src="/coolicon@2x.png" />
            </button>
          </div>
          </div>
          
          {isProjectPopUPpOpen && (
            <PortalPopup
              overlayColor="rgba(113, 113, 113, 0.3)"
              placement="Centered"
              onOutsideClick={closeProjectPopUPp}
            >
              <ProjectPopUPp onClose={closeProjectPopUPp} />
            </PortalPopup>
          )}
          <div className={styles.projects}>
            
            {projects && projects.map((project,img, index) => (
              <ProjectFrame 
                onclick={() => onFrameButtonClick(project._id)}
                key={project.id}
                project={project}
                edited5MinAgo={project.updatedAt}
                project1={project.prjName}
                j={project.progLang.slice(0, 1).toUpperCase()}
                showEditMinus={false}
                projectFrameWidth="1099px"
                projectFrameTop="0px"
                projectFrameLeft="0px"
                projectBoxBackground="linear-gradient(139.01deg, #8775df, #7a59b5 93.23%)"
                projectBoxBoxShadow="0px 4px 4px rgba(0, 0, 0, 0.35)"

              />
           
            ))}

          </div>
          <div className={styles.recentlyViewed}>Recently viewed</div>
          <TextField
            className={styles.searchBar}
            color="secondary"
            name="Search"
            label="Search"
            placeholder="Search"
            sx={{ width: 1089 }}
            variant="filled"
            type="search"
            onChange={(event) => onSearch(event.target.value)}
         
          />
        </div>

        <Footer />
        <Property1Default
          onFrameButtonClick={onCodeEditorclick} 
          onVoopClick={onVoopClick}/>
        <Property1Closed
          onFrameContainerClick={onFrameContainer3Click}
          onFrameIconClick={onFrameIconClick}
          onUsericonContainerClick={onUsericonClick}
          onDashoboardSMContainerClick={onDashoboardSMContainerClick}
        />

      </div>

      {isDeleteProjectOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeDeleteProject}
        >
          <DeleteProject onClose={closeDeleteProject} />
        </PortalPopup>
      )}

    </>
  );
};

export default Projects;
