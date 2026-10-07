# fullstack-demo

A tiny notes app: one HTML page (`public/index.html`) and one API (`server.js`, Express).

## Run

```bash
npm install
npm start
# open http://localhost:3000
```

## API

| Method | Path | Description |
|---|---|---|
| GET | `/api/notes` | List notes |
| POST | `/api/notes` | Create a note (`{ "text": "..." }`) |

Notes are stored in memory and reset on restart.
