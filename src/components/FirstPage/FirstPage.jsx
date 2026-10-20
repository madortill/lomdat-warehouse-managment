
import React, { useEffect, useRef, useState } from "react";

import zigiFirst from "../../../media/zigi-first.svg";
import startBox from "../../../media/start-button.svg";
import endBox from "../../../media/end-button.svg";
import about from "../../../media/about.svg";
import character from "../../../media/character.svg";

import "./FirstPage.css";

export const END_PAGE = 39;

function FirstPage({
  toNextPage,
  onRestart,
  variant = "start",
}) {
  const isEnd = variant === "end";

  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const aboutRef = useRef(null);

  // סגירה בלחיצה מחוץ לכרטיסייה או באמצעות ESC
  useEffect(() => {
    if (!isAboutOpen) return;

    const handleOutsideClick = (event) => {
      if (
        aboutRef.current &&
        !aboutRef.current.contains(event.target)
      ) {
        setIsAboutOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsAboutOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleOutsideClick
      );
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isAboutOpen]);

  return (
    <div
      className={`app first-page-screen ${
        isEnd ? "first-page-end" : "first-page-start"
      }`}
      dir="rtl"
    >
      {/* ====================================
          ABOUT BUTTON + DROPDOWN
      ==================================== */}

      <div
        className="about-button first-page-about-anchor"
        ref={aboutRef}
      >
        <button
          type="button"
          className="first-page-about-trigger"
          onClick={() => setIsAboutOpen((prev) => !prev)}
          aria-label="מידע על הלומדה"
          aria-expanded={isAboutOpen}
          aria-controls="first-page-about-panel"
        >
          <img
            src={about}
            className="about-button-image"
            alt=""
            draggable="false"
          />
        </button>

        {isAboutOpen && (
          <div
            id="first-page-about-panel"
            className="first-page-about-modal"
            role="dialog"
            aria-labelledby="first-page-about-title"
          >
            <button
              type="button"
              className="first-page-about-close"
              onClick={() => setIsAboutOpen(false)}
              aria-label="סגירת חלונית אודות"
            >
              ×
            </button>

            <h2
              id="first-page-about-title"
              className="about-main-title"
            >
              מפתחת ראשית:
            </h2>

            <img
              className="about-character"
              src={character}
              alt="דמות מאוירת"
              draggable="false"
            />

            <p className="about-developer-name">
             טוראי גל גבעון 
            </p>

            <h3 className="about-graphics-title">
              גרפיקה:
            </h3>

            <p className="about-graphics-name">
             טוראי גל גבעון
            </p>

            <h3 className="about-experts-title">
              מומחי תוכן:
            </h3>

            <p className="about-experts-name">
             סמ״ר איתמר חלילי
            </p>

            <h3 className="about-commander-title">
              רמ״ד טי״ל:
            </h3>

            <p className="about-commander-name">
             סמ״ר קטיה מדבדב
            </p>

            <h3 className="about-version-title">
              גרסה:
            </h3>

            <p className="about-version-date">
              אוקטובר 2026
            </p>
          </div>
        )}
      </div>

      {/* ====================================
          START / END BUTTON
      ==================================== */}

      {isEnd ? (
        <button
          type="button"
          className="start-button-first-page"
          onClick={onRestart}
          aria-label="חזרה לתחילת הלומדה"
        >
          <img
            className="first-page-end-button-image"
            src={endBox}
            alt=""
            draggable="false"
          />
        </button>
      ) : (
        <img
          className="start-button-first-page"
          onClick={toNextPage}
          src={startBox}
          alt="התחלת הלומדה"
          draggable="false"
        />
      )}

      {/* ====================================
          ZIGI
      ==================================== */}

      <img
        className="zigi-first-page"
        src={zigiFirst}
        alt="זיגי המלגזה"
        draggable="false"
      />

      {/* ====================================
          TITLES
      ==================================== */}

      <div className="titles-div">
        {isEnd ? (
          <>
            <h3 className="first-page-end-welcome">
              כל הכבוד!
            </h3>

            <h1 className="first-page-end-title">
              סיימתם את לומדת ניהול מחסן
            </h1>
          </>
        ) : (
          <>
            <h3 className="first-page-welcome">
              ברוכים הבאים ללומדת
            </h3>

            <h1 className="first-page-title">
              ניהול מחסן
            </h1>
          </>
        )}
      </div>
    </div>
  );
}

export default FirstPage;
