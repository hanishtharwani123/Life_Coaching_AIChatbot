const mongoose = require("mongoose");

const URI = process.env.MONGODB_URI;

mongoose
  .connect(URI)
  .then(() => {
    console.log(`Database is successfully connected`);
  })
  .catch((e) => {
    console.log(e);
  });
