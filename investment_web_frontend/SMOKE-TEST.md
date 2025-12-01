# Frontend Tests

Run:
- `npm test -- --watchAll=false` (CI mode)
- `make test-frontend` from project root

The suite includes:
- AuthContext behavior with mocked endpoints
- ProtectedRoute auth gating
- Login/Register forms invoking context
- Onboarding flow step navigation
- Suggestions and Portfolio basic rendering with mocked APIs
