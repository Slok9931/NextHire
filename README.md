# NextHire - Modern Job Portal Application

A full-stack job portal application built with modern technologies, featuring microservices architecture, real-time notifications, and premium subscriptions.

## 🚀 Features

### For Job Seekers
- **User Registration & Authentication** with JWT tokens
- **Profile Management** with resume upload and skills tracking
- **Job Search & Filtering** with advanced filters
- **Job Applications** with application tracking
- **Resume Analysis** with ATS scoring and suggestions
- **Career Guide** with personalized recommendations
- **Premium Subscriptions** for enhanced visibility
- **Application Status Notifications** via email

### For Recruiters
- **Company Management** with logo and details
- **Job Posting** with detailed requirements
- **Application Management** with status updates
- **Premium User Prioritization** in application listings
- **Email Notifications** for application updates
- **Analytics Dashboard** with application statistics

### System Features
- **Microservices Architecture** for scalability
- **Real-time Email Notifications** using Kafka message queue
- **File Upload Service** with cloud storage
- **Dark/Light Theme** support
- **Responsive Design** for all devices
- **Advanced Security** with middleware protection

## 🏗️ Architecture

### Microservices Overview

```
NextHire/
├── client/                # Next.js Frontend Application
└── services/
    ├── auth/              # Authentication Service
    ├── user/              # User Management Service
    ├── job/               # Job & Application Service
    └── utils/             # Utility Service (Email, File Upload)
```

### Technology Stack

**Frontend:**
- Next.js 14 with TypeScript
- Tailwind CSS for styling
- shadcn/ui component library
- Context API for state management
- Axios for API calls

**Backend:**
- Node.js with Express.js
- TypeScript for type safety
- PostgreSQL database
- Kafka for message queuing
- JWT for authentication
- Multer for file uploads

**Infrastructure:**
- Microservices architecture
- Docker containerization ready
- Cloud storage integration
- Email service integration

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Kafka (for message queuing)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone https://github.com/Slok9931/NextHire.git
cd NextHire
```

### 2. Setup Backend Services

#### Authentication Service
```bash
cd services/auth
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

#### User Service
```bash
cd services/user
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

#### Job Service
```bash
cd services/job
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

#### Utils Service
```bash
cd services/utils
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```

## 🔧 Environment Configuration

### Service Environment Variables

#### Auth Service (.env)
```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/nexthire_auth
JWT_SECRET=your_jwt_secret_key
KAFKA_BROKER=localhost:9092
FILE_UPLOAD_SERVICE_URL=http://localhost:5001
```

#### User Service (.env)
```env
PORT=5002
DATABASE_URL=postgresql://username:password@localhost:5432/nexthire_users
JWT_SECRET=your_jwt_secret_key
KAFKA_BROKER=localhost:9092
FILE_UPLOAD_SERVICE_URL=http://localhost:5001
```

#### Job Service (.env)
```env
PORT=5003
DATABASE_URL=postgresql://username:password@localhost:5432/nexthire_jobs
JWT_SECRET=your_jwt_secret_key
KAFKA_BROKER=localhost:9092
FILE_UPLOAD_SERVICE_URL=http://localhost:5001
```

#### Utils Service (.env)
```env
PORT=5001
KAFKA_BROKER=localhost:9092
EMAIL_SERVICE_API_KEY=your_email_service_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🚀 Available Scripts

### Backend Services

Each service includes the following scripts:

```bash
# Development
npm run dev         # Start development server with hot reload
npm start           # Start production server
npm run build       # Build TypeScript files
npm run lint        # Run ESLint

# Database
npm run migrate     # Run database migrations
npm run seed        # Seed database with sample data
```

### Frontend Application

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm start           # Start production server
npm run lint        # Run ESLint
npm run type-check  # Run TypeScript checks
```

### Docker Support

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop all services
docker-compose down
```

## 📁 Project Structure

### Frontend Structure
```
client/src/
├── app/                   # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── account/           # User account pages
│   ├── company/           # Company pages
│   ├── jobs/              # Job pages
│   └── about/             # About page
├── components/            # Reusable UI components
│   ├── ui/                # shadcn/ui components
│   └── custom/            # Custom components
├── context/               # React Context providers
├── lib/                   # Utility libraries
└── types/                 # TypeScript type definitions
```

### Backend Structure (Each Service)
```
services/[service]/src/
├── controllers/          # Business logic
├── routes/               # API endpoints
├── middleware/           # Custom middleware
├── utils/                # Utility functions
├── app.ts                # Express app configuration
└── index.ts              # Service entry point
```

## 🔌 API Endpoints

### Authentication Service (Port: 5000)
```
POST /api/auth/register         # User registration
POST /api/auth/login            # User login
POST /api/auth/forgot-password  # Password reset request
POST /api/auth/reset-password   # Password reset
GET  /api/auth/verify-token     # Token verification
```

### User Service (Port: 5002)
```
GET    /api/user/profile        # Get user profile
PUT    /api/user/profile        # Update profile
PUT    /api/user/profile-pic    # Update profile picture
PUT    /api/user/resume         # Update resume
GET    /api/user/skills         # Get user skills
POST   /api/user/skills         # Add skill
DELETE /api/user/skills/:skill  # Remove skill
GET    /api/user/:id            # Get user by ID
```

### Job Service (Port: 5003)
```
# Companies
POST   /api/job/company/new              # Create company
GET    /api/job/company                  # Get all companies
GET    /api/job/company/by-recruiter     # Get recruiter companies
GET    /api/job/company/:id              # Get company details
DELETE /api/job/company/:id              # Delete company

# Jobs
POST   /api/job/new                      # Create job
GET    /api/job/                         # Get all jobs
GET    /api/job/:id                      # Get job details
PUT    /api/job/:id                      # Update job
GET    /api/job/applications/:jobId      # Get job applications
PUT    /api/job/application/:appId       # Update application status
```

### Utils Service (Port: 5001)
```
POST /api/utils/upload          # File upload
POST /api/utils/analyze-resume  # Resume analysis
POST /api/utils/career-guide    # Career guidance
```

## 🎨 UI Components

### Core Components
- **Navbar** - Navigation with theme toggle
- **Hero** - Landing page hero section
- **JobCard** - Individual job display
- **ApplicationCard** - Application status display
- **FilterPanel** - Advanced job filtering
- **ResumeAnalyzer** - ATS resume analysis
- **CareerGuide** - Personalized career recommendations

### UI Library (shadcn/ui)
- Button, Card, Dialog, Input, Select
- Badge, Avatar, Tabs, Checkbox
- Alert, Popover, Dropdown Menu
- And more...

## 🔐 Authentication & Authorization

### JWT Token Flow
1. User registers/logs in
2. Server issues JWT token
3. Frontend stores token in cookies
4. Protected routes verify token via middleware
5. Token includes user role (jobseeker/recruiter)

### Role-Based Access
- **Job Seekers**: Apply to jobs, manage profile, view applications
- **Recruiters**: Post jobs, manage companies, review applications
- **Premium Users**: Enhanced visibility, priority in application lists

## 📧 Notification System

### Kafka Message Queue
- **Email Queue**: Application status updates, welcome emails
- **Notification Queue**: Real-time user notifications
- **Analytics Queue**: Usage tracking and metrics

### Email Templates
- Welcome email for new users
- Application confirmation
- Status update notifications
- Password reset emails

## 🎯 Premium Features

### For Job Seekers
- **Enhanced Visibility**: Profile appears first in recruiter searches
- **Priority Applications**: Applications shown first to recruiters

### For Recruiters
- **Premium Applicant Filtering**: Filter by subscription status
- **Advanced Analytics**: Detailed hiring metrics
- **Priority Support**: Faster customer service

## 📊 Database Schema

### Key Tables
- **users**: User profiles and authentication
- **companies**: Company information and branding
- **jobs**: Job postings and requirements
- **applications**: Job applications and status
- **skills**: Available skills and user associations

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow conventional commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for beautiful UI components
- **Next.js** team for the amazing framework
- **Tailwind CSS** for utility-first styling
- **PostgreSQL** for reliable database
- **Kafka** for message queuing

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: sloktulsyan@gmail.com

---

**NextHire** - Connecting talent with opportunity 🚀