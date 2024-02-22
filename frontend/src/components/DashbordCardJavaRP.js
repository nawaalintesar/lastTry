import styles from "./DashbordCardJavaRP.module.css";
import { useMemo } from "react";
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

import { useState, useCallback, useEffect, dispatch } from "react";
import { useNavigate } from "react-router-dom";

const DashbordCardJavaRP = ({project, index}) => {

  const navigate = useNavigate();
  const onFrameButtonClick = useCallback(() => {
    navigate("/CodeEditor", { state: { ProjectId: project._id } });
  }, [navigate, project._id]);
  
  return (
  <div className={styles.javaRecentprojects} style={{ left: `${index === 0 ? 350 : 700 + (index - 1) * 350}px` }}>

      <div className={styles.javaRecentprojectsChild} onClick={onFrameButtonClick} />
      <img
        className={styles.javaRecentprojectsItem}
        alt=""
        src="/frame-33618@2x.png"
      />
      <div className={styles.javaRecentprojectsInner} >
        <div className={styles.javaWrapper}>
          <div className={styles.java}>{project.progLang}</div>
        </div>
      </div>
      <div className={styles.animalsLab5}>{project.prjName}</div>
      <div className={styles.lastUpdated7}>Updated {formatDistanceToNow(new Date(project.updatedAt), {addSuffix: true})}</div>
    </div>
  );
};

export default DashbordCardJavaRP;
