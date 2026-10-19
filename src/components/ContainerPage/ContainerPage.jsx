
import React from "react";

import containerBackground from "../../../media/ContainerPage/container-background.png";
import containerTitle from "../../../media/ContainerPage/container-title.svg";

import "./ContainerPage.css";

function ContainerPage({ pageNum }) {

  const pages = [
    {
      page: 18,
      content: (
        <p>
          מכולה היא תיבה גדולה העשויה לרוב ממתכת
          ומשמשת להובלת מטען ואחסנת ציוד בצה״ל
          ביחידות השונות. ישנן מספר סוגים וגדלים
          של מכולות.
        </p>
      ),
    },
    {
      page: 19,
      content: (
        <>
          <p>
            ישנן יחידות שבהן ייעוד המכולה הוא
            לשמש כמחסן ציוד לכל דבר, כמו למשל
            גדודים שנעים לאורך השנה בין
            מוצבים שונים בארץ.
          </p>

          <p className="container-page-bold">
            הציוד יאוחסן במכולה סגורה ומקורה,
            באופן הדומה לאחסונו במחסן בנוי.
          </p>
        </>
      ),
    },
  ];

  const currentPage = pages.find(
    (page) => page.page === pageNum
  );

  if (!currentPage) return null;

  return (
    <section className="container-page" dir="rtl">

      <img
        className="container-page-background"
        src={containerBackground}
        alt=""
        draggable="false"
      />

      <img
        className="container-page-title"
        src={containerTitle}
        alt="אחסנת אפסניה במכולות"
        draggable="false"
      />

      <div className="container-page-text-wrapper">
        <div className="container-page-text">
          {currentPage.content}
        </div>
      </div>

    </section>
  );
}

export default ContainerPage;
