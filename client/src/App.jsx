import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Prompt_Chat from "./components/prompt.jsx";
import Home from "./components/Home.jsx";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Prompt_Chat" element={<Prompt_Chat />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
