
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

import "./InfoPage.css";

// ====================================
// NEW PAGE - EQUIPMENT RECEIPT FLOW
// ====================================

export const EQUIPMENT_RECEIPT_PAGE = 35;

// ====================================
// CARD IMAGES
// ====================================

const CARD_IMAGES = {
  fire,
  insects,
  mushrooms,
  sun,
};

// ====================================
// RECEIPT FLOW - NODES
//
// x, y: מיקום בתוך אזור התרשים באחוזים
// width: רוחב הכרטיסייה
// ====================================

const RECEIPT_NODES = [
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
// RECEIPT FLOW - CONNECTING ARROWS
//
// חיצים ירוקים: מסלול תקין
// חיצים אדומים: טיפול או בלאי
// ====================================

function ReceiptFlowArrows() {
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
            d="M 0 0 L 10 5 L 0 10 Z"
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
            d="M 0 0 L 10 5 L 0 10 Z"
            fill="#E15B55"
          />
        </marker>
      </defs>

      {/* בדיקת הציוד -> לא תקין */}
      <path
        className="info-page-flow-path is-red"
        d="M 375 47 C 315 47, 315 77, 315 107"
        markerEnd="url(#receipt-red-arrow)"
      />

      {/* בדיקת הציוד -> תקין */}
      <path
        className="info-page-flow-path is-green"
        d="M 625 47 C 700 47, 700 77, 700 107"
        markerEnd="url(#receipt-green-arrow)"
      />

      {/* לא תקין -> דרוש טיפול */}
      <path
        className="info-page-flow-path is-red"
        d="M 190 153 C 104 159, 112 232, 200 246"
        markerEnd="url(#receipt-red-arrow)"
      />

      {/* לא תקין -> בלוי */}
      <path
        className="info-page-flow-path is-red"
        d="M 440 153 C 510 153, 510 210, 510 250"
        markerEnd="url(#receipt-red-arrow)"
      />

      {/* תקין -> חזרה לארגז */}
      <path
        className="info-page-flow-path is-green"
        d="M 825 153 C 915 153, 875 222, 830 250"
        markerEnd="url(#receipt-green-arrow)"
      />

      {/* דרוש טיפול -> בדיקה חוזרת */}
      <path
        className="info-page-flow-path is-green"
        d="M 89 289 C 34 302, 47 350, 115 358"
        markerEnd="url(#receipt-green-arrow)"
      />

      {/* דרוש טיפול -> בלאי */}
      <path
        className="info-page-flow-path is-red"
        d="M 310 289 C 355 291, 370 333, 370 360"
        markerEnd="url(#receipt-red-arrow)"
      />

      {/* בלוי -> פינת בלאי */}
      <path
        className="info-page-flow-path is-red"
        d="M 588 322 C 584 407, 481 489, 475 507"
        markerEnd="url(#receipt-red-arrow)"
      />

      {/* בדיקה חוזרת -> תקין */}
      <path
        className="info-page-flow-path is-green"
        d="M 115 444 L 115 467"
        markerEnd="url(#receipt-green-arrow)"
      />

      {/* בלאי -> פינת בלאי */}
      <path
        className="info-page-flow-path is-red"
        d="M 370 445 L 370 464"
        markerEnd="url(#receipt-red-arrow)"
      />

      {/* תקין -> חזרה לארגז */}
      <path
        className="info-page-flow-path is-green"
        d="M 115 548 L 115 563"
        markerEnd="url(#receipt-green-arrow)"
      />
    </svg>
  );
}

// ====================================
// RECEIPT FLOW SCREEN
// PAGE 35
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
              <span dir="rtl">
                {node.text}
              </span>
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
// MAIN INFO PAGE COMPONENT
// ====================================

function InfoPage({
  pageNum,
  onCardSeen,
  seenCardIds = [],
}) {
  const [flippedCards, setFlippedCards] = useState([]);

  // ====================================
  // HANDLE CARD CLICK
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
  // PAGE 35 - EQUIPMENT RECEIPT FLOW
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
                        : `חשיפת כרטיס מספר ${
                            index + 1
                          }`
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
                          src={
                            CARD_IMAGES[card.id]
                          }
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

  const currentScreen = content.textScreens.find(
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
