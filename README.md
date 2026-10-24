![SafePath AI — bespoke brushed-metal project artwork](./assets/readme-metal-hero.svg)

# SAFEPATH AI

**An explainable journey-safety interface prototype for exploring routes, context, and incident review.**

SafePath AI presents a product concept for parent and school workflows around journeys: route context, expected travel windows, safety states, and a clear explanation of why an event might deserve attention. The repository contains a React/TypeScript frontend and Supabase client dependency, but the landing-page descriptions do not establish that wearable feeds, child location, SMS/email/call services, or a validated risk model are connected.

## Product model

```text
Journey context (proposed input)
           │
           ▼
Route / timing comparison
           │
           ▼
Explainable safety state
           │
           ▼
Parent / school review interface
           │
           ▼
Escalation adapter (requires implementation)
```

## What the interface explores

- **Route context:** A way to present a usual route, travel window, and point of interest.
- **Explainable indicators:** Show what inputs might contribute to a warning rather than exposing an unexplained score.
- **Parent and school roles:** Explore different views for family and school workflows.
- **Incident review:** Keep a clear place for the reason, severity, and status of a concern.

## Stack

React · TypeScript · Vite · React Router · Leaflet / React Leaflet · Supabase client

## Run locally

**Requirements:** Node.js and npm.

```bash
git clone https://github.com/Kishordiu/safepathai.git
cd safepathai
npm ci
cp .env.example .env
npm run dev
```

Run `npm run lint`, `npm test`, and `npm run build` for the available project checks.

## Safety, privacy, and status

**Prototype only — not a child-tracking or emergency-response service.** Do not rely on this app for live GPS, wearable sensing, geofence alerts, or emergency escalation. The README does not claim those integrations have been validated. Do not input real children's location or personal information into an unreviewed deployment. Any real-world version would need safeguarding design, lawful consent, strict role-based access, security and privacy testing, field validation, and fallback procedures that do not depend on this app alone.

---

<p align="center"><sub>DIU FOUNDRY · ROUTE CONTEXT / EXPLAINABLE SAFETY</sub></p>
