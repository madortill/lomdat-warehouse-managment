
import { useState } from "react";

import content from "../../../data/InfoPageData.json";

import largeBox from "../../../media/InfoPage/large-box.svg";
import smallBox from "../../../media/InfoPage/small-box.svg";
import sideZigi from "../../../media/InfoPage/side-zigi.svg";
import floorImage from "../../../media/InfoPage/section2-floor-text.svg";

import fire from "../../../media/InfoPage/fire.svg";
import insects from "../../../media/InfoPage/insects.svg";
import mushrooms from "../../../media/InfoPage/mushrooms.svg";
import sun from "../../../media/InfoPage/sun.svg";

import supplyFile from "../../../media/InfoPage/supply-file.svg";
import supplyTable from "../../../media/InfoPage/supply-table.svg";
import erp from "../../../media/InfoPage/erp.svg";

import "./InfoPage.css";

// ====================================
// PAGE NUMBERS
// ====================================

export const EQUIPMENT_RECEIPT_PAGE = 35;
export const WAREHOUSE_CONTROL_PAGE = 37;
export const WAREHOUSE_CONTROL_CARD_COUNT = 3;

// ====================================
// ORIGINAL FLIP CARD IMAGES
// ====================================

const CARD_IMAGES = {
  fire,
  insects,
  mushrooms,
  sun,
};

// ====================================
// WAREHOUSE CONTROL CARDS
//
// סדר הכרטיסיות:
// 1. דף תכולה
// 2. טבלת פריטים קריטיים
// 3. מערכת ERP
//
// התמונות משויכות לפי התיקון
// שביצענו קודם.
// ====================================

const WAREHOUSE_CONTROL_CARDS = [
  {
    id: "supply-file",
    title: "דף תכולה",
    image: supplyTable,
    description:
      "דף תכולה הוא מסמך המוצג בקדמת תא האחסון ובו מידע על הציוד המאוחסן, הכמות ומיקום האחסנה.",
  },
  {
    id: "supply-table",
    title: "טבלת פריטים קריטיים",
    image: supplyFile,
    description:
      "טבלת פריטים קריטיים מסייעת במעקב אחר פריטים חיוניים במחסן, לרבות מיקומם, תקינותם והערות נוספות.",
  },
  {
    id: "erp",
    title: "מערכת ERP",
    image: erp,
    description:
      "מערכת ERP היא מערכת ממוחשבת לניהול המלאי במחסן. המערכת מאפשרת מעקב אחר קליטות, ניפוקים ותנועות ציוד.",
  },
];

// ====================================
// EQUIPMENT RECEIPT FLOW NODES
// PAGE 35
//
// משותף גם ל-SecondPractice
// ====================================

export const RECEIPT_NODES = [
  {
    id: "check",
    text: "בדיקת הציוד",
    x: 50,
    y: 7,
    width: "25%",
  },
  {
    id: "not-good",
    text: "לא תקין",
    x: 31.5,
    y: 23.5,
    width: "25%",
  },
  {
    id: "good",
    text: "תקין",
    x: 70,
    y: 23.5,
    width: "25%",
  },
  {
    id: "needs-treatment",
    text: "דרוש טיפול",
    x: 20,
    y: 44.5,
    width: "22.5%",
  },
  {
    id: "worn",
    text: "בלוי",
    x: 51,
    y: 44.5,
    width: "22.5%",
  },
  {
    id: "return-good",
    text: "חזרה לארגז",
    x: 83,
    y: 44.5,
    width: "23%",
    emphasized: true,
  },
  {
    id: "recheck",
    text: "בדיקה חוזרת",
    x: 11.5,
    y: 62,
    width: "21%",
  },
  {
    id: "waste",
    text: "בלאי",
    x: 37,
    y: 62,
    width: "21%",
  },
  {
    id: "good-after-check",
    text: "תקין",
    x: 11.5,
    y: 78,
    width: "21%",
  },
  {
    id: "waste-corner",
    text: "פינת בלאי",
    x: 37,
    y: 78,
    width: "21%",
    emphasized: true,
  },
  {
    id: "return-after-check",
    text: "חזרה לארגז",
    x: 11.5,
    y: 93,
    width: "21%",
    emphasized: true,
  },
];

// ====================================
// RECEIPT FLOW ARROWS
// PAGE 35
// ====================================

export function ReceiptFlowArrows() {
  return (
    <svg
      className="info-page-receipt-lines"
      viewBox="0 0 1000 650"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <marker
          id="receipt-green-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5.5"
          markerHeight="5.5"
          orient="auto"
        >
          <path
            d="M0 0 L10 5 L0 10 Z"
            fill="#62A85B"
          />
        </marker>

        <marker
          id="receipt-red-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5.5"
          markerHeight="5.5"
          orient="auto"
        >
          <path
            d="M0 0 L10 5 L0 10 Z"
            fill="#E15B55"
          />
        </marker>
      </defs>

      <path
        className="info-page-flow-path is-red"
        d="M375 47 C315 47 315 77 315 107"
        markerEnd="url(#receipt-red-arrow)"
      />

      <path
        className="info-page-flow-path is-green"
        d="M625 47 C700 47 700 77 700 107"
        markerEnd="url(#receipt-green-arrow)"
      />

      <path
        className="info-page-flow-path is-red"
        d="M190 153 C104 159 112 232 200 246"
        markerEnd="url(#receipt-red-arrow)"
      />

      <path
        className="info-page-flow-path is-red"
        d="M440 153 C510 153 510 210 510 250"
        markerEnd="url(#receipt-red-arrow)"
      />

      <path
        className="info-page-flow-path is-green"
        d="M825 153 C915 153 875 222 830 250"
        markerEnd="url(#receipt-green-arrow)"
      />

      <path
        className="info-page-flow-path is-green"
        d="M89 289 C34 302 47 350 115 358"
        markerEnd="url(#receipt-green-arrow)"
      />

      <path
        className="info-page-flow-path is-red"
        d="M310 289 C355 291 370 333 370 360"
        markerEnd="url(#receipt-red-arrow)"
      />

      <path
        className="info-page-flow-path is-red"
        d="M588 322 C584 407 481 489 475 507"
        markerEnd="url(#receipt-red-arrow)"
      />

      <path
        className="info-page-flow-path is-green"
        d="M115 444 L115 467"
        markerEnd="url(#receipt-green-arrow)"
      />

      <path
        className="info-page-flow-path is-red"
        d="M370 445 L370 464"
        markerEnd="url(#receipt-red-arrow)"
      />

      <path
        className="info-page-flow-path is-green"
        d="M115 548 L115 563"
        markerEnd="url(#receipt-green-arrow)"
      />
    </svg>
  );
}

// ====================================
// PAGE 35 - EQUIPMENT RECEIPT
// ====================================

function EquipmentReceiptFlow() {
  return (
    <section
      className="info-page info-page-receipt"
      dir="rtl"
      aria-label="סדר פעולות בעת קבלת ציוד"
    >
      <div className="info-page-box">
        <img
          className="info-page-box-img"
          src={largeBox}
          alt=""
          draggable="false"
        />

        <h2 className="info-page-receipt-title">
          סדר פעולות בעת קבלת ציוד
        </h2>

        <div className="info-page-receipt-chart">
          <ReceiptFlowArrows />

          {RECEIPT_NODES.map((node) => (
            <div
              key={node.id}
              className={`info-page-receipt-node ${
                node.emphasized
                  ? "is-emphasized"
                  : ""
              }`}
              style={{
                "--node-x": `${node.x}%`,
                "--node-y": `${node.y}%`,
                "--node-width": node.width,
              }}
            >
              <span dir="rtl">{node.text}</span>
            </div>
          ))}
        </div>
      </div>

      <img
        className="info-page-receipt-zigi"
        src={sideZigi}
        alt="זיגי המלגזה"
        draggable="false"
      />
    </section>
  );
}

// ====================================
// PAGE 37 - WAREHOUSE CONTROL CARDS
//
// שלוש כרטיסיות בתוך הארגז הגדול.
//
// הכרטיסייה הפעילה גדולה,
// האחרות קטנות.
//
// שלוש נקודות הניווט נמצאות
// מחוץ לכרטיסיות, מתחתיהן,
// אבל עדיין בתוך הארגז הגדול.
// ====================================

function WarehouseControlCards({
  activeIndex = 0,
  onChange,
}) {
  const safeIndex = Math.max(
    0,
    Math.min(
      WAREHOUSE_CONTROL_CARD_COUNT - 1,
      activeIndex
    )
  );

  const changeCard = (index) => {
    if (index === safeIndex) return;

    onChange?.(index);
  };

  return (
    <section
      className="info-page info-page-control"
      dir="rtl"
      aria-label="עזרי השליטה במחסן"
    >
      <div className="info-page-box">
        {/* ====================================
            LARGE BOX BACKGROUND
        ==================================== */}

        <img
          className="info-page-box-img"
          src={largeBox}
          alt=""
          draggable="false"
        />

        {/* ====================================
            MAIN TITLE
        ==================================== */}

        <h2 className="info-page-control-title">
          עזרי השליטה במחסן
        </h2>

        {/* ====================================
            THREE CARDS
        ==================================== */}

        <div className="info-page-control-cards">
          {WAREHOUSE_CONTROL_CARDS.map(
            (card, index) => {
              const isActive =
                index === safeIndex;

              return (
                <div
                  key={card.id}
                  className={[
                    "info-page-control-card",
                    isActive
                      ? "is-active"
                      : "is-inactive",
                  ].join(" ")}
                >
                  {/* לחיצה על כרטיסייה מצומצמת */}

                  <button
                    type="button"
                    className="info-page-control-card-select"
                    onClick={() => changeCard(index)}
                    disabled={isActive}
                    aria-label={
                      isActive
                        ? `כרטיסייה פעילה: ${card.title}`
                        : `פתיחת הכרטיסייה: ${card.title}`
                    }
                  />

                  {/* תוכן הכרטיסייה הפעילה */}

                  {isActive && (
                    <div className="info-page-control-card-content">
                      <h3 className="info-page-control-card-heading">
                        {card.title}
                      </h3>

                      <img
                        className="info-page-control-card-image"
                        src={card.image}
                        alt={card.title}
                        draggable="false"
                      />

                      <p className="info-page-control-card-description">
                        {card.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>

        {/* ====================================
            THREE NAVIGATION DOTS

            מחוץ לכרטיסיות!
            מתחת לקבוצת הכרטיסיות!
            עדיין בתוך הקופסה הגדולה!
        ==================================== */}

        <nav
          className="info-page-control-dots"
          aria-label="מעבר בין כרטיסיות"
        >
          {WAREHOUSE_CONTROL_CARDS.map(
            (card, index) => {
              const isCurrent =
                index === safeIndex;

              return (
                <button
                  key={card.id}
                  type="button"
                  className={`info-page-control-dot ${
                    isCurrent
                      ? "is-current"
                      : ""
                  }`}
                  onClick={() => changeCard(index)}
                  aria-label={`מעבר לכרטיסייה ${index + 1}: ${card.title}`}
                  aria-current={
                    isCurrent
                      ? "step"
                      : undefined
                  }
                />
              );
            }
          )}
        </nav>
      </div>

      {/* ====================================
          ZIGI
      ==================================== */}

      <img
        className="info-page-control-zigi"
        src={sideZigi}
        alt="זיגי המלגזה"
        draggable="false"
      />
    </section>
  );
}

// ====================================
// MAIN INFO PAGE COMPONENT
// ====================================

function InfoPage({
  pageNum,
  onCardSeen,
  seenCardIds = [],
  controlCardIndex = 0,
  onControlCardChange,
}) {
  const [flippedCards, setFlippedCards] =
    useState([]);

  // ====================================
  // ORIGINAL FLIP CARDS
  // ====================================

  const handleCardClick = (cardIndex) => {
    const isFlipped =
      flippedCards.includes(cardIndex);

    setFlippedCards((prev) =>
      isFlipped
        ? prev.filter(
            (index) => index !== cardIndex
          )
        : [...prev, cardIndex]
    );

    if (!isFlipped) {
      onCardSeen?.(cardIndex);
    }
  };

  // ====================================
  // PAGE 37 - CONTROL CARDS
  // ====================================

  if (pageNum === WAREHOUSE_CONTROL_PAGE) {
    return (
      <WarehouseControlCards
        activeIndex={controlCardIndex}
        onChange={onControlCardChange}
      />
    );
  }

  // ====================================
  // PAGE 35 - RECEIPT FLOW
  // ====================================

  if (pageNum === EQUIPMENT_RECEIPT_PAGE) {
    return <EquipmentReceiptFlow />;
  }

  // ====================================
  // PAGE 2 - FLIPPING CARDS
  // ====================================

  if (pageNum === content.flipScreen.page) {
    return (
      <section className="info-page" dir="rtl">
        <div className="info-page-box">
          <img
            className="info-page-box-img"
            src={largeBox}
            alt=""
            draggable="false"
          />

          <h2 className="info-page-title">
            {content.topicTitle}
          </h2>

          <p className="info-page-subtitle">
            {content.flipScreen.subtitle}
          </p>

          <p className="info-page-subtitle-instructions">
            - לחצו על הכרטיסיות כדי ללמוד -
          </p>

          <h3 className="info-page-question">
            {content.flipScreen.question}
          </h3>

          <div className="info-page-cards">
            {content.flipScreen.cards.map(
              (card, index) => {
                const isFlipped =
                  flippedCards.includes(index);

                return (
                  <button
                    key={card.id}
                    type="button"
                    className={`info-flip-card ${
                      isFlipped
                        ? "is-flipped"
                        : ""
                    }`}
                    onClick={() =>
                      handleCardClick(index)
                    }
                    aria-pressed={isFlipped}
                    aria-label={
                      isFlipped
                        ? `הסתרת כרטיס ${card.title}`
                        : `חשיפת כרטיס מספר ${index + 1}`
                    }
                  >
                    <span className="info-flip-card-inner">
                      <span
                        className="info-flip-card-front"
                        aria-hidden="true"
                      />

                      <span
                        className="info-flip-card-back"
                        aria-hidden="true"
                      >
                        <span className="info-card-title">
                          {card.title}
                        </span>

                        <img
                          className="info-card-icon"
                          src={CARD_IMAGES[card.id]}
                          alt=""
                          draggable="false"
                        />
                      </span>
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>

        <img
          className="info-page-zigi"
          src={sideZigi}
          alt="זיגי המלגזה"
          draggable="false"
        />

        <p
          className="info-page-progress"
          role="status"
        >
          נחשפו {seenCardIds.length} מתוך{" "}
          {content.flipScreen.cards.length} כרטיסיות
        </p>
      </section>
    );
  }

  // ====================================
  // PAGE 3 - FLOOR SCREEN
  // ====================================

  if (pageNum === content.floorScreen.page) {
    return (
      <section
        className="info-page info-page-floor"
        dir="rtl"
      >
        <h2 className="info-page-global-title">
          {content.topicTitle}
        </h2>

        <img
          className="info-page-floor-image"
          src={floorImage}
          alt="סעיף 2 - אפשרויות קבלה, הוצאה ופריסה של האפסניה"
          draggable="false"
        />
      </section>
    );
  }

  // ====================================
  // PAGE 8 - WAREHOUSE ORDER
  // ====================================

  if (
    pageNum ===
    content.warehouseOrderScreen.page
  ) {
    return (
      <section
        className="info-page info-page-warehouse-order"
        dir="rtl"
      >
        <div className="info-page-box">
          <img
            className="info-page-box-img"
            src={largeBox}
            alt=""
            draggable="false"
          />

          <h2 className="info-page-title info-page-title-wide">
            {content.warehouseOrderScreen.title}
          </h2>

          <div className="info-page-order-cards">
            {content.warehouseOrderScreen.cards.map(
              (card) => (
                <div
                  key={card.number}
                  className="info-page-order-card"
                >
                  <h3 className="info-page-order-card-number">
                    {card.number}
                  </h3>

                  <p className="info-page-order-card-text">
                    {card.text}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        <img
          className="info-page-zigi"
          src={sideZigi}
          alt="זיגי המלגזה"
          draggable="false"
        />
      </section>
    );
  }

  // ====================================
  // PAGES 4-7 - TEXT SCREENS
  // ====================================

  const currentScreen =
    content.textScreens.find(
      (screen) => screen.page === pageNum
    );

  if (currentScreen) {
    return (
      <section
        className="info-page info-page-small"
        dir="rtl"
      >
        <h2 className="info-page-global-title">
          {content.topicTitle}
        </h2>

        <img
          className="info-page-small-zigi"
          src={sideZigi}
          alt="זיגי המלגזה"
          draggable="false"
        />

        <div className="info-page-small-box">
          <img
            className="info-page-small-box-image"
            src={smallBox}
            alt=""
            draggable="false"
          />

          <p className="info-page-small-text">
            {currentScreen.number}.{" "}
            {currentScreen.text}
          </p>
        </div>
      </section>
    );
  }

  return null;
}

export default InfoPage;
