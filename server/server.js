const express = require("express");
const cors = require("cors");
const database = require("./database");
const dbFunctions = require("./dbFunctions");
const canFunctions = require("./candidateFunctions");
const voteFunctions = require("./voteFunctions");
const electionFunctions = require("./electionFunctions");
const { ObjectId } = require("mongodb");
const port = 5000;
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const axios = require("axios");

const app = express();
const bodyParser = require("body-parser");
const path = require("path");
app.use(cors());
app.use(express.static(path.join(__dirname, "../client")));
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(bodyParser.text({ limit: "200mb" }));
app.use(express.json());

// The route definitions for get, post and delete

app.get("/api/allnames", async (req, res) => {
  try {
    const docs = await dbFunctions.getAllDocs();
    res.json(docs);
  } catch (err) {
    console.error("# Get Error", err);
    res.status(500).send({ error: err.name + ", " + err.message });
  }
});

app.get("/api/user/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await dbFunctions.getUserById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (err) {
    console.error("# Get Error", err);
    res.status(500).send({ error: err.name + ", " + err.message });
  }
});

app.get("/api/allcandidates", async (req, res) => {
  try {
    const docs = await canFunctions.getAllDocs();
    res.json(docs);
  } catch (err) {
    console.error("# Get Error", err);
    res.status(500).send({ error: err.name + ", " + err.message });
  }
});

app.post("/api/addcandidate", async (req, res) => {
  let data = req.body;

  try {
    data = await canFunctions.addDoc(data);
    res.json(data);
  } catch (err) {
    console.error("# Post Error", err);
    res.status(500).send({ error: err.name + ", " + err.message });
  }
});

app.delete("/api/deletecandidate/:id", async (req, res) => {
  const id = req.params.id;
  let respObj = {};

  if (id && ObjectId.isValid(id)) {
    try {
      respObj = await canFunctions.deleteDoc(id);
    } catch (err) {
      console.error("# Delete Error", err);
      res.status(500).send({ error: err.name + ", " + err.message });
      return;
    }
  } else {
    respObj = { message: "Data not deleted; the id to delete is not valid!" };
  }

  res.json(respObj);
});

app.post("/api/addname", async (req, res) => {
  let data = req.body;

  try {
    data = await dbFunctions.addDoc(data);
    res.json(data);
  } catch (err) {
    console.error("# Post Error", err);
    res.status(500).send({ error: err.name + ", " + err.message });
  }
});

app.post("/api/setappliperiod", async (req, res) => {
  let data = req.body;
});

app.put("/api/userset/:id", async (req, res) => {
  const id = req.params.id;
  const { voted } = req.body;

  try {
    await dbFunctions.editUserData(id, voted);
    res.json({ success: true });
  } catch (err) {
    console.error("# Put Error", err);
    res.status(500).send({ error: err.name + ", " + err.message });
  }
});

app.delete("/api/deletename/:id", async (req, res) => {
  const id = req.params.id;
  let respObj = {};

  if (id && ObjectId.isValid(id)) {
    try {
      respObj = await dbFunctions.deleteDoc(id);
    } catch (err) {
      console.error("# Delete Error", err);
      res.status(500).send({ error: err.name + ", " + err.message });
      return;
    }
  } else {
    respObj = { message: "Data not deleted; the id to delete is not valid!" };
  }

  res.json(respObj);
});

app.get("/api/allapplications", async (req, res) => {
  try {
    const docs = await canFunctions.getAllApplications();
    res.json(docs);
  } catch (err) {
    console.error("# Get Error", err);
    res.status(500).send({ error: err.name + ", " + err.message });
  }
});

app.post("/api/addapplication", async (req, res) => {
  let data = req.body;

  try {
    data = await canFunctions.addApplication(data);
    res.json(data);
  } catch (err) {
    console.error("# Post Error", err);
    res.status(500).send({ error: err.name + ", " + err.message });
  }
});

app.put("/api/editapplication/:id", async (req, res) => {
  const id = req.params.id;
  const { field1, field2, field3 } = req.body;

  try {
    await canFunctions.editApplicationData(id, field1, field2, field3);
    res.json({ success: true });
  } catch (err) {
    console.error("# Put Error", err);
    res.status(500).send({ error: err.name + ", " + err.message });
  }
});

app.delete("/api/deleteapplication/:id", async (req, res) => {
  const id = req.params.id;
  let respObj = {};

  if (id && ObjectId.isValid(id)) {
    try {
      respObj = await canFunctions.deleteApplication(id);
    } catch (err) {
      console.error("# Delete Error", err);
      res.status(500).send({ error: err.name + ", " + err.message });
      return;
    }
  } else {
    respObj = { message: "Data not deleted; the id to delete is not valid!" };
  }

  res.json(respObj);
});

app.get("/api/voters", async (req, res) => {
  try {
    const docs = await voteFunctions.getAllDocs();
    res.json(docs);
  } catch (err) {
    console.error("# Get Error", err);
    res.status(500).send({ error: err.name + ", " + err.message });
  }
});

app.post("/api/addvoter", async (req, res) => {
  let data = req.body;

  try {
    data = await voteFunctions.addDoc(data);
    res.json(data);
  } catch (err) {
    console.error("# Post Error", err);
    res.status(500).send({ error: err.name + ", " + err.message });
  }
});

app.delete("/api/deletevoter/:id", async (req, res) => {
  const id = req.params.id;
  let respObj = {};

  if (id && ObjectId.isValid(id)) {
    try {
      respObj = await voteFunctions.deleteDoc(id);
    } catch (err) {
      console.error("# Delete Error", err);
      res.status(500).send({ error: err.name + ", " + err.message });
      return;
    }
  } else {
    respObj = { message: "Data not deleted; the id to delete is not valid!" };
  }

  res.json(respObj);
});

app.get("/api/results", async (req, res) => {
  try {
    const docs = await voteFunctions.getAllResults();
    res.json(docs);
  } catch (err) {
    console.error("# Get Error", err);
    res.status(500).send({ error: err.name + ", " + err.message });
  }
});

app.post("/api/addresult", async (req, res) => {
  let data = req.body;

  try {
    data = await voteFunctions.addResults(data);
    res.json(data);
  } catch (err) {
    console.error("# Post Error", err);
    res.status(500).send({ error: err.name + ", " + err.message });
  }
});

app.delete("/api/deleteresults/:id", async (req, res) => {
  const id = req.params.id;
  let respObj = {};

  if (id && ObjectId.isValid(id)) {
    try {
      respObj = await voteFunctions.deleteResults(id);
    } catch (err) {
      console.error("# Delete Error", err);
      res.status(500).send({ error: err.name + ", " + err.message });
      return;
    }
  } else {
    respObj = { message: "Data not deleted; the id to delete is not valid!" };
  }

  res.json(respObj);
});

app.get("/api/election", async (req, res) => {
  try {
    const docs = await electionFunctions.getAllDocs();
    res.json(docs);
  } catch (err) {
    console.error("# Get Error", err);
    res.status(500).send({ error: err.name + ", " + err.message });
  }
});

app.post("/api/setelectiondate", async (req, res) => {
  let data = req.body;

  try {
    data = await electionFunctions.addDoc(data);
    res.json(data);
  } catch (err) {
    console.error("# Post Error", err);
    res.status(500).send({ error: err.name + ", " + err.message });
  }
});

app.put("/api/updateelection/:id", async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  try {
    const filter = { _id: ObjectId(id) };
    const result = await electionFunctions.updateDoc(filter, updatedData);
    res.json(result);
  } catch (err) {
    console.error("# PUT Error", err);
    res.status(500).send({ error: err.name + ", " + err.message });
  }
});

app.delete("/api/deleteelection/:id", async (req, res) => {
  const id = req.params.id;
  let respObj = {};

  if (id && ObjectId.isValid(id)) {
    try {
      respObj = await electionFunctions.deleteDoc(id);
    } catch (err) {
      console.error("# Delete Error", err);
      res.status(500).send({ error: err.name + ", " + err.message });
      return;
    }
  } else {
    respObj = { message: "Data not deleted; the id to delete is not valid!" };
  }

  res.json(respObj);
});

async function checkCredentials(username, password) {
  const url = "http://localhost:5000/api/allnames/";
  const response = await fetch(url);
  const data = await response.json();

  for (const entry of data) {
    if (entry.username == username && entry.password == password) {
      return true;
    }
  }

  return false;
}

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const isValid = checkCredentials(username, password);

  res.send(isValid);
});

// Start the web server and connect to the database

let server;
let conn;

(async () => {
  try {
    conn = await database();
    await dbFunctions.getDb(conn);
    await canFunctions.getDb(conn);
    await voteFunctions.getDb(conn);
    await electionFunctions.getDb(conn);
    server = app.listen(port, () => {
      console.log("# App server listening on port " + port);
    });
  } catch (err) {
    console.error("# Error:", err);
    console.error("# Exiting the application.");
    await closing();
    process.exit(1);
  }
})();

async function closing() {
  console.log("# Closing resources...");
  if (conn) {
    await conn.close();
    console.log("# Database connection closed.");
  }
  if (server) {
    server.close(() => console.log("# Web server stopped."));
  }
}
