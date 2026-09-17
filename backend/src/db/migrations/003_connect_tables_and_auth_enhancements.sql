-- 1. Create user_logins table to track user login events
CREATE TABLE IF NOT EXISTS user_logins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ip_address VARCHAR(100),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_logins_user_id ON user_logins(user_id);
CREATE INDEX IF NOT EXISTS idx_user_logins_created ON user_logins(created_at DESC);

-- 2. Add last_login_at to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

-- 3. Connect products to users (creator / updater)
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_products_created_by ON products(created_by);

-- 4. Connect missions to users (lead operator) and products
ALTER TABLE missions
  ADD COLUMN IF NOT EXISTS lead_operator_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_missions_lead_operator ON missions(lead_operator_id);
CREATE INDEX IF NOT EXISTS idx_missions_product_id ON missions(product_id);

-- 5. Connect build_logs to users (author) and products
ALTER TABLE build_logs
  ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_build_logs_author_id ON build_logs(author_id);
CREATE INDEX IF NOT EXISTS idx_build_logs_product_id ON build_logs(product_id);

-- 6. Connect chapters to users (author) and products
ALTER TABLE chapters
  ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_chapters_author_id ON chapters(author_id);
CREATE INDEX IF NOT EXISTS idx_chapters_product_id ON chapters(product_id);

-- 7. Connect contacts to users (assigned operator for inquiry review)
ALTER TABLE contacts
  ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_contacts_assigned_to ON contacts(assigned_to);

-- 8. Connect media_assets to users (uploader) and products
ALTER TABLE media_assets
  ADD COLUMN IF NOT EXISTS uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_media_uploaded_by ON media_assets(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_media_product_id ON media_assets(product_id);

-- 9. Connect team_members to user accounts
ALTER TABLE team_members
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);

-- 10. Connect system_activities to users, products, and missions
ALTER TABLE system_activities
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS mission_id UUID REFERENCES missions(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_activities_user_id ON system_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_product_id ON system_activities(product_id);

-- 11. Remove default admin credentials so any new operator signs up directly
DELETE FROM users WHERE username = 'admin';
