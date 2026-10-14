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

import leftBubble from "../../../media/SupplyTypes/leftBubble.svg";
import middleLargeBubble from "../../../media/SupplyTypes/middle-large-bubble.svg";
import rightLargeBubble from "../../../media/SupplyTypes/right-large-bubble.svg";
import smallRightBubble from "../../../media/SupplyTypes/small-right-bubble.svg";
import largeLeftBubble from "../../../media/SupplyTypes/large-left-bubble.svg";
import sideRightBubble from "../../../media/SupplyTypes/side-right-bubble.svg";
import largeArrow from "../../../media/SupplyTypes/large-arrow.svg";
import smallArrow from "../../../media/SupplyTypes/small-arrow.svg";

import "./SupplyTypes.css";

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

/*
  Coordinates are percentages of the 160rem x 90rem learning stage.
  left/top are the TOP-LEFT of the image box. Adjust here to match Figma.
  Bubble coordinates are separate so they can be tweaked independently.

  Important: bubble SVGs include transparent space above the rectangular
  body (for the triangular pointer). CSS places text below that space.
*/
const PLACEMENTS = {
  pressure: {
    box: { left: 45.0, top: 68.5, width: 13.0 },
    bubble: { left: 42.0, top: 84.0, width: 43.0, image: leftBubble, kind: "short" },
  },
  heat: {
    box: { left: 62.5, top: 25.0, width: 13.0 },
    bubble: { left: 45.0, top: 52.7, width: 44.0, image: middleLargeBubble, kind: "tall" },
  },
  light: {
    box: { left: 81.0, top: 47.1, width: 13.0 },
    bubble: { left: 61.0, top: 65.3, width: 36.0, image: smallRightBubble, kind: "short" },
  },
  filtration: {
    box: { left: 26.3, top: 47.1, width: 13.0 },
    bubble: { left: 8.0, top: 64.0, width: 43.0, image: middleLargeBubble, kind: "tall" },
  },
  toxic: {
    box: { left: 26.3, top: 25.0, width: 13.0 },
    bubble: { left: 5.0, top: 46.3, width: 44.0, image: leftBubble, kind: "short" },
  },
  pests: {
    box: { left: 62.5, top: 47.1, width: 13.0 },
    bubble: { left: 46.5, top: 64.2, width: 48.0, image: middleLargeBubble, kind: "tall" },
  },
  safety: {
    box: { left: 62.5, top: 68.5, width: 13.0 },
    bubble: { left: 33.0, top: 74.7, width: 38.0, image: rightLargeBubble, kind: "tall" },
  },
  move: {
    box: { left: 26.3, top: 68.5, width: 13.0 },
    bubble: { left: 28.0, top: 74.5, width: 45.0, image: largeLeftBubble, kind: "short" },
  },
  stack: {
    box: { left: 39.6, top: 57.3, width: 25.5 },
    bubble: { left: 4.7, top: 55.0, width: 42.0, image: sideRightBubble, kind: "side" },
  },
};

// Highlight only the exact approved phrases; no HTML injection.
function renderHighlightedText(text, highlights = []) {
  const matches = highlights
    .map((phrase) => ({ phrase, index: text.indexOf(phrase) }))
    .filter(({ index }) => index >= 0)
    .sort((a, b) => a.index - b.index);

  if (!matches.length) return text;

  const parts = [];
  let cursor = 0;
  for (const { phrase, index } of matches) {
    if (index < cursor) continue;
    if (index > cursor) parts.push(text.slice(cursor, index));
    parts.push(<strong key={`${index}-${phrase}`}>{phrase}</strong>);
    cursor = index + phrase.length;
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}

/**
 * SupplyTypes - one stage at a time; NO navigation controls inside.
 *
 * Props:
 *   step: 0..8 (0=pressure, 8=height/stack)
 *   onStepComplete: (isComplete:boolean) => void
 *
 * Parent may use onStepComplete to enable its Next arrow in the future.
 * Previous boxes remain clickable. Backward stage changes close the bubble.
 */
function SupplyTypes({ step = 0, onStepComplete }) {
  const lastStep = supplyTypesData.items.length - 1;
  const activeStep = Math.min(lastStep, Math.max(0, Number(step) || 0));
  const currentItem = supplyTypesData.items[activeStep];

  const [seenIds, setSeenIds] = useState([]);
  const [openBubble, setOpenBubble] = useState(null);

  // Prevent a previous stage's bubble from flashing on the next stage.
  const visibleBubble = openBubble?.step === activeStep ? openBubble.id : null;

  useEffect(() => {
    setOpenBubble(null);
  }, [activeStep]);

  const isCurrentStepComplete = seenIds.includes(currentItem.id);

  useEffect(() => {
    onStepComplete?.(isCurrentStepComplete);
  }, [isCurrentStepComplete, onStepComplete]);

  const visibleItems = useMemo(
    () => supplyTypesData.items.slice(0, activeStep + 1),
    [activeStep]
  );

  const selectedItem = visibleItems.find((item) => item.id === visibleBubble);

  const handleBoxClick = (item) => {
    setOpenBubble({ step: activeStep, id: item.id });
    if (item.id === currentItem.id) {
      setSeenIds((prev) =>
        prev.includes(item.id) ? prev : [...prev, item.id]
      );
    }
  };

  return (
    <section className="supply-types" dir="rtl" aria-label={supplyTypesData.title}>
      <div className="supply-types-background" aria-hidden="true" />
      <h2 className="supply-types-heading">{supplyTypesData.title}</h2>

      <div className="supply-types-shelf" aria-label="סוגי אפסניה במחסן">
        {visibleItems.map((item) => {
          const position = PLACEMENTS[item.id].box;
          const isActive = item.id === currentItem.id;
          const isGlowing = isActive && visibleBubble !== item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={[
                "supply-types-box",
                `supply-types-box--${item.id}`,
                isActive ? "is-current" : "",
                isGlowing ? "is-glowing" : "",
              ].filter(Boolean).join(" ")}
              style={{
                left: `${position.left}%`,
                top: `${position.top}%`,
                width: `${position.width}%`,
              }}
              onClick={() => handleBoxClick(item)}
              aria-label={`פתיחת הסבר: ${item.label}`}
              aria-expanded={visibleBubble === item.id}
            >
              <img src={IMAGES[item.id]} alt="" draggable="false" />
            </button>
          );
        })}
      </div>

      {selectedItem && (() => {
        const bubble = PLACEMENTS[selectedItem.id].bubble;
        return (
          <div
            key={`${activeStep}-${selectedItem.id}`}
            className={`supply-types-bubble supply-types-bubble--${bubble.kind}`}
            style={{
              left: `${bubble.left}%`,
              top: `${bubble.top}%`,
              width: `${bubble.width}%`,
            }}
            role="status"
            aria-live="polite"
          >
            <img
              className="supply-types-bubble-shape"
              src={bubble.image}
              alt=""
              aria-hidden="true"
              draggable="false"
            />
            <div className="supply-types-bubble-inner">
              <span className="supply-types-bubble-text">
                {renderHighlightedText(selectedItem.text, selectedItem.highlights)}
              </span>
            </div>
          </div>
        );
      })()}

      {/* Dimension markers only appear with the relevant explanation. */}
      {visibleBubble === "heat" && (
        <div className="supply-types-measure supply-types-measure--heat" aria-label="מרחק של מטר אחד לפחות מהגג">
          <img src={smallArrow} alt="" draggable="false" />
          <span>1 מטר</span>
        </div>
      )}
      {visibleBubble === "stack" && (
        <div className="supply-types-measure supply-types-measure--stack" aria-label="גובה אחסנה מקסימלי">
          <img src={largeArrow} alt="" draggable="false" />
          <span>גובה אחסנה</span>
        </div>
      )}
    </section>
  );
}

export default SupplyTypes;
