# Database Setup

To enable the new dynamic features (Blog and Testimonials), please execute the following SQL commands in your database manager (Hostinger/phpMyAdmin):

## 1. Blog Posts Table
```sql
CREATE TABLE blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT,
    image_url VARCHAR(255),
    category VARCHAR(50),
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 2. Testimonials Table
```sql
CREATE TABLE testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    text TEXT NOT NULL,
    avatar_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### What's New:
1.  **Admin Tabs**: Projects, Blog, and Testimonials are now separated into tabs.
2.  **Dynamic Homepage**: The testimonial slider on the homepage now fetches data directly from the database.
3.  **Dynamic Blog**: The blog list and individual post pages are fully dynamic.

### How to use:
1. Create the tables above.
2. Go to the Admin Panel.
3. Add some testimonials and blog posts.
4. Refresh your homepage and blog page to see the results!
