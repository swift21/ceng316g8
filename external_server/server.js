const express = require("express");
const app = express();
const port = 8000;
("use strict");

const f = require("fs");
const readline = require("readline");

// Configure middleware to parse JSON request bodies
app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

async function checkCredentials(username, password) {
  var user_file = "./users.txt";
  var rl = readline.createInterface({
    input: f.createReadStream(user_file),
  });

  return new Promise((resolve) => {
    rl.on("line", (line) => {
      id = line.split(",")[0];
      readUser = line.split(",")[1];
      readPass = line.split(",")[2];
      if (readUser == username && readPass == password) {
        resolve(id);
      }
    });

    rl.on("close", () => {
      resolve("-1");
    });
  });
}

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const isValid = await checkCredentials(username, password);
  console.log(isValid);
  res.send(isValid);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
