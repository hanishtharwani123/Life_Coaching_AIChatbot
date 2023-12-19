import React, { useEffect, useRef, useState } from "react";
import "../styles/prompt.css";
import axios from "axios";
import cross from "../assets/cross.png";
import baseUrl from "../baseUrl";

const Prompt = ({ closeModal }) => {
  const [prompt, setPrompt] = useState("");
  const [input, setInput] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const savedInput = JSON.parse(sessionStorage.getItem("chatHistory")) || [];
    setInput(savedInput);

    setInput((prevInput) => [
      ...prevInput,
      {
        id: Date.now(),
        prompt:
          "Awesome to have you here! 😊 What specific area of your life are you looking to enhance or explore? Whether it's goals, self-discovery, or general well-being, let me know what you need guidance on, and let's make progress together! 💬🌟",
        response: "Share goals/questions, let's navigate together!",
      },
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [input]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setPrompt("");

      const newMessage = {
        id: Date.now(),
        prompt: prompt || selectedPrompt,
        response: "",
      };

      setInput((prevInput) => [...prevInput, newMessage]);

      const res = await axios.post(`${baseUrl}/prompt`, {
        prompt: prompt || selectedPrompt,
      });

      setInput((prevInput) =>
        prevInput.map((item) =>
          item.prompt === (prompt || selectedPrompt)
            ? { ...item, response: res.data.response }
            : item
        )
      );

      setSelectedPrompt("");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handlePromptClick = (selected) => {
    setSelectedPrompt(selected);
  };

  const clearChat = () => {
    setInput([]);
    sessionStorage.removeItem("chatHistory");
  };

  useEffect(() => {
    return () => {
      clearChat();
    };
  }, []);

  return (
    <>
      <div className="container">
        <div className="box">
          <img src={cross} alt="cross" className="cross" onClick={closeModal} />
          <div className="heading">
            <h1 className="life_coaching">
              Your personal chatbot companion for transformative life coaching
              conversations.
            </h1>
          </div>
          <hr className="line" />
          <div className="show_chat">
            {input.map((item) => (
              <div className="part" key={item.id}>
                <div className="card1">
                  <p className="question">{item.prompt}</p>
                </div>
                <div className="card2">
                  <p className="question">
                    {(loading &&
                      (item.prompt === prompt ||
                        item.prompt === selectedPrompt)) ||
                    (!item.response && loading)
                      ? "Loading..."
                      : item.response}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="input_prompt">
            <div className="prompt-list">
              <button
                className="prompt-btn"
                onClick={() =>
                  handlePromptClick(
                    "How can I overcome self-doubt and build confidence in my personal and professional life?"
                  )
                }
              >
                Prompt 1
              </button>
              <button
                className="prompt-btn"
                id="btn3"
                onClick={() =>
                  handlePromptClick(
                    "What strategies can I use to set and achieve meaningful goals in my life?"
                  )
                }
              >
                Prompt 2
              </button>
              <button
                className="prompt-btn"
                id="btn2"
                onClick={() =>
                  handlePromptClick(
                    "What steps can I take to discover my life's purpose and align it with my career?"
                  )
                }
              >
                Prompt 3
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="prompt"
                placeholder="Type your prompt here..."
                value={prompt || selectedPrompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button type="submit" className="send" disabled={loading}>
                {loading ? "Sending..." : "Send"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Prompt;
