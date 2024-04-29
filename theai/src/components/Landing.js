import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import logo from "./img/logoo.svg";
import research from "./img/research.png";
import flow from "./img/flow.png";

import "./Landing.css";

function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      <div id="nav">
        <img className="logo" src={logo} alt="logo" />
        <div
          className="menu"
          onClick={() => {
            setMenuOpen(!menuOpen);
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div id="nav-part2">
          <div id="links">
            <ul className={menuOpen ? "open" : ""}>
              <li>
                <NavLink to="/login" className="button">
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/home" className="button">
                  Try Now
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div id="main">
        <div id="page1">
          <div className="wrap">
            <h1 className="header">
              CHANGE <br />
              THE COURSE
            </h1>
          </div>
        </div>
        <div className="page2">
          <div id="about">
            <h1 className="about-section">What we do</h1>
            <div className="about-content">
              <div className="about-para">
                <p>
                  <b>TheAIWriter</b> streamlines the process of transforming
                  project concepts into comprehensive research papers. Our
                  advanced AI agents, powered by LangChain and OpenAI LLM,
                  conduct thorough research by analyzing reputable sources and
                  academic literature. Users can customize preferences, ensuring
                  the generated research paper aligns with their specific
                  requirements. The final product is promptly delivered, ready
                  for submission or further refinement. With TheAIWriter,
                  professional-grade research papers are within reach.
                </p>
              </div>
              <div className="about-img">
                <img src={research} alt="research" className="img" />
              </div>
            </div>
          </div>
        </div>
        <div className="page2">
          <div id="about">
            <h1 className="about-section">How we do</h1>
            <div className="about-content">
              <div className="about-img">
                <img src={flow} alt="research" className="img" />
              </div>
              <div className="about-para">
                <p>
                  Our platform employs cutting-edge technologies and
                  methodologies to streamline the process of generating research
                  papers. Through the integration of AI agents built on
                  LangChain and OpenAI LLM. These agents make the retrieved data
                  into concise summaries while preserving key insights and
                  ensuring coherence. Additionally, our platform adheres to
                  established academic formatting standards, such as APA or MLA,
                  to present the research paper in a professional manner. We
                  continuously refine our algorithms and models based on user
                  feedback and the latest advancements in AI, ensuring optimal
                  performance and accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
