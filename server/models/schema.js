const mongoose = require("mongoose");

const gptSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
});

const PromptModel = new mongoose.model("prompting", gptSchema);
module.exports = PromptModel;
