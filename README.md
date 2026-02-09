# 🏆 Creatix - Creative Contest Platform

A full-stack contest creation platform where users can participate in creative challenges, creators can host contests, and admins can manage the platform.

**Live Demo**: [Add your deployed links here]

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Setup Instructions](#-setup-instructions)
- [Environment Variables](#-environment-variables)
- [Deployment Guide](#-deployment-guide)
- [What You Need to Set Up](#-what-you-need-to-set-up)

---

## ✨ Features

### Public Features
- 🎨 Browse and search contests by category
- ⏱️ Contest countdown timers
- 🏅 Leaderboard with top winners
- 🌙 Dark/Light theme toggle

### User Dashboard
- 📊 View participated & winning contests
- 💰 Track earnings and win rate
- ✏️ Edit profile information
- 📝 Submit contest entries

### Creator Dashboard
- ➕ Create new contests
- 👁️ View submissions
- 🎖️ Declare winners
- ✏️ Edit/Delete contests

### Admin Dashboard
- 👥 Manage user roles
- ✅ Approve/Reject contests
- 🗑️ Delete contests

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS |
| State | TanStack Query, Context API |
| Forms | React Hook Form |
| Auth | Firebase Authentication |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Payments | Stripe |

---

## 📁 Project Structure

```
Creatix/
├── creatix-client/          # React frontend
│   ├── src/
│   │   ├── api/             # API service layer
│   │   ├── components/      # Reusable components
│   │   ├── context/         # Auth context
│   │   ├── layouts/         # Page layouts
│   │   ├── pages/           # All pages
│   │   │   └── dashboard/   # Dashboard pages
│   │   ├── routes/          # App routing
│   │   └── theme/           # Theme context
│   └── .env.example
│
└── creatix-server/          # Express backend
    ├── config/              # Database & env config
    ├── middlewares/         # Auth, validation, rate limiting
    ├── models/              # Mongoose schemas
    ├── routes/              # API routes
    ├── utils/               # Helper utilities
    └── .env.example
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Firebase project
- Stripe account

### 1. Clone the Repository
```bash
git clone https://github.com/rubayet2027/Creatix.git
cd Creatix
```

### 2. Install Dependencies
```bash
# Install client dependencies
cd creatix-client
npm install

# Install server dependencies
cd ../creatix-server
npm install
```

### 3. Set Up Environment Variables
Copy the example files and fill in your values:
```bash
# Client
cp creatix-client/.env.example creatix-client/.env

# Server
cp creatix-server/.env.example creatix-server/.env
```

### 4. Run Development Servers
```bash
# Terminal 1 - Backend
cd creatix-server
npm run dev

# Terminal 2 - Frontend
cd creatix-client
npm run dev
```

---

## 🔐 Environment Variables

### Client (`creatix-client/.env`)

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | Firebase Console → Project Settings |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Firebase Console → Project Settings |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | Firebase Console → Project Settings |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Firebase Console → Project Settings |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID | Firebase Console → Project Settings |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | Firebase Console → Project Settings |
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` (dev) or your deployed URL |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable key | Stripe Dashboard → API Keys |

### Server (`creatix-server/.env`)

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `PORT` | Server port | `5000` (default) |
| `MONGODB_URI` | MongoDB connection string | MongoDB Atlas → Connect → Connection String |
| `JWT_SECRET` | Secret for JWT signing | Generate a random 32+ character string |
| `STRIPE_SECRET_KEY` | Stripe secret key | Stripe Dashboard → API Keys |
| `CLIENT_URL` | Frontend URL | `http://localhost:5173` (dev) or your deployed URL |

---

## 📦 What You Need to Set Up

### ⚠️ Required Services (You Must Create These)

#### 1. Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → **Email/Password** and **Google** sign-in
4. Go to Project Settings → General → Your apps → Add web app
5. Copy the config values to your `.env` file

#### 2. MongoDB Atlas Database
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster
3. Create a database user (note the username/password)
4. Whitelist IP addresses (use `0.0.0.0/0` for all IPs)
5. Get connection string: Connect → Connect your application
6. Replace `<password>` with your database user password

#### 3. Stripe Account
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create an account (use test mode for development)
3. Go to Developers → API Keys
4. Copy **Publishable key** (for client) and **Secret key** (for server)

#### 4. Generate JWT Secret
Run this in terminal to generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🌐 Deployment Guide

### Deploy Frontend (Vercel)
1. Go to [Vercel](https://vercel.com/) and sign in with GitHub
2. Click "Add New" → "Project"
3. Import your `Creatix` repository
4. Set **Root Directory** to `creatix-client`
5. Add all `VITE_*` environment variables
6. Click "Deploy"

### Deploy Backend (Vercel)
1. Create a new project in Vercel
2. Import the same repository
3. Set **Root Directory** to `creatix-server`
4. Add a `vercel.json` file in `creatix-server`:
```json
{
  "version": 2,
  "builds": [
    { "src": "index.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "index.js" }
  ]
}
```
5. Add server environment variables
6. Click "Deploy"

### After Deployment
1. Update `VITE_API_URL` in client with your deployed server URL
2. Update `CLIENT_URL` in server with your deployed client URL
3. Add your deployed URLs to Firebase authorized domains

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/jwt` - Get JWT token from Firebase token

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/leaderboard` - Get leaderboard
- `PUT /api/users/:id` - Update profile
- `PATCH /api/users/:id/role` - Change role (Admin)

### Contests
- `GET /api/contests` - Get approved contests
- `GET /api/contests/popular` - Get popular contests
- `POST /api/contests` - Create contest (Creator)
- `PATCH /api/contests/:id/status` - Approve/Reject (Admin)

### Submissions
- `POST /api/submissions` - Submit entry
- `PATCH /api/submissions/:id/winner` - Declare winner

### Payments
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `GET /api/payments/participated` - Get user's participated contests

---

## 📄 License
MIT

---

## 👤 Author
Rubayet - [@rubayet2027](https://github.com/rubayet2027)
