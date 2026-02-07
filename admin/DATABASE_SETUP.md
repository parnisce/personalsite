# Database Setup Instructions

## Supabase Setup

### 1. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Note your project URL and anon key

### 2. Create the Projects Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create projects table
CREATE TABLE projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT NOT NULL,
    image_url TEXT NOT NULL,
    link TEXT NOT NULL,
    category TEXT NOT NULL,
    badges TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access"
ON projects FOR SELECT
TO public
USING (true);

-- Create policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated insert"
ON projects FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated update"
ON projects FOR UPDATE
TO authenticated
USING (true);

-- Create policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated delete"
ON projects FOR DELETE
TO authenticated
USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 3. Configure Your Admin Account

In Supabase Dashboard:
1. Go to Authentication > Users
2. Create a new user (this will be your admin account)
3. Set email and password
4. Confirm the user

### 4. Update Configuration

Edit `admin/admin.js` and replace:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

With your actual Supabase credentials from:
- Settings > API > Project URL
- Settings > API > Project API keys > anon public

### 5. Test the Admin Panel

1. Navigate to `/admin/` on your site
2. Log in with the admin credentials you created
3. Add, edit, and delete projects

## Database Schema

### Projects Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| title | TEXT | Project title |
| short_description | TEXT | Brief description for card |
| description | TEXT | Full project description |
| tech_stack | TEXT | Comma-separated tech stack |
| image_url | TEXT | Project preview image URL |
| link | TEXT | Project URL |
| category | TEXT | Space-separated categories (wordpress, ecommerce, backend, frontend, figma) |
| badges | TEXT | Comma-separated badge labels |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

## Security Notes

- Row Level Security (RLS) is enabled
- Public users can only read projects
- Only authenticated users can create, update, or delete projects
- Make sure to keep your Supabase credentials secure
- Never commit your actual credentials to version control
