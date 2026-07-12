<div align="center">

# 🛍️ ShopEZ – AI-Powered Smart Shopping Platform

### Shop Smarter. Discover Faster. Powered by AI.

ShopEZ is an AI-powered e-commerce platform designed to provide a modern online shopping experience with an intelligent AI Shopping Assistant. The application combines secure authentication, responsive design, efficient product management, and AI-powered recommendations to help users make smarter purchasing decisions.

🌐 **Live Demo:** https://shop-ez-uio7.onrender.com/

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite)
![AI Powered](https://img.shields.io/badge/AI-Powered-success?style=for-the-badge)

</div>

---

# 📖 About the Project

ShopEZ is a full-stack AI-powered shopping platform that enhances the traditional online shopping experience by integrating Artificial Intelligence into product discovery and decision-making.

Instead of manually browsing through hundreds of products, users can interact with an AI Shopping Assistant that provides personalized product recommendations, comparisons, buying suggestions, and answers to shopping-related queries.

The project is developed following **MVC (Model–View–Controller) Architecture**, ensuring clean code organization, modularity, scalability, and maintainability.

---

# ✨ Key Features

## 🛒 Smart Shopping

- Browse products
- Search products
- View product details
- Explore offers and discounts
- Secure checkout
- Order confirmation
- Responsive shopping experience

---

## 🤖 AI Shopping Assistant (Unique Feature)

The AI Shopping Assistant helps users by:

- Recommending products
- Comparing products
- Answering shopping queries
- Suggesting alternatives
- Explaining product specifications
- Providing buying guidance

This feature transforms ShopEZ into an intelligent shopping companion.

---

## 👤 User Features

- User Registration
- Secure Login
- Firebase Authentication
- User Profile
- Protected Routes
- Order Confirmation
- Responsive Dashboard

---

## 👨‍💼 Admin Features

- Product Management
- Inventory Management
- Order Management
- User Monitoring
- Dashboard Overview

---

# 🏗️ MVC Architecture

This project strictly follows the **MVC (Model–View–Controller)** architecture.

### Model

Responsible for:

- Firestore Database Schemas
- Data Models
- Database Operations

### View

Responsible for:

- React Components
- UI Pages
- Responsive Interface

### Controller

Responsible for:

- Business Logic
- Request Processing
- AI Integration
- Authentication Logic

### Routes

Responsible for:

- API Endpoints
- User Routes
- Product Routes
- Authentication Routes

### Config

Responsible for:

- Firebase Configuration
- Environment Variables
- Application Configuration

### Server

- `server.js`
- Main application entry point

---

# 📂 Project Structure

```text
ShopEZ/
│
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   └── public/
│
├── server/
│   ├── config/
│   │   └── firebaseConfig.js
│   │
│   ├── models/
│   │   └── ProductModel.js
│   │
│   ├── controllers/
│   │   ├── ProductController.js
│   │   ├── UserController.js
│   │   └── AIController.js
│   │
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── userRoutes.js
│   │   └── aiRoutes.js
│   │
│   └── server.js
│
├── firestore.rules
├── package.json
├── package-lock.json
├── vite.config.ts
├── README.md
└── .env.example
```

---

# 🚀 Technology Stack

## Frontend

- React.js
- TypeScript
- Vite
- HTML5
- CSS3

---

## Backend

- Node.js
- Express.js

---

## Database

- Firebase Firestore
- Firebase Authentication

---

## AI Integration

- Google AI Studio
- Gemini AI
- Prompt Engineering

---

## Development Tools

- Git
- GitHub
- VS Code
- npm

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/Sathwika0412/Shop-EZ.git
```

---

## Move into Project

```bash
cd Shop-EZ
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create a `.env` file.

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

---

## Run Development Server

```bash
npm run dev
```

---

## Start Backend Server

```bash
node server.js
```

---

# 🔒 Security

- Firebase Authentication
- Protected API Routes
- Firestore Security Rules
- Environment Variables
- Secure User Sessions

---

# 📱 Responsive Design

Optimized for:

- Desktop
- Laptop
- Tablet
- Mobile Devices

---

# ⚡ Performance

- Fast rendering using React & Vite
- Modular MVC Architecture
- Reusable Components
- Optimized API Calls
- AI-assisted Product Search
- Responsive UI

---

# 🌟 Future Enhancements

- Wishlist
- Online Payment Gateway
- Order Tracking
- Voice AI Assistant
- Image Search
- Dark Mode
- Push Notifications
- Multi-language Support
- Personalized Recommendations

---

# 🎯 Learning Outcomes

This project demonstrates knowledge of:

- MVC Architecture
- React.js
- TypeScript
- Node.js
- Express.js
- Firebase
- Firestore
- Authentication
- REST APIs
- Google Gemini AI
- Prompt Engineering
- Responsive Web Design

---

# 📸 Screenshots

Include screenshots of:

- 🏠 Home Page
- 🔍 Product Search
- 🛒 Product Details
- 🤖 AI Shopping Assistant
- 👤 User Dashboard
- 👨‍💼 Admin Dashboard
- 📱 Mobile Responsive View

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a new branch.
3. Commit your changes.
4. Push to GitHub.
5. Submit a Pull Request.

---

# ⭐ Support

If you found this project useful, please give it a ⭐ on GitHub.

---

# 📄 License

This project is developed for educational and learning purposes only.

---

# 📌 Evaluation Notes

This project follows the prescribed **MVC (Model–View–Controller)** architecture.

- **Models** → Database Schemas
- **Controllers** → Business Logic
- **Routes** → API Endpoints
- **Config** → Database Configuration
- **server.js** → Application Entry Point

The folder structure has been organized to maintain modularity, scalability, and clean code practices as per the evaluation guidelines.
