-- Database Schema for MySQL

-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    tech_stack VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    link VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    badges VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. (Optional) Insert Dummy Data
INSERT INTO projects (title, short_description, description, tech_stack, image_url, link, category, badges) VALUES
('UPCA Dashboard', 'Premium real estate media management portal.', 'UPCA Dashboard is a premium real estate media management portal. It allows media agencies to manage orders, properties, and assets in one place.', 'React, TypeScript, Supabase', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', 'https://upcadashboard.vercel.app', 'backend frontend', 'SaaS, React, Supabase'),
('Luxe Commerce', 'High-end e-commerce experience.', 'A high-end e-commerce experience designed for luxury brands. Featuring smooth animations and premium typography.', 'Next.js, Shopify, Stripe', 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80', '#', 'ecommerce frontend', 'Next.js, Shopify, Stripe');
