import React from "react";
import { useState, useEffect } from "react";
import tillLogo from "../media/Till-logo.png"
import bahad6Logo from "../media/bahad-6-logo.png"
import InstructionsImg from "../media/Instructions.svg"

import "./App.css"
import Navbar from "./components/Navbar/Navbar.jsx";
import FirstPage from "./components/FirstPage/FirstPage.jsx";
import NavigationArrows from "./components/NavigationArrows/NavigationArrows.jsx";
import InfoPage from "./components/InfoPage/InfoPage.jsx";

function App() {
  const [pageNum, setPageNum] = useState(0);
  const [maxPageReached, setMaxPageReached] = useState(0);
  const [seenInfoCards, setSeenInfoCards] = useState([]);
  const infoPageCompleted = seenInfoCards.length === 4;
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

    // אי אפשר לעבור את מסך הכרטיסיות
    // לפני שכל ארבע הכרטיסיות נחשפו
    if (prev === 2 && !infoPageCompleted) {
      return prev;
    }

    // כרגע העמוד האחרון שבנינו הוא 7
    return Math.min(prev + 1, 7);
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

      {pageNum >= 2 && pageNum <= 7 && (
  <InfoPage
    pageNum={pageNum}
    onCardSeen={handleInfoCardSeen}
    seenCardIds={seenInfoCards}
  />
)}
    </>
  );
}

export default App;
