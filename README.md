# MiraScope — Feedback Summarizer 🔭

> Turn scattered form responses into actionable insights with AI-powered sentiment analysis, theme extraction, and visual reports.

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18 + Vite + Tailwind CSS v3   |
| Backend    | Node.js + Express                   |
| Database   | MongoDB (Mongoose)                  |
| NLP        | sentiment (VADER-like) + natural.js |
| AI / LLM   | Google Gemini 2.0 Flash             |
| Charts     | Chart.js + react-chartjs-2          |
| PDF Export | jsPDF + html2canvas                 |

## Project Structure

```
anti_mirascope/
├── server/               # Express backend
│   ├── index.js          # Entry point
│   ├── models/Report.js  # MongoDB schema
│   ├── routes/
│   │   ├── upload.js     # POST /api/upload
│   │   └── report.js     # GET/DELETE /api/report/:id
│   └── services/
│       ├── csvParser.js      # CSV parsing + type detection
│       ├── sentimentService.js  # VADER sentiment analysis
│       ├── keywordService.js    # TF-IDF keyword + themes
│       └── geminiService.js     # Gemini AI insights
├── client/               # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── UploadZone.jsx
│   │   │   ├── Charts.jsx
│   │   │   ├── ActionItems.jsx
│   │   │   └── QuoteCard.jsx
│   │   └── pages/
│   │       ├── HomePage.jsx
│   │       ├── ReportPage.jsx
│   │       └── HistoryPage.jsx
└── sample_feedback.csv   # Sample CSV to test with
```

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`)

### 1. Setup Backend

```bash
cd server
npm install
cp .env.example .env
# Edit .env: add your GEMINI_API_KEY (optional but recommended)
npm run dev
```

### 2. Setup Frontend

```bash
cd client
npm install
npm run dev
```

Open http://localhost:3000

### 3. Get a Gemini API Key (Free)
1. Go to https://aistudio.google.com/app/apikey
2. Create a free API key
3. Add to `server/.env`: `GEMINI_API_KEY=your_key_here`

> Without a Gemini key, MiraScope still works — it falls back to rule-based action suggestions.

### 4. Test with Sample CSV
Upload `sample_feedback.csv` from the root of this project.

## How to Export Google Form as CSV
1. Open your Google Form → **Responses** tab
2. Click the three-dot menu (⋮) → **Download responses (.csv)**
3. Upload the downloaded file to MiraScope

## Features
- ✅ CSV upload with drag-and-drop
- ✅ Auto-detection of rating/multiple-choice/text/timestamp columns
- ✅ VADER-like sentiment analysis on all text responses
- ✅ TF-IDF keyword extraction and top theme identification
- ✅ Representative quote extraction per theme
- ✅ Gemini AI executive summary + prioritized action items
- ✅ Bar + Doughnut charts for all question types
- ✅ One-click PDF report download
- ✅ Annotated CSV export
- ✅ Report history with MongoDB persistence
