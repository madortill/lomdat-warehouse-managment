import React from "react";
import { useState } from "react";
import zigiFirst from "../../../media/zigi-first.svg"
import startBox from "../../../media/start-button.svg"
import "./FirstPage.css";

function FirstPage({toNextPage}) {
    return (
        <>
          <div className="app">
           {/* <img className="about-img" src="media/info.svg"/> */}
          <img className="start-button-first-page" onClick={toNextPage} src={startBox} alt="start box"/>
          <img className="zigi-first-page" src={zigiFirst} alt="zigi"/>
          <div className="titles-div">
          <h3 className="first-page-welcome">ברוכים הבאים ללומדת</h3>
          <h1 className="first-page-title">ניהול מחסן</h1>
          </div>
          </div>
        </>
      );
}

export default FirstPage;