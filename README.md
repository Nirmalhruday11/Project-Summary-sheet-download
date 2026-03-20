# Project Summary Sheet Download

A Next.js web app to create and download a Major Project Individual Summary Sheet (A4 format) for VBIT-style academic submissions.

The app includes:
- Login page (college email validation)
- Year/Semester/Department selection
- Editable project summary form
- Image upload support (guide and batch member photos, architecture diagram)
- One-click PDF export

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- html2canvas
- jsPDF

## Project Structure

This repository contains the working Next.js app inside:

- `frontend/`

Main files you will usually edit:

- `frontend/src/app/page.tsx`
- `frontend/src/app/globals.css`

## Run Locally

1. Open terminal in `frontend`.
2. Install dependencies:

```bash
npm install
```

3. Start dev server:

```bash
npm run dev
```

4. Open in browser:

- Local PC: `http://localhost:3000`
- Mobile (same Wi-Fi): `http://<your-lan-ip>:3000`

Example:

`http://192.168.29.47:3000`

## Build and Production Run

From `frontend`:

```bash
npm run build
npm run start
```

## Deployment (Vercel)

When importing this repo in Vercel, set:

- Framework Preset: Next.js
- Root Directory: `frontend`
- Build Command: `npm run build`
- Install Command: `npm install`

Then deploy.

## Notes

- PDF output is generated on the client side using `html2canvas` + `jsPDF`.
- Form styling is optimized for A4-style sheet rendering.
- If mobile view looks stale after updates, hard refresh once.

## License

For academic/project use.