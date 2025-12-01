# Frontend Smoke Test (Preview)

Pre-reqs
- Backend reachable at REACT_APP_API_BASE_URL and includes frontend origin in CORS.

Steps
1) Open / (home) and ensure UI renders
2) Navigate to /login
3) Register a test user via /register (or use existing)
4) Login and confirm redirect to /dashboard
5) Visit /onboarding, step through, click Finish (200 response)
6) Visit /suggestions; verify cards load (mock data ok)
7) Visit /portfolio; verify JSON summary renders
8) Visit /pricing; verify plans or empty state
9) Toggle theme (moon/sun) in navbar, verify persistence
10) Logout; protected routes redirect to /login
