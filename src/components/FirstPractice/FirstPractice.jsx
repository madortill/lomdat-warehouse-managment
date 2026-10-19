
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import practiceData from "../../../data/FirstPracticeData.json";

import pressureBox from "../../../media/SupplyTypes/pressure-box.png";
import heatBox from "../../../media/SupplyTypes/heat-box.png";
import lightBox from "../../../media/SupplyTypes/light-box.png";
import filtrationBox from "../../../media/SupplyTypes/filtration-box.png";
import toxicBox from "../../../media/SupplyTypes/toxic-box.png";
import pestsBox from "../../../media/SupplyTypes/pests-box.png";
import safetyBox from "../../../media/SupplyTypes/safety-box.png";
import moveBox from "../../../media/SupplyTypes/move-box.png";

import largeBox from "../../../media/InfoPage/large-box.svg";
import carouselArrow from "../../../media/FirstPractice/arrow.svg";
import lightBulb from "../../../media/FirstPractice/light-bulb.svg";
import smallArrow from "../../../media/SupplyTypes/small-arrow.svg";

import "./FirstPractice.css";

// ====================================
// תמונות הקופסאות
// ====================================

const BOX_IMAGES = {
  pressure: pressureBox,
  heat: heatBox,
  light: lightBox,
  filtration: filtrationBox,
  toxic: toxicBox,
  pests: pestsBox,
  safety: safetyBox,
  move: moveBox,
};

// קופסאות פתוחות יושבות מעט נמוך יותר
const OPEN_BOX_IDS = new Set([
  "filtration",
  "toxic",
  "pests",
  "safety",
  "move",
]);

function FirstPractice({ onComplete, onBackToMaterial, onSkipPractice }) {
  // ====================================
  // STATES
  // ====================================

  const [placements, setPlacements] = useState({});
  const [results, setResults] = useState({});
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [activeHintSlot, setActiveHintSlot] = useState(null);

  // 0 = הוראות ראשונות
  // 1 = הוראות שניות
  // null = התרגול
  const [instructionsPage, setInstructionsPage] = useState(0);

  const [isComplete, setIsComplete] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dragPreview, setDragPreview] = useState(null);

  // ====================================
  // REFS
  // ====================================

  const carouselRef = useRef(null);
  const activePointerRef = useRef(null);
  const preventClickOnceRef = useRef(false);

  // ====================================
  // DERIVED VALUES
  // ====================================

  const placedIds = useMemo(
    () => new Set(Object.values(placements)),
    [placements]
  );

  const itemMap = useMemo(
    () => Object.fromEntries(
      practiceData.items.map((item) => [item.id, item])
    ),
    []
  );

  const filledCount = Object.keys(placements).length;

  const canSubmit =
    practiceData.slots.every((slot) => Boolean(placements[slot.id])) &&
    !isComplete;

  const modalOpen = instructionsPage !== null || showSuccess;

  // ====================================
  // CAROUSEL
  // ====================================

  const scrollCarousel = (direction) => {
    const element = carouselRef.current;
    if (!element) return;

    const firstItem = element.querySelector(
      ".first-practice-catalog-item"
    );

    const distance = firstItem
      ? firstItem.getBoundingClientRect().height + 12
      : 100;

    element.scrollBy({
      top: direction * distance * 2,
      behavior: "smooth",
    });
  };

  // ====================================
  // PLACE BOX
  // ====================================

  const placeItem = useCallback(
    (itemId, destinationSlotId) => {
      if (!itemId || isComplete || modalOpen) return;

      // לא מחליפים תשובה שכבר נבדקה כנכונה
      if (results[destinationSlotId] === "correct") return;

      const oldSlotId = Object.keys(placements).find(
        (slotId) => placements[slotId] === itemId
      );

      if (oldSlotId && results[oldSlotId] === "correct") return;

      setPlacements((previous) => {
        const next = { ...previous };

        // מסירים את הקופסה מהמיקום הקודם שלה
        Object.keys(next).forEach((slotId) => {
          if (next[slotId] === itemId) {
            delete next[slotId];
          }
        });

        next[destinationSlotId] = itemId;
        return next;
      });

      setResults((previous) => {
        const next = { ...previous };

        if (oldSlotId) delete next[oldSlotId];
        delete next[destinationSlotId];

        return next;
      });

      setSelectedItemId(null);
      setActiveHintSlot(null);
    },
    [placements, results, modalOpen, isComplete]
  );

  // ====================================
  // RETURN BOX TO CAROUSEL
  // ====================================

  const returnToCarousel = useCallback(
    (itemId) => {
      if (isComplete || modalOpen) return;

      const originSlot = Object.keys(placements).find(
        (slotId) => placements[slotId] === itemId
      );

      if (!originSlot || results[originSlot] === "correct") {
        return;
      }

      setPlacements((prev) => {
        const next = { ...prev };
        delete next[originSlot];
        return next;
      });

      setResults((prev) => {
        const next = { ...prev };
        delete next[originSlot];
        return next;
      });

      setSelectedItemId(null);
      setActiveHintSlot(null);
    },
    [placements, results, modalOpen, isComplete]
  );

  // ====================================
  // START DRAG
  // ====================================

  const beginPointer = (event, itemId) => {
    if (event.button !== 0 || modalOpen || isComplete) return;

    const originSlot = Object.keys(placements).find(
      (slotId) => placements[slotId] === itemId
    );

    if (originSlot && results[originSlot] === "correct") return;

    activePointerRef.current = {
      itemId,
      x: event.clientX,
      y: event.clientY,
      moved: false,
    };

    event.preventDefault();
  };

  // ====================================
  // POINTER DRAG HANDLING
  // ====================================

  useEffect(() => {
    const handleMove = (event) => {
      const active = activePointerRef.current;
      if (!active) return;

      const dx = event.clientX - active.x;
      const dy = event.clientY - active.y;

      if (!active.moved && Math.hypot(dx, dy) > 7) {
        active.moved = true;
      }

      if (active.moved) {
        setDragPreview({
          itemId: active.itemId,
          x: event.clientX,
          y: event.clientY,
        });
      }
    };

    const handleRelease = (event) => {
      const active = activePointerRef.current;
      if (!active) return;

      activePointerRef.current = null;
      setDragPreview(null);

      if (!active.moved) return;

      preventClickOnceRef.current = true;

      window.setTimeout(() => {
        preventClickOnceRef.current = false;
      }, 0);

      // בודקים את כל השכבות שמתחת לעכבר.
      // כך אלמנט שקוף מעל המדף לא יחסום את השיבוץ.
      const elements = document.elementsFromPoint(
        event.clientX,
        event.clientY
      );

      const slotElement = elements
        .map((element) =>
          element.closest?.("[data-practice-slot]")
        )
        .find(Boolean);

      if (slotElement) {
        placeItem(
          active.itemId,
          slotElement.dataset.practiceSlot
        );
        return;
      }

      const overCarousel = elements.some((element) =>
        element.closest?.(".first-practice-catalog")
      );

      if (overCarousel) {
        returnToCarousel(active.itemId);
      }
    };

    const handleCancel = () => {
      activePointerRef.current = null;
      setDragPreview(null);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleRelease);
    window.addEventListener("pointercancel", handleCancel);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleRelease);
      window.removeEventListener("pointercancel", handleCancel);
    };
  }, [placeItem, returnToCarousel]);

  // ====================================
  // SELECT BOX BY CLICK
  // ====================================

  const selectItem = (itemId) => {
    if (preventClickOnceRef.current) {
      preventClickOnceRef.current = false;
      return;
    }

    if (modalOpen || isComplete) return;

    const existingSlot = Object.keys(placements).find(
      (slotId) => placements[slotId] === itemId
    );

    if (existingSlot && results[existingSlot] === "correct") {
      return;
    }

    setSelectedItemId((prev) =>
      prev === itemId ? null : itemId
    );
  };

  const pickSlot = (slotId) => {
    if (!selectedItemId || results[slotId] === "correct") {
      return;
    }

    placeItem(selectedItemId, slotId);
  };

  // ====================================
  // CHECK ANSWERS
  // ====================================

  const submitAnswers = () => {
    if (!canSubmit) return;

    const nextResults = {};

    practiceData.slots.forEach((slot) => {
      nextResults[slot.id] =
        placements[slot.id] === slot.correctItemId
          ? "correct"
          : "incorrect";
    });

    setResults(nextResults);
    setActiveHintSlot(null);
    setSelectedItemId(null);

    const allCorrect = Object.values(nextResults).every(
      (value) => value === "correct"
    );

    if (allCorrect) {
      setIsComplete(true);
      setShowSuccess(true);
      onComplete?.();
    }
  };

  // ====================================
  // INSTRUCTIONS
  // ====================================

  const instruction = instructionsPage === null
    ? null
    : practiceData.instructions[instructionsPage];

  const closeModal = () => {
    setInstructionsPage(null);
    setShowSuccess(false);
  };

  const continueModal = () => {
    if (showSuccess) {
      setShowSuccess(false);
    } else if (instructionsPage === 0) {
      setInstructionsPage(1);
    } else {
      setInstructionsPage(null);
    }
  };

  // ====================================
  // RENDER
  // ====================================

  return (
    <section
      className={`first-practice ${modalOpen ? "first-practice--modal-open" : ""
        }`}
      dir="rtl"
      aria-label="תרגול אחסנה לפי סוגי אפסניה"
    >
      {/* רקע המדפים */}
      <div
        className="first-practice-background"
        aria-hidden="true"
      />

      {/* כותרת */}
      <h2 className="first-practice-title">
        {practiceData.title}
      </h2>

      {/* חץ מרחק מהגג */}
      <div
        className="first-practice-roof-measure"
        aria-hidden="true"
      >
        <img src={smallArrow} alt="" draggable="false" />
        <span>1 מטר</span>
      </div>

      {/* כפתור דילוג */}

      {/* ====================================
    TEMPORARY SKIP BUTTON
    להסיר לאחר סיום פיתוח התרגול
==================================== */}

      {!modalOpen && (
        <button
          type="button"
          className="first-practice-skip"
          onClick={onSkipPractice}
        >
          דלג על התרגול 
        </button>
      )}


      {/* ====================================
          אזורי השיבוץ במדפים
      ==================================== */}

      <div className="first-practice-slots">
        {practiceData.slots.map((slot) => {
          const itemId = placements[slot.id];
          const result = results[slot.id];

          const isLocked = result === "correct";
          const showHint = result === "incorrect";
          const hintOpen = activeHintSlot === slot.id;

          const isOpenBox =
            itemId && OPEN_BOX_IDS.has(itemId);

          return (
            <div
              key={slot.id}
              data-practice-slot={slot.id}
              className={[
                "first-practice-slot",
                itemId ? "has-item" : "",
                result ? `is-${result}` : "",
                selectedItemId && !isLocked
                  ? "can-receive"
                  : "",
              ].filter(Boolean).join(" ")}
              style={{
                left: `${slot.left}%`,
                top: `${slot.top}%`,
                width: `${slot.width}%`,
                height: `${slot.height}%`,
              }}
              onClick={() => pickSlot(slot.id)}
              role="group"
              aria-label={`${slot.label}${itemId
                  ? ` – ${itemMap[itemId]?.label}`
                  : " – פנוי"
                }`}
            >
              {!itemId ? (
                <span className="first-practice-slot-label">
                  {slot.label}
                </span>
              ) : (
                <button
                  type="button"
                  className={[
                    "first-practice-placed-item",
                    isOpenBox ? "is-open-box" : "",
                  ].filter(Boolean).join(" ")}
                  onPointerDown={(event) =>
                    beginPointer(event, itemId)
                  }
                  onClick={(event) => {
                    event.stopPropagation();
                    selectItem(itemId);
                  }}
                  aria-label={`${itemMap[itemId]?.label}${isLocked
                      ? ", תשובה נכונה"
                      : ", לחצו לבחירה או גררו להחלפה"
                    }`}
                  disabled={isLocked}
                >
                  <img
                    src={BOX_IMAGES[itemId]}
                    alt=""
                    draggable="false"
                  />
                </button>
              )}

              {/* חיווי ירוק או אדום */}
              {result && (
                <span
                  className="first-practice-result-mark"
                  aria-label={isLocked ? "נכון" : "לא נכון"}
                >
                  {isLocked ? "✓" : "✕"}
                </span>
              )}

              {/* נורת רמז */}
              {showHint && (
                <button
                  type="button"
                  className="first-practice-hint-trigger"
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveHintSlot(
                      hintOpen ? null : slot.id
                    );
                  }}
                  aria-label={`הצגת רמז עבור ${slot.label}`}
                  aria-expanded={hintOpen}
                >
                  <img
                    src={lightBulb}
                    alt=""
                    draggable="false"
                  />
                </button>
              )}

              {/* רמז עם כפתור X */}
              {hintOpen && (
                <div
                  className="first-practice-hint"
                  role="status"
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    className="first-practice-hint-close"
                    aria-label="סגירת רמז"
                    onClick={(event) => {
                      event.stopPropagation();
                      setActiveHintSlot(null);
                    }}
                  >
                    ×
                  </button>

                  <p className="first-practice-hint-text">
                    {slot.hint}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ====================================
          קרוסלת הקופסאות
      ==================================== */}

      <aside
        className="first-practice-catalog"
        aria-label="קרוסלת קופסאות לבחירה"
      >
        <button
          type="button"
          className="first-practice-carousel-arrow is-up"
          onClick={() => scrollCarousel(-1)}
          aria-label="קופסאות קודמות"
        >
          <img
            src={carouselArrow}
            alt=""
            draggable="false"
          />
        </button>

        <div
          className="first-practice-catalog-viewport"
          ref={carouselRef}
        >
          {practiceData.items.map((item) => {
            const placed = placedIds.has(item.id);
            const selected = selectedItemId === item.id;

            return (
              <button
                key={item.id}
                type="button"
                className={[
                  "first-practice-catalog-item",
                  placed ? "is-placed" : "",
                  selected ? "is-selected" : "",
                ].filter(Boolean).join(" ")}
                onPointerDown={(event) =>
                  beginPointer(event, item.id)
                }
                onClick={() => selectItem(item.id)}
                aria-label={`בחירת קופסה: ${item.label}`}
                aria-pressed={selected}
                disabled={placed || isComplete}
              >
                <img
                  src={BOX_IMAGES[item.id]}
                  alt=""
                  draggable="false"
                />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="first-practice-carousel-arrow is-down"
          onClick={() => scrollCarousel(1)}
          aria-label="קופסאות נוספות"
        >
          <img
            src={carouselArrow}
            alt=""
            draggable="false"
          />
        </button>
      </aside>

      {/* ====================================
          כפתור הגשה - מלבן צהוב
      ==================================== */}

      <button
        className="first-practice-submit"
        type="button"
        onClick={submitAnswers}
        disabled={!canSubmit}
        aria-label="הגשת התרגול לבדיקה"
      >
        הגשה
      </button>

      {/* כפתור חזרה לחומר */}
      {!modalOpen && (
        <button
          type="button"
          className="first-practice-back-to-material"
          onClick={onBackToMaterial}
        >
          <span aria-hidden="true">↪</span>
          חזרה לחומר
        </button>
      )}

      {/* מונה קופסאות */}
      <p
        className="first-practice-counter"
        aria-live="polite"
      >
        {filledCount} מתוך {practiceData.slots.length} קופסאות שובצו
      </p>

      {/* הסבר לבחירה באמצעות לחיצה */}
      {selectedItemId && !modalOpen && (
        <p
          className="first-practice-selection-tip"
          role="status"
        >
          נבחרה הקופסה ״{itemMap[selectedItemId]?.label}״
          {" "}— לחצו על המקום המתאים במדף
        </p>
      )}

      {/* קופסה שעוקבת אחרי העכבר בגרירה */}
      {dragPreview && !modalOpen && (
        <div
          className="first-practice-drag-ghost"
          style={{
            left: dragPreview.x,
            top: dragPreview.y,
          }}
          aria-hidden="true"
        >
          <img
            src={BOX_IMAGES[dragPreview.itemId]}
            alt=""
            draggable="false"
          />
        </div>
      )}

      {/* ====================================
          חלונית הוראות / הצלחה
      ==================================== */}

      {modalOpen && (
        <div className="first-practice-overlay">
          <div
            className="first-practice-modal"
            role="dialog"
            aria-modal="true"
            aria-label={
              showSuccess
                ? practiceData.successTitle
                : instruction?.heading
            }
          >
            <img
              className="first-practice-modal-box"
              src={largeBox}
              alt=""
              draggable="false"
            />

            <h3 className="first-practice-modal-title">
              {showSuccess
                ? practiceData.successTitle
                : instruction?.heading}
            </h3>

            <button
              className="first-practice-modal-close"
              type="button"
              onClick={closeModal}
              aria-label="סגירה"
            >
              ×
            </button>

            <p className="first-practice-modal-copy">
              {showSuccess
                ? practiceData.successText
                : instruction?.text}
            </p>

            <button
              type="button"
              className="first-practice-modal-continue"
              onClick={continueModal}
            >
              {showSuccess
                ? "סיום"
                : instructionsPage === 0
                  ? "המשך ←"
                  : "בהצלחה! ←"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default FirstPractice;
