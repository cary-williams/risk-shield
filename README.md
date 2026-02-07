# Risk Shield
This project is a web based Risk Register Generator designed to support structured risk assessments for security, compliance, and operational use cases.

The tool allows users to define the scope of an assessment, document identified risks, and evaluate those risks using likelihood and impact scoring. It distinguishes between inherent risk and residual risk by factoring in the effectiveness of existing controls, providing a clearer picture of overall risk posture.

Users can capture key risk details such as threat sources, impacted assets, existing controls, and ownership. The application automatically calculates risk scores, visualizes risk through charts and heat maps, and summarizes overall exposure across the assessment. This makes it easier to communicate risk clearly to both technical and non technical stakeholders.

The goal of this project is to demonstrate practical risk management concepts in a usable, real world tool rather than a theoretical or checklist driven approach. It reflects how risk registers are commonly used in security and compliance programs and highlights the tradeoffs between risk, controls, and business decisions.

## Project info

If you want to work locally, you can clone/fork this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

This project is intended to be deployed using Vercel.

Recommended Vercel settings:

Framework preset: Vite

Build command: npm run build

Output directory: dist

Once the GitHub repository is connected, Vercel will automatically build and deploy on every push to the main branch.
