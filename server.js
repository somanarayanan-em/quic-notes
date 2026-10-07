const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// In-memory store (resets when the server restarts)
const notes = [];
let nextId = 1;

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  const text = (req.body && req.body.text || "").trim();
  if (!text) {
    return res.status(400).json({ error: "text is required" });
  }
  const note = { id: nextId++, text, createdAt: new Date().toISOString() };
  notes.push(note);
  res.status(201).json(note);
});

app.listen(PORT, () => {
  console.log(`Notes app running at http://localhost:${PORT}`);
});
