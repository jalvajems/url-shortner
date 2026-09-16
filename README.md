# Authenticated URL Shortener

A full-stack **Authenticated URL Shortener** application built using **Node.js (NestJS)**, **TypeScript**, **MongoDB (Mongoose)**, **JWT Authentication**, and **React (Vite)**.

This project strictly adheres to **Repository Architecture**, **SOLID principles**, and **TypeScript OOP** concepts without over-engineering.

---

## Technical Overview

### Backend Tech Stack
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport JWT & bcrypt for password hashing
- **Documentation**: OpenAPI / Swagger
- **Security**: Helmet, CORS, DTO validation pipes, global exception filter
- **Testing**: Jest (Unit tests for services, repositories, and generators)

### Frontend Tech Stack
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Routing**: React Router v6
- **HTTP Client**: Axios with centralized request & response interceptors
- **Styling**: Tailwind CSS & Lucide React icons

---

## Project Architecture & Design Principles

### Repository Architecture

The project enforces a unidirectional dependency flow:

$$\text{Controller} \longrightarrow \text{Service Interface} \longrightarrow \text{Service Implementation} \longrightarrow \text{Repository Interface} \longrightarrow \text{Repository Implementation} \longrightarrow \text{MongoDB}$$

- **Controllers**: Handle HTTP requests/responses, request validation, and status codes.
- **Service Interfaces**: Define contracts for business logic capabilities.
- **Service Implementations**: Contain core domain business rules (e.g. short code collision retries, click counter tracking).
- **Repository Interfaces**: Abstract persistence operations.
- **Repository Implementations**: Execute Mongoose database queries. High-level services **never** import or interact directly with Mongoose models.

---

### SOLID Principles Implementation

1. **Single Responsibility Principle (SRP)**:
   - `PasswordService`: Responsible exclusively for password hashing and bcrypt comparison.
   - `TokenService`: Responsible exclusively for issuing and verifying JWT tokens.
   - `ShortCodeGenerator`: Responsible exclusively for generating random unique short code strings.
   - `UserRepository` / `UrlRepository`: Responsible exclusively for database operations.
2. **Open/Closed Principle (OCP)**:
   - Components depend on interface abstractions, enabling new implementations (e.g. swapping MongoDB for PostgreSQL) without modifying high-level services.
3. **Liskov Substitution Principle (LSP)**:
   - Concrete repositories (`UserRepository`, `UrlRepository`) strictly satisfy their interface contracts (`IUserRepository`, `IUrlRepository`) and can be substituted transparently.
4. **Interface Segregation Principle (ISP)**:
   - Interfaces are kept small and focused (`IPasswordService`, `ITokenService`, `IShortCodeGenerator`).
5. **Dependency Inversion Principle (DIP)**:
   - Services depend on abstractions/interfaces injected via NestJS custom provider tokens (`IUSER_REPOSITORY`, `IURL_REPOSITORY`, `IAUTH_SERVICE`, `IURL_SERVICE`).

---

## Project Folder Structure

```text
d:\brototype\url-shortner\
├── backend/
│   ├── src/
│   │   ├── config/             # Config variables & environment loaders
│   │   ├── controllers/
│   │   │   ├── interface/      # Controller interface contracts
│   │   │   └── implementation/ # NestJS API Controllers
│   │   ├── dto/
│   │   │   ├── auth/           # Login & Registration DTOs
│   │   │   └── url/            # URL creation & response DTOs
│   │   ├── guards/             # JWT Authentication Guard
│   │   ├── models/             # Mongoose Schemas (User & Url)
│   │   ├── modules/            # NestJS Feature Modules (AuthModule, UrlModule)
│   │   ├── repositories/
│   │   │   ├── interface/      # Data access contracts (IUserRepository, IUrlRepository)
│   │   │   └── implementation/ # Concrete Mongoose query implementations
│   │   ├── services/
│   │   │   ├── interface/      # Business logic contracts
│   │   │   └── implementation/ # Domain service logic (AuthService, UrlService)
│   │   ├── strategies/         # Passport JWT Strategy
│   │   ├── utils/              # ShortCodeGenerator & Exception Filters
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   ├── test/
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/         # ProtectedRoute, UI layout components
│   │   ├── context/            # AuthContext state manager
│   │   ├── pages/              # LoginPage, RegisterPage, DashboardPage
│   │   ├── services/           # api.ts (Axios), auth.service.ts, url.service.ts
│   │   ├── types/              # TypeScript interfaces
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
└── docker-compose.yml
```

---

## Key Features & Endpoints

### Authentication APIs
- `POST /api/auth/register` - Create account, hash password using bcrypt, return JWT.
- `POST /api/auth/login` - Validate credentials, issue JWT access token.
- `POST /api/auth/logout` - Clear token and invalidate session.

### URL Shortener APIs
- `POST /api/urls` (Protected) - Shorten a long URL for authenticated user.
- `GET /api/urls` (Protected) - Retrieve all URLs owned by authenticated user.
- `GET /api/urls/:id` (Protected) - Retrieve specific URL details (Ownership enforced).
- `DELETE /api/urls/:id` (Protected) - Delete URL owned by user.
- `GET /:shortCode` (Public) - Redirect visitor to original long URL & increment click count.

---

## Setup & Deployment

### Method 1: Easy Production Cloud Hosting (Vercel + Render + MongoDB Atlas)
1. **Database**: Create free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and get connection string.
2. **Backend**: Deploy `backend/` to [Render](https://render.com) (Web Service using Node.js).
3. **Frontend**: Deploy `frontend/` to [Vercel](https://vercel.com) (Connect Git repository, set `VITE_API_BASE_URL` to Render backend URL).

### Method 2: Docker Container Deployment (Single Command)
```bash
docker-compose up --build -d
```
This spins up MongoDB, Backend, and Frontend (Nginx) containers automatically.

### Method 3: Running Locally

#### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `mongodb://localhost:27017`)

#### 1. Backend Setup
```bash
cd backend
npm install
npm run build
npm run start:dev
```
- API Server: `http://localhost:4000`
- Swagger Documentation: `http://localhost:4000/api/docs`

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Client App: `http://localhost:5173`

---

## Running Unit Tests

```bash
cd backend
npm run test
```
Runs Jest unit test suite for `AuthService` and `UrlService` verifying password hashing, JWT generation, short code generation retry loops, user authorization checks, and click incrementing.

---

## AI Assistance Disclosure

As per evaluation requirements, AI assistance (Google Antigravity) was utilized during development for:
1. **Architecture Planning**: Designing clean separation of interfaces and implementations for Repository Architecture and SOLID compliance.
2. **Edge Case Identification**: Defining collision handling strategy for short-code generation and standardizing HTTP exception responses.
3. **Boilerplate & Test Generation**: Accelerating setup of NestJS modules, DTO validations, and Jest unit test mocks.
4. **Documentation**: Structuring comprehensive API docs and README layout.

*All AI-generated suggestions were manually reviewed, refined, integrated, and verified through build and automated test suites.*
