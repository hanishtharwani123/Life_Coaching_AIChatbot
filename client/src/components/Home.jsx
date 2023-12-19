import React, { useState } from "react";
import "../styles/Home.css";
import img from "../assets/img.png";
import chat from "../assets/chat.png";
import Prompt from "./prompt";
import { Link } from "react-router-dom";

const Home = () => {
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => setShowModal(false);
  return (
    <>
      <div className="contain">
        <header>
          <h1 className="logo_name">NurtureNudge</h1>
          <Link
            className="login"
            to="https://my-portfolio-website-three-delta.vercel.app/"
          >
            My Portfolio
          </Link>
        </header>
        <div className="main">
          <div className="cont">
            <h1 className="tagline">
              Navigate Life's Challenges with Confidence. Unleash Your Potential
              through Personalized Life Coaching Conversations
            </h1>
            <div className="btn">
              <button
                className={`circle ${showModal ? "pop" : ""}`}
                onClick={() => setShowModal(true)}
              >
                <img src={chat} alt="chat" className="chat" />
              </button>
            </div>
          </div>
          <div className="imgg">
            <img src={img} alt="life" className="life_img" />
          </div>
        </div>
        <div className="me">
          <h1 className="hanish">Made with ❤️ by Hanish</h1>
        </div>
      </div>
      {showModal && <Prompt closeModal={closeModal} />}
    </>
  );
};

export default Home;
