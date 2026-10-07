const express = require("express");
const path = require("path");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/notes", (req, res) => {
  res.json(db.listNotes());
});

app.post("/api/notes", (req, res) => {
  const text = (req.body && req.body.text || "").trim();
  if (!text) {
    return res.status(400).json({ error: "text is required" });
  }
  res.status(201).json(db.addNote(text));
});

app.listen(PORT, () => {
  console.log(`Notes app running at http://localhost:${PORT}`);
});
