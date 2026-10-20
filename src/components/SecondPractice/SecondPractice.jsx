
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  RECEIPT_NODES,
  ReceiptFlowArrows,
} from "../InfoPage/InfoPage.jsx";

import largeBox from "../../../media/InfoPage/large-box.svg";
import sideZigi from "../../../media/InfoPage/side-zigi.svg";

import "../InfoPage/InfoPage.css";
import "./SecondPractice.css";
import { STORAGE_KEYS, readStoredObject, writeStoredObject } from "../../utils/practiceStorage.js";

// ====================================
// PAGE NUMBER
// ====================================

export const SECOND_PRACTICE_PAGE = 36;

// ====================================
// WORD BANK - 11 CARDS
// כולל מילים כפולות והדגשות
// ====================================

const WORD_BANK_ORDER = [
  "waste-corner",
  "check",
  "not-good",
  "return-good",
  "worn",
  "needs-treatment",
  "good",
  "waste",
  "recheck",
  "good-after-check",
  "return-after-check",
];

const WORD_BANK = WORD_BANK_ORDER.map((id) => {
  const node = RECEIPT_NODES.find(
    (item) => item.id === id
  );

  return {
    id: node.id,
    text: node.text,
    emphasized: Boolean(node.emphasized),
  };
});

const WORD_BY_ID = Object.fromEntries(
  WORD_BANK.map((word) => [
    word.id,
    word,
  ])
);

// ====================================
// THREE PRACTICE ROUNDS
// ====================================

const ROUNDS = [
  {
    id: 1,
    missingIds: [
      "good",
      "needs-treatment",
      "waste-corner",
    ],
  },
  {
    id: 2,
    missingIds: [
      "not-good",
      "return-good",
    ],
  },
  {
    id: 3,
    missingIds: [
      "check",
      "worn",
      "recheck",
    ],
  },
];

// ====================================
// CORRECT ANSWERS
// ====================================

const CORRECT_ANSWERS = Object.fromEntries(
  RECEIPT_NODES.map((node) => [
    node.id,
    node.text,
  ])
);

// ====================================
// MAIN COMPONENT
// ====================================

function SecondPractice({
  ref,
  onCanAdvanceChange,
  onComplete,
}) {
  // ====================================
  // STATES
  // ====================================

  // Restore the same round and answers when returning to page 36.
  const [savedPractice] = useState(() =>
    readStoredObject(STORAGE_KEYS.secondPractice)
  );

  const [stage, setStage] = useState(() =>
    ["intro", "playing", "success", "finished"].includes(
      savedPractice?.stage
    )
      ? savedPractice.stage
      : "intro"
  );

  const [roundIndex, setRoundIndex] = useState(() =>
    Number.isInteger(savedPractice?.roundIndex)
      ? Math.max(0, Math.min(ROUNDS.length - 1, savedPractice.roundIndex))
      : 0
  );

  // slotId -> wordId
  const [placements, setPlacements] = useState(() =>
    savedPractice?.placements &&
    typeof savedPractice.placements === "object" &&
    !Array.isArray(savedPractice.placements)
      ? savedPractice.placements
      : {}
  );

  const [results, setResults] = useState(() =>
    savedPractice?.results &&
    typeof savedPractice.results === "object" &&
    !Array.isArray(savedPractice.results)
      ? savedPractice.results
      : {}
  );

  const [selectedWordId, setSelectedWordId] = useState(null);

  const [roundComplete, setRoundComplete] = useState(
    () => savedPractice?.roundComplete === true
  );

  const [message, setMessage] = useState(() =>
    typeof savedPractice?.message === "string"
      ? savedPractice.message
      : ""
  );

  const [dragPreview, setDragPreview] = useState(null);

  // Persist the current round, submitted answers, and completion.
  useEffect(() => {
    writeStoredObject(STORAGE_KEYS.secondPractice, {
      stage,
      roundIndex,
      placements,
      results,
      roundComplete,
      message,
    });
  }, [stage, roundIndex, placements, results, roundComplete, message]);

  const [scrollState, setScrollState] =
    useState({
      canUp: false,
      canDown: true,
    });

  // ====================================
  // REFS
  // ====================================

  const catalogRef = useRef(null);
  const activePointerRef = useRef(null);
  const suppressClickRef = useRef(false);

  // ====================================
  // CURRENT ROUND
  // ====================================

  const round = ROUNDS[roundIndex];

  const missingIds = round.missingIds;

  const usedWordIds = useMemo(
    () => new Set(Object.values(placements)),
    [placements]
  );

  const filledCount = missingIds.filter(
    (slotId) => Boolean(placements[slotId])
  ).length;

  const isInteractive =
    stage === "playing" &&
    !roundComplete;

  const canSubmit =
    isInteractive &&
    missingIds.every(
      (slotId) => Boolean(placements[slotId])
    );

  // ====================================
  // PLACE WORD IN SLOT
  // ====================================

  const placeWord = useCallback(
    (wordId, slotId) => {
      if (!wordId || !slotId) return;

      if (!WORD_BY_ID[wordId]) return;

      if (
        stage !== "playing" ||
        roundComplete ||
        !missingIds.includes(slotId) ||
        results[slotId] === "correct"
      ) {
        return;
      }

      const previousSlot = Object.keys(
        placements
      ).find(
        (id) =>
          id !== slotId &&
          placements[id] === wordId
      );

      if (
        previousSlot &&
        results[previousSlot] === "correct"
      ) {
        return;
      }

      setPlacements((previous) => {
        const next = { ...previous };

        // כל כרטיסייה משובצת במקום אחד,
        // אבל כפילויות הן כרטיסיות עצמאיות.
        Object.keys(next).forEach((id) => {
          if (next[id] === wordId) {
            delete next[id];
          }
        });

        next[slotId] = wordId;

        return next;
      });

      setResults((previous) => {
        const next = { ...previous };

        delete next[slotId];

        if (previousSlot) {
          delete next[previousSlot];
        }

        return next;
      });

      setSelectedWordId(null);
      setMessage("");
    },
    [
      stage,
      roundComplete,
      missingIds,
      results,
      placements,
    ]
  );

  // ====================================
  // REMOVE WORD FROM SLOT
  // ====================================

  const clearSlot = useCallback(
    (slotId) => {
      if (
        stage !== "playing" ||
        roundComplete ||
        results[slotId] === "correct"
      ) {
        return;
      }

      setPlacements((previous) => {
        const next = { ...previous };

        delete next[slotId];

        return next;
      });

      setResults((previous) => {
        const next = { ...previous };

        delete next[slotId];

        return next;
      });

      setMessage("");
    },
    [
      stage,
      roundComplete,
      results,
    ]
  );

  // ====================================
  // SELECT WORD BY CLICK
  // ====================================

  const selectWord = (wordId) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }

    if (
      !isInteractive ||
      usedWordIds.has(wordId)
    ) {
      return;
    }

    setSelectedWordId((previous) =>
      previous === wordId
        ? null
        : wordId
    );
  };

  // ====================================
  // DRAG START
  // ====================================

  const beginPointer = (
    event,
    wordId,
    originSlot = null
  ) => {
    if (!isInteractive) return;

    if (
      event.pointerType === "mouse" &&
      event.button !== 0
    ) {
      return;
    }

    if (!WORD_BY_ID[wordId]) return;

    if (originSlot) {
      if (
        results[originSlot] === "correct"
      ) {
        return;
      }
    } else if (usedWordIds.has(wordId)) {
      return;
    }

    activePointerRef.current = {
      wordId,
      originSlot,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    };
  };

  // ====================================
  // DRAG AND DROP
  // ====================================

  useEffect(() => {
    const handleMove = (event) => {
      const active =
        activePointerRef.current;

      if (!active) return;

      const distance = Math.hypot(
        event.clientX - active.startX,
        event.clientY - active.startY
      );

      if (
        !active.moved &&
        distance > 7
      ) {
        active.moved = true;
      }

      if (active.moved) {
        setDragPreview({
          wordId: active.wordId,
          x: event.clientX,
          y: event.clientY,
        });
      }
    };

    const handleRelease = (event) => {
      const active =
        activePointerRef.current;

      if (!active) return;

      activePointerRef.current = null;
      setDragPreview(null);

      if (!active.moved) return;

      suppressClickRef.current = true;

      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);

      const elements =
        document.elementsFromPoint(
          event.clientX,
          event.clientY
        );

      const targetSlot = elements
        .map((element) =>
          element.closest?.(
            "[data-second-slot]"
          )
        )
        .find(Boolean);

      if (targetSlot) {
        placeWord(
          active.wordId,
          targetSlot.dataset.secondSlot
        );

        return;
      }

      // גרירת תשובה ממשבצת בחזרה למחסן
      if (active.originSlot) {
        const overCatalog = elements.some(
          (element) =>
            element.closest?.(
              ".second-practice-catalog"
            )
        );

        if (overCatalog) {
          clearSlot(active.originSlot);
        }
      }
    };

    const handleCancel = () => {
      activePointerRef.current = null;
      setDragPreview(null);
    };

    window.addEventListener(
      "pointermove",
      handleMove
    );

    window.addEventListener(
      "pointerup",
      handleRelease
    );

    window.addEventListener(
      "pointercancel",
      handleCancel
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handleMove
      );

      window.removeEventListener(
        "pointerup",
        handleRelease
      );

      window.removeEventListener(
        "pointercancel",
        handleCancel
      );
    };
  }, [
    placeWord,
    clearSlot,
  ]);

  // ====================================
  // WORD BANK SCROLL STATE
  // ====================================

  const updateScrollState =
    useCallback(() => {
      const element = catalogRef.current;

      if (!element) return;

      const maxScroll =
        element.scrollHeight -
        element.clientHeight;

      setScrollState({
        canUp:
          element.scrollTop > 2,

        canDown:
          element.scrollTop <
          maxScroll - 2,
      });
    }, []);

  // ====================================
  // SCROLL WORD BANK
  // ====================================

  const scrollCatalog = (direction) => {
    const element = catalogRef.current;

    if (!element) return;

    const step = Math.max(
      element.clientHeight * 0.55,
      100
    );

    const maxScroll = Math.max(
      0,
      element.scrollHeight -
      element.clientHeight
    );

    const target = Math.max(
      0,
      Math.min(
        maxScroll,
        element.scrollTop +
          direction * step
      )
    );

    element.scrollTo({
      top: target,
      behavior: "smooth",
    });
  };

  // ====================================
  // RESET SCROLL ON NEW ROUND
  // ====================================

  useEffect(() => {
    if (stage !== "playing") return;

    const animationFrame =
      window.requestAnimationFrame(() => {
        if (catalogRef.current) {
          catalogRef.current.scrollTop = 0;
        }

        updateScrollState();
      });

    return () => {
      window.cancelAnimationFrame(
        animationFrame
      );
    };
  }, [
    stage,
    roundIndex,
    updateScrollState,
  ]);

  // ====================================
  // CHECK ANSWERS
  // ====================================

  const submitAnswers = () => {
    if (!canSubmit) return;

    const nextResults = {};

    missingIds.forEach((slotId) => {
      const wordId = placements[slotId];

      const word = WORD_BY_ID[wordId];

      // בודקים טקסט ולא ID:
      // גם כרטיסיות כפולות ייחשבו נכונות.
      nextResults[slotId] =
        word?.text ===
        CORRECT_ANSWERS[slotId]
          ? "correct"
          : "incorrect";
    });

    setResults(nextResults);
    setSelectedWordId(null);

    const allCorrect = missingIds.every(
      (slotId) =>
        nextResults[slotId] === "correct"
    );

    if (!allCorrect) {
      setMessage(
        "יש תשובות שדורשות תיקון. תקנו את המשבצות האדומות ונסו שוב!"
      );

      return;
    }

    setRoundComplete(true);

    if (
      roundIndex === ROUNDS.length - 1
    ) {
      setMessage("");
      setStage("success");
      onComplete?.();
      return;
    }

    setMessage(
      "כל הכבוד! כל התשובות נכונות. אפשר להמשיך לסבב הבא."
    );
  };

  // ====================================
  // NEXT ROUND
  // ====================================

  const goToNextRound = () => {
    if (!roundComplete) return;

    if (
      roundIndex >= ROUNDS.length - 1
    ) {
      return;
    }

    setRoundIndex(
      (previous) => previous + 1
    );

    setPlacements({});
    setResults({});
    setSelectedWordId(null);
    setRoundComplete(false);
    setMessage("");
    setDragPreview(null);
  };

  // ====================================
  // GLOBAL NAVIGATION
  // NavigationArrows stays in App.jsx
  // ====================================

  const canAdvance =
    stage === "intro" ||
    (
      stage === "playing" &&
      roundComplete &&
      roundIndex < ROUNDS.length - 1
    );

  useEffect(() => {
    onCanAdvanceChange?.(canAdvance);
  }, [
    canAdvance,
    onCanAdvanceChange,
  ]);

  useImperativeHandle(ref, () => ({
    goNext: () => {
      if (stage === "intro") {
        setStage("playing");
        return;
      }

      if (
        stage === "playing" &&
        roundComplete &&
        roundIndex < ROUNDS.length - 1
      ) {
        goToNextRound();
      }
    },
  }));

  // ====================================
  // RENDER FLOWCHART NODE
  // ====================================

  const renderNode = (node) => {
    const isMissing =
      missingIds.includes(node.id);

    const style = {
      "--node-x": `${node.x}%`,
      "--node-y": `${node.y}%`,
      "--node-width": node.width,
    };

    const emphasizedClass =
      node.emphasized
        ? "is-emphasized"
        : "";

    // Fixed node - exactly like InfoPage
    if (!isMissing) {
      return (
        <div
          key={node.id}
          className={[
            "info-page-receipt-node",
            emphasizedClass,
          ].filter(Boolean).join(" ")}
          style={style}
        >
          <span dir="rtl">
            {node.text}
          </span>
        </div>
      );
    }

    // Interactive missing node
    const wordId = placements[node.id];

    const answer =
      WORD_BY_ID[wordId]?.text;

    const result = results[node.id];
    const isLocked = result === "correct";

    return (
      <button
        key={node.id}
        type="button"
        data-second-slot={node.id}
        style={style}
        className={[
          "info-page-receipt-node",
          "second-practice-slot",
          emphasizedClass,
          answer ? "is-filled" : "",
          result ? `is-${result}` : "",
          selectedWordId && !isLocked
            ? "can-receive"
            : "",
        ].filter(Boolean).join(" ")}
        onPointerDown={(event) => {
          if (wordId && !isLocked) {
            beginPointer(
              event,
              wordId,
              node.id
            );
          }
        }}
        onClick={() => {
          if (suppressClickRef.current) {
            suppressClickRef.current = false;
            return;
          }

          if (!isInteractive || isLocked) {
            return;
          }

          if (selectedWordId) {
            placeWord(
              selectedWordId,
              node.id
            );
          } else if (wordId) {
            clearSlot(node.id);
          }
        }}
        disabled={!isInteractive || isLocked}
        aria-label={
          answer
            ? `משבצת עם התשובה ${answer}`
            : "משבצת חסרה למילוי"
        }
      >
        <span
          className="second-practice-answer-text"
          dir="rtl"
        >
          {answer || ""}
        </span>

        {result && (
          <span
            className={[
              "second-practice-result-mark",
              isLocked
                ? "is-correct"
                : "is-incorrect",
            ].join(" ")}
            aria-hidden="true"
          >
            {isLocked ? "✓" : "×"}
          </span>
        )}
      </button>
    );
  };

  // ====================================
  // RENDER
  // ====================================

  const isIntro = stage === "intro";
  const isFinished = stage === "finished";

  return (
    <>
      {/* ====================================
          MAIN PRACTICE SCREEN

          Same layout as InfoPage page 35
      ==================================== */}

      <section
        className={[
          "second-practice",
          "info-page-receipt",
          stage === "success"
            ? "is-modal-open"
            : "",
        ].filter(Boolean).join(" ")}
        dir="rtl"
        aria-label="תרגול סדר פעולות בעת קבלת ציוד"
      >
        {/* LARGE BOX */}
        <div className="info-page-box">
          <img
            className="info-page-box-img"
            src={largeBox}
            alt=""
            draggable="false"
          />

          <h2 className="info-page-receipt-title">
            {isIntro
              ? "תרגול - הוראות"
              : "סדר פעולות בעת קבלת ציוד - תרגול"}
          </h2>

          {isIntro ? (
            <div className="second-practice-instructions">
              <p>
                בכל סבב יוצגו בתרשים
                כמה משבצות חסרות.
              </p>

              <p>
                גררו ממחסן המילים את
                התשובה המתאימה למשבצת,
                או בחרו מילה ולחצו
                על המשבצת הרצויה.
              </p>

              <p>
                לאחר מילוי המשבצות,
                לחצו על{" "}
                <strong>״הגשה״</strong>
                {" "}כדי לבדוק את התשובות.
              </p>

              <p>
                תשובות נכונות יינעלו.
                אם יש טעויות,
                תקנו אותן ונסו שוב.
              </p>
            </div>
          ) : (
            <div className="info-page-receipt-chart">
              <ReceiptFlowArrows />

              {RECEIPT_NODES.map(renderNode)}
            </div>
          )}
        </div>

        {/* ZIGI - SAME AS INFO PAGE */}
        <img
          className="info-page-receipt-zigi"
          src={sideZigi}
          alt="זיגי המלגזה"
          draggable="false"
        />

        {/* ROUND COUNTER */}
        {stage === "playing" && (
          <p className="second-practice-counter">
            סבב {roundIndex + 1} מתוך{" "}
            {ROUNDS.length}
          </p>
        )}

        {/* FEEDBACK */}
        {stage === "playing" && (
          <div
            className={`second-practice-feedback ${
              roundComplete
                ? "is-success"
                : ""
            }`}
            role="status"
            aria-live="polite"
          >
            {message ||
              `מולאו ${filledCount} מתוך ${missingIds.length} משבצות`}
          </div>
        )}

        {/* SUBMIT BUTTON */}
        {stage === "playing" &&
          !roundComplete && (
            <button
              type="button"
              className="second-practice-submit"
              onClick={submitAnswers}
              disabled={!canSubmit}
            >
              הגשה
            </button>
          )}

        {/* DRAG PREVIEW */}
        {dragPreview && (
          <div
            className="second-practice-drag-preview"
            style={{
              left: dragPreview.x,
              top: dragPreview.y,
            }}
            aria-hidden="true"
          >
            {
              WORD_BY_ID[
                dragPreview.wordId
              ]?.text
            }
          </div>
        )}

        {/* SUCCESS MODAL */}
        {stage === "success" && (
          <div className="second-practice-modal-backdrop">
            <div
              className="second-practice-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="second-practice-success-title"
            >
              <img
                className="second-practice-modal-box"
                src={largeBox}
                alt=""
                draggable="false"
              />

              <h2 className="second-practice-modal-title">
                תרגול
              </h2>

              <button
                className="second-practice-modal-close"
                type="button"
                onClick={() =>
                  setStage("finished")
                }
                aria-label="סגירת הודעת ההצלחה"
              >
                ×
              </button>

              <div
                className="second-practice-modal-text"
                id="second-practice-success-title"
              >
                <strong>
                  אלופים!
                </strong>

                <span>
                  סיימתם את התרגול,
                  הגיע הזמן להמשיך בלומדה.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* FINISHED STATUS */}
        {isFinished && (
          <div
            className="second-practice-finished-status"
            role="status"
          >
            כל שלושת הסבבים הושלמו בהצלחה!
          </div>
        )}
      </section>

      {/* ====================================
          WORD BANK - RIGHT SIDE

          Rendered beside the main section
          to remain clickable over other
          interface layers.
      ==================================== */}

      {stage === "playing" && (
        <aside
          className="second-practice-catalog"
          dir="rtl"
          aria-label="מחסן מילים"
        >
          {/* UP ARROW */}
          <button
            type="button"
            className="second-practice-catalog-arrow"
            onClick={() => scrollCatalog(-1)}
            disabled={!scrollState.canUp}
            aria-label="גלילה למעלה"
          >
            <svg
              viewBox="0 0 32 28"
              aria-hidden="true"
            >
              <path d="M5 21 L16 10 L27 21" />
            </svg>
          </button>

          {/* ALL 11 WORD CARDS */}
          <div
            className="second-practice-catalog-list"
            ref={catalogRef}
            onScroll={updateScrollState}
          >
            {WORD_BANK.map((word) => {
              const isUsed =
                usedWordIds.has(word.id);

              const isSelected =
                selectedWordId === word.id;

              return (
                <button
                  key={word.id}
                  type="button"
                  className={[
                    "second-practice-option",
                    word.emphasized
                      ? "is-emphasized"
                      : "",
                    isUsed
                      ? "is-used"
                      : "",
                    isSelected
                      ? "is-selected"
                      : "",
                  ].filter(Boolean).join(" ")}
                  disabled={
                    isUsed || roundComplete
                  }
                  onPointerDown={(event) =>
                    beginPointer(
                      event,
                      word.id
                    )
                  }
                  onClick={() =>
                    selectWord(word.id)
                  }
                  aria-pressed={isSelected}
                  aria-label={
                    `בחירת מילה: ${word.text}`
                  }
                >
                  {word.text}
                </button>
              );
            })}
          </div>

          {/* DOWN ARROW */}
          <button
            type="button"
            className="second-practice-catalog-arrow"
            onClick={() => scrollCatalog(1)}
            disabled={!scrollState.canDown}
            aria-label="גלילה למטה"
          >
            <svg
              viewBox="0 0 32 28"
              aria-hidden="true"
            >
              <path d="M5 7 L16 18 L27 7" />
            </svg>
          </button>
        </aside>
      )}
    </>
  );
}

export default SecondPractice;
