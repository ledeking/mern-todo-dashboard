# MERN Todo Dashboard

A modern, production-ready task management application built with the MERN stack (MongoDB, Express, React, Node.js). Features a beautiful dashboard interface with Kanban board, drag & drop functionality, calendar view, and comprehensive task management capabilities.

![React](https://img.shields.io/badge/React-19+-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-8.8-47A248?style=flat-square&logo=mongodb)
![Express](https://img.shields.io/badge/Express-4.21-000000?style=flat-square&logo=express)

## ✨ Features

### Core Functionality
- ✅ **User Authentication** - Secure register/login with JWT tokens (httpOnly cookies)
- ✅ **Dashboard Overview** - Statistics cards showing total, completed, in progress, and overdue tasks
- ✅ **Kanban Board** - Drag & drop task management with three columns (To Do, In Progress, Done)
- ✅ **Task Management** - Create, edit, delete tasks with full CRUD operations
- ✅ **Task Details** - Rich task pages with subtasks, comments, tags, and due dates
- ✅ **Task List View** - Filterable and sortable task list with search functionality
- ✅ **Calendar View** - Visual calendar showing tasks by due date
- ✅ **User Profile** - View and manage account information
- ✅ **Dark Mode** - System preference-based theme switching
- ✅ **Responsive Design** - Mobile-friendly interface

### Task Features
- **Priority Levels** - Low, Medium, High priority with color coding
- **Status Tracking** - Todo, In Progress, Done statuses
- **Due Dates** - Set and track due dates with overdue highlighting
- **Tags/Labels** - Organize tasks with custom tags
- **Subtasks** - Break down tasks into smaller subtasks
- **Comments** - Add comments to tasks for collaboration
- **Search & Filter** - Search by title/description, filter by status/priority
- **Sorting** - Sort by created date, due date, or title

### Technical Features
- **TypeScript** - Full type safety across frontend and backend
- **React 19+** - Latest React features with hooks
- **Zustand** - Lightweight state management
- **React Hook Form + Zod** - Form validation and type-safe forms
- **Drag & Drop** - @dnd-kit for smooth drag and drop interactions
- **React Big Calendar** - Calendar view for task scheduling
- **shadcn/ui** - Beautiful, accessible UI components
- **Tailwind CSS v4** - Modern utility-first styling
- **JWT Authentication** - Secure token-based auth with httpOnly cookies
- **MongoDB + Mongoose** - Robust data modeling and queries
- **Express Middleware** - Helmet, CORS, rate limiting for security

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 20+ and npm/yarn/pnpm
- MongoDB (local installation or MongoDB Atlas account)
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mern-todo-dashboard
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies (root, client, server)
   npm run install:all
   ```

   Or install separately:
   ```bash
   npm install
   cd client && npm install && cd ..
   cd server && npm install && cd ..
   ```

3. **Set up environment variables**

   Create `.env` in the `server/` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mern-todo
   CLIENT_URL=http://localhost:3000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   ```

   Create `.env` in the `client/` directory (optional):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start MongoDB**
   
   If using local MongoDB:
   ```bash
   # macOS (Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   # Start MongoDB service from Services panel
   ```

   Or use MongoDB Atlas (cloud):
   - Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster
   - Get connection string and update `MONGODB_URI` in `.env`

5. **Start development servers**

   From the root directory:
   ```bash
   npm run dev
   ```

   Or start them separately:
   ```bash
   # Terminal 1 - Server
   cd server && npm run dev

   # Terminal 2 - Client
   cd client && npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🏗️ Architecture

### Authentication Flow
1. User registers/logs in via REST API
2. Server validates credentials and creates JWT
3. JWT stored in httpOnly cookie (and localStorage as backup)
4. All protected routes verify JWT via middleware
5. Token expires after 7 days (configurable)

### Task Management Flow
1. User creates task via API
2. Task stored in MongoDB with owner reference
3. Real-time updates via Zustand store
4. Optimistic updates for drag & drop
5. Server syncs changes

### State Management
- **Zustand** for global state
- **Auth Store**: User info and JWT token
- **Task Store**: Tasks list, filters, sorting
- **LocalStorage**: Persistent auth state

## 📝 API Reference

### Authentication Endpoints

**POST `/api/auth/register`**
- Body: `{ name: string, email: string, password: string }`
- Returns: `{ user: User, token: string }`

**POST `/api/auth/login`**
- Body: `{ email: string, password: string }`
- Returns: `{ user: User, token: string }`

**POST `/api/auth/logout`**
- Clears httpOnly cookie
- Returns: `{ message: string }`

**GET `/api/auth/me`**
- Headers: `Authorization: Bearer <token>` or cookie
- Returns: `{ user: User }`

### Task Endpoints

**GET `/api/tasks`**
- Query params: `status`, `priority`, `search`, `sortBy`, `sortOrder`
- Returns: `Task[]`

**GET `/api/tasks/:id`**
- Returns: `Task`

**POST `/api/tasks`**
- Body: `{ title: string, description?: string, dueDate?: Date, priority?: string, status?: string, tags?: string[] }`
- Returns: `Task`

**PUT `/api/tasks/:id`**
- Body: Partial task updates
- Returns: `Task`

**DELETE `/api/tasks/:id`**
- Returns: `{ message: string }`

**PATCH `/api/tasks/status`**
- Body: `{ taskIds: string[], status: string }`
- Returns: `{ message: string }`

## Contact

- Telegram: https://t.me/ledeking
- Twitter: https://x.com/ledeking_
