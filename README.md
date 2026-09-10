# Universal Video Downloader

A web app to download videos and audio from YouTube, Instagram, TikTok, Twitter/X, Facebook, and 1000+ other sites. Paste a link, pick a format, and download.

![Stack](https://img.shields.io/badge/React-Vite-blue) ![Stack](https://img.shields.io/badge/Node.js-Express-green) ![Engine](https://img.shields.io/badge/Engine-yt--dlp-red)

## Features

- **Universal support** — works with any site supported by [yt-dlp](https://github.com/yt-dlp/yt-dlp) (YouTube, Instagram, TikTok, Twitter/X, Facebook, and more)
- **Video & Audio** — choose from available resolutions or audio bitrates
- **Stream-to-browser** — no files written to disk; media streams directly to your download
- **Fast metadata** — in-memory caching avoids redundant lookups
- **Clean UI** — dark theme, responsive, minimal

## Prerequisites

### System-level binaries (required)

These are **not** npm packages — they must be installed on your system:

#### yt-dlp

The extraction engine. Install via your package manager:

```bash
# macOS
brew install yt-dlp

# Ubuntu/Debian
sudo apt install yt-dlp
# or via pip
pip install yt-dlp

# Windows (scoop)
scoop install yt-dlp

# Or download the binary directly
# https://github.com/yt-dlp/yt-dlp/releases
```

Verify: `yt-dlp --version`

#### ffmpeg (recommended)

Required by yt-dlp for merging separate video+audio streams (e.g. high-res YouTube downloads). Without it, some format combinations won't work.

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg

# Windows (scoop)
scoop install ffmpeg
```

Verify: `ffmpeg -version`

### Node.js

Node.js 18+ is required.

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url> video-downloader
cd video-downloader

# Backend
cd backend
cp .env.example .env    # edit if needed
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure (optional)

Edit `backend/.env`:

| Variable         | Default   | Description                                     |
| ---------------- | --------- | ----------------------------------------------- |
| `PORT`           | `3001`    | Backend server port                             |
| `CACHE_TTL_MS`   | `300000`  | Metadata cache TTL in ms (default 5 min)        |
| `YTDLP_PATH`    | `yt-dlp`  | Path to yt-dlp binary (if not on system PATH)   |
| `RATE_LIMIT_MAX` | `30`      | Max download requests per 15-minute window      |

### 3. Run

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

### Production build

```bash
cd frontend
npm run build
# Serve the dist/ folder with any static file server,
# or configure Express to serve it.
```

## Architecture

```
video-downloader/
├── backend/          Express API
│   └── src/
│       ├── features/
│       │   ├── media-info/       POST /api/media/info
│       │   └── media-download/   GET  /api/media/download
│       └── shared/               Cache, utils, middleware
└── frontend/         React + Vite + Tailwind
    └── src/
        ├── features/downloader/  Main UI components
        └── shared/               Utilities, UI primitives
```

### How it works

1. **User pastes a URL** → frontend calls `POST /api/media/info`
2. **Backend** runs `yt-dlp -j <url>` to fetch metadata, transforms the format list, caches the result, returns clean JSON
3. **Frontend** displays a preview card + available formats (video by resolution, audio by bitrate)
4. **User clicks Download** → browser navigates to `GET /api/media/download?url=...&formatId=...&type=video`
5. **Backend** spawns `yt-dlp -f <formatId> -o - <url>` and pipes stdout directly into the HTTP response — zero disk writes

## API

### `POST /api/media/info`

**Body:** `{ "url": "https://..." }`

**Response:**
```json
{
  "title": "Video Title",
  "thumbnail": "https://...",
  "duration": 187,
  "uploader": "Channel Name",
  "video": [
    { "id": "137+140", "quality": "1080p", "ext": "mp4", "approxSizeMB": 42.1 }
  ],
  "audio": [
    { "id": "140", "quality": "128kbps", "ext": "m4a", "approxSizeMB": 3.2 }
  ]
}
```

### `GET /api/media/download`

**Query:** `url`, `formatId`, `type` (video|audio)

**Response:** Binary stream with `Content-Disposition: attachment`

## License

MIT
