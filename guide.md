# 🚀 BusMitra Deployment Guide (Render + Netlify + MongoDB Atlas)

This comprehensive guide will walk you through deploying the **BusMitra (Bus Booking Management System)** to production:
- **Database**: MongoDB Atlas Cloud (Free M0 Cluster)
- **Backend API**: Render Web Service (Node.js/Express)
- **Frontend SPA**: Netlify (Vite React + Tailwind CSS)

---

## 📑 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Step 1: MongoDB Atlas Cloud Database Setup](#2-step-1-mongodb-atlas-cloud-database-setup)
3. [Step 2: Push Repository to GitHub](#3-step-2-push-repository-to-github)
4. [Step 3: Deploy Backend on Render](#4-step-3-deploy-backend-on-render)
5. [Step 4: Seed Database on Render](#5-step-4-seed-database-on-render)
6. [Step 5: Deploy Frontend on Netlify](#6-step-5-deploy-frontend-on-netlify)
7. [Step 6: Link Frontend & Backend](#7-step-6-link-frontend--backend)
8. [Step 7: Verification & Demo Credentials](#8-step-7-verification--demo-credentials)
9. [Troubleshooting & FAQs](#9-troubleshooting--faqs)

---

## 1. Prerequisites

Before beginning, ensure you have free accounts on:
1. **GitHub**: [github.com](https://github.com)
2. **MongoDB Atlas**: [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
3. **Render**: [render.com](https://render.com)
4. **Netlify**: [netlify.com](https://www.netlify.com)

---

## 2. Step 1: MongoDB Atlas Cloud Database Setup

### 2.1 Create Free Cluster
1. Sign in to your **MongoDB Atlas** account.
2. Click **Create** under Deployments.
3. Choose the **M0 Free** tier.
4. Select a cloud provider (e.g., **AWS**) and choose the region closest to your users (e.g., **ap-south-1 Mumbai** or **us-east-1**).
5. Name your cluster (e.g., `Cluster0`) and click **Create Deployment**.

### 2.2 Create Database User
1. Under **Security** in the left sidebar, click **Database Access**.
2. Click **Add New Database User**.
3. Choose **Password** Authentication:
   - **Username**: `busmitra_admin` (or your chosen username)
   - **Password**: Generate or type a secure password (e.g., `SecurePass123!`). *Save this password.*
   - **Database User Privileges**: Select `Read and write to any database`.
4. Click **Add User**.

### 2.3 Configure Network Access (IP Whitelist)
1. In the left sidebar, click **Network Access**.
2. Click **Add IP Address**.
3. Click **Allow Access from Anywhere** (`0.0.0.0/0`).
   > *Note: Render dynamically assigns IP addresses to free web instances. Allowing `0.0.0.0/0` is necessary for Render to communicate with Atlas.*
4. Click **Confirm**.

### 2.4 Get Your Connection String
1. Return to the **Database** tab and click **Connect** on your cluster.
2. Select **Drivers** (Node.js).
3. Copy the connection string. It will look like this:
   ```text
   mongodb+srv://busmitra_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password and append the database name `/busmitra` before the query parameters:
   ```text
   mongodb+srv://busmitra_admin:SecurePass123!@cluster0.xxxxx.mongodb.net/busmitra?retryWrites=true&w=majority
   ```
5. Keep this URI ready for Step 3.

---

## 3. Step 2: Push Repository to GitHub

Ensure all files (including `render.yaml`, `netlify.toml`, and `frontend/public/_redirects`) are committed and pushed to your GitHub repository:

```bash
# In your project root
git add .
git commit -m "feat: complete deployment configurations for Netlify and Render"
git branch -M main
git push origin main
```

---

## 4. Step 3: Deploy Backend on Render

You can deploy the backend using either **Render Blueprints (Automated)** or the **Render Dashboard UI (Manual)**.

### Option A: Render Dashboard UI (Recommended for First-Time Users)

1. Go to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** in the top right and select **Web Service**.
3. Choose **Build and deploy from a Git repository** and connect your GitHub repo `Bus-Booking-Management-System`.
4. Fill in the deployment details:
   - **Name**: `busmitra-backend` (or a name of your choice)
   - **Region**: Choose the region closest to your MongoDB Atlas cluster (e.g., *Oregon* or *Singapore* or *Frankfurt*)
   - **Branch**: `main`
   - **Root Directory**: `backend` *(⚠️ Critical: Must be set to `backend`)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

5. Scroll down to **Environment Variables** and add the following:

   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enables production mode |
   | `PORT` | `5000` | Render dynamically forwards port |
   | `MONGO_URI` | `mongodb+srv://busmitra_admin:...@cluster0.../busmitra?retryWrites=true&w=majority` | Your MongoDB Atlas connection URI |
   | `JWT_SECRET` | `a_very_long_secure_random_string_min_32_characters` | Secret for signing auth tokens |
   | `JWT_EXPIRE` | `7d` | Token expiry duration |
   | `CLIENT_URL` | `https://*.netlify.app` | Netlify frontend origin (will be updated in Step 6) |

6. Click **Advanced Settings**:
   - **Health Check Path**: `/api/health`
7. Click **Create Web Service**.

### Option B: Render Blueprint (Infrastructure-as-Code)
The repository already includes `render.yaml`.
1. In the Render Dashboard, click **New +** -> **Blueprint**.
2. Select your repository.
3. Render will auto-detect `render.yaml`.
4. Enter the `MONGO_URI` value when prompted.
5. Click **Apply**.

---

## 5. Step 4: Seed Database on Render

Once your backend is deployed and shows **Live**:

1. In the Render Dashboard, navigate to your `busmitra-backend` service.
2. In the left menu, click **Shell**.
3. Run the database seed script to populate demo buses, routes, trips, and demo users:
   ```bash
   npm run seed
   ```
   *(To wipe and reseed anytime: `npm run seed -- --force`)*
4. Once completed, verify your backend in your browser:
   - Root ping: `https://busmitra-backend.onrender.com/`
   - Health check: `https://busmitra-backend.onrender.com/api/health`
   - Swagger API Docs: `https://busmitra-backend.onrender.com/api/docs`

> 📋 **Note down your Render Backend URL** (e.g., `https://busmitra-backend.onrender.com`). You will need it in Step 5.

---

## 6. Step 5: Deploy Frontend on Netlify

### 6.1 Create New Site from Git
1. Log in to your [Netlify Dashboard](https://app.netlify.com).
2. Click **Add new site** -> **Import an existing project**.
3. Choose **GitHub** and authorize access to your repository `Bus-Booking-Management-System`.

### 6.2 Configure Build Settings
Netlify will automatically detect settings from `netlify.toml`, but verify:
- **Base directory**: `frontend` *(⚠️ Critical)*
- **Build command**: `npm run build`
- **Publish directory**: `frontend/dist` (or `dist` if base directory is set to `frontend`)

### 6.3 Add Environment Variables
Click **Add environment variables** and enter:

| Key | Value | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://<YOUR-RENDER-BACKEND-URL>/api` | `https://busmitra-backend.onrender.com/api` |

*(Note: If you omit `/api`, the frontend automatically appends `/api` safely).*

### 6.4 Deploy
1. Click **Deploy busmitra** (or **Deploy site**).
2. Netlify will build the Vite project and deploy it.
3. Once finished, your site will be available at a URL like:
   `https://busmitra-demo.netlify.app`
4. You can change your domain under **Site configuration** -> **Domain management** -> **Change site name** (e.g., `busmitra.netlify.app`).

---

## 7. Step 6: Link Frontend & Backend

To ensure strict production security and prevent any CORS issues:

1. Copy your Netlify frontend URL:
   `https://your-site.netlify.app`
2. Go back to your [Render Dashboard](https://dashboard.render.com) -> `busmitra-backend`.
3. Go to **Environment** tab.
4. Update the `CLIENT_URL` variable:
   ```text
   CLIENT_URL=https://your-site.netlify.app
   ```
5. Click **Save Changes**. Render will automatically redeploy with the updated CORS rule.

---

## 8. Step 7: Verification & Demo Credentials

### 8.1 Demo Accounts
The database seed script sets up three test accounts:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@demo.com` | `Demo@123` | Full system access, revenue analytics, buses, routes, users, audit logs |
| **Bus Operator** | `operator@demo.com` | `Demo@123` | Bus fleet management, scheduling trips, live passenger manifests |
| **Customer** | `customer@demo.com` | `Demo@123` | Search trips, select seats, book tickets, download ticket PDF |

### 8.2 End-to-End Verification Checklist
- [ ] **Home Page**: Load the homepage at your Netlify URL. Verify the hero image and search bar load cleanly.
- [ ] **Trip Search**: Search for trips from **Mumbai** to **Pune** (or **Delhi** to **Jaipur**).
- [ ] **Seat Selection**: Select seats on an available bus and proceed to passenger details.
- [ ] **Confirm Booking**: Fill in passenger info and complete payment checkout. Confirm ticket generation with PNR and QR code.
- [ ] **Customer Portal**: Click **My Bookings** in the navbar to review active and past bookings.
- [ ] **Operator Portal**: Log in as `operator@demo.com`. Go to `/operator/buses` to add a new bus or `/operator/schedule` to schedule a new trip.
- [ ] **Admin Portal**: Log in as `admin@demo.com`. Review analytics dashboard, user list, and audit logs.
- [ ] **Deep Link / Page Refresh**: Refresh any inner page (e.g. `/my-bookings` or `/admin/dashboard`). Verify that Netlify does not return a 404 error (handled by `_redirects`).
- [ ] **Language Selector**: Test switching languages (English, हिंदी, मराठी, ಕನ್ನಡ) in the navbar to verify multi-language support.

---

## 9. Troubleshooting & FAQs

### Q1: The backend takes ~50 seconds to respond on first request.
**Reason**: On the free tier of Render, instances spin down after 15 minutes of inactivity. When a new request arrives, Render boots the instance (cold start).
**Solution**: This is standard behavior for Render's free tier. Subsequent requests will respond in under 100ms. For 24/7 instant response, upgrade the Render instance to Starter ($7/month) or use a free uptime monitor (like UptimeRobot) pinging `https://<backend>.onrender.com/health` every 10 minutes.

### Q2: 404 Not Found error when refreshing the browser on Netlify.
**Reason**: Single Page Applications (React Router) handle routing in JavaScript. If a user refreshes `/my-bookings`, Netlify looks for an actual file named `my-bookings.html`.
**Solution**: This repository includes `frontend/public/_redirects` and `netlify.toml` with `/* /index.html 200`, which redirects all traffic to `index.html`. If you configure Netlify manually, ensure the publish directory points to `dist`.

### Q3: Network Error or CORS blocked in the browser console.
**Reason**: The backend CORS configuration is not allowing requests from your frontend origin.
**Solution**:
1. Check that `VITE_API_URL` on Netlify points to your Render backend: `https://<app>.onrender.com/api`.
2. Check that `CLIENT_URL` on Render contains your exact Netlify domain: `https://<app>.netlify.app`.
3. Note that `backend/server.js` already includes wildcard support for `*.netlify.app` domains.

### Q4: MongoServerError: bad auth : Authentication failed.
**Reason**: The username or password in `MONGO_URI` is incorrect, or the user was created without read/write permissions.
**Solution**:
1. In MongoDB Atlas, go to **Database Access** and verify your username.
2. Reset the user's password to avoid special characters that require URL-encoding (e.g. avoid `@`, `:`, `/` inside the password).
3. Ensure Network Access has `0.0.0.0/0` whitelisted.

---

🎉 **Congratulations! Your BusMitra application is now fully deployed and live!**
