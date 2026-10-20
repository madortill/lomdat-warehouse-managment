
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

import tillLogo from "../media/Till-logo.png";
import bahad6Logo from "../media/bahad-6-logo.png";
import InstructionsImg from "../media/Instructions.svg";

import "./App.css";

// ====================================
// שמירת ההתקדמות
// ====================================

import {
  STORAGE_KEYS,
  readStoredObject,
  writeStoredObject,
  clearWarehouseProgress,
} from "./utils/practiceStorage.js";

// ====================================
// COMPONENTS
// ====================================

import SafetyGuidelines, {
  SAFETY_GUIDELINES_PAGE,
  SAFETY_GUIDELINES_TOTAL_STEPS,
} from "./components/SafetyGuidelines/SafetyGuidelines.jsx";

import Navbar from "./components/Navbar/Navbar.jsx";

import FirstPage, {
  END_PAGE,
} from "./components/FirstPage/FirstPage.jsx";

import NavigationArrows from "./components/NavigationArrows/NavigationArrows.jsx";

import InfoPage, {
  EQUIPMENT_RECEIPT_PAGE,
  WAREHOUSE_CONTROL_PAGE,
  WAREHOUSE_CONTROL_CARD_COUNT,
} from "./components/InfoPage/InfoPage.jsx";

import MobileBlocker from "./components/MobileBlocker/MobileBlocker";

import SupplyTypes from "./components/SupplyTypes/SupplyTypes.jsx";

import FirstPractice from "./components/FirstPractice/FirstPractice.jsx";

import ContainerPage from "./components/ContainerPage/ContainerPage.jsx";

import OpenFieldSupply, {
  OPEN_FIELD_START_PAGE,
  OPEN_FIELD_END_PAGE,
} from "./components/OpenFieldSupply/OpenFieldSupply.jsx";

import SecondPractice, {
  SECOND_PRACTICE_PAGE,
} from "./components/SecondPractice/SecondPractice.jsx";

// ====================================
// SETTINGS
// ====================================

const LAST_PAGE = END_PAGE;

const TOPICS = [
  {
    page: 2,
    title: "עקרונות ומטרות אחסנה",
  },
  {
    page: 8,
    title: "סידור המחסן ושמירה על כשירות האפסניה",
  },
  {
    page: 9,
    title: "אחסנת אפסניה על פי סוגים",
  },
  {
    page: 19,
    title: "אחסנת אפסניה במכולות",
  },
  {
    page: 21,
    title: "אחסנת אפסניה בשטח פתוח",
  },
  {
    page: 37,
    title: "עזרי שליטה במחסן",
  },
  {
    page: 38,
    title: "הוראות בטיחות במחסן",
  },
];

function App() {

  // ====================================
  // טעינת התקדמות שמורה
  // ====================================

  const [savedProgress] = useState(() => ({
    course: readStoredObject(STORAGE_KEYS.course),
    first: readStoredObject(STORAGE_KEYS.firstPractice),
    second: readStoredObject(STORAGE_KEYS.secondPractice),
  }));

  const savedCourse = savedProgress.course;

  // ====================================
  // PAGE STATE
  // ====================================

  const [pageNum, setPageNum] = useState((37) 
  );
/*=>
    Number.isInteger(savedCourse?.pageNum)
      ? Math.max(
          36,
          Math.min(LAST_PAGE, savedCourse.pageNum)
        )
      : 0 */
  const [maxPageReached, setMaxPageReached] =
    useState(() =>
      Number.isInteger(savedCourse?.maxPageReached)
        ? Math.max(
            0,
            Math.min(
              LAST_PAGE,
              savedCourse.maxPageReached
            )
          )
        : 0
    );

  // ====================================
  // SAFETY GUIDELINES
  // ====================================

  const [safetyStep, setSafetyStep] = useState(() =>
    Number.isInteger(savedCourse?.safetyStep)
      ? Math.max(
          0,
          Math.min(
            SAFETY_GUIDELINES_TOTAL_STEPS - 1,
            savedCourse.safetyStep
          )
        )
      : 0
  );

  const [
    maxSafetyStepReached,
    setMaxSafetyStepReached,
  ] = useState(() =>
    Number.isInteger(
      savedCourse?.maxSafetyStepReached
    )
      ? Math.max(
          0,
          Math.min(
            SAFETY_GUIDELINES_TOTAL_STEPS - 1,
            savedCourse.maxSafetyStepReached
          )
        )
      : 0
  );

  // ====================================
  // MOBILE BLOCKER
  // ====================================

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 900);
    };

    checkScreen();

    window.addEventListener("resize", checkScreen);

    return () => {
      window.removeEventListener(
        "resize",
        checkScreen
      );
    };
  }, []);

  // ====================================
  // INFO PAGE PROGRESS
  // ====================================

  const [seenInfoCards, setSeenInfoCards] =
    useState(() =>
      Array.isArray(savedCourse?.seenInfoCards)
        ? savedCourse.seenInfoCards
        : []
    );

  const infoPageCompleted =
    seenInfoCards.length >= 4;

  // ====================================
  // SUPPLY TYPES PROGRESS
  // ====================================

  const [
    completedSupplySteps,
    setCompletedSupplySteps,
  ] = useState(() =>
    Array.isArray(savedCourse?.completedSupplySteps)
      ? savedCourse.completedSupplySteps
      : []
  );

  // ====================================
  // FIRST PRACTICE PROGRESS
  // ====================================

  const [
    firstPracticeCompleted,
    setFirstPracticeCompleted,
  ] = useState(() =>
    savedProgress.first?.isComplete === true ||
    savedCourse?.firstPracticeCompleted === true
  );

  // ====================================
  // SECOND PRACTICE PROGRESS
  // ====================================

  const secondPracticeRef = useRef(null);

  const [
    secondPracticeCanAdvance,
    setSecondPracticeCanAdvance,
  ] = useState(() => {
    const saved = savedProgress.second;

    if (!saved || saved.stage === "intro") {
      return true;
    }

    return (
      saved.stage === "playing" &&
      saved.roundComplete === true &&
      saved.roundIndex < 2
    );
  });

  const [
    secondPracticeCompleted,
    setSecondPracticeCompleted,
  ] = useState(() =>
    ["success", "finished"].includes(
      savedProgress.second?.stage
    ) ||
    savedCourse?.secondPracticeCompleted === true
  );

  // ====================================
  // WAREHOUSE CONTROL CARDS
  // ====================================

  const [
    controlCardIndex,
    setControlCardIndex,
  ] = useState(() =>
    Number.isInteger(savedCourse?.controlCardIndex)
      ? Math.max(
          0,
          Math.min(
            WAREHOUSE_CONTROL_CARD_COUNT - 1,
            savedCourse.controlCardIndex
          )
        )
      : 0
  );

  // ====================================
  // שמירה אוטומטית של התקדמות הלומדה
  // ====================================

  useEffect(() => {
    writeStoredObject(STORAGE_KEYS.course, {
      pageNum,
      maxPageReached,

      safetyStep,
      maxSafetyStepReached,

      seenInfoCards,
      completedSupplySteps,

      firstPracticeCompleted,
      secondPracticeCompleted,

      controlCardIndex,
    });
  }, [
    pageNum,
    maxPageReached,
    safetyStep,
    maxSafetyStepReached,
    seenInfoCards,
    completedSupplySteps,
    firstPracticeCompleted,
    secondPracticeCompleted,
    controlCardIndex,
  ]);

  // ====================================
  // RESTART COURSE
  // ====================================

  const restartCourse = () => {

    // מחיקת ההתקדמות השמורה
    clearWarehouseProgress();

    // חזרה למסך הפתיחה
    setPageNum(0);
    setMaxPageReached(0);

    // כרטיסיות מידע
    setSeenInfoCards([]);

    // שלבי אחסנה
    setCompletedSupplySteps([]);

    // תרגול ראשון
    setFirstPracticeCompleted(false);

    // תרגול שני
    setSecondPracticeCompleted(false);
    setSecondPracticeCanAdvance(true);

    // עזרי שליטה
    setControlCardIndex(0);

    // הוראות בטיחות
    setSafetyStep(0);
    setMaxSafetyStepReached(0);
  };

  // ====================================
  // NEXT PAGE
  // ====================================

  const toNextPage = () => {

    // ------------------------------------
    // PAGE 38 - SAFETY GUIDELINES
    // ------------------------------------

    if (pageNum === SAFETY_GUIDELINES_PAGE) {

      if (
        safetyStep <
        SAFETY_GUIDELINES_TOTAL_STEPS - 1
      ) {
        const nextStep = safetyStep + 1;

        setSafetyStep(nextStep);

        setMaxSafetyStepReached((previous) =>
          Math.max(previous, nextStep)
        );

      } else {

        setPageNum(END_PAGE);
      }

      return;
    }

    // ------------------------------------
    // PAGE 37 - WAREHOUSE CONTROL
    // ------------------------------------

    if (pageNum === WAREHOUSE_CONTROL_PAGE) {

      if (
        controlCardIndex <
        WAREHOUSE_CONTROL_CARD_COUNT - 1
      ) {
        setControlCardIndex((previous) =>
          previous + 1
        );

      } else {

        setSafetyStep(0);
        setPageNum(SAFETY_GUIDELINES_PAGE);
      }

      return;
    }

    // ------------------------------------
    // PAGE 36 - SECOND PRACTICE
    // ------------------------------------

    if (pageNum === SECOND_PRACTICE_PAGE) {

      if (secondPracticeCompleted) {

        setControlCardIndex(0);
        setPageNum(WAREHOUSE_CONTROL_PAGE);

        return;
      }

      secondPracticeRef.current?.goNext();

      return;
    }

    // ------------------------------------
    // REGULAR PAGE NAVIGATION
    // ------------------------------------

    setPageNum((previous) => {

      // עמוד 2 - כרטיסיות מידע
      if (
        previous === 2 &&
        !infoPageCompleted
      ) {
        return previous;
      }

      // עמודים 9-17 - סוגי אפסניה
      if (
        previous >= 9 &&
        previous <= 17 &&
        !completedSupplySteps.includes(
          previous - 9
        )
      ) {
        return previous;
      }

      // עמוד 18 - תרגול ראשון
      if (
        previous === 18 &&
        !firstPracticeCompleted
      ) {
        return previous;
      }

      return Math.min(
        previous + 1,
        LAST_PAGE
      );
    });
  };

  // ====================================
  // PREVIOUS PAGE
  // ====================================

  const toPrevPage = () => {

    // הוראות בטיחות
    if (pageNum === SAFETY_GUIDELINES_PAGE) {

      if (safetyStep > 0) {
        setSafetyStep((previous) =>
          previous - 1
        );
      } else {
        setPageNum(WAREHOUSE_CONTROL_PAGE);
      }

      return;
    }

    // מעבר בין כרטיסיות עזרי השליטה
    if (
      pageNum === WAREHOUSE_CONTROL_PAGE &&
      controlCardIndex > 0
    ) {
      setControlCardIndex((previous) =>
        Math.max(0, previous - 1)
      );

      return;
    }

    // חזרה לעמוד הקודם
    setPageNum((previous) =>
      Math.max(0, previous - 1)
    );
  };

  // ====================================
  // MAX PAGE REACHED
  // ====================================

  useEffect(() => {
    setMaxPageReached((previous) =>
      Math.max(previous, pageNum)
    );
  }, [pageNum]);

  // ====================================
  // NAVBAR NAVIGATION
  // ====================================

  const goToTopic = (targetPage) => {

    const topicExists = TOPICS.some(
      (topic) => topic.page === targetPage
    );

    if (
      !topicExists ||
      targetPage > maxPageReached
    ) {
      return;
    }

    if (targetPage === WAREHOUSE_CONTROL_PAGE) {
      setControlCardIndex(0);
    }

    if (targetPage === SAFETY_GUIDELINES_PAGE) {
      setSafetyStep(0);
    }

    setPageNum(targetPage);
  };

  // ====================================
  // INFO CARD SEEN
  // ====================================

  const handleInfoCardSeen = (cardId) => {

    setSeenInfoCards((previous) => {

      if (previous.includes(cardId)) {
        return previous;
      }

      return [...previous, cardId];
    });
  };

  // ====================================
  // PREVENT NATIVE IMAGE DRAGGING
  // ====================================

  useEffect(() => {

    const preventImageDrag = (event) => {

      if (
        event.target instanceof HTMLImageElement
      ) {
        event.preventDefault();
      }
    };

    document.addEventListener(
      "dragstart",
      preventImageDrag
    );

    return () => {
      document.removeEventListener(
        "dragstart",
        preventImageDrag
      );
    };

  }, []);

  // ====================================
  // SUPPLY TYPES COMPLETION
  // ====================================

  const handleSupplyStepComplete = useCallback(
    (isComplete) => {

      if (
        !isComplete ||
        pageNum < 9 ||
        pageNum > 17
      ) {
        return;
      }

      const stepIndex = pageNum - 9;

      setCompletedSupplySteps((previous) => {

        if (previous.includes(stepIndex)) {
          return previous;
        }

        return [...previous, stepIndex];
      });
    },
    [pageNum]
  );

  // ====================================
  // NEXT ARROW AVAILABILITY
  // ====================================

  const canGoNext =

    pageNum === SAFETY_GUIDELINES_PAGE
      ? true

      : pageNum === WAREHOUSE_CONTROL_PAGE
        ? true

        : pageNum === SECOND_PRACTICE_PAGE
          ? (
              secondPracticeCompleted ||
              secondPracticeCanAdvance
            )

          : (
              pageNum < LAST_PAGE &&

              (
                pageNum !== 2 ||
                infoPageCompleted
              ) &&

              (
                pageNum !== 18 ||
                firstPracticeCompleted
              ) &&

              (
                pageNum < 9 ||
                pageNum > 17 ||
                completedSupplySteps.includes(
                  pageNum - 9
                )
              )
            );

  // ====================================
  // MOBILE BLOCKER
  // ====================================

  if (isMobile) {
    return <MobileBlocker />;
  }

  // ====================================
  // RENDER
  // ====================================

  return (
    <>

      {/* GLOBAL BACKGROUND */}

      <div
        className={`page-background ${
          pageNum === 1 ? "blurred" : ""
        }`}
      />

      {/* GLOBAL LOGOS */}

      {pageNum !== 18 && (
        <>
          <img
            className="till-logo"
            src={tillLogo}
            alt="לוגו מדור טיל"
          />

          <img
            className="bahad-logo"
            src={bahad6Logo}
            alt="לוגו בהד 6"
          />
        </>
      )}

      {/* PAGE 0 - OPENING */}

      {pageNum === 0 && (
        <FirstPage
          toNextPage={toNextPage}
        />
      )}

      {/* PAGE 1 - INSTRUCTIONS */}

      {pageNum === 1 && (
        <img
          className="Instructions-img"
          src={InstructionsImg}
          alt="הוראות הלומדה"
          draggable="false"
        />
      )}

      {/* NAVIGATION ARROWS */}

      {pageNum >= 1 &&
        pageNum !== END_PAGE &&
        pageNum !== 18 && (

          <NavigationArrows
            onNext={toNextPage}
            onBack={toPrevPage}
            canGoNext={canGoNext}
            canGoBack={pageNum > 0}
          />

        )}

      {/* NAVBAR */}

      {pageNum >= 2 &&
        pageNum < END_PAGE &&
        pageNum !== SECOND_PRACTICE_PAGE && (

          <Navbar
            topics={TOPICS}
            currentPage={pageNum}
            maxPageReached={maxPageReached}
            onNavigate={goToTopic}
          />

        )}

      {/* INFO PAGE */}

      {(
        (pageNum >= 2 && pageNum <= 8) ||
        pageNum === EQUIPMENT_RECEIPT_PAGE ||
        pageNum === WAREHOUSE_CONTROL_PAGE
      ) && (

        <InfoPage
          pageNum={pageNum}
          onCardSeen={handleInfoCardSeen}
          seenCardIds={seenInfoCards}
          controlCardIndex={controlCardIndex}
          onControlCardChange={setControlCardIndex}
        />

      )}

      {/* SUPPLY TYPES - PAGES 9-17 */}

      {pageNum >= 9 && pageNum <= 17 && (

        <SupplyTypes
          step={pageNum - 9}
          onStepComplete={handleSupplyStepComplete}
        />

      )}

      {/* FIRST PRACTICE - PAGE 18 */}

   
{/* FIRST PRACTICE - PAGE 18 */}

{pageNum === 18 && (
  <FirstPractice
    onComplete={() => {
      setFirstPracticeCompleted(true);
    }}

    onBackToMaterial={() => {
      setPageNum(17);
    }}

    onGoNext={() => {
      setPageNum(19);
    }}
  />
)}


      {/* CONTAINER PAGE - PAGES 19-20 */}

      {pageNum >= 19 && pageNum <= 20 && (

        <ContainerPage
          pageNum={pageNum - 1}
        />

      )}

      {/* OPEN FIELD SUPPLY - PAGES 21-34 */}

      {pageNum >= OPEN_FIELD_START_PAGE &&
        pageNum <= OPEN_FIELD_END_PAGE && (

          <OpenFieldSupply
            pageNum={pageNum}
          />

        )}

      {/* SECOND PRACTICE - PAGE 36 */}

      {pageNum === SECOND_PRACTICE_PAGE && (

        <SecondPractice
          ref={secondPracticeRef}

          onCanAdvanceChange={
            setSecondPracticeCanAdvance
          }

          onComplete={() => {
            setSecondPracticeCompleted(true);
          }}
        />

      )}

      {/* SAFETY GUIDELINES - PAGE 38 */}

      {pageNum === SAFETY_GUIDELINES_PAGE && (

        <SafetyGuidelines
          currentStep={safetyStep}
          maxReachedStep={maxSafetyStepReached}
          onStepChange={setSafetyStep}
        />

      )}

      {/* FINAL SCREEN - PAGE 39 */}

      {pageNum === END_PAGE && (

        <FirstPage
          variant="end"
          onRestart={restartCourse}
        />

      )}

    </>
  );
}

export default App;
