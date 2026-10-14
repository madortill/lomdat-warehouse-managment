
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
// תמונות הכרטיסיות
// ====================================

const CARD_IMAGES = {
  fire,
  insects,
  mushrooms,
  sun,
};

function InfoPage({
  pageNum,
  onCardSeen,
  seenCardIds = [],
}) {
  const [flippedCards, setFlippedCards] = useState([]);

  // ====================================
  // טיפול בלחיצה על כרטיסייה
  // ====================================

  const handleCardClick = (cardIndex) => {
    const isFlipped = flippedCards.includes(cardIndex);

    setFlippedCards((prev) =>
      isFlipped
        ? prev.filter((index) => index !== cardIndex)
        : [...prev, cardIndex]
    );

    // הכרטיסייה נספרת רק בחשיפה הראשונה
    if (!isFlipped) {
      onCardSeen?.(cardIndex);
    }
  };

  // ====================================
  // עמוד 2 - הכרטיסיות המתהפכות
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

            {content.flipScreen.cards.map((card, index) => {
              const isFlipped = flippedCards.includes(index);

              return (
                <button
                  key={card.id}
                  type="button"
                  className={`info-flip-card ${
                    isFlipped ? "is-flipped" : ""
                  }`}
                  onClick={() => handleCardClick(index)}
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
            })}

          </div>

        </div>

        <img
          className="info-page-zigi"
          src={sideZigi}
          alt="זיגי המלגזה"
          draggable="false"
        />

        <p className="info-page-progress" role="status">
          נחשפו {seenCardIds.length} מתוך{" "}
          {content.flipScreen.cards.length} כרטיסיות
        </p>

      </section>
    );
  }

  // ====================================
  // עמוד 3 - מסך הרצפה
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
  // עמוד 8 - סידור המחסן ושמירה
  // על כשירות האפסניה
  // ====================================

  if (pageNum === content.warehouseOrderScreen.page) {
    return (
      <section
        className="info-page info-page-warehouse-order"
        dir="rtl"
      >

        <div className="info-page-box">

          {/* הקופסה הגדולה - כמו בעמוד 2 */}
          <img
            className="info-page-box-img"
            src={largeBox}
            alt=""
            draggable="false"
          />

          {/* הכותרת על הקופסה */}
          <h2 className="info-page-title info-page-title-wide">
            {content.warehouseOrderScreen.title}
          </h2>

          {/* שתי כרטיסיות המידע */}
          <div className="info-page-order-cards">

            {content.warehouseOrderScreen.cards.map((card) => (
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
            ))}

          </div>

        </div>

        {/* זיגי - באותו מיקום של עמוד הכרטיסיות */}
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
  // עמודים 4-7 - מסכי המידע
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
            {currentScreen.number}. {currentScreen.text}
          </p>

        </div>

      </section>
    );
  }

  return null;
}

export default InfoPage;
