require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const { urlencoded } = require("body-parser");
const port = process.env.PORT || 5000;
const OpenAI = require("openai");

const PromptModel = require("./models/schema");
require("./db/connect");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/save", async (req, res) => {
  try {
    const data = await PromptModel.find();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function callThisFunction(prompt) {
  try {
    let responseContent = "";

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
      model: "gpt-3.5-turbo",
    });
    responseContent += completion.choices[0].message.content;
    console.log(responseContent);
    return responseContent;
  } catch (err) {
    console.error(err);
    throw new Error("Internal Server Error");
  }
}

app.post("/prompt", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const isRelated = await isLifeCoachingRelated(prompt);

    if (isRelated) {
      const responseContent = await callThisFunction(prompt);
      const saveToDatabase = new PromptModel({
        prompt: prompt,
        response: responseContent,
      });

      await saveToDatabase.save();
      res.send(saveToDatabase);
    } else {
      const saveToDatabase = new PromptModel({
        prompt: prompt,
        response:
          "Sorry, I'm here to assist with life coaching topics. If you have any questions related to personal development, goals, or well-being, feel free to ask! Let's focus on transformative conversations.",
      });
      await saveToDatabase.save();
      res.send(saveToDatabase);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function isLifeCoachingRelated(prompt) {
  try {
    let responseContent = "";

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Evaluate if the prompt is related to life coaching topics: "${prompt}". Respond with yes or no.`,
        },
      ],
      model: "gpt-3.5-turbo",
    });
    responseContent += completion.choices[0].message.content
      .trim()
      .toLowerCase();
    console.log(responseContent);

    return responseContent === "yes";
  } catch (error) {
    console.error("Error checking life coaching relevance:", error);
    return false;
  }
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
