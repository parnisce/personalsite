# Admin Panel Setup Guide (Hostinger / MySQL)

## 🎯 Overview

Your personal portfolio admin panel now uses a **custom PHP API** connected to your Hostinger MySQL database.

## 🚀 Quick Start Guide

### Step 1: Database Setup (phpMyAdmin)

1. Log in to your Hostinger Handle / phpMyAdmin (`srv1518.hstgr.io`).
2. Select your database `u323771957_cyrylprojectdb`.
3. Click the **SQL** tab.
4. Copy the contents of `admin/MYSQL_SETUP.sql`.
5. Paste into the query box and click **Go**.
   - This creates the `projects` and `admin_users` tables.

### Step 2: Upload Files

Upload the entire `personalsite` folder to your `public_html` directory on Hostinger using File Manager or FTP (FileZilla).

Ensure the structure looks like this on the server:
```
public_html/
├── api/
│   ├── config.php
│   ├── auth.php
│   ├── projects.php
│   └── setup_user.php
├── admin/
│   ├── index.html
│   ├── admin.js
│   └── admin.css
├── index.html
├── db-loader.js
└── ... (other assets)
```

### Step 3: Create Admin User

1. In your browser, visit: `https://your-domain.com/api/setup_user.php`
2. Enter your desired **Admin Email** and **Password**.
3. Click **Create User**.
4. **IMPORTANT**: Once successful, go to File Manager and **DELETE `api/setup_user.php`** immediately for security.

### Step 4: Login to Admin Panel

1. Go to `https://your-domain.com/admin/`.
2. Login with the improved credentials.
3. You can now manage your projects!

## 🔧 Configuration

Your database credentials are hardcoded in `api/config.php`. If you change your database password later, update this file:

```php
define('DB_HOST', 'srv1518.hstgr.io');
define('DB_USER', 'u323771957_cyrylprousr');
define('DB_PASS', 'yourpassword'); // UPDATE THIS IF NEEDED
define('DB_NAME', 'u323771957_cyrylprojectdb');
```

## 📝 API Endpoints

The frontend communicates with these PHP endpoints:

- `GET /api/projects.php`: Fetch all projects (Public)
- `POST /api/projects.php`: Create new project (Admin only)
- `PUT /api/projects.php`: Update project (Admin only)
- `DELETE /api/projects.php`: Delete project (Admin only)
- `POST /api/auth.php`: Login/Logout

## 🐛 Troubleshooting

### "Database connection failed"
- Check `api/config.php` credentials.
- Ensure the user `u323771957_cyrylprousr` has privileges on the database.
- Check if `srv1518.hstgr.io` is the correct host (sometimes it's `localhost` if the script runs on the same server). Try changing `DB_HOST` to `'localhost'` in `api/config.php` if the external host fails.

### "404 Not Found" on API calls
- Ensure the `api` folder is uploaded correctly relative to `admin` and `index.html`.
- Check file permissions (folders 755, files 644).

### Admin Login fails loop
- Ensure PHP sessions are working on your server.
- Clear browser cookies/cache.
