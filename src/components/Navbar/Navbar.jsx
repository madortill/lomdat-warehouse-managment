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
  const [isOpen, setIsOpen] = useState(false);
  const navbarRef = useRef(null);

  // סגירה בלחיצה מחוץ לנאבבר או במקש Escape
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

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleTopicClick = (topicPage) => {
    // מניעת מעבר לנושאים שטרם הגענו אליהם
    if (topicPage > maxPageReached) return;

    onNavigate(topicPage);
    setIsOpen(false);
  };

  return (
    <nav
      ref={navbarRef}
      className={`learning-navbar ${isOpen ? "is-open" : ""}`}
      aria-label="נושאי הלומדה"
      dir="rtl"
    >
      {/* הנאבבר הסגור */}
      <button
        type="button"
        className="learning-navbar-trigger"
        onClick={() => setIsOpen(true)}
        aria-label="פתיחת נושאי הלומדה"
        aria-expanded={isOpen}
        aria-controls="learning-navbar-panel"
        disabled={isOpen}
      >
        <img src={navbarClosed} alt="" draggable="false" />
      </button>

      {/* הנאבבר הפתוח */}
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

        <button
          type="button"
          className="learning-navbar-close"
          onClick={() => setIsOpen(false)}
          aria-label="סגירת נושאי הלומדה"
          disabled={!isOpen}
        >
          ×
        </button>

        <ol className="learning-navbar-topics">
          {topics.map((topic) => {
            const isCurrent = topic.page === currentPage;

            const isVisited =
              topic.page <= maxPageReached && !isCurrent;

            const isLocked = topic.page > maxPageReached;

            return (
              <li key={topic.page}>
                <button
                  type="button"
                  className={[
                    "learning-navbar-item",
                    isCurrent ? "is-current" : "",
                    isVisited ? "is-visited" : "",
                    isLocked ? "is-locked" : "",
                  ].join(" ")}
                  onClick={() => handleTopicClick(topic.page)}
                  disabled={!isOpen || isLocked}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  <span
                    className="learning-navbar-check"
                    aria-hidden="true"
                  >
                    {isVisited && (
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
