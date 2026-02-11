# 🚀 Creatix - Contest Management Platform

A modern, full-stack contest management platform built with React, Node.js, Express, MongoDB, and Firebase.

## 📋 Features

- **User Authentication** - Firebase Authentication with Email/Password and Google Sign-In
- **Role-Based Access** - Admin, Creator, and User roles with protected routes
- **Contest Management** - Create, browse, and participate in contests
- **Payment Integration** - Secure Stripe payment processing
- **Real-Time Stats** - Platform statistics and leaderboards
- **Responsive Design** - Mobile-first design with dark/light mode

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- TanStack Query (React Query)
- Firebase Authentication
- Tailwind CSS
- Axios + Interceptors
- React Router DOM
- React Hot Toast & SweetAlert2

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Firebase Admin SDK
- Stripe API
- JWT Authentication

## 📦 Installation

### Prerequisites
- Node.js 16+
- MongoDB Atlas account
- Firebase project
- Stripe account (optional)

### Client Setup

```bash
cd creatix-client
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_STRIPE_PUBLIC_KEY=your-stripe-public-key
```

### Server Setup

```bash
cd creatix-server
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/creatix
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
```

Place your `firebase-admin-sdk.json` in the server root directory.

## 🚀 Running Locally

### Start Backend
```bash
cd creatix-server
npm run dev
```

### Start Frontend
```bash
cd creatix-client
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000

## 🌐 Deployment

### Frontend (Firebase Hosting)

```bash
cd creatix-client
npm run build
firebase login
firebase init hosting
firebase deploy
```

### Backend (Vercel)

```bash
cd creatix-server
vercel login
vercel
```

Set environment variables in Vercel dashboard.

## 📁 Project Structure

```
creatix-client/
├── src/
│   ├── api/          # API services
│   ├── components/   # Reusable components
│   ├── context/      # React contexts
│   ├── layouts/      # Page layouts
│   ├── pages/        # Page components
│   ├── routes/       # Route configuration
│   └── theme/        # Theme configuration

creatix-server/
├── config/           # Firebase Admin config
├── models/           # Mongoose models
├── routes/           # API routes
├── middlewares/      # Auth & validation
└── index.js          # Server entry point
```

## 🔐 Authentication

Uses Firebase Authentication on the frontend and Firebase Admin SDK on the backend for token verification. No custom JWT tokens are used.

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Author

Built with ❤️ by Rubayet
