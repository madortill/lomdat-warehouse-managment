
import React, {
  useState,
  useEffect,
  useCallback,
} from "react";

import tillLogo from "../media/Till-logo.png";
import bahad6Logo from "../media/bahad-6-logo.png";
import InstructionsImg from "../media/Instructions.svg";

import "./App.css";

// ====================================
// COMPONENTS
// ====================================

import Navbar from "./components/Navbar/Navbar.jsx";
import FirstPage from "./components/FirstPage/FirstPage.jsx";
import NavigationArrows from "./components/NavigationArrows/NavigationArrows.jsx";

import InfoPage, {
  EQUIPMENT_RECEIPT_PAGE,
} from "./components/InfoPage/InfoPage.jsx";

import SupplyTypes from "./components/SupplyTypes/SupplyTypes.jsx";
import FirstPractice from "./components/FirstPractice/FirstPractice.jsx";
import ContainerPage from "./components/ContainerPage/ContainerPage.jsx";

import OpenFieldSupply, {
  OPEN_FIELD_START_PAGE,
  OPEN_FIELD_END_PAGE,
} from "./components/OpenFieldSupply/OpenFieldSupply.jsx";

// ====================================
// LAST PAGE
// ====================================

const LAST_PAGE = EQUIPMENT_RECEIPT_PAGE;

function App() {
  // ====================================
  // PAGE STATE
  // ====================================

  const [pageNum, setPageNum] = useState(0);

  const [maxPageReached, setMaxPageReached] =
    useState(0);

  // ====================================
  // INFO PAGE PROGRESS
  // ====================================

  const [seenInfoCards, setSeenInfoCards] =
    useState([]);

  const infoPageCompleted =
    seenInfoCards.length >= 4;

  // ====================================
  // SUPPLY TYPES PROGRESS
  // ====================================

  const [
    completedSupplySteps,
    setCompletedSupplySteps,
  ] = useState([]);

  // ====================================
  // NAVBAR TOPICS
  // ====================================

  const TOPICS = [
    {
      page: 2,
      title: "עקרונות ומטרות אחסנה",
    },
    {
      page: 3,
      title: "סידור המחסן ושמירה על כשירות האפסניה",
    },
    {
      page: 4,
      title: "עקרונות ומטרות אחסנה",
    },
    {
      page: 5,
      title: "אחסנת אפסניה במכולות",
    },
    {
      page: 6,
      title: "עזרי שליטה במחסן",
    },
    {
      page: 7,
      title: "הוראות בטיחות במחסן",
    },
    {
      page: 8,
      title: "אחסנת אפסניה בשטח פתוח",
    },
  ];

  // ====================================
  // NEXT PAGE
  // ====================================

  const toNextPage = () => {
    setPageNum((prev) => {

      // עמוד 2:
      // חובה לחשוף את כל הכרטיסיות
      if (
        prev === 2 &&
        !infoPageCompleted
      ) {
        return prev;
      }

      // עמודים 9-17:
      // חובה לפתוח את הקופסה הפעילה
      if (
        prev >= 9 &&
        prev <= 17 &&
        !completedSupplySteps.includes(prev - 9)
      ) {
        return prev;
      }

      // עמוד 18:
      // מעבר דרך FirstPractice
      if (prev === 18) {
        return prev;
      }

      // עמוד 35 הוא כרגע האחרון
      return Math.min(
        prev + 1,
        LAST_PAGE
      );

    });
  };

  // ====================================
  // PREVIOUS PAGE
  // ====================================

  const toPrevPage = () => {
    setPageNum((prev) =>
      Math.max(0, prev - 1)
    );
  };

  // ====================================
  // MAX PAGE REACHED
  // ====================================

  useEffect(() => {
    setMaxPageReached((prev) =>
      Math.max(prev, pageNum)
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

    setPageNum(targetPage);
  };

  // ====================================
  // INFO CARD SEEN
  // ====================================

  const handleInfoCardSeen = (cardId) => {
    setSeenInfoCards((prev) => {
      if (prev.includes(cardId)) {
        return prev;
      }

      return [...prev, cardId];
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

      setCompletedSupplySteps((prev) => {
        if (prev.includes(stepIndex)) {
          return prev;
        }

        return [...prev, stepIndex];
      });
    },
    [pageNum]
  );

  // ====================================
  // NEXT ARROW AVAILABILITY
  // ====================================

  const canGoNext =
    pageNum < LAST_PAGE &&
    pageNum !== 18 &&
    (pageNum !== 2 || infoPageCompleted) &&
    (
      pageNum < 9 ||
      pageNum > 17 ||
      completedSupplySteps.includes(
        pageNum - 9
      )
    );

  // ====================================
  // RENDER
  // ====================================

  return (
    <>

      {/* ====================================
          GLOBAL BACKGROUND
      ==================================== */}

      <div
        className={`page-background ${
          pageNum === 1 ? "blurred" : ""
        }`}
      />

      {/* ====================================
          GLOBAL LOGOS
      ==================================== */}

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

      {/* ====================================
          PAGE 0 - OPENING
      ==================================== */}

      {pageNum === 0 && (
        <FirstPage
          toNextPage={toNextPage}
        />
      )}

      {/* ====================================
          PAGE 1 - INSTRUCTIONS
      ==================================== */}

      {pageNum === 1 && (
        <img
          className="Instructions-img"
          src={InstructionsImg}
          alt="הוראות הלומדה"
          draggable="false"
        />
      )}

      {/* ====================================
          NAVIGATION ARROWS
      ==================================== */}

      {pageNum >= 1 && pageNum !== 18 && (
        <NavigationArrows
          onNext={toNextPage}
          onBack={toPrevPage}
          canGoNext={canGoNext}
          canGoBack={pageNum > 0}
        />
      )}

      {/* ====================================
          NAVBAR
          PAGES 2-8 AND 18-35
      ==================================== */}

      {(
        (pageNum >= 2 && pageNum <= 8) ||
        (
          pageNum >= 18 &&
          pageNum <= LAST_PAGE
        )
      ) && (
        <Navbar
          topics={TOPICS}
          currentPage={pageNum}
          maxPageReached={maxPageReached}
          onNavigate={goToTopic}
        />
      )}

      {/* ====================================
          INFO PAGE
          PAGES 2-8 + PAGE 35
      ==================================== */}

      {(
        (pageNum >= 2 && pageNum <= 8) ||
        pageNum === EQUIPMENT_RECEIPT_PAGE
      ) && (
        <InfoPage
          pageNum={pageNum}
          onCardSeen={handleInfoCardSeen}
          seenCardIds={seenInfoCards}
        />
      )}

      {/* ====================================
          SUPPLY TYPES - PAGES 9-17
      ==================================== */}

      {pageNum >= 9 && pageNum <= 17 && (
        <SupplyTypes
          step={pageNum - 9}
          onStepComplete={
            handleSupplyStepComplete
          }
        />
      )}

      {/* ====================================
          FIRST PRACTICE - PAGE 18
      ==================================== */}

      {pageNum === 18 && (
        <FirstPractice

          onBackToMaterial={() => {
            setPageNum(17);
          }}

          onSkipPractice={() => {
            setPageNum(19);
          }}

        />
      )}

      {/* ====================================
          CONTAINER PAGE - PAGES 19-20
      ==================================== */}

      {pageNum >= 19 && pageNum <= 20 && (
        <ContainerPage
          pageNum={pageNum - 1}
        />
      )}

      {/* ====================================
          OPEN FIELD SUPPLY - PAGES 21-34
      ==================================== */}

      {pageNum >= OPEN_FIELD_START_PAGE &&
        pageNum <= OPEN_FIELD_END_PAGE && (
          <OpenFieldSupply
            pageNum={pageNum}
          />
        )}

    </>
  );
}

export default App;
