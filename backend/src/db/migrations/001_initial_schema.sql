-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: users (operators and administrators)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'OPERATOR',
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(100) DEFAULT 'CORE',
  status VARCHAR(50) DEFAULT 'draft',
  summary TEXT,
  description TEXT,
  specs JSONB DEFAULT '{}'::jsonb,
  featured BOOLEAN DEFAULT false,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: missions
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  milestone VARCHAR(100),
  status VARCHAR(50) DEFAULT 'planning',
  summary TEXT,
  telemetry JSONB DEFAULT '{}'::jsonb,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: build_logs
CREATE TABLE IF NOT EXISTS build_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  version VARCHAR(50),
  summary TEXT,
  content TEXT,
  author VARCHAR(100) DEFAULT 'Alex Vance',
  tags TEXT[] DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'published',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: chapters
CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_number INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  read_time VARCHAR(50) DEFAULT '5 min read',
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: contacts (public landing inquiries)
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(150),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  ip_address VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: media_assets
CREATE TABLE IF NOT EXISTS media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  file_type VARCHAR(100),
  size_bytes BIGINT DEFAULT 0,
  alt_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: team_members
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  role VARCHAR(150) NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: system_activities (live audit & operations feed)
CREATE TABLE IF NOT EXISTS system_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  meta TEXT,
  badge_label VARCHAR(50) DEFAULT 'SYSTEM',
  badge_variant VARCHAR(50) DEFAULT 'neutral',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: system_settings
CREATE TABLE IF NOT EXISTS system_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create helpful indices
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_system_activities_created ON system_activities(created_at DESC);
