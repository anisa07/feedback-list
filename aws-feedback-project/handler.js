const express = require("express");
const serverless = require("serverless-http");
const {feedbackRouter} = require("./handlers/feedbackHandler");
const {userRouter} = require("./handlers/userHandler");

const app = express();

app.use(express.json());

app.use('/users', userRouter);
app.use('/feedbacks', feedbackRouter);

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports.handler = serverless(app);
