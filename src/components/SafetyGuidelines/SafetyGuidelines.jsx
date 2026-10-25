
import React, { useEffect, useRef, useState } from "react";

import notebook from "../../../media/SafetyGuidelines/notebook.svg";
import largeBox from "../../../media/InfoPage/large-box.svg";
import sideZigi from "../../../media/InfoPage/side-zigi.svg";
import officeVideo from "../../../media/SafetyGuidelines/the-office.mp4";
import checkBox from "../../../media/SafetyGuidelines/check-box.svg";
import square from "../../../media/SafetyGuidelines/square.svg";

import noBullets from "../../../media/SafetyGuidelines/no-bullets.svg";
import fireExtinguisher from "../../../media/SafetyGuidelines/fire-extinguisher.png";
import firstAid from "../../../media/SafetyGuidelines/first-aid.svg";
import fireHazard from "../../../media/SafetyGuidelines/fire-hazard.svg";

import noSmoking from "../../../media/SafetyGuidelines/no-smoking.svg";
import supplyTypes from "../../../media/SafetyGuidelines/supply-types.svg";
import nearLight from "../../../media/SafetyGuidelines/near-light.svg";
import onShelves from "../../../media/SafetyGuidelines/on-shelves.svg";

import "./SafetyGuidelines.css";

// ====================================
// PAGE CONFIGURATION
// ====================================

export const SAFETY_GUIDELINES_PAGE = 38;

// 2 opening screens + the same original 8 safety guidelines.
export const SAFETY_GUIDELINES_INTRO_STEPS = 2;
export const SAFETY_GUIDELINES_TOTAL_STEPS = 10;

export const SAFETY_GUIDELINES_GROUP_SIZE = 4;

// ====================================
// SAFETY GUIDELINES DATA
//
// 8 הוראות בשתי קבוצות.
//
// ניתן לשנות לכל הוראה:
// text - טקסט
// image - תמונה
// imageWidth - רוחב התמונה
// imageHeight - גובה התמונה
// ====================================

const SAFETY_ITEMS = [
    // ====================================
    // GROUP 1 - FIRST FOUR GUIDELINES
    // ====================================

    {
        id: "no-bullets",
        text:
            "אי הימצאות תחמושת במחסן היחידה (למעט מחסן תחמושת)",
        image: noBullets,
        imageWidth: "37rem",
        imageHeight: "29rem",
    },
    {
        id: "fire-extinguisher",
        text:
            "הימצאות מטפי כיבוי אש תקינים בקרבת המחסן",
        image: fireExtinguisher,
        imageWidth: "35rem",
        imageHeight: "29rem",
    },
    {
        id: "first-aid",
        text:
            "הימצאות ערכת עזרה ראשונה במחסן (רק ב0דנאות)",
        image: firstAid,
        imageWidth: "35rem",
        imageHeight: "29rem",
    },
    {
        id: "fire-hazard",
        text:
            "סילוק חומרי בערה מתוך המחסן וסביבתו כגון: צבע, סולר, נפט",
        image: fireHazard,
        imageWidth: "30rem",
        imageHeight: "24rem",
    },

    // ====================================
    // GROUP 2 - LAST FOUR GUIDELINES
    // ====================================

    {
        id: "no-smoking",
        text:
            'יש למקם שלטי "אסור לעשן" בתוך המחסן ומחוצה לו',
        image: noSmoking,
        imageWidth: "35rem",
        imageHeight: "22rem",
    },
    {
        id: "supply-types",
        text:
            "אין לסדר בערימה אחת פריטי אפסניה מסוגים שונים",
        image: supplyTypes,
        imageWidth: "40rem",
        imageHeight: "24rem",
    },
    {
        id: "near-light",
        text:
            "אין לאחסן אפסניה בקרבת מקומות בהם יש חשש לסכנת דליקה (כגון קרבה לתאורת מחסן)",
        image: nearLight,
        imageWidth: "33rem",
        imageHeight: "29rem",
    },
    {
        id: "on-shelves",
        text:
            "האחסנה על גבי מדפים תסודר כך שפריטים בעלי משקל כבד יהיו בקומות התחתונות והקלים יותר בקומות העליונות.",
        image: onShelves,
        imageWidth: "35rem",
        imageHeight: "24rem",
    },
];

// ====================================
// MAIN COMPONENT
//
// currentStep:
// 0 = video, 1 = explanation, 2-9 = original safety guidelines
//
// maxReachedStep:
// השלב הכי מתקדם שכבר נפתח
//
// onStepChange:
// מעבר לשלב שכבר נפתח
// ====================================

function SafetyGuidelines({
    currentStep = 0,
    maxReachedStep = 0,
    onStepChange,
    onVideoComplete,
}) {
    // The video should reset to its preview when returning to this screen.
    const videoRef = useRef(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    useEffect(() => {
        setIsVideoPlaying(false);
    }, [currentStep]);

    const playIntroVideo = () => {
        const video = videoRef.current;
        if (!video) return;
        video.play().catch(() => {
            // Native video controls stay available if playback is blocked.
        });
    };

    // ====================================
    // SAFE VALUES
    // ====================================

    const safeStep = Math.max(
        0,
        Math.min(
            SAFETY_GUIDELINES_TOTAL_STEPS - 1,
            currentStep
        )
    );

    const safeMaxReached = Math.max(
        safeStep,
        Math.min(
            SAFETY_GUIDELINES_TOTAL_STEPS - 1,
            maxReachedStep
        )
    );

    // ====================================
    // CURRENT GROUP
    //
    // 0-3 = חלק ראשון
    // 4-7 = חלק שני
    // ====================================

    // Keep all original guideline indices untouched: 0-7.
    // They now correspond to the global steps 2-9.
    const guidelineStep = Math.max(
        0,
        safeStep - SAFETY_GUIDELINES_INTRO_STEPS
    );

    const currentGroup = Math.floor(
        guidelineStep / SAFETY_GUIDELINES_GROUP_SIZE
    );

    const groupStart =
        currentGroup * SAFETY_GUIDELINES_GROUP_SIZE;

    const visibleItems = SAFETY_ITEMS.slice(
        groupStart,
        groupStart + SAFETY_GUIDELINES_GROUP_SIZE
    );

    // ====================================
    // ACTIVE IMAGE
    // ====================================

    const activeItem = SAFETY_ITEMS[guidelineStep];

    // ====================================
    // CLICK ON VISITED GUIDELINE
    //
    // מותר לחזור רק למשפט שכבר נפתח.
    // אין אפשרות לדלג קדימה.
    // ====================================

    const handleItemClick = (globalIndex) => {
        const targetStep = globalIndex + SAFETY_GUIDELINES_INTRO_STEPS;

        if (targetStep > safeMaxReached || targetStep === safeStep) {
            return;
        }

        onStepChange?.(targetStep);
    };

    // ====================================
    // INTRO SCREENS: VIDEO, THEN EXPLANATION
    // ====================================

    if (safeStep < SAFETY_GUIDELINES_INTRO_STEPS) {
        return (
            <section
                className="safety-guidelines safety-guidelines-intro"
                dir="rtl"
                aria-label={
                    safeStep === 0
                        ? "סרטון פתיחה להוראות הבטיחות"
                        : "הקדמה להוראות הבטיחות"
                }
            >
                <div className="safety-guidelines-intro-box">
                    {/* Same original large-box.svg used by InfoPage. */}
                    <img
                        className="safety-guidelines-intro-box-image"
                        src={largeBox}
                        alt=""
                        draggable="false"
                    />

                    {safeStep === 0 ? (
                        <>
                            <h2 className="safety-guidelines-intro-title">
                                מה כבר יכול להשתבש במחסן?
                            </h2>

                            <div className="safety-guidelines-video-wrap">
                                <video
                                    ref={videoRef}
                                    className="safety-guidelines-video"
                                    src={officeVideo}
                                    controls
                                    playsInline
                                    preload="metadata"
                                    aria-label="קטע מסדרת המשרד עם מלגזה במחסן"
                                    onPlay={() => setIsVideoPlaying(true)}
                                    onPause={() => setIsVideoPlaying(false)}
                                    onEnded={() => {
                                        setIsVideoPlaying(false);
                                        onVideoComplete?.();
                                    }}
                                />

                                {!isVideoPlaying && (
                                    <button
                                        type="button"
                                        className="safety-guidelines-video-play"
                                        onClick={playIntroVideo}
                                        aria-label="הפעלת הסרטון"
                                    >
                                        <span aria-hidden="true" />
                                    </button>
                                )}
                            </div>
                        </>
                        ) : (
                            <div className="safety-guidelines-intro-text">
                                <p>
                                    במחסן של מייקל סקוט דחיפה אחת
                                    <br />
                                    מהמלגזה הספיקה כדי להפיל את כל
                                    <br />
                                    העסק. ברור, בכל זאת המלגזה שלו היא לא
                                    <br />
                                    זיגי. אצלנו נעדיף שהמחסן יישאר עומד,
                                    <br />
                                    וגם האנשים שבו.
                                </p>
                                <p>
                                    כדי למנוע תקלות שעלולות לפגוע באדם או
                                    <br />
                                    ברכוש, קיימות מספר הוראות בטיחות
                                    <br />
                                    שחשוב שנכיר <span aria-hidden="true">←</span>
                                </p>
                            </div>
                        )}
                </div>

                {/* Zigi beside the large box on both introduction screens. */}
                <img
                    className="safety-guidelines-intro-zigi"
                    src={sideZigi}
                    alt="זיגי המלגזה"
                    draggable="false"
                />
            </section>
        );
    }

    // ====================================
    // RENDER: ORIGINAL NOTEBOOK
    // ====================================

    return (
        <section
            className="safety-guidelines"
            dir="rtl"
            aria-label="הוראות בטיחות במחסן"
        >
            {/* ====================================
          NOTEBOOK
      ==================================== */}

            <div className="safety-guidelines-notebook">
                <img
                    className="safety-guidelines-notebook-image"
                    src={notebook}
                    alt=""
                    draggable="false"
                />

                {/* ====================================
            TITLE
        ==================================== */}

                <h2 className="safety-guidelines-title">
                    הוראות בטיחות במחסן
                </h2>

                {/* ====================================
            FOUR VISIBLE GUIDELINES
        ==================================== */}

                <div className="safety-guidelines-list">
                    {visibleItems.map((item, index) => {
                        const globalIndex = groupStart + index;

                        const isCurrent =
                            globalIndex === guidelineStep;

                        // נפתח כבר בעבר?
                        const isVisited =
                            globalIndex + SAFETY_GUIDELINES_INTRO_STEPS <= safeMaxReached;

                        // עדיין לא נפתח?
                        const isFuture = !isVisited;

                        const stateClass = isCurrent
                            ? "is-current"
                            : isFuture
                                ? "is-future"
                                : "is-past";

                        // ====================================
                        // CHECKBOX ICON
                        //
                        // visited/current -> check-box.svg
                        // future -> square.svg
                        // ====================================

                        const checkboxImage = isVisited
                            ? checkBox
                            : square;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                className={[
                                    "safety-guidelines-item",
                                    stateClass,
                                ].join(" ")}
                                style={{
                                    "--safety-row-index": index,
                                }}
                                onClick={() =>
                                    handleItemClick(globalIndex)
                                }
                                disabled={!isVisited || isCurrent}
                                aria-current={
                                    isCurrent ? "step" : undefined
                                }
                                aria-label={
                                    `${globalIndex + 1}. ${item.text}`
                                }
                            >
                                {/* ====================================
                    CHECKBOX
                ==================================== */}

                                <img
                                    className="safety-guidelines-checkbox"
                                    src={checkboxImage}
                                    alt=""
                                    draggable="false"
                                />

                                {/* ====================================
                    TEXT
                ==================================== */}

                                <span className="safety-guidelines-item-text">
                                    {item.text}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* ====================================
            ACTIVE ILLUSTRATION
        ==================================== */}

                <div
                    className={`safety-guidelines-illustration-area ${currentGroup === 1 ? "is-second-group" : ""
                        }`}
                >
                    <img
                        key={activeItem.id}
                        className="safety-guidelines-illustration"
                        src={activeItem.image}
                        alt={activeItem.text}
                        draggable="false"
                        style={{
                            "--safety-image-width":
                                activeItem.imageWidth,
                            "--safety-image-height":
                                activeItem.imageHeight,
                        }}
                    />
                </div>
            </div>

            {/* ====================================
          SCREEN READER STATUS
      ==================================== */}

            <p
                className="safety-guidelines-screen-reader"
                role="status"
                aria-live="polite"
            >
                הוראה {guidelineStep + 1} מתוך{" "}
                {SAFETY_ITEMS.length}.
                {activeItem.text}
            </p>
        </section>
    );
}

export default SafetyGuidelines;
