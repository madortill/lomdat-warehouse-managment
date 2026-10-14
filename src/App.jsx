import React from "react";
import { useState, useEffect, useCallback } from "react";
import tillLogo from "../media/Till-logo.png"
import bahad6Logo from "../media/bahad-6-logo.png"
import InstructionsImg from "../media/Instructions.svg"

import "./App.css"
import Navbar from "./components/Navbar/Navbar.jsx";
import FirstPage from "./components/FirstPage/FirstPage.jsx";
import NavigationArrows from "./components/NavigationArrows/NavigationArrows.jsx";
import InfoPage from "./components/InfoPage/InfoPage.jsx";
import SupplyTypes from "./components/SupplyTypes/SupplyTypes.jsx";

function App() {
  const [pageNum, setPageNum] = useState(0);
  const [maxPageReached, setMaxPageReached] = useState(0);
  const [seenInfoCards, setSeenInfoCards] = useState([]);
  const infoPageCompleted = seenInfoCards.length === 4;
  // שלבי SupplyTypes שכבר הושלמו
  const [completedSupplySteps, setCompletedSupplySteps] = useState([]);
  const TOPICS = [
    { page: 2, title: "עקרונות ומטרות אחסנה" },
    { page: 3, title: "סידור המחסן ושמירה על כשירות האפסניה" },
    { page: 4, title: "עקרונות ומטרות אחסנה" },
    { page: 5, title: "אחסנת אפסניה במכולות" },
    { page: 6, title: "עזרי שליטה במחסן" },
    { page: 7, title: "הוראות בטיחות במחסן" },
    { page: 8, title: "אחסנת אפסניה בשטח פתוח" },
  ];

  const toNextPage = () => {
    setPageNum((prev) => {
      // עמוד 2 - חובה לחשוף את כל הכרטיסיות
      if (prev === 2 && !infoPageCompleted) {
        return prev;
      }
      // עמודים 9-17 - חובה לפתוח את הקופסה הפעילה
      if (
        prev >= 9 &&
        prev <= 17 &&
        !completedSupplySteps.includes(prev - 9)
      ) {
        return prev;
      }
      // עמוד 17 הוא האחרון כרגע
      return Math.min(prev + 1, 17);
    });
  };

  const toPrevPage = () => {
    setPageNum(prev => Math.max(0, prev - 1));
  };

  useEffect(() => {
    setMaxPageReached((prev) => Math.max(prev, pageNum));
  }, [pageNum]);


  const goToTopic = (targetPage) => {
    const topicExists = TOPICS.some(
      (topic) => topic.page === targetPage
    );
    if (!topicExists || targetPage > maxPageReached) {
      return;
    }
    setPageNum(targetPage);
  };


  const handleInfoCardSeen = (cardId) => {
    setSeenInfoCards((prev) => {
      if (prev.includes(cardId)) {
        return prev;
      }

      return [...prev, cardId];
    });
  };

  useEffect(() => {
    const preventImageDrag = (event) => {
      if (event.target instanceof HTMLImageElement) {
        event.preventDefault();
      }
    };

    document.addEventListener("dragstart", preventImageDrag);

    return () => {
      document.removeEventListener("dragstart", preventImageDrag);
    };
  }, []);

  // מקבלת עדכון כשהמשתמש פתח את הקופסה הפעילה
  const handleSupplyStepComplete = useCallback((isComplete) => {
    if (!isComplete || pageNum < 9 || pageNum > 17) {
      return;
    }

    const stepIndex = pageNum - 9;

    setCompletedSupplySteps((prev) => {
      if (prev.includes(stepIndex)) {
        return prev;
      }

      return [...prev, stepIndex];
    });
  }, [pageNum]);

  const canGoNext =
    pageNum < 17 &&
    (pageNum !== 2 || infoPageCompleted) &&
    (
      pageNum < 9 ||
      completedSupplySteps.includes(pageNum - 9)
    );

  return (
    <>
      <div className={`page-background ${pageNum === 1 ? "blurred" : ""}`} />
      <img className="till-logo" src={tillLogo} alt="tillLogo" />
      <img className="bahad-logo" src={bahad6Logo} alt="bahad6Logo" />

      {pageNum === 0 && <FirstPage
        toNextPage={toNextPage}
      />}

      {pageNum === 1 &&
        <img className="Instructions-img" src={InstructionsImg} alt="InstructionsImg" />
      }

      {pageNum >= 1 && (
        <NavigationArrows
          onNext={toNextPage}
          onBack={toPrevPage}
          canGoNext={canGoNext}
        />
      )}

      {pageNum >= 2 && pageNum <= 8 && (
        <Navbar
          topics={TOPICS}
          currentPage={pageNum}
          maxPageReached={maxPageReached}
          onNavigate={goToTopic}
        />
      )}

      {pageNum >= 2 && pageNum <= 8 && (
        <InfoPage
          pageNum={pageNum}
          onCardSeen={handleInfoCardSeen}
          seenCardIds={seenInfoCards}
        />
      )}

      {/* מסכי SupplyTypes - עמודים 9 עד 17 */}
      {pageNum >= 9 && pageNum <= 17 && (
        <SupplyTypes
          step={pageNum - 9}
          onStepComplete={handleSupplyStepComplete}
        />
      )}
    </>
  );
}

export default App;
