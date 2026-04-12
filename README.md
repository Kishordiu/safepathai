SafePath AI

Run:
1. npm install
2. add .env
3. npm run dev

Realtime channel bug fixed.

# SafePath AI

SafePath AI is an AI-enabled child safety monitoring platform built with React, Vite, Tailwind, shadcn/ui, Leaflet, and Supabase.

## Features
- Parent login and monitoring console
- School admin dashboard
- Live tracking with route overlays and geofences
- Alerts and risk insights
- Activity history and pickup verification
- Settings, notifications, and help pages
- Supabase-backed data layer with realtime refresh

## Setup
1. Copy `.env.example` to `.env`
2. Add your Supabase values
3. Run:

```bash
npm install
npm run dev
```

## Environment Variables
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Backend
Use the SQL schema and seed data already created in Supabase.

## Build
```bash
npm run build
```


## Hardware-ready emergency audio UX
This build includes a parent-only temporary emergency audio window.

Optional environment variables:
- `VITE_EMERGENCY_AUDIO_URL` - audio relay or clip URL for the emergency audio player
- `VITE_AUDIO_SESSION_ENDPOINT` - backend endpoint to mark audio window open/close
- `VITE_DEVICE_LED_ENDPOINT` - device endpoint or bridge to turn the hardware LED on/off while the audio window is active

Without these values, the UI still works and shows the one-minute privacy-controlled audio workflow for hackathon presentation.
