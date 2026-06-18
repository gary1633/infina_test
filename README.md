# Infina Test Automation Suite

This repository contains a Playwright automation test suite written in TypeScript for testing registration and login scenarios on the Infina application (`https://nomi-staging-3c09.up.railway.app/`).

The project adheres to the **Page Object Model (POM)** design pattern, uses environment variables for configuration, avoids arbitrary timeouts, and runs tests in a serialized suite.

## Project Structure

```text
├── pages/
│   ├── home.page.ts        # POM for the landing page
│   ├── register.page.ts    # POM for the sign-up form
│   ├── login.page.ts       # POM for the login form
│   └── otp.page.ts         # POM for the 6-digit OTP verification & toast validation
├── tests/
│   └── auth.spec.ts        # E2E test specifications
├── playwright.config.ts    # Playwright configuration
├── .env                    # Local environment variables (git-ignored)
├── .gitignore              # Files to ignore in git
├── package.json            # Node.js dependencies
└── README.md               # Run instructions & documentation
```

## Setup Instructions

### 1. Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 2. Install Dependencies

Clone this repository and run the following command to install the required packages:

```bash
npm install
```

Install Playwright browsers (if not already installed):

```bash
npx playwright install
```

### 3. Environment Variables Configuration

Create a `.env` file in the root directory (or use the automatically generated one):

```env
BASE_URL=https://nomi-staging-3c09.up.railway.app/
TEST_OTP=000000
INVALID_OTP=111111
TEST_NAME=AutoTest
```

## Running the Tests

To execute the entire test suite in headless mode (default):

```bash
npx playwright test
```

### Running with UI / Headed Mode

To open the Playwright interactive Test Runner UI:

```bash
npx playwright test --ui
```

To run the tests in headed mode:

```bash
npx playwright test --headed
```

### Viewing Test Reports

If any test fails or to see the run details, view the HTML report:

```bash
npx playwright show-report
```
