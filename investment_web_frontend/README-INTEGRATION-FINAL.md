# Investment Web Frontend - Final Integration Notes

Environment (.env)
- REACT_APP_API_BASE_URL=http://localhost:8000
- REACT_APP_BACKEND_URL=http://localhost:8000
- REACT_APP_FRONTEND_URL=http://localhost:3000
- Optional flags:
  - REACT_APP_WS_URL=
  - REACT_APP_NODE_ENV=development
  - REACT_APP_ENABLE_SOURCE_MAPS=true
  - REACT_APP_TRUST_PROXY=false
  - REACT_APP_LOG_LEVEL=info
  - REACT_APP_HEALTHCHECK_PATH=/
  - REACT_APP_FEATURE_FLAGS={}
  - REACT_APP_EXPERIMENTS_ENABLED=false

Steps
1) cp .env.example .env
2) Set REACT_APP_API_BASE_URL to your backend URL
3) npm install
4) npm start

Backend CORS
- Ensure backend BACKEND_CORS_ORIGINS includes http://localhost:3000 (or your deployed frontend).
