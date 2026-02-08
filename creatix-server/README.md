# Creatix - Contest Platform API (Server)

RESTful API for the Creatix contest platform, built with Express.js and MongoDB.

## 🚀 Live API
- **Base URL**: [Deployed on Vercel]

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Auth**: JWT + Firebase
- **Payments**: Stripe

## 📦 Installation

```bash
# Clone repository
git clone <repo-url>
cd creatix-server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your configuration

# Start development server
npm run dev
```

## 🔧 Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=sk_test_...
CLIENT_URL=http://localhost:5173
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/jwt` | Generate JWT from Firebase token |
| GET | `/api/auth/me` | Get current user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users (Admin) |
| GET | `/api/users/leaderboard` | Get top winners |
| PUT | `/api/users/:id` | Update user profile |
| PATCH | `/api/users/:id/role` | Update user role (Admin) |

### Contests
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contests` | Get all approved contests |
| GET | `/api/contests/popular` | Get popular contests |
| GET | `/api/contests/:id` | Get contest by ID |
| POST | `/api/contests` | Create contest (Creator) |
| PUT | `/api/contests/:id` | Update contest |
| DELETE | `/api/contests/:id` | Delete contest |
| PATCH | `/api/contests/:id/status` | Approve/Reject (Admin) |

### Submissions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/submissions` | Submit task |
| GET | `/api/submissions/contest/:id` | Get submissions (Creator) |
| PATCH | `/api/submissions/:id/winner` | Declare winner |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/create-intent` | Create Stripe intent |
| POST | `/api/payments/confirm` | Confirm payment |
| GET | `/api/payments/participated` | Get participated contests |
| GET | `/api/payments/winnings` | Get winning contests |

## 📁 Project Structure

```
├── config/
│   └── db.js           # MongoDB connection
├── middlewares/
│   └── auth.js         # JWT verification
├── models/
│   ├── User.js
│   ├── Contest.js
│   ├── Submission.js
│   └── Payment.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── contests.js
│   ├── submissions.js
│   └── payments.js
└── index.js            # Entry point
```

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

### User Roles
- **user**: Default role, can participate in contests
- **creator**: Can create and manage contests
- **admin**: Full access to manage users and contests

## 📝 Scripts

```bash
npm start     # Start production server
npm run dev   # Start with nodemon
```

## 📄 License
MIT
