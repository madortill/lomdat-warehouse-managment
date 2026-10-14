
import { useEffect, useMemo, useState } from "react";
import supplyTypesData from "../../../data/SupplyTypesData.json";

import pressureBox from "../../../media/SupplyTypes/pressure-box.png";
import heatBox from "../../../media/SupplyTypes/heat-box.png";
import lightBox from "../../../media/SupplyTypes/light-box.png";
import filtrationBox from "../../../media/SupplyTypes/filtration-box.png";
import toxicBox from "../../../media/SupplyTypes/toxic-box.png";
import pestsBox from "../../../media/SupplyTypes/pests-box.png";
import safetyBox from "../../../media/SupplyTypes/safety-box.png";
import moveBox from "../../../media/SupplyTypes/move-box.png";
import sixSupply from "../../../media/SupplyTypes/six-supply.svg";

import largeArrow from "../../../media/SupplyTypes/large-arrow.svg";
import smallArrow from "../../../media/SupplyTypes/small-arrow.svg";

import "./SupplyTypes.css";

// ====================================
// תמונות הקופסאות
// ====================================

const IMAGES = {
  pressure: pressureBox,
  heat: heatBox,
  light: lightBox,
  filtration: filtrationBox,
  toxic: toxicBox,
  pests: pestsBox,
  safety: safetyBox,
  move: moveBox,
  stack: sixSupply,
};

// ====================================
// מיקומי הקופסאות ובועות ההסבר
// כל המספרים באחוזים מתוך מסך הלומדה
//
// box:
// left - מיקום אופקי
// top - מיקום אנכי
// width - רוחב הקופסה
//
// bubble:
// left - מיקום אופקי
// top - מיקום אנכי
// maxWidth - רוחב מרבי של בועת ההסבר
// side - האם חוד הבועה מופיע בצד
// ====================================

const PLACEMENTS = {
  pressure: {
    box: {
      left: 45.0,
      top: 68.5,
      width: 13.0,
    },
    bubble: {
      left: 36.0,
      top: 87.5,
      maxWidth: 43.0,
    },
  },

  heat: {
    box: {
      left: 62.5,
      top: 23.2,
      width: 13.0,
    },
    bubble: {
      left: 47.0,
      top: 41.7,
      maxWidth: 44.0,
    },
  },

  light: {
    box: {
      left: 81.0,
      top: 43.5,
      width: 13.0,
    },
    bubble: {
      left: 44.0,
      top: 47.3,
      maxWidth: 36.0,
      side: true,
    },
  },

  filtration: {
    box: {
      left: 26.3,
      top: 44.1,
      width: 13.0,
    },
    bubble: {
      left: 11.0,
      top: 62.5,
      maxWidth: 43.0,
    },
  },

  toxic: {
    box: {
      left: 26.3,
      top: 23.6,
      width: 13.0,
    },
    bubble: {
      left: 10.5,
      top: 41.7,
      maxWidth: 44.0,
    },
  },

  pests: {
    box: {
      left: 62.5,
      top: 44.1,
      width: 13.0,
    },
    bubble: {
      left: 44.8,
      top: 62.5,
      maxWidth: 48.0,
    },
  },

  safety: {
    box: {
      left: 62.5,
      top: 69.3,
      width: 13.0,
    },
    bubble: {
      left: 52.0,
      top: 87.8,
      maxWidth: 38.0,
    },
  },

  move: {
    box: {
      left: 26.3,
      top: 68.5,
      width: 13.0,
    },
    bubble: {
      left: 40.0,
      top: 72.5,
      maxWidth: 45.0,
      sideLeft: true,
    },
  },

  stack: {
    box: {
      left: 52,
      top: 55.3,
      width: 25.5,
    },
    bubble: {
      left: 17.2,
      top: 57.0,
      maxWidth: 42.0,
      side: true,
    },
  },
};

// ====================================
// הדגשת ביטויים מתוך קובץ ה-JSON
// ====================================

function renderHighlightedText(text, highlights = []) {
  const matches = highlights
    .map((phrase) => ({
      phrase,
      index: text.indexOf(phrase),
    }))
    .filter(({ index }) => index >= 0)
    .sort((a, b) => a.index - b.index);

  if (!matches.length) {
    return text;
  }

  const parts = [];
  let cursor = 0;

  for (const { phrase, index } of matches) {
    if (index < cursor) continue;

    if (index > cursor) {
      parts.push(text.slice(cursor, index));
    }

    parts.push(
      <strong key={`${index}-${phrase}`}>
        {phrase}
      </strong>
    );

    cursor = index + phrase.length;
  }

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return parts;
}

// ====================================
// SupplyTypes
//
// step: מספר השלב הנוכחי (0 עד 8)
// onStepComplete: עדכון כשנפתחה הקופסה
// הפעילה
// ====================================

function SupplyTypes({ step = 0, onStepComplete }) {
  const lastStep = supplyTypesData.items.length - 1;

  const activeStep = Math.min(
    lastStep,
    Math.max(0, Number(step) || 0)
  );

  const currentItem = supplyTypesData.items[activeStep];

  const [seenIds, setSeenIds] = useState([]);
  const [openBubble, setOpenBubble] = useState(null);

  // ====================================
  // הצגת הבועה רק בשלב הנוכחי
  // ====================================

  const visibleBubble =
    openBubble?.step === activeStep
      ? openBubble.id
      : null;

  // כשעוברים שלב, הבועה נסגרת
  useEffect(() => {
    setOpenBubble(null);
  }, [activeStep]);

  // ====================================
  // בדיקה אם הקופסה הפעילה כבר נפתחה
  // ====================================

  const isCurrentStepComplete = seenIds.includes(
    currentItem.id
  );

  useEffect(() => {
    onStepComplete?.(isCurrentStepComplete);
  }, [isCurrentStepComplete, onStepComplete]);

  // ====================================
  // כל הקופסאות שצריכות להיות מוצגות
  // ====================================

  const visibleItems = useMemo(
    () => supplyTypesData.items.slice(
      0,
      activeStep + 1
    ),
    [activeStep]
  );

  // ====================================
  // תוכן בועת הדיבור הפתוחה
  // ====================================

  const selectedItem = visibleItems.find(
    (item) => item.id === visibleBubble
  );

  // ====================================
  // לחיצה על קופסה
  // ====================================

  const handleBoxClick = (item) => {
    setOpenBubble({
      step: activeStep,
      id: item.id,
    });

    // שומרים שהקופסה הפעילה נפתחה
    if (item.id === currentItem.id) {
      setSeenIds((prev) =>
        prev.includes(item.id)
          ? prev
          : [...prev, item.id]
      );
    }
  };

  // ====================================
  // תצוגה
  // ====================================

  return (
    <section
      className="supply-types"
      dir="rtl"
      aria-label={supplyTypesData.title}
    >

      {/* רקע המדפים */}
      <div
        className="supply-types-background"
        aria-hidden="true"
      />

      {/* כותרת המסך */}
      <h2 className="supply-types-heading">
        {supplyTypesData.title}
      </h2>

      <h2 className="supply-types-subheading">
        - לחצו על הקופסאות כדי ללמוד, תוכלו לחזור אליהן בלחיצה -
      </h2>

      {/* ====================================
          הקופסאות שעל המדפים
      ==================================== */}

      <div
        className="supply-types-shelf"
        aria-label="סוגי אפסניה במחסן"
      >

        {visibleItems.map((item) => {
          const position = PLACEMENTS[item.id].box;

          const isActive =
            item.id === currentItem.id;

          const isGlowing =
            isActive && !isCurrentStepComplete;

          return (
            <button
              key={item.id}
              type="button"
              className={[
                "supply-types-box",
                `supply-types-box--${item.id}`,
                isActive ? "is-current" : "",
                isGlowing ? "is-glowing" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{
                left: `${position.left}%`,
                top: `${position.top}%`,
                width: `${position.width}%`,
              }}
              onClick={() => handleBoxClick(item)}
              aria-label={`פתיחת הסבר: ${item.label}`}
              aria-expanded={
                visibleBubble === item.id
              }
            >
              <img
                src={IMAGES[item.id]}
                alt=""
                draggable="false"
              />
            </button>
          );
        })}

      </div>

      {/* ====================================
          בועת הסבר שנבנית מ-DIV
          ללא תמונת SVG
      ==================================== */}

      {selectedItem && (() => {
        const bubble = PLACEMENTS[
          selectedItem.id
        ].bubble;

        return (
          <div
            key={`${activeStep}-${selectedItem.id}`}
            className={[
              "supply-types-bubble",
              bubble.sideLeft
                ? "supply-types-bubble--side-left"
                : bubble.side
                  ? "supply-types-bubble--side"
                  : "supply-types-bubble--top",
            ].join(" ")}
            style={{
              left: `${bubble.left}%`,
              top: `${bubble.top}%`,
              maxWidth: `${bubble.maxWidth}%`,
            }}
            role="status"
            aria-live="polite"
          >

            <div className="supply-types-bubble-text">
              {renderHighlightedText(
                selectedItem.text,
                selectedItem.highlights
              )}
            </div>

          </div>
        );
      })()}

      {/* ====================================
          חץ מדידה - קופסה רגישה לחום
      ==================================== */}

      {visibleBubble === "heat" && (
        <div
          className="
            supply-types-measure
            supply-types-measure--heat
          "
          aria-label="מרחק של מטר אחד לפחות מהגג"
        >
          <img
            src={smallArrow}
            alt=""
            draggable="false"
          />

          <span>1 מטר</span>
        </div>
      )}

      {/* ====================================
          חץ מדידה - גובה אחסנה
      ==================================== */}

      {visibleBubble === "stack" && (
        <div
          className="
            supply-types-measure
            supply-types-measure--stack
          "
          aria-label="גובה אחסנה מקסימלי"
        >
          <img
            src={largeArrow}
            alt=""
            draggable="false"
          />

          <span>גובה אחסנה</span>
        </div>
      )}

    </section>
  );
}

export default SupplyTypes;
