
import { Select, message } from "antd";
import styles from "./EnrollPopUp.module.css";


import { useState, useCallback, useContext, useEffect } from "react";
import PortalPopup from "./PortalPopup";
import ConfirmEnrollment from "./ConfirmEnrollment";
import { enrollTutorialAction } from '../context/TutorialsContext'
import { fetchEnrolledTutorials } from "../context/TutorialsContext";
import { TutorialsContext } from '../context/TutorialsContext';
import { useTutorialsContext } from '../hooks/useTutorialsContext'
import { useAuthContext } from "../hooks/useAuthContext";

const EnrollPopUp = ({ onClose, tutorialId }) => {

  const [selectedLanguage, setSelectedLanguage] = useState(""); const user = useAuthContext();
  //const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isConfirmEnrollmentPopupOpen, setConfirmEnrollmentPopupOpen] =
    useState(false);

  const openConfirmEnrollmentPopup = useCallback(() => {
    setConfirmEnrollmentPopupOpen(true);
  }, []);

  const closeConfirmEnrollmentPopup = useCallback(() => {
    setConfirmEnrollmentPopupOpen(false);
  }, []);

  const onLanguageChange = (value) => {
    setSelectedLanguage(value);
  };




  const fetchEnrolledTutorialsPopUp = async (dispatch, user) => {
    try {
      const response = await fetch(`/api/tutorials/enrolled`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.user.token}`,
          'Content-Type': 'application/json'
        },
      });

      const json = await response.json();
      console.log("Json is", json)

      return json;

    } catch (error) {
      console.error('Error fetching enrolled tutorials:', error);

    }
  };

  const { dispatch } = useTutorialsContext();


  const onEnrollButtonClick = useCallback(async () => {
     if (!selectedLanguage) {
      // Show an alert if the user hasn't selected a language
      message.warning("Please choose a language before enrolling.");
      return;
    }
    await enrollTutorialAction(dispatch, selectedLanguage, tutorialId, user);
    message.success("Enrolled successfully for "+ selectedLanguage)

    onClose();

  }, [dispatch, onClose, tutorialId, selectedLanguage, user]);

  const [languageOptions, setLanguageOptions] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      const options = await checkforID(user, tutorialId);
      setLanguageOptions(options);
    };

    fetchOptions();
  }, [user, tutorialId]);

  const checkforID = async (user, tutorialId) => {
    try {
      const langs = [];
      const response = await fetchEnrolledTutorialsPopUp(dispatch, user);
      const options = ["C++", "Java", "Python"];

      console.log("Inside FUNCTION");
      //console.log(Array.isArray(enrolledTutorials));
      const enrolledTutorials = response.enrolledTutorials;
      console.log(Array.isArray(enrolledTutorials));

      for (var tutorial of enrolledTutorials) {
        if (tutorial.tutId._id === tutorialId) {
          console.log(tutorial);
          console.log("Tutorial lang is :", (tutorial.progLang));
          langs.push(tutorial.progLang);
        }
      }

      for (const lang of langs) {
        if (lang === "C++" || lang === "Java" || lang === "Python") {
          var index = options.indexOf(lang);
          if (index !== -1) {
            options.splice(index, 1);
          }
        }
      }

      if (options.length === 0) {
        return null // Return null instead of JSX element
      }

      const selectOptions = options.map((lang) => (
        <Select.Option key={lang} value={lang}>
          {lang}
        </Select.Option>
      ));

      return selectOptions;
    } catch (error) {
      console.error("Error fetching enrolled tutorials:", error);
      return null; // Return null instead of JSX element
    }
  };
  return (
    <div className={styles.enrollPopUp}>
      <div className={styles.frameforforgetpass}>
        <div className={styles.chooseYourLanguageParent}>
          <div id="langChoice" className={styles.chooseYourLanguage}>Choose your language</div>
          <Select
            className={styles.javaParent}
            placeholder={languageOptions === null ? "Enrolled in all languages" : "Choose language"}
            style={{ width: "226px" }}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            virtual={false}
            onChange={(value) => {
              console.log("Selected value:", value);
              onLanguageChange(value);
            }}
            disabled={languageOptions === null} // Disable the Select if languageOptions is null
          >
            {
              languageOptions
            }
          </Select>
        </div>
      </div>
      <div className={styles.frameforcross}>
        <img
          className={styles.pagecrossIcon}
          alt=""
          src="/pagecross31.svg"
          onClick={onClose}
        />
      </div>
      <div className={styles.buttondone}>
        <div className={styles.button} onClick={() => { closeConfirmEnrollmentPopup(); onClose(); }}>
          <button className={styles.button} onClick={onEnrollButtonClick} > <div className={styles.save}>Enroll</div> </button>
        </div>
      </div>

      {isConfirmEnrollmentPopupOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeConfirmEnrollmentPopup}
        >
          <ConfirmEnrollment onClose={closeConfirmEnrollmentPopup} />
        </PortalPopup>
      )}
    </div>


  );
};

export default EnrollPopUp;
