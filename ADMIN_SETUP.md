# Admin Panel Setup Guide (Vercel + Remote MySQL)

## 🎯 Overview

Your personal portfolio uses **Vercel Serverless Functions (Node.js)** to connect to your **Hostinger MySQL database**.

## 🚀 Quick Start Guide

### Step 1: Database Setup (phpMyAdmin)

1. Log in to your Hostinger Handle / phpMyAdmin.
2. Select your database `u323771957_cyrylprojectdb`.
3. Click the **SQL** tab.
4. Run the SQL from `admin/MYSQL_SETUP.sql`.

### Step 2: Enable Remote MySQL (CRITICAL)

Since Vercel is external to Hostinger, you must allow connection.

1. Go to **Hostinger Dashboard** > **Databases** > **Remote MySQL**.
2. Create a new Remote MySQL connection:
   - **IP (IPv4) or %**: Enter `%` (This allows any IP, which is required for Vercel as their IPs change).
   - **Database**: Select your database.
   - Click **Create**.
3. *Note: Using `%` affects security. Ensure you have a strong database password.*

### Step 3: Deploy to Vercel

1. Push your code to GitHub.
2. Vercel will auto-deploy.

### Step 4: Configure Vercel Environment Variables

1. Go to your **Vercel Dashboard** > **Settings** > **Environment Variables**.
2. Add these variables (using the values from your Hostinger DB):
   - `DB_HOST`: `srv1518.hstgr.io`
   - `DB_USER`: `u323771957_cyrylprousr`
   - `DB_PASSWORD`: `yourpassword` (The one you provided earlier)
   - `DB_NAME`: `u323771957_cyrylprojectdb`
   - `ADMIN_EMAIL`: `admin@example.com` (Your desired admin email)
   - `ADMIN_PASSWORD`: `securepassword` (Your desired admin login password)

### Step 5: Test the Admin Panel

1. Go to `https://your-site.vercel.app/admin/`.
2. Login with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you set in Vercel.

## 🔧 Local Development

To run this locally, you need to set up environment variables or rely on the fallbacks in `api/db.js`.
Ensure you have run `npm install` to get the `mysql2` driver.

## 🐛 Troubleshooting

### "Database connection failed" (Endpoint Timeout)
- Did you enable **Remote MySQL** on Hostinger with `%`?
- Double check `DB_HOST` and `DB_PASSWORD`.

### "500 Server Error"
- Check Vercel Logs (Dashboard > Deployments > Logs).
- Most likely a missing environment variable.

### "404 Not Found" on API
- Ensure `vercel.json` is present and committed.
