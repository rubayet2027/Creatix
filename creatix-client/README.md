# Creatix - Contest Creation Platform (Client)

A modern, full-stack contest platform built with React, featuring role-based dashboards, Firebase authentication, and Stripe payments.

## 🚀 Live Demo
- **Client**: [Deployed on Vercel/Firebase]
- **Server**: [Deployed on Vercel]

## ✨ Features

### Public Features
- Browse and search contests by category
- View contest details with countdown timer
- Leaderboard showing top winners
- Dark/Light theme toggle

### User Dashboard
- View participated contests
- Track winning contests and earnings
- Profile with win rate chart
- Submit entries for contests

### Creator Dashboard  
- Create and manage contests
- View contest submissions
- Declare winners

### Admin Dashboard
- Manage users and roles
- Approve/reject contests
- Full contest management

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS v3, DaisyUI
- **State**: TanStack Query, Context API
- **Forms**: React Hook Form
- **Auth**: Firebase Authentication
- **Routing**: React Router v6
- **Payments**: Stripe

## 📦 Installation

```bash
# Clone repository
git clone <repo-url>
cd creatix-client

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your Firebase and API configuration

# Start development server
npm run dev
```

## 🔧 Environment Variables

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=
```

## 📁 Project Structure

```
src/
├── api/          # Axios API layer
├── components/   # Reusable components
├── context/      # AuthContext
├── layouts/      # MainLayout, DashboardLayout
├── pages/        # All page components
│   └── dashboard/   # Dashboard pages
├── routes/       # App routing
└── theme/        # Theme context
```

## 🎨 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with hero and contests |
| All Contests | `/all-contests` | Browse with filters |
| Contest Details | `/contest/:id` | Full contest info |
| Leaderboard | `/leaderboard` | Top winners |
| Login | `/login` | Firebase auth |
| Register | `/register` | New user signup |
| Dashboard | `/dashboard/*` | Role-based dashboard |

## 📝 Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📄 License
MIT
