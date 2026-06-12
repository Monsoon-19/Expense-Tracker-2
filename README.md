#Paisa-Tracker
## Expense Tracker Application

**Live Demo:** [https://expense-trackk-app.web.app](https://expense-trackk-app.web.app)

A sleek, premium Dark Mode Expense Tracker built with React, TypeScript, Vite, and Firebase. This application allows users to seamlessly manage their personal finances with real-time syncing.

## Features

- **Dark Mode UI:** A professional and beautiful dark-themed interface built from scratch.
- **Global Currency Selection:** Choose between `₹ INR`, `$ USD`, `€ EUR`, `£ GBP`, and `¥ JPY`. Selections persist globally across the app.
- **User Authentication:** Secure email/password login and registration via Firebase Auth.
- **Real-Time Data (Firestore):** Add, edit, or delete transactions (expenses and incomes). Changes sync instantly across devices.
- **Interactive Analytics:** View your spending habits with real-time updating Recharts area charts.
- **Responsive Layout:** Works smoothly on desktop and mobile devices.

## Tech Stack

- React 19
- TypeScript
- Vite
- Firebase (Authentication, Firestore, Hosting)
- Recharts (for Dashboard Analytics)
- Lucide React (for Icons)

## Getting Started Locally

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` with Firebase configurations (see `.env.example`).
4. Run the local development server:
   ```bash
   npm run dev
   ```

## Live Deployment
This project is automatically deployed to Firebase Hosting. You can access the live version here:
[https://expense-trackk-app.web.app](https://expense-trackk-app.web.app)
