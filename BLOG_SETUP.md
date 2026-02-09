# Blog Database Setup

To enable the new Blog management features in your admin panel, please execute the following SQL command in your database manager (Hostinger/phpMyAdmin/Supabase):

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

### What's New:
1.  **Admin Panel Tabs**: You can now switch between **Projects** and **Blog Posts** in your admin dashboard.
2.  **Blog CRUD**: You can Add, Edit, and Delete blog posts directly from the browser.
3.  **Automatic Routing**: New blog posts will be accessible via their slugs (e.g., `/blog/your-slug`).

### Next Steps:
Once the table is created, you can start adding posts through the Admin Panel. 

**Note**: To make the blog list and post pages load this data dynamically, we will need to update `blog/index.html` to fetch from the database. Would you like me to do that now?
