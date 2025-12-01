# Investment Web Frontend - Integration Notes

This SPA is wired for:
- Auth: /auth/login, /auth/register, /auth/me, /auth/logout
- Onboarding: /onboarding (GET/POST)
- Suggestions: /suggestions (GET with params: amount, market)
- Portfolio: /portfolio (GET)
- Pricing: /pricing/plans (GET)

Configure the backend base URL in .env:
REACT_APP_API_BASE_URL=https://your-backend.example.com

Pages:
- /login, /register (public)
- /onboarding, /dashboard, /suggestions, /portfolio, /pricing, /settings (protected)

To start:
1) cp .env.example .env
2) Update REACT_APP_API_BASE_URL to point to the backend
3) npm install
4) npm start

Styling follows the "Ocean Professional" theme using CSS variables and supports dark mode.
