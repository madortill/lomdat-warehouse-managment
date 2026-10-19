
import React, {
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import "./OpenFieldSupply.css";

import desertBackground from "../../../media/OpenFieldSupply/desert-background.png";
import desertTreeBackground from "../../../media/OpenFieldSupply/desert-tree-background.png";
import openFieldBox from "../../../media/OpenFieldSupply/open-field-box.svg";
import sandHills from "../../../media/OpenFieldSupply/sand-hills.svg";
import heightenedSupply from "../../../media/OpenFieldSupply/hightened-supply.svg";
import wetGround from "../../../media/OpenFieldSupply/wet.svg";
import blueShadow from "../../../media/OpenFieldSupply/blue-shadow.svg";
import sideZigi from "../../../media/InfoPage/side-zigi.svg";

// ====================================
// PAGE RANGE
// ====================================

export const OPEN_FIELD_START_PAGE = 21;
export const OPEN_FIELD_SCREEN_COUNT = 14;
export const OPEN_FIELD_END_PAGE = 34;

// ====================================
// TWO BOX SIZES
// ====================================

const BOX_SIZES = {
  regular: "19.5%",
  wide: "21.5%",
};

// ====================================
// SCREEN CONTENT
// ====================================

const SCREENS = [
  // PAGE 21
  {
    boxSize: "wide",
    fontSize: "2.65rem",
    text: (
      <>
        אחסנת אפסניה תחת כיפת השמיים
        דורשת בחירת שטח נכונה,{" "}
        <strong>הכנת השטח</strong>{" "}
        ונקיטת אמצעים ל
        <strong>הגנת האפסניה.</strong>
      </>
    ),
  },

  // PAGE 22
  {
    boxSize: "regular",
    fontSize: "2.65rem",
    text: (
      <>
        אחסנה מחוץ למבנה מחייבת
        שטח מישורי (ישר)
      </>
    ),
  },

  // PAGE 23
  {
    boxSize: "regular",
    fontSize: "2.65rem",
    text: (
      <>
        אפסניה המאוחסנת בחוץ על גבי
        הקרקע חייבת להיות{" "}
        <strong>מבודדת ומוגבהת.</strong>
      </>
    ),
  },

  // PAGE 24
  {
    boxSize: "wide",
    fontSize: "2.65rem",
    text: (
      <>
        אמצעי בידוד לאפסניה יכולים
        לכלול משטחים, קורות עץ,
        פלטות עץ, משטחי פלסטיק,
        לבנים או אמצעים ייעודיים אחרים.
      </>
    ),
  },

  // PAGE 25
  {
    boxSize: "regular",
    fontSize: "2.65rem",
    text: (
      <>
        יש להציב את אמצעי ההגבהה
        בצורה ישרה, מאוזנת ויציבה.
      </>
    ),
  },

  // PAGE 26 - HEIGHT MEASUREMENT
  {
    boxSize: "regular",
    fontSize: "2.65rem",
    showMeasureArrow: true,
    text: (
      <>
        הערמת האפסניה תעשה לגובה
        של 15–20 ס״מ מעל הקרקע
      </>
    ),
  },

  // PAGE 27
  {
    boxSize: "wide",
    fontSize: "2.65rem",
    text: (
      <>
        נדרש להשתמש בכיסוי על מנת
        להגן על האפסניה מהשפעות
        הסביבה (לחות, גשם, קרני
        שמש ישירות)
      </>
    ),
  },

  // PAGE 28
  {
    boxSize: "regular",
    fontSize: "2.65rem",
    text: (
      <>
        יש לנקות את השטח מעשבייה,
        למניעת הצטברות לחות,
        מזיקים וסכנת שריפה.
      </>
    ),
  },

  // PAGE 29 - TREE INTRO
  {
    text: (
      <>
        במקרה שיש צורך לאחסן אפסניה
        בקרבת עצים, יש להביא בחשבון
        גם את הדברים הבאים:
      </>
    ),
  },

  // PAGE 30 - RAIN
  {
    boxSize: "wide",
    fontSize: "2.65rem",
    text: (
      <>
        בתקופת הגשמים, הלחות היחסית
        תחת העצים גבוהה יותר
        בשטח פתוח
      </>
    ),
  },

  // PAGE 31 - WET GROUND
  {
    boxSize: "wide",
    fontSize: "2.65rem",
    text: (
      <>
        האדמה והאוויר תחת העצים
        או בקרבתם נשארים לחים
        לזמן רב יותר בשטח פתוח
      </>
    ),
  },

  // PAGE 32
  {
    boxSize: "regular",
    fontSize: "2.65rem",
    text: (
      <>
        בנוסף, העצים מפריעים
        לייבוש מהיר של האפסניה
        בשמש
      </>
    ),
  },

  // PAGE 33
  {
    boxSize: "wide",
    fontSize: "2.65rem",
    text: (
      <>
        עלי העצים ומי הגשמים
        יורדים ומתרכזים על כיסוי
        המערומים, דבר העלול לגרום{" "}
        <strong>פטריות, עובש וריקבון.</strong>
      </>
    ),
  },

  // PAGE 34 - SUMMARY
  {
    boxSize: "wide",
    fontSize: "2.55rem",
    lineHeight: "1.28",
    text: (
      <>
        מכאן נסיק שבעת אחסנת
        אפסניה בקרבת עצים, יש
        להביא בחשבון את הלחות
        הגבוהה וקצב הייבוש האיטי,
        ולהקפיד על הגבהתה מהקרקע
        והגנתה מפני רטיבות.
      </>
    ),
  },
];

// ====================================
// RAIN PARTICLES
// ====================================

const RAIN_DROPS = Array.from(
  { length: 85 },
  (_, index) => ({
    left: `${(index * 37.71) % 105}%`,
    top: `${-10 - ((index * 13) % 35)}%`,
    animationDelay:
      `${-((index * 0.37) % 2.7)}s`,
    animationDuration:
      `${1.5 + (index % 7) * 0.17}s`,
    height:
      `${2.5 + (index % 5) * 0.7}rem`,
    opacity:
      0.19 + (index % 4) * 0.075,
  })
);

// ====================================
// COMPONENT
// ====================================

function OpenFieldSupply({ pageNum }) {
  const [earthPhase, setEarthPhase] =
    useState("idle");

  const previousPageRef = useRef(pageNum);

  // ====================================
  // EARTH TRANSITION: PAGE 22 -> 23
  // ====================================

  useLayoutEffect(() => {
    const previousPage =
      previousPageRef.current;

    previousPageRef.current = pageNum;

    const reduceMotion =
      window.matchMedia?.(
        "(prefers-reduced-motion: reduce)"
      )?.matches ?? false;

    if (
      previousPage === 22 &&
      pageNum === 23 &&
      !reduceMotion
    ) {
      setEarthPhase("running");
    } else {
      setEarthPhase("idle");
    }
  }, [pageNum]);

  const handleHillsAnimationEnd = (event) => {
    if (
      event.animationName !==
      "ofs-hills-dissolve"
    ) {
      return;
    }

    if (
      pageNum === 23 &&
      earthPhase === "running"
    ) {
      setEarthPhase("complete");
    }
  };

  // ====================================
  // CURRENT SCREEN
  // ====================================

  const screenIndex =
    pageNum - OPEN_FIELD_START_PAGE;

  const screen = SCREENS[screenIndex];

  if (!screen) return null;

  // ====================================
  // SCREEN CONDITIONS
  // ====================================

  const isTreeSection = screenIndex >= 8;
  const isTreeIntro = screenIndex === 8;
  const isRaining = screenIndex === 9;

  const isEarthRunning =
    pageNum === 23 &&
    earthPhase === "running";

  const isEarthComplete =
    pageNum === 23 &&
    earthPhase === "complete";

  const isEarthSpecial =
    isEarthRunning || isEarthComplete;

  const showHills =
    screenIndex <= 1 || isEarthRunning;

  const showInventory =
    (screenIndex >= 2 && screenIndex <= 5) ||
    isTreeSection;

  const showZigi = !isTreeIntro;
  const showWetGround = screenIndex >= 10;

  // הזוהר פועל רק במסכים 3 ו-4
  const showBlueGlow =
    screenIndex === 2 ||
    screenIndex === 3;

  // חץ הגובה פועל רק במסך 6
  const showMeasureArrow =
    screen.showMeasureArrow === true;

  const boxWidth =
    BOX_SIZES[screen.boxSize] ||
    BOX_SIZES.regular;

  // ====================================
  // RENDER
  // ====================================

  return (
    <section
      className={[
        "open-field-supply",
        isTreeSection ? "is-tree" : "is-desert",
        isRaining ? "is-raining" : "",
        isEarthRunning ? "is-earth-running" : "",
        isEarthComplete ? "is-earth-complete" : "",
      ].filter(Boolean).join(" ")}
      dir="rtl"
      aria-label="אחסנת אפסניה בשטח פתוח"
    >

      {/* ====================================
          BACKGROUNDS
      ==================================== */}

      <img
        className={`open-field-supply-background ${
          !isTreeSection ? "is-visible" : ""
        }`}
        src={desertBackground}
        alt=""
        draggable="false"
      />

      <img
        className={`open-field-supply-background ${
          isTreeSection ? "is-visible" : ""
        }`}
        src={desertTreeBackground}
        alt=""
        draggable="false"
      />

      {/* ====================================
          SAND HILLS
      ==================================== */}

      <img
        className={`open-field-sand-hills ${
          showHills ? "is-visible" : ""
        }`}
        src={sandHills}
        alt=""
        draggable="false"
        onAnimationEnd={handleHillsAnimationEnd}
      />

      {/* ====================================
          WET GROUND
      ==================================== */}

      <img
        className={`open-field-wet ${
          showWetGround ? "is-visible" : ""
        }`}
        src={wetGround}
        alt=""
        draggable="false"
      />

      {/* ====================================
          HEIGHTENED SUPPLY + BLUE GLOW
      ==================================== */}

      <div
        className={`open-field-inventory ${
          showInventory ? "is-visible" : ""
        }`}
      >
        <img
          className="open-field-inventory-art"
          src={heightenedSupply}
          alt=""
          draggable="false"
        />

        <img
          className={`open-field-blue-shadow ${
            showBlueGlow ? "is-glowing" : ""
          }`}
          src={blueShadow}
          alt=""
          draggable="false"
        />
      </div>

      {/* ====================================
          HEIGHT MEASUREMENT ARROW
          PAGE 26 ONLY
      ==================================== */}

      {showMeasureArrow && (
        <div
          className="open-field-measure"
          aria-label="גובה הגבהה של 15 עד 20 סנטימטרים"
        >
          <div className="open-field-measure-arrow">
            <span className="open-field-measure-arrow-top" />
            <span className="open-field-measure-line" />
            <span className="open-field-measure-arrow-bottom" />
          </div>

          <span className="open-field-measure-label">
            15–20 ס״מ
          </span>
        </div>
      )}

      {/* ====================================
          RAIN DIMMING
      ==================================== */}

      <div
        className={`open-field-rain-dim ${
          isRaining ? "is-active" : ""
        }`}
        aria-hidden="true"
      />

      {/* ====================================
          ZIGI
      ==================================== */}

      <img
        className={`open-field-zigi ${
          showZigi ? "is-visible" : ""
        }`}
        src={sideZigi}
        alt=""
        draggable="false"
      />

      {/* ====================================
          TEXT BOX
      ==================================== */}

      <div
        className={`open-field-box ${
          isTreeIntro ? "is-hidden" : ""
        }`}
        style={{
          "--box-width": boxWidth,
          "--box-font":
            screen.fontSize || "2.2rem",
          "--box-line-height":
            screen.lineHeight || "1.42",
        }}
      >
        <img
          className="open-field-box-art"
          src={openFieldBox}
          alt=""
          draggable="false"
        />

        {!isTreeIntro && (
          <div className="open-field-box-content">

            {isEarthRunning && (
              <p
                className="open-field-box-copy is-earth-old"
                style={{
                  fontSize: SCREENS[1].fontSize,
                }}
              >
                {SCREENS[1].text}
              </p>
            )}

            <p
              key={screenIndex}
              className={`open-field-box-copy ${
                isEarthSpecial
                  ? "is-earth-new"
                  : ""
              }`}
            >
              {screen.text}
            </p>

          </div>
        )}
      </div>

      {/* ====================================
          TREE INTRO
      ==================================== */}

      {isTreeIntro && (
        <p className="open-field-tree-intro">
          {screen.text}
        </p>
      )}

      {/* ====================================
          RAIN
      ==================================== */}

      <div
        className={`open-field-rain ${
          isRaining ? "is-active" : ""
        }`}
        aria-hidden="true"
      >
        {RAIN_DROPS.map((drop, index) => (
          <span
            key={index}
            className="open-field-raindrop"
            style={drop}
          />
        ))}
      </div>

      {/* ====================================
          TITLES
      ==================================== */}

      <h2 className="open-field-title">
        אחסנת אפסניה בשטח פתוח
      </h2>

      <h3
        className={`open-field-subtitle ${
          isTreeSection && !isTreeIntro
            ? "is-visible"
            : ""
        }`}
      >
        אחסון מתחת לעצים
      </h3>

    </section>
  );
}

export default OpenFieldSupply;
