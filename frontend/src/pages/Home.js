import { useCallback } from "react";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import HeaderLight from "../components/HeaderLight";

const Home = () => {
  const navigate = useNavigate();

  const onExploreButtonClick = useCallback(() => {
    const anchor = document.querySelector("[data-scroll-to='image9']");
    if (anchor) {
      anchor.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, []);

  
  const onGetCodingButtonClick = useCallback(() => {
    navigate("/CodeEditor");
  }, [navigate]);


  const onButtonContainerClick = useCallback(() => {
    navigate("/CodeEditor");
  }, [navigate]);

  const onSignUpContainerClick = useCallback(() => {
    // Please sync "Sign in-L" to the project
    navigate("/signIn");
  }, [navigate]);

  const onButtonClick = useCallback(() => {
    // Please sync "Sign in-L" to the project
    navigate("/signIn");
  }, [navigate]);

  const onVoopClick = useCallback(() => {
    // Please sync "Sign in-L" to the project
    navigate("/");
  }, [navigate]);

  return (
    <div className={styles.Home}>
      <div className={styles.firstpage}>
        <img className={styles.image11Icon} alt="" src="/image-11@2x.png" />
        <img
          className={styles.firstpageChild}
          alt=""
          src="/rectangle-15@2x.png"
        />
        <div className={styles.middleinfo}>
          <div className={styles.visualize}>Visualize OOP</div>
          <div className={styles.voop}>VOOP</div>
          <button
            className={styles.exploreButton}
            onClick={onExploreButtonClick}
          >
            <div className={styles.exploreButtonChild} />
            <div className={styles.exploreButtonItem} />
            <div className={styles.explore}>Explore</div>
          </button>
          <button className={styles.getCodingButton}
          onClick={onGetCodingButtonClick}>
            <div className={styles.getCodingButtonChild} />
            <div className={styles.getCodingButtonItem} />
            <div className={styles.getCoding}>Get Coding</div>

          </button>
        </div>
        <img className={styles.firstpageItem} alt="" src="/vector-16@2x.png" />
      </div>
      <div className={styles.secondpage}>
        <div className={styles.wrapperCloudFrame}>
          <img
            className={styles.cloudFrameIcon}
            alt=""
            src="/cloud-frame@2x.png"
          />
        </div>
        <div className={styles.wrapperCloudFram1}>
          <img
            className={styles.cloudFram1Icon}
            alt=""
            src="/cloud-fram1@2x.png"
          />
        </div>
        <div className={styles.wrapperFrame33656}>
          <img
            className={styles.wrapperFrame33656Child}
            alt=""
            src="/frame-33656@2x.png"
          />
        </div>
        <img
          className={styles.image9Icon}
          alt=""
          src="/image-9@2x.png"
          data-scroll-to="image9"
        />
        <div className={styles.magicofvoop}>
          <div className={styles.visualizeYourCode}>
            Visualize your code and learn all you need to know about Object
            Oriented Programming. With our animations, say goodbye to logic
            errors and hello to organized code.
          </div>
          <div
            className={styles.learnToImplement}
          >{`Learn to implement OOP in `}</div>
          <div className={styles.theMagicOf}>The Magic of Voop</div>
          <div className={styles.wrapperRectangle75}>
            <img
              className={styles.wrapperRectangle75Child}
              alt=""
              src="/rectangle-75@2x.png"
            />
          </div>
          <div className={styles.magicofvoopChild} />
          <div className={styles.magicofvoopItem} />
          <div className={styles.magicofvoopInner} />
          <div className={styles.c}>C++</div>
          <div className={styles.java}>Java</div>
          <div className={styles.python}>Python</div>
        </div>
        <div className={styles.marker} />
      </div>
      <div className={styles.thirdpage}>
        <div className={styles.wrapperFrame33655Parent}>
          <div className={styles.wrapperFrame33655}>
            <img
              className={styles.wrapperFrame33655Child}
              alt=""
              src="/frame-33655@2x.png"
            />
          </div>
          <div className={styles.wrapperFrame33654}>
            <img
              className={styles.wrapperFrame33654Child}
              alt=""
              src="/frame-33654@2x.png"
            />
          </div>
          <img className={styles.frameChild} alt="" src="/frame-33657@2x.png" />
          <div className={styles.middleinfo1}>
            <div className={styles.ourSolution}>Our Solution</div>
            <div className={styles.ourTeamAims}>
              Our Team aims to improve your OOP learning experience with our
              cutting edge animations. By visually representing your code,
              you’ll be an OOP expert in no time!
            </div>
            <div className={styles.newToOop}>
              New to OOP? We got you! Sign up now to access our beginner
              friendly tutorials
            </div>
            <div className={styles.signUp} onClick={onSignUpContainerClick}>
              <div className={styles.text}>Sign up</div>
              <div className={styles.icon} />
            </div>
          </div>
        </div>
      </div>
      {/* <div className={styles.headerLight}>
        <div className={styles.buttonParent}>
          <button className={styles.button}
          onClick={onGetCodingButtonClick}>
            <div className={styles.codeEditor}>Code Editor</div>
          </button>
          <div className={styles.voOp}>
            <span className={styles.voOpTxtContainer}>
              <p className={styles.vo}>VO</p>
              <p className={styles.vo}>&nbsp;</p>
              <p className={styles.vo}>&nbsp;</p>
              <p className={styles.op}>OP</p>
            </span>
          </div>
          <button
            className={styles.button1}
            id="LogOutButton"
            onClick={onButtonClick}
          >
            <div className={styles.text1}>Sign In</div>
          </button>
        </div>
      </div> */}
      <HeaderLight
        onButtonContainerClick={onButtonContainerClick}
        onButtonClick={onButtonClick}
        onVoopClick={onVoopClick}
      />
      <footer className={styles.footer} id="footer">
        <div className={styles.voopSeeMoreContainer}>
          <span className={styles.voopSeeMoreContainer1}>
            <p className={styles.voop1}>Voop</p>
            <p className={styles.vo}>&nbsp;</p>
            <p className={styles.vo}>&nbsp;</p>
            <p className={styles.seeMoreLearn}>{`See More, Learn More. `}</p>
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
