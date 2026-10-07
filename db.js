const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");
const FILE = path.join(DATA_DIR, "notes.csv");
const HEADER = "id,text,createdAt";

function escapeField(v) {
  const s = String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Parse CSV text into rows of fields (handles quotes and embedded newlines)
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      rows.push(row); row = [];
    } else field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function init() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, HEADER + "\n");
}

function listNotes() {
  init();
  const rows = parseCsv(fs.readFileSync(FILE, "utf8")).slice(1);
  return rows
    .filter((r) => r.length >= 3 && r[0] !== "")
    .map(([id, text, createdAt]) => ({ id: Number(id), text, createdAt }));
}

function addNote(text) {
  const notes = listNotes();
  const id = notes.reduce((max, n) => Math.max(max, n.id), 0) + 1;
  const note = { id, text, createdAt: new Date().toISOString() };
  const line = [note.id, note.text, note.createdAt].map(escapeField).join(",");
  fs.appendFileSync(FILE, line + "\n");
  return note;
}

module.exports = { listNotes, addNote };
