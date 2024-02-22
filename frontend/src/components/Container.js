import styles from "../pages/Projects.module.css";

const Container = ({ project,
    onclick
  })=>{
  return (
    <>
            <div className={styles.recentProjectProject1} onClick={onclick}>
            <div className={styles.recentProjectProject1Child} />
            <div className={styles.p1}>{project.prjName.slice(0,1).toUpperCase()+ "1"}</div>
        </div>

    </>
  );
};

export default Container;
