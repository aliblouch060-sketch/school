# School Management System

Web-based school software with role-based access for Admin and Teacher.

## Features
- Login with JWT session
- Role-based access (Admin / Teacher)
- Admissions, attendance, results, fees
- Notice board and timetable
- PWA install on Android (Add to Home Screen)
- Class Workspace column view for fast class-wise entry

## Tech Stack
- Node.js + Express
- SQLite (local)
- PostgreSQL (production)
- HTML/CSS/JavaScript frontend

## Local Run
1. `npm install`
2. `npm start`
3. Open `http://localhost:3000`

Default first admin (if no admin exists):
- Username: `admin`
- Password: `admin123`

## Permanent Online Access (Render) - Recommended
Is setup ke baad aap, aap ka teacher, aur mobile users sab internet se app use kar sakte hain. Hotspot/same Wi-Fi ki zarurat nahi.

### Step 1: GitHub par code push karein
1. New GitHub repo banayein.
2. Is project ka code push karein.

### Step 2: Render Blueprint se deploy karein
1. Render account login karein.
2. `New` -> `Blueprint` select karein.
3. GitHub repo connect karein.
4. Render `render.yaml` read karke:
   - 1 Web Service banayega
   - 1 PostgreSQL database banayega

### Step 3: Environment variables set/verify karein
Render Web Service -> Environment me check karein:
- `JWT_SECRET` (auto generated)
- `JWT_EXPIRES_IN=never` (session duration; e.g. `90d`)
- `DATABASE_URL` (auto linked from Render DB)
- `PGSSL=false`
- `ADMIN_USERNAME=admin`
- `ADMIN_PASSWORD` (khud strong password set karein)

### Step 4: Deploy complete hone ke baad
1. Render URL open karein (example: `https://school-management-system.onrender.com`)
2. Admin se login karein (`ADMIN_USERNAME` + `ADMIN_PASSWORD`)
3. Teacher users create karein (Access section)
4. URL teacher ko share karein

### Existing local data ko cloud me le jana
Local `school.db` ka data automatic copy nahi hota. Deploy ke baad ek dafa ye command chalayen:

`$env:DATABASE_URL="your_render_postgres_url"; $env:PGSSL="false"; npm run migrate:sqlite-to-postgres`

Notes:
- Ye command local SQLite data ko Render PostgreSQL me copy karegi.
- Pehli migration us waqt karein jab remote app nayi ho ya remote data abhi important na ho.
- Migration se pehle Render service ko kam az kam ek dafa run hone dein taa ke tables create ho jayein.

### Git na ho to upload package kaise banayein
PowerShell me ye command chalayen:

`powershell -ExecutionPolicy Bypass -File .\scripts\create-deploy-package.ps1`

Ye ek clean deploy folder aur zip bana dega jise GitHub web upload ke liye use kiya ja sakta hai.

## Android Install (Public URL se)
1. Android Chrome me Render app URL open karein.
2. Menu -> `Install app` / `Add to Home Screen`.
3. App icon phone par aa jayega.

## Important Notes
- Local `school.db` ka data cloud PostgreSQL me auto copy nahi hota.
- Agar local data bhi chahiye ho to migration script alag se run karni padegi.
- Free plans par app idle hone ke baad first request slow ho sakti hai.

## Important Files
- `server.js`: API routes + auth
- `db.js`: SQLite/PostgreSQL layer + schema init
- `public/index.html`: UI + PWA links
- `public/app.js`: frontend logic + class workspace + install flow
- `public/styles.css`: styling
- `public/manifest.webmanifest`: PWA manifest
- `public/service-worker.js`: offline caching
- `render.yaml`: Render infrastructure config
- `.env.example`: environment template


