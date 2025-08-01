# 🚀 PortFolyo - Developer Portfolio Platform

A modern portfolio platform where developers can showcase their skills and recruiters can discover talent. Built with Next.js frontend and Node.js/Express backend.

## 📋 Project Overview

PortFolyo is a comprehensive platform that allows developers to:
- Create professional portfolios with skills, experience, and projects
- Sync stats from GitHub, Codeforces, and LeetCode (Phase 3)
- Get verified and ranked based on platform performance
- Visualize their strengths with AI-powered radar charts
- Connect with recruiters and job opportunities

## 📁 Project Structure

```
portfolyo/
├── frontend/                    # Next.js frontend application
│   ├── pages/                   # Next.js pages
│   ├── components/              # Reusable React components
│   │   └── profile/             # Profile-specific components
│   │       ├── RadarChart.js    # Radar visualization component
│   │       ├── AvatarAndIdentity.js
│   │       ├── MetaCards.js
│   │       └── ...
│   ├── styles/                  # Tailwind CSS styles
│   └── public/                  # Static assets
├── backend/                     # Node.js/Express backend API
│   ├── config/                  # Database configuration
│   ├── models/                  # MongoDB schemas
│   ├── controllers/             # Business logic
│   ├── routes/                  # API endpoints
│   ├── middleware/              # Custom middleware
│   ├── services/                # External services (AI, platform APIs)
│   └── server.js                # Main server file
└── README.md
```

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15
- **Styling**: Tailwind CSS 4.x
- **Charts**: Recharts for radar visualization
- **Icons**: FontAwesome, Heroicons
- **Language**: JavaScript (React)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **Security**: bcrypt password hashing
- **AI Integration**: OpenAI GPT-4 for profile analysis

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/portfolyo
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   OPENAI_API_KEY=your-openai-api-key
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   Server will run on http://localhost:5000

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Frontend will run on http://localhost:3000

## 📊 Radar Chart Visualization

### Overview
The radar chart provides a visual representation of developer strengths across six key dimensions:

- **Code Activity**: GitHub repositories, commits, stars, and verification status
- **Problem Solving**: Codeforces rating, LeetCode problems solved, algorithmic skills
- **Project Impact**: Repository quality, stars received, project complexity
- **Writing & Documentation**: README quality, articles, documentation skills
- **Social & Community**: GitHub followers, LinkedIn presence, community engagement
- **Verification & Trust**: Email, GitHub, phone verification, skill validation

### Features
- **Responsive Design**: Chart and legend side-by-side on desktop, stacked on mobile
- **Interactive Legend**: Click to navigate to relevant profile sections
- **Accessibility**: Screen reader support with descriptive content
- **Real-time Updates**: Automatically calculated when profiles are fetched
- **Graceful Degradation**: Informative empty state when data is missing

### Data Sources
The radar chart uses normalized data (0-100 scale) from:
- Platform statistics (GitHub, Codeforces, LeetCode)
- Profile verification status
- AI-analyzed content quality
- User-provided information

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Profile Management
- `GET /api/profile/me` - Get current user's profile (protected)
- `PUT /api/profile` - Create/update profile (protected)
- `GET /api/profile/:username` - Get public profile by username
- `POST /api/profile/:username/fetchPlatforms` - Sync platform statistics (protected)
- `POST /api/profile/:username/runSkillExtractor` - Generate AI analysis (protected)

### System
- `GET /api/health` - Health check endpoint

## 🗄 Database Models

### User Model
- Basic authentication and account information
- Account types: developer_free, developer_pro, recruiter
- Password hashing with bcrypt
- JWT token generation

### Profile Model
- Complete developer profile information
- Skills with proficiency levels (1-10)
- Experience and project arrays
- Social media handles
- Verification status
- Platform statistics and radar chart data
- AI-generated analysis fields

## 🎯 Development Phases

### ✅ Phase 1: Frontend Foundation (Completed)
- Responsive homepage with hero section
- About page with company story
- Pricing page with comparison tables
- Professional navigation and footer
- Modern UI with Tailwind CSS

### ✅ Phase 2: Backend Infrastructure (Completed)
- Complete authentication system
- User and Profile models
- RESTful API endpoints
- JWT token security
- Frontend-backend integration
- Registration and login pages

### 🔄 Phase 3: Profile Editor & Platform Sync (Completed)
- Complete profile editing UI
- GitHub/Codeforces/LeetCode API integration
- Platform statistics storage
- Radar chart data generation and visualization
- AI-powered profile analysis
- Public profile pages with interactive charts

### 📅 Phase 4: Advanced Features (Planned)
- Advanced search and filtering
- Real-time features
- Enhanced AI recommendations
- Recruiter dashboard improvements

## 🧪 Testing

### Backend Testing (Postman)
1. **Register User:**
   ```
   POST http://localhost:5000/api/auth/register
   Body: { "name": "Test User", "email": "test@example.com", "password": "password123", "accountType": "developer_free" }
   ```

2. **Login User:**
   ```
   POST http://localhost:5000/api/auth/login
   Body: { "email": "test@example.com", "password": "password123" }
   ```

3. **Create Profile:**
   ```
   PUT http://localhost:5000/api/profile
   Headers: Authorization: Bearer <token>
   Body: { "basicInfo": { "location": "Mumbai" }, "skills": [{ "name": "JavaScript", "proficiency": 8 }] }
   ```

### Frontend Testing
1. Visit http://localhost:3000/register
2. Create a new account
3. Login at http://localhost:3000/login
4. Access profile at http://localhost:3000/profile/edit
5. View public profile at http://localhost:3000/profile/[username]

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication (7-day expiry)
- Input validation and sanitization
- CORS configuration
- Environment variable protection
- Secure error handling

## ⚡ Performance Optimizations

- Next.js Image optimization
- Tailwind CSS purging
- MongoDB indexing
- Efficient API queries
- Static asset optimization
- Recharts performance optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ as a comprehensive full-stack development project.

## 🔗 Links

- **Backend API**: http://localhost:5000
- **Frontend**: http://localhost:3000
- **Health Check**: http://localhost:5000/api/health

---

**Status**: Phase 3 Complete - Radar Chart Visualization Live! 🚀