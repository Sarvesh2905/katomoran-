# 🚀 KatoPulse - URL Shortener & Analytics SaaS Platform

![License](https://img.shields.io/badge/Hackathon-Katomaran-blueviolet)
![React](https://img.shields.io/badge/Frontend-React-61DAFB)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248)
![Status](https://img.shields.io/badge/Status-Live-success)

A production-ready URL Shortener & Analytics SaaS Platform built for the Katomaran Hackathon.

---

# 🌐 Live Links

### Live Application

https://katomoran.vercel.app/

### Backend API

https://katomaran-api.onrender.com

### GitHub Repository

https://github.com/Sarvesh2905/Katomaran-Technologies

### Demo Video

**[ADD LOOM / YOUTUBE VIDEO LINK HERE]**

---

# 📚 Table of Contents

* Overview
* Problem Statement
* Features
* Architecture Diagram
* AI Planning Document
* Tech Stack
* Setup Instructions
* Environment Variables
* Screenshots
* Assumptions
* Deployment
* Future Enhancements
* Developer

---

# 📌 Project Overview

KatoPulse is a modern SaaS platform that enables users to create short URLs, manage links, generate QR codes, monitor engagement, and analyze traffic using advanced analytics.

The platform combines:

* URL Shortening
* QR Generation
* Device Analytics
* Browser Analytics
* Geographic Analytics
* Referrer Analytics
* Public Statistics Pages
* Insight Engine
* CSV Export
* PDF Export
* Health Score Analysis

into a single unified analytics ecosystem.

Unlike traditional URL shorteners, KatoPulse focuses on both link management and business intelligence.

---

# 🎯 Problem Statement

Build a full-stack URL Shortener application where users can:

* Create short URLs
* Manage links securely
* Track click analytics
* View engagement insights
* Export reports
* Monitor visitor behavior

The platform should support authentication, analytics tracking, and a premium user experience.

---

# ✨ Features

## 🔐 Authentication

* User Registration
* User Login
* JWT Authentication
* Password Hashing using bcrypt
* Protected Routes
* Session Validation
* Logout Functionality
* User Data Isolation

---

## 🔗 URL Shortening

* Long URL Creation
* Unique Short Code Generation
* Custom Alias Support
* URL Validation
* Duplicate Alias Prevention
* Server-side Redirect Handling

Example:

```text
https://amazon.com/product/123456

↓

https://katomoran.vercel.app/amazon-sale
```

---

## 📊 Dashboard

Displays:

* Original URL
* Short URL
* Alias
* Created Date
* Expiry Date
* Status
* Click Count
* Health Score

Actions:

* Copy URL
* Edit URL
* Delete URL
* Enable / Disable Link
* Generate QR Code
* View Analytics

---

## 📈 Analytics

Tracks:

* Total Clicks
* Timestamp
* Last Visited
* Recent Visits
* Device Type
* Browser
* Operating System
* Referrer Source
* Country
* State
* City

---

## 🎁 Bonus Features

### Custom Alias

Examples:

```text
/my-resume
/amazon-sale
/sarvesh
```

### QR Code Generation

* Generate QR
* Download QR
* Scan & Redirect

### Expiry Links

* Never Expire
* Custom Expiry Date

### Device Analytics

* Desktop
* Mobile
* Tablet

### Browser Analytics

* Chrome
* Firefox
* Safari
* Edge

### Geo Analytics

* Country
* State
* City

### Daily Click Trends

* Last 7 Days
* Last 30 Days
* Last 90 Days

### Public Statistics Page

```text
/stats/:shortCode
```

### Edit Destination URL

Update destination URL without changing shortcode.

### Bulk URL Upload

Upload multiple URLs through CSV.

---

## 🚀 Advanced SaaS Features

### Referrer Analytics

Tracks:

* Direct
* Google
* Facebook
* Instagram
* LinkedIn
* WhatsApp
* Telegram
* Twitter/X

### SaaS Insight Engine

Automatically generates:

* Most Popular Link
* Fastest Growing Link
* Highest Engagement Link
* Top Country
* Top Browser
* Top Device
* Weekly Growth
* Monthly Growth

### Link Health Score

Calculated using:

* Click Activity
* Link Age
* Status
* Recent Activity

Ratings:

* Excellent
* Good
* Average
* Poor

---

## 📂 Export Features

### CSV Export

Export analytics reports to CSV.

### PDF Export

Generate professional analytics reports.

Includes:

* Link Information
* Click Count
* Device Analytics
* Browser Analytics
* Referrer Analytics
* Geo Analytics
* Daily Trends
* Health Score

---

## 🔎 Search & Discovery

### Search

Search by:

* Original URL
* Alias
* Short URL

### Filter

* Active
* Disabled
* Expired

### Sort

* Latest
* Oldest
* Most Clicked
* Least Clicked

---

## 🎨 UI / UX Features

### Theme System

* Dark Mode
* Light Mode
* Theme Persistence
* System Theme Detection

### Premium User Experience

* Skeleton Loading States
* Empty States
* Error States
* Success States
* Responsive Design

### 3D Cosmic Design System

Inspired by:

* Apple Vision Pro
* Stripe
* Linear
* Vercel
* Modern AI Platforms

Includes:

* Aurora Gradients
* Floating Cards
* Glassmorphism
* Animated KPI Counters
* Interactive Charts
* Dynamic Shadows
* Micro Interactions

---

# 🏗 Architecture Diagram

<p align="center">
  <img src="./architecture-diagram.png" alt="KatoPulse Architecture Diagram" width="1000"/>
</p>

## Architecture Overview

Frontend (React + Vite)

↓

REST API Layer

↓

Express Backend

↓

MongoDB Atlas

Analytics Flow:

Visitor

↓

Short URL

↓

Redirect Controller

↓

Analytics Capture

↓

MongoDB

↓

Dashboard Insights

This architecture ensures:

* Scalability
* Security
* Maintainability
* Production Readiness

---

# 🤖 AI Planning Document

## Phase 1 - Requirement Analysis

The problem statement was analyzed and divided into:

* Authentication
* URL Shortening
* Dashboard
* Analytics
* Bonus Features
* Deployment Requirements

---

## Phase 2 - Architecture Design

Chosen Architecture:

Frontend

↓

REST APIs

↓

Express Backend

↓

MongoDB Atlas

### Why This Architecture?

* Clear Separation of Concerns
* Easy Maintenance
* High Scalability
* Production-Friendly Deployment

---

## Phase 3 - Feature Planning

### Mandatory Features

* Authentication
* URL Shortening
* Dashboard
* Analytics

### Bonus Features

* QR Code Generation
* Custom Alias
* Expiry Links
* Device Analytics
* Browser Analytics
* Geo Analytics
* Daily Trends
* Public Statistics
* Bulk Upload

### Advanced Features

* Insight Engine
* Health Score
* Theme System
* CSV Export
* PDF Export
* Search / Filter / Sort

---

## Phase 4 - Development

Implemented with:

* Backend Validation
* Security Checks
* Error Handling
* Deployment Readiness Validation

---

## Phase 5 - Deployment

Frontend:
Vercel

Backend:
Render

Database:
MongoDB Atlas

---

# 🛠 Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Axios
* TanStack Query
* React Hook Form
* Zod
* Recharts
* Framer Motion

## Backend

* Node.js
* Express.js

## Database

* MongoDB Atlas
* Mongoose

## Authentication

* JWT
* bcrypt

## Deployment

* Vercel
* Render
* MongoDB Atlas

---

# ⚙️ Setup Instructions

## Clone Repository

```bash
git clone https://github.com/Sarvesh2905/Katomaran-Technologies
cd Katomaran-Technologies
```

---

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## Backend Setup

```bash
cd server
npm install
npm run dev
```

---

# 🔑 Environment Variables

## Frontend (.env)

```env
VITE_API_URL=https://katomaran-api.onrender.com/api
VITE_BASE_URL=https://katomoran.vercel.app
```

## Backend (.env)

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/katopulse
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=https://katomoran.vercel.app
BASE_URL=https://katomoran.vercel.app
PORT=5000
NODE_ENV=production
```

---

# 📸 Application Screenshots

## Landing Page

![Landing Page](./landing-page.png)

## Login Page

![Login](./login-page.png)

## Dashboard Overview

![Dashboard](./dashboard-overview.png)

## URL Creation

![URL Creation](./create-url.png)

## Analytics Dashboard

![Analytics Dashboard](./analytics-dashboard.png)

## Device, Browser & Referrer Analytics

![Device Browser Referrer Analytics](./device-browser-referrer-analytics.png)

## Geographic Analytics

![Geographic Analytics](./geographic-analytics.png)

## QR Code Generation

![QR Generator](./qr-generator.png)

## Platform Insights Engine

![Platform Insights](./platform-insights-section.png)

## Bulk Upload

![Bulk Upload](./bulk-upload.png)

## Theme System - Dark Mode

![Theme Dark](./theme-system-dark.png)

## Theme System - Light Mode

![Theme Light](./theme-system-light.png)

## CSV Export

![CSV Export](./export-features-csv.png)

## PDF Export

![PDF Export](./export-features-pdf.png)

## MongoDB Collections

![MongoDB](./mongodb-collections.png)

---

# 🧪 Assumptions Made

* Users can manage only their own URLs.
* Custom aliases must remain unique.
* Analytics are recorded on every successful redirect.
* Expired links do not redirect.
* Disabled links do not redirect.
* Public statistics pages expose analytics information only.
* MongoDB Atlas remains available during runtime.

---

# 🚀 Deployment

Frontend:
https://katomoran.vercel.app/

Backend:
https://katomaran-api.onrender.com

Database:
MongoDB Atlas

---

# 🎥 Project Demonstration

Loom / YouTube Video:

**[ADD VIDEO LINK HERE]**

---

# 🔮 Future Enhancements

* Team Workspaces
* Custom Domains
* Scheduled Link Expiry
* AI-Based Insights
* Email Reports
* Webhook Integrations
* Role-Based Access Control

---

# 👨‍💻 Developer

**Sarvesh P**

Organization:
**Katomaran Technologies**

GitHub:
https://github.com/Sarvesh2905

LinkedIn:
https://www.linkedin.com/in/sarveshp2905/

---

## 📜 Hackathon Attribution

This project is a part of a hackathon run by https://katomaran.com
