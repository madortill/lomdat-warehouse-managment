
import React from "react";

import nextArrow from "../../../media/NavigationArrows/next-arrow.svg";
import backArrow from "../../../media/NavigationArrows/back-arrow.svg";

import "./NavigationArrows.css";

function NavigationArrows({
    onNext,
    onBack,
    canGoNext = true,
    canGoBack = true,
}) {
    return (
        <nav className="navigation-arrows" aria-label="ניווט בין מסכים">

            {/* כפתור הבא - צד שמאל */}
            <button
                type="button"
                className="navigation-arrow navigation-arrow-next"
                onClick={onNext}
                disabled={!canGoNext}
                aria-label="לעמוד הבא"
            >
                <img src={nextArrow} alt="" draggable="false" />
            </button>

            {/* כפתור חזור - צד ימין */}
            <button
                type="button"
                className="navigation-arrow navigation-arrow-back"
                onClick={onBack}
                disabled={!canGoBack}
                aria-label="חזרה לעמוד הקודם"
            >
                <img src={backArrow} alt="" draggable="false" />
            </button>

        </nav>
    );
}

export default NavigationArrows;
