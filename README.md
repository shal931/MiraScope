# MiraScope - Feedback Summarizer

Turn scattered form responses into actionable insights with AI-powered sentiment analysis, theme extraction, and visual reports.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Gemini Setup](#gemini-setup)
- [Sample CSV](#sample-csv)
- [Google Forms CSV Export](#google-forms-csv-export)
- [AI Insight Generation](#ai-insight-generation)
- [Visual Reports](#visual-reports)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Features

### Core capabilities

- CSV upload with drag-and-drop support
- Automatic detection of rating, multiple choice, text, and timestamp columns
- Sentiment analysis using NLP
- TF-IDF keyword extraction and top theme identification
- Representative quote extraction
- AI-generated executive summaries
- Prioritized action recommendations
- Interactive charts and visual analytics
- One-click PDF report export
- Annotated CSV export
- MongoDB-based report history

### Fallback behavior

- Rule-based fallback insights if Gemini is unavailable

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18 + Vite + Tailwind CSS v3 |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| NLP | sentiment + natural.js |
| AI / LLM | Google Gemini 2.5 Flash |
| Charts | Chart.js + react-chartjs-2 |
| PDF Export | jsPDF + html2canvas |

## Project Structure

```text
mirascope/
├── server/
│   ├── index.js
│   ├── .env.example
│   ├── models/
│   │   └── Report.js
│   ├── routes/
│   │   ├── upload.js
│   │   └── report.js
│   ├── scripts/
│   │   └── ensurePortFree.js
│   └── services/
│       ├── csvParser.js
│       ├── sentimentService.js
│       ├── keywordService.js
│       └── geminiService.js
├── client/
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
└── sample csv file/
```

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Community Server running locally

Start MongoDB locally:

```bash
mongod
```

### 1. Setup Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

If needed, update `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mirascope
GEMINI_API_KEY=your_api_key_here
```

### 2. Setup Frontend

```bash
cd client
npm install
npm run dev
```

Open the app at:

```text
http://localhost:5173
```

## Gemini Setup

1. Visit Google AI Studio: https://aistudio.google.com/app/apikey
2. Create a free API key
3. Add the key to `server/.env`

Example:

```env
GEMINI_API_KEY=your_api_key_here
```

MiraScope uses `gemini-2.5-flash` for AI-generated summaries and action items. If the key is missing or Gemini is unavailable, the app falls back to rule-based insights.

## Sample CSV

Use the included sample file in the sample CSV folder and upload it through the dashboard.

## Google Forms CSV Export

1. Open your Google Form
2. Go to the Responses tab
3. Click the three-dot menu
4. Select Download responses (.csv)
5. Upload the CSV into MiraScope

## AI Insight Generation

The AI engine:

- analyzes sentiment trends
- extracts common themes
- identifies pain points
- generates executive summaries
- recommends actionable improvements

If Gemini is unavailable, the system automatically switches to:

- rule-based analysis
- heuristic recommendations

## Visual Reports

MiraScope automatically generates:

- Bar charts
- Doughnut charts
- Sentiment breakdowns
- Theme frequency analysis

## Environment Variables

The server reads these values from `server/.env`:

```env
PORT=5000
MONGODB_URI=your_mongoddb_uri_here
GEMINI_API_KEY=your_api_key_here
```

An example file is provided at `server/.env.example`.

## Troubleshooting

### Gemini API not working?

Check that:

- `server/.env` exists
- the backend was restarted after editing `.env`
- `GEMINI_API_KEY` is valid
- the app is using `gemini-2.5-flash`

You can also test the key against the Gemini models endpoint:

```text
https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY
```

### MongoDB connection issues?

Make sure MongoDB is running locally:

```bash
mongod
```

Also confirm that `MONGODB_URI` points to the correct host and database.

## Future Improvements

- Authentication and user accounts
- Team collaboration and shared workspaces
- Multi-language sentiment analysis
- Real-time report sharing
- Cloud deployment support
- Advanced AI analytics and prompt tuning
- CSV schema customization
- Streaming AI responses

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push your branch
5. Open a pull request

 
## Acknowledgements

- Google Gemini API
- React
- Tailwind CSS
- MongoDB
- Chart.js
- Natural.js
- Sentiment NLP
