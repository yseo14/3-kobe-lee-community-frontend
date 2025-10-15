import express from "express";

const app = express();

const port = 3000;

app.get("/", (req, res) => {
  res.send("hello word");
});

app.listen(port, () => {
  console.log(port, "포트로 서버 열림");
});
