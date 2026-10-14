
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


// התאמה בין מזהה האייקון בקובץ JSON לבין התמונה
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

  const handleCardClick = (cardId) => {
    const isFlipped = flippedCards.includes(cardId);

    setFlippedCards((prev) =>
      prev.includes(cardId)
        ? prev.filter((id) => id !== cardId)
        : [...prev, cardId]
    );

    if (!isFlipped) {
      onCardSeen?.(cardId);
    }
  };


  // ====================================
  // מסך הכרטיסיות - עמוד 2
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
            - לחצו על הכטיסיות כדי ללמוד -
          </p>

          <h3 className="info-page-question">
            {content.flipScreen.question}
          </h3>

          <div className="info-page-cards">

            {content.flipScreen.cards.map((card, index) => {
              const isFlipped = flippedCards.includes(card.id);

              return (
                <button
                  key={card.id}
                  type="button"
                  className={`info-flip-card ${
                    isFlipped ? "is-flipped" : ""
                  }`}
                  onClick={() => handleCardClick(card.id)}
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
  // מסך סעיף 2 - רצפה זוהרת
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
  // מסכי סעיפים 3 עד 6
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
