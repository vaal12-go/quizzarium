import express from "express";

import router from "../routes/router.js";
import "../routes/quizzes.js";
import "../routes/answered_quizes.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("static"));
app.use("/api", router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// To run: node --watch server.js
