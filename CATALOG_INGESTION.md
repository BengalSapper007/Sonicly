# Sonicly — Admin Catalog Ingestion Guide

The internal admin catalog API lets you populate the Sonicly music catalog with real audio files, album artwork, and artist images.

> ⚠️ This is not a public-facing endpoint. It is secured with a static API key and intended for use by the platform operator/developer only.

---

## Prerequisites

- Backend running: `pnpm --filter backend dev`
- `ADMIN_API_KEY` set in `backend/.env`
- `media/audio/`, `media/albums/`, `media/artists/` directories exist at the project root

---

## Authentication

All admin endpoints require:

```
x-admin-key: <your ADMIN_API_KEY>
```

Requests without this header return `401 Unauthorized`.

---

## Base URL

```
http://localhost:3001/api/admin/catalog
```

---

## Reference Lookups

Before uploading, retrieve existing IDs for artists, albums, and genres.

**List all artists**
```bash
curl http://localhost:3001/api/admin/catalog/artists \
  -H "x-admin-key: sonicly_admin_dev_key_2026"
```

**List all albums**
```bash
curl http://localhost:3001/api/admin/catalog/albums \
  -H "x-admin-key: sonicly_admin_dev_key_2026"
```

**List all genres**
```bash
curl http://localhost:3001/api/admin/catalog/genres \
  -H "x-admin-key: sonicly_admin_dev_key_2026"
```

---

## Uploading a Song

**Endpoint:** `POST /api/admin/catalog/songs`  
**Content-Type:** `multipart/form-data`

| Field      | Type    | Description                        |
|------------|---------|------------------------------------|
| `file`     | File    | MP3 or WAV audio file (max 200 MB) |
| `title`    | string  | Song title                         |
| `trackNum` | integer | Track number on the album          |
| `albumId`  | string  | Sonicly album ID                   |
| `genreId`  | string  | Sonicly genre ID                   |

**Example (curl):**
```bash
curl -X POST http://localhost:3001/api/admin/catalog/songs \
  -H "x-admin-key: sonicly_admin_dev_key_2026" \
  -F "file=@/path/to/my-track.mp3" \
  -F "title=Midnight Drive" \
  -F "trackNum=1" \
  -F "albumId=al_neonpulse_01" \
  -F "genreId=gn_synthwave"
```

**Response:**
```json
{
  "id": "tr_Abc123XyzQr",
  "title": "Midnight Drive",
  "duration": 247,
  "trackNum": 1,
  "audioUrl": "/media/audio/tr_Abc123XyzQr.mp3",
  "albumId": "al_neonpulse_01",
  "genreId": "gn_synthwave",
  "album": { ... },
  "genre": { ... }
}
```

The `duration` is extracted automatically from the audio file's metadata.  
The file is stored at `media/audio/tr_Abc123XyzQr.mp3`.  
The frontend plays it from `/media/audio/tr_Abc123XyzQr.mp3` via the Next.js proxy.

---

## Creating an Artist

**Endpoint:** `POST /api/admin/catalog/artists`  
**Content-Type:** `application/json`

```bash
curl -X POST http://localhost:3001/api/admin/catalog/artists \
  -H "x-admin-key: sonicly_admin_dev_key_2026" \
  -H "Content-Type: application/json" \
  -d '{"name": "Neon Pulse", "bio": "Electronic producer from Tokyo.", "monthlyListeners": 50000}'
```

---

## Uploading Artist Artwork

**Endpoint:** `POST /api/admin/catalog/artists/:id/artwork`  
**Content-Type:** `multipart/form-data`

Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif` (max 10 MB)

```bash
curl -X POST http://localhost:3001/api/admin/catalog/artists/ar_neonpulse/artwork \
  -H "x-admin-key: sonicly_admin_dev_key_2026" \
  -F "file=@/path/to/artist-photo.webp"
```

---

## Creating an Album

**Endpoint:** `POST /api/admin/catalog/albums`  
**Content-Type:** `application/json`

```bash
curl -X POST http://localhost:3001/api/admin/catalog/albums \
  -H "x-admin-key: sonicly_admin_dev_key_2026" \
  -H "Content-Type: application/json" \
  -d '{"title": "Midnight Circuit", "artistId": "ar_neonpulse", "releaseYear": 2023, "type": "ALBUM"}'
```

---

## Uploading Album Artwork

**Endpoint:** `POST /api/admin/catalog/albums/:id/artwork`

```bash
curl -X POST http://localhost:3001/api/admin/catalog/albums/al_neonpulse_01/artwork \
  -H "x-admin-key: sonicly_admin_dev_key_2026" \
  -F "file=@/path/to/album-cover.webp"
```

---

## Media Serving

All media files are served by NestJS at:

```
GET http://localhost:3001/media/audio/{songId}.mp3
GET http://localhost:3001/media/albums/{albumId}.webp
GET http://localhost:3001/media/artists/{artistId}.webp
```

The frontend proxies these through Next.js, so the browser always uses:

```
/media/audio/{songId}.mp3
/media/albums/{albumId}.webp
```

HTTP Range requests (audio seeking) are fully supported — the server returns `206 Partial Content` with `Accept-Ranges: bytes`.

---

## Media Directory Structure

```
Sonicly/
└── media/
    ├── audio/          ← Uploaded audio files
    │   └── tr_Abc123XyzQr.mp3
    ├── albums/         ← Album artwork
    │   └── al_neonpulse_01.webp
    └── artists/        ← Artist images
        └── ar_neonpulse.webp
```
