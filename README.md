# [AirSense (Frontend)](https://github.com/salimi-my/airsense-frontend) &middot; [![Author Salimi](https://img.shields.io/badge/Author-Salimi-%3C%3E)](https://www.salimi.my)

A modern web application **built for [UN SDG 11](https://sdgs.un.org/goals/goal11)** — *Sustainable Cities and Communities* — delivering personalized smart air quality awareness for urban Malaysia. Powered by Next.js 16, it provides real-time Klang Valley AQI monitoring, interactive station maps, AI-powered health risk assessments, valley-wide alerts, and admin tooling to help cities and residents respond to haze and urban pollution.

## 🌟 Features

### Core Functionality

- **📊 Dashboard** — Home-station AQI gauge, valley band overview, trend charts, recent assessments, and admin summary strip
- **🗺️ Air Map** — Interactive Leaflet map of Klang Valley monitoring stations with colour-coded AQI markers and station sidebar
- **📍 Station Detail** — Per-station pollutant readings (PM2.5, PM10, NO₂, O₃, temperature, humidity), 7-day trend charts, and 24-hour AI predictions
- **🧠 Risk Assessment** — Personalized health risk scoring via a Random Forest model (Hugging Face) using age, conditions, activity, and live station data
- **🚨 Valley Alerts** — Dismissible alert banner when AQI exceeds unhealthy thresholds, with home-station vs valley-wide messaging
- **📋 Admin Logs** — Audit views for station data ingestion and anonymised AI assessment requests (admin only)
- **👤 User Management** — Admin-only user administration with filtering and pagination
- **⚙️ Settings** — Profile, password, two-factor authentication, and linked OAuth accounts

### Air Quality & AI

- 🌬️ **Live WAQI data** — Station readings fetched and cached by the Laravel backend scheduler
- 📈 **Trend visualisation** — 7-day AQI history with Recharts
- 🔮 **24-hour predictions** — AI-powered AQI forecasts per station
- 📍 **Geolocation** — Auto-select nearest monitoring station when permitted
- 💾 **Health profile memory** — Optional localStorage persistence for assessment form defaults
- ⚠️ **Stale data notices** — Clear indicators when readings are outdated

### Authentication & Security

- 🔐 Secure authentication with Laravel Sanctum
- 📧 Email verification
- 🔄 Password reset functionality
- 🔢 Two-factor authentication (TOTP) with recovery codes
- 🌐 OAuth integration (Google, GitHub, etc.) — configurable
- 🛡️ CSRF protection
- 🔑 Role-based permissions (admin vs standard user)

### Progressive Web App (PWA)

- 📱 Install as native app on mobile and desktop
- 🔄 Pull-to-refresh functionality
- 📴 Offline-capable with service worker
- 🎨 Responsive design for all screen sizes with device-specific splash screens

### User Experience

- 🎨 Modern UI with shadcn/ui components
- 🌓 Dark/Light mode toggle
- 📱 Mobile-first responsive design with bottom navigation
- ♿ Accessible components (Radix UI primitives)
- 🔔 Toast notifications with Sonner
- 📈 Charts with Recharts (dashboard, trends, gauges)
- 🔍 Advanced table filtering and pagination (admin areas)

---

## 🚀 Tech Stack

### Frontend

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Data Fetching**: [SWR](https://swr.vercel.app/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Maps**: [Leaflet](https://leafletjs.com/) + [react-leaflet](https://react-leaflet.js.org/)
- **Date Handling**: [date-fns](https://date-fns.org/)

### Backend & AI (companion services)

- **API**: [AirSense Backend](https://github.com/salimi-my/airsense-backend) — Laravel with Sanctum, WAQI ingestion, and assessment proxy
- **AI Service**: Random Forest models deployed on Hugging Face Spaces (`airsense-ai`)

### Development Tools

- **Package Manager**: [pnpm](https://pnpm.io/)
- **Linting**: ESLint v9
- **Formatting**: Prettier with plugins
- **Type Checking**: TypeScript 5
- **React Compiler**: Enabled via `babel-plugin-react-compiler`

---

## 📋 Prerequisites

### Required

- **Node.js** 20.x or higher ([Download](https://nodejs.org/))
- **pnpm** 9.x or higher (`npm install -g pnpm`)
- **Backend API** — Laravel backend with Sanctum authentication ([AirSense Backend](https://github.com/salimi-my/airsense-backend))

---

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/salimi-my/airsense-frontend.git
cd airsense-frontend
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

Copy `.env.example` to `.env` and adjust values:

```bash
cp .env.example .env
```

```env
# API Configuration
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_REGISTRATION=true
NEXT_PUBLIC_ENABLE_OAUTH_GOOGLE=true
NEXT_PUBLIC_ENABLE_OAUTH_GITHUB=true
```

### 4. Start the Backend

Ensure the [AirSense Backend](https://github.com/salimi-my/airsense-backend) is running (default: `http://localhost:8000`).

### 5. Start Development Server

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

**Demo login** (after backend seed): `johndoe@example.com` / `P@$$w0rd` (admin)

---

## 📁 Project Structure

```
airsense-frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Login, register, password reset, verify email
│   │   ├── (main)/                   # Protected app pages
│   │   │   ├── dashboard/
│   │   │   ├── map/
│   │   │   ├── assess/               # AI risk assessment form
│   │   │   ├── stations/[id]/        # Station detail & trends
│   │   │   ├── admin/logs/           # Admin audit logs
│   │   │   ├── users/
│   │   │   └── settings/
│   │   ├── layout.tsx
│   │   └── manifest.ts               # PWA manifest
│   ├── components/
│   │   ├── airsense/                 # Air quality feature components
│   │   ├── auth/
│   │   ├── main/                     # Layout, tables, settings
│   │   ├── pwa/
│   │   └── ui/                       # shadcn/ui
│   ├── hooks/
│   ├── lib/
│   │   ├── axios.ts
│   │   ├── server-axios.ts
│   │   └── server-auth.ts
│   ├── schemas/
│   ├── types/
│   └── constants/
│
├── public/                           # Static assets, favicons, splash screens, SEO image
├── .env.example
└── package.json
```

---

## 🔧 Available Scripts

### Development

```bash
# Start development server
pnpm dev

# Start on a different port
pnpm dev -- -p 3001
```

### Building

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Code Quality

```bash
# Run ESLint
pnpm lint

# Type check
pnpm exec tsc --noEmit
```

---

## 🌐 Environment Variables

| Variable                          | Description                        | Required | Default |
| --------------------------------- | ---------------------------------- | -------- | ------- |
| `NEXT_PUBLIC_BACKEND_URL`         | Laravel API base URL               | Yes      | —       |
| `NEXT_PUBLIC_FRONTEND_URL`        | Frontend URL (metadata, Referer)   | Yes      | —       |
| `NEXT_PUBLIC_ENABLE_REGISTRATION` | Enable user registration           | No       | `false` |
| `NEXT_PUBLIC_ENABLE_OAUTH_GOOGLE` | Enable OAuth Google authentication | No       | `false` |
| `NEXT_PUBLIC_ENABLE_OAUTH_GITHUB` | Enable OAuth GitHub authentication | No       | `false` |

---

## 🏗️ Development Workflow

### Daily Development

1. Edit source files in `src/`
2. Run `pnpm dev` and test with hot reload
3. Point `NEXT_PUBLIC_BACKEND_URL` at your local or staging API
4. Run `php artisan app:fetch-aqi-data` on the backend to refresh station readings

### API Integration

The frontend consumes REST endpoints defined in `src/constants/routes.ts`. Key areas:

- `/api/stations` — Station list and nearby lookup
- `/api/stations/{id}/readings` — Historical readings for trend charts
- `/api/stations/{id}/prediction` — 24-hour AQI prediction
- `/api/assessments` — Submit risk assessment to AI service via backend
- `/api/dashboard` — Aggregated dashboard data
- `/api/admin/readings` and `/api/admin/assessments` — Admin audit logs

### Companion Repositories

| Repository                                                              | Role                                      |
| ----------------------------------------------------------------------- | ----------------------------------------- |
| [airsense-backend](https://github.com/salimi-my/airsense-backend)       | Laravel API, WAQI ingestion, auth, proxy  |
| `airsense-ai` (Hugging Face Space)                                      | Random Forest risk & prediction models    |

---

## 🧪 Testing

### Air Map & Station Detail

1. Ensure the backend is running with seeded stations and fresh WAQI data
2. Navigate to `/map`
3. Click a station marker or sidebar entry to open `/stations/{id}`
4. Verify pollutant readings, 7-day trend chart, and prediction card

### Risk Assessment

1. Navigate to `/assess` (or use **Assess My Risk** from map/station pages)
2. Select a station (or allow geolocation to pick the nearest)
3. Fill age group, health conditions, and planned activity
4. Submit and confirm the AI risk level and precautions display

### Dashboard & Alerts

1. Navigate to `/dashboard`
2. Set a home station via the station combobox
3. When valley AQI exceeds thresholds, confirm the alert banner appears
4. Review stats cards, trend chart, and recent assessments

### Admin Logs

1. Log in as an admin user
2. Navigate to `/admin/logs`
3. Review station ingestion and assessment request logs

---

## 🚢 Deployment

### Build for Production

```bash
pnpm install
pnpm build
pnpm start
```

Set production environment variables in RunCloud (or your `.env` on the server):

- `NEXT_PUBLIC_BACKEND_URL`
- `NEXT_PUBLIC_FRONTEND_URL`
- Feature flags as needed

### Production Hosting

The app is deployed on a **Linode VPS** managed with **[RunCloud](https://runcloud.io/)**:

| Component | Host                                      |
| --------- | ----------------------------------------- |
| Frontend  | Linode VPS — RunCloud Node.js web app     |
| Backend   | Linode VPS — RunCloud PHP (Laravel) stack |
| Database  | MySQL on the same Linode VPS              |
| AI        | Hugging Face Spaces                       |

RunCloud handles Nginx, SSL, process management, and deployments for both the Next.js frontend (`pnpm build` → `pnpm start`) and the Laravel API on the same server.

---

## 🔒 Security

- **Authentication**: Laravel Sanctum with HTTP-only cookies
- **CSRF Protection**: Built-in with Sanctum
- **Two-factor authentication**: TOTP with recovery codes
- **XSS Protection**: React's built-in escaping
- **HTTPS**: Recommended for production
- **Health profile**: Stored locally in the browser only (`localStorage`); not sent to the server unless submitted with an assessment

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use `pnpm` for all package and script commands
- Follow TypeScript and existing component patterns
- Use shadcn/ui components from `src/components/ui/`
- Match backend API contracts when adding hooks or services
- Keep air-quality UI in `src/components/airsense/`

---

## 🐛 Troubleshooting

**Port already in use:**

```bash
pnpm dev -- -p 3001
```

**No station data on the map:**

- Confirm the backend is running and `NEXT_PUBLIC_BACKEND_URL` is correct
- Run `php artisan app:fetch-aqi-data` on the backend
- Check that `WAQI_API_TOKEN` is set in the backend `.env`

**Authentication issues:**

- Verify `NEXT_PUBLIC_BACKEND_URL` and CORS on the backend
- Clear cookies and retry login

**Risk assessment fails:**

- Confirm the AI service URL is configured in the backend (`AI_SERVICE_URL`)
- Check admin logs at `/admin/logs` for failed assessment requests

**Build errors:**

```bash
rm -rf .next node_modules
pnpm install
pnpm build
```

---

## 📄 License

This project is proprietary software for the AirSense smart air quality awareness platform.

---

## 📞 Support

For issues or questions:

- Confirm backend API health, WAQI token, and AI service availability
- Check browser console and network tab for API errors

---

## 🎯 Roadmap

- [ ] Push notifications for valley AQI alerts
- [ ] Extended historical reporting and exports
- [ ] Multi-language support (BM / EN)
- [ ] Enhanced offline caching for map tiles and last-known readings
- [ ] User-configurable alert thresholds

---

**Built with ❤️ for SDG 11 — sustainable, resilient cities and healthier urban communities**

**Version:** 0.1.0  
**Last Updated:** 26 June 2026
