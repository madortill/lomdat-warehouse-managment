
import { useEffect, useRef, useState } from "react";

import navbarClosed from "../../../media/Navbar/navbar-closed.svg";
import navbarOpenBase from "../../../media/Navbar/navbar-open-base.svg";

import "./Navbar.css";

function Navbar({
  topics,
  currentPage,
  maxPageReached,
  onNavigate,
}) {
  
const isInstructionsPage = currentPage === 1;

const [isOpen, setIsOpen] = useState(isInstructionsPage);

useEffect(() => {
  setIsOpen(isInstructionsPage);
}, [isInstructionsPage]);

  const navbarRef = useRef(null);

  // ====================================
  // FIND CURRENT TOPIC
  //
  // הנושא הנוכחי נקבע לפי טווח
  // העמודים שלו, ולא רק לפי עמוד
  // ההתחלה.
  // ====================================

  const currentTopicIndex = topics.reduce(
    (activeIndex, topic, index) => {
      if (currentPage >= topic.page) {
        return index;
      }

      return activeIndex;
    },
    -1
  );

  // ====================================
  // CLOSE NAVBAR
  //
  // לחיצה מחוץ ללוח או Escape
  // סוגרת אותו.
  // ====================================

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "pointerdown",
      handleOutsideClick
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleOutsideClick
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [isOpen]);

  // ====================================
  // NAVIGATE TO TOPIC
  //
  // אפשר להיכנס רק לנושא
  // שכבר נפתח במהלך הלומדה.
  // ====================================

  const handleTopicClick = (topicPage) => {
    if (topicPage > maxPageReached) {
      return;
    }

    onNavigate?.(topicPage);
    setIsOpen(false);
  };

  // ====================================
  // RENDER
  // ====================================

  return (
    <nav
      ref={navbarRef}
      className={`learning-navbar ${
        isOpen ? "is-open" : ""
      }`}
      aria-label="נושאי הלומדה"
      dir="rtl"
    >
      {/* ====================================
          CLOSED NAVBAR
      ==================================== */}

      <button
        type="button"
        className="learning-navbar-trigger"
        onClick={() => setIsOpen(true)}
        aria-label="פתיחת נושאי הלומדה"
        aria-expanded={isOpen}
        aria-controls="learning-navbar-panel"
        disabled={isOpen}
      >
        <img
          src={navbarClosed}
          alt=""
          draggable="false"
        />
      </button>

      {/* ====================================
          OPEN NAVBAR
      ==================================== */}

      <div
        id="learning-navbar-panel"
        className="learning-navbar-expanded"
        aria-hidden={!isOpen}
      >
        <img
          className="learning-navbar-base"
          src={navbarOpenBase}
          alt=""
          draggable="false"
        />

        {/* ====================================
            CLOSE BUTTON
        ==================================== */}

        <button
          type="button"
          className="learning-navbar-close"
          onClick={() => setIsOpen(false)}
          aria-label="סגירת נושאי הלומדה"
          disabled={!isOpen}
        >
          ×
        </button>

        {/* ====================================
            TOPICS LIST
        ==================================== */}

        <ol className="learning-navbar-topics">
          {topics.map((topic, index) => {
            // ====================================
            // CURRENT TOPIC
            //
            // הנושא שבו אנחנו נמצאים כרגע.
            // ====================================

            const isCurrent =
              index === currentTopicIndex;

            // ====================================
            // LOCKED TOPIC
            //
            // נושא שעוד לא הגענו אליו.
            // ====================================

            const isLocked =
              topic.page > maxPageReached;

            // ====================================
            // COMPLETED TOPIC
            //
            // נושא נחשב כמושלם כאשר
            // הגענו לנושא הבא.
            //
            // בנושא האחרון:
            // ההשלמה היא כשהגענו
            // לעמוד שאחריו (מסך הסיום).
            //
            // חשוב:
            // הווי נשאר גם כשחוזרים
            // לנושא שכבר הושלם.
            // ====================================

            const nextTopic = topics[index + 1];

            const isCompleted = nextTopic
              ? maxPageReached >= nextTopic.page
              : maxPageReached > topic.page;

            // ====================================
            // VISITED TOPIC
            //
            // נושא שכבר נפתח,
            // אבל אינו הנושא הנוכחי.
            // ====================================

            const isVisited =
              !isLocked && !isCurrent;

            return (
              <li key={topic.page}>
                <button
                  type="button"
                  className={[
                    "learning-navbar-item",
                    isCurrent ? "is-current" : "",
                    isVisited ? "is-visited" : "",
                    isCompleted ? "is-completed" : "",
                    isLocked ? "is-locked" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() =>
                    handleTopicClick(topic.page)
                  }
                  disabled={!isOpen || isLocked}
                  aria-current={
                    isCurrent ? "page" : undefined
                  }
                >
                  {/* ====================================
                      CHECKBOX
                  ==================================== */}

                  <span
                    className="learning-navbar-check"
                    aria-hidden="true"
                  >
                    {isCompleted && (
                      <svg
                        viewBox="0 0 40 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 20 L15 30 L35 7"
                          stroke="#27B446"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>

                  {/* ====================================
                      TOPIC TITLE
                  ==================================== */}

                  <span className="learning-navbar-label">
                    {topic.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

export default Navbar;
