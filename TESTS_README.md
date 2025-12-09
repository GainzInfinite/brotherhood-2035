Playwright E2E smoke tests

Setup (first time):

1. Install dev dependencies:

```bash
npm install -D @playwright/test
npx playwright install
```

2. Run the dev server (tests expect the site at `http://localhost:3000` unless `NEXT_PUBLIC_SITE_URL` is set):

```bash
npm run dev
```

3. In another terminal run tests:

```bash
npm run test:e2e
```

Notes:
- Tests are minimal smoke checks that verify core pages load and key UI elements exist.
- If you want to run tests headful for debugging, set `HEADLESS=false` env or run Playwright directly with `npx playwright test --headed`.
