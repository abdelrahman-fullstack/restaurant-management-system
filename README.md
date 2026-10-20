# 🍽️ Restaurant Management System REST API

A production-grade, secure, and robust backend REST API for a Restaurant Management System built with Node.js, Express.js, and MongoDB.

## 🚀 Tech Stack
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database & ODM:** MongoDB & Mongoose
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs
- **Validation:** Zod
- **Security:** Helmet, CORS, Express-Rate-Limit
- **Testing:** Jest & Supertest

---

## 📂 Project Architecture
```text
src/
├── config/          # Database configuration
├── models/          # Mongoose schemas & models
├── controllers/     # Business logic & request handlers
├── services/        # Auxiliary services
├── routes/          # API endpoints routing
├── middleware/      # Auth, RBAC, error handling, validation
├── validators/      # Zod validation schemas
├── utils/           # Helper functions & seed scripts
├── app.js           # Express app configuration
└── server.js        # Server entry point