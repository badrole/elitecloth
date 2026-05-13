-- ═══════════════════════════════════════════════════════
-- Elitecloth — Supabase Database Schema
-- Run this in Supabase SQL Editor (supabase.com/dashboard)
-- ═══════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Storage ──
INSERT INTO storage.buckets (id, name, public) VALUES ('outfits', 'outfits', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'outfits');
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'outfits');

-- ── Table: outfits ──
CREATE TABLE IF NOT EXISTS outfits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'casual',
  occasion TEXT DEFAULT '',
  niche TEXT DEFAULT 'cowok',
  gender TEXT DEFAULT 'male',
  cover_image_url TEXT NOT NULL,
  gallery_image_urls TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  estimated_total_price INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Table: outfit_items ──
CREATE TABLE IF NOT EXISTS outfit_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  outfit_id UUID NOT NULL REFERENCES outfits(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  item_type TEXT NOT NULL DEFAULT 'atasan',
  thumbnail_url TEXT NOT NULL,
  estimated_price INTEGER NOT NULL DEFAULT 0,
  shopee_affiliate_url TEXT,
  tiktok_shop_affiliate_url TEXT,
  position INTEGER DEFAULT 0
);

-- ── Table: affiliate_clicks ──
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  outfit_id UUID REFERENCES outfits(id) ON DELETE SET NULL,
  item_id UUID REFERENCES outfit_items(id) ON DELETE SET NULL,
  marketplace TEXT NOT NULL CHECK (marketplace IN ('shopee', 'tiktok_shop')),
  user_agent TEXT DEFAULT '',
  referrer TEXT DEFAULT '',
  session_id TEXT DEFAULT '',
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes ──
CREATE INDEX IF NOT EXISTS idx_outfits_published ON outfits(published);
CREATE INDEX IF NOT EXISTS idx_outfits_category ON outfits(category);
CREATE INDEX IF NOT EXISTS idx_outfits_slug ON outfits(slug);
CREATE INDEX IF NOT EXISTS idx_outfits_created_at ON outfits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_outfits_view_count ON outfits(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_outfit_items_outfit_id ON outfit_items(outfit_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_outfit_id ON affiliate_clicks(outfit_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_clicked_at ON affiliate_clicks(clicked_at);

-- ── RPC: Increment view count (atomic) ──
CREATE OR REPLACE FUNCTION increment_view_count(outfit_id_input UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE outfits
  SET view_count = view_count + 1,
      updated_at = NOW()
  WHERE id = outfit_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── Row Level Security ──
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Public read access for published outfits
CREATE POLICY "Public can read published outfits"
  ON outfits FOR SELECT
  USING (published = true);

-- Public read access for outfit items
CREATE POLICY "Public can read outfit items"
  ON outfit_items FOR SELECT
  USING (true);

-- Public can insert affiliate clicks
CREATE POLICY "Public can insert affiliate clicks"
  ON affiliate_clicks FOR INSERT
  WITH CHECK (true);

-- MVP Admin: Allow inserts from client
CREATE POLICY "Public can insert outfits" ON outfits FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update outfits" ON outfits FOR UPDATE USING (true);
CREATE POLICY "Public can delete outfits" ON outfits FOR DELETE USING (true);

CREATE POLICY "Public can insert outfit items" ON outfit_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update outfit items" ON outfit_items FOR UPDATE USING (true);
CREATE POLICY "Public can delete outfit items" ON outfit_items FOR DELETE USING (true);

-- ═══ SEED DATA (10 outfits for MVP launch) ═══

INSERT INTO outfits (slug, name, description, category, occasion, niche, gender, cover_image_url, tags, estimated_total_price, published, view_count) VALUES
('outfit-kampus-minimalis-putih', 'Kampus Minimalis Putih', 'Look clean dan rapi untuk hari-hari di kampus. Kombinasi kaos polos putih dengan celana chino cream dan sneakers putih klasik.', 'kampus', 'Kuliah', 'cowok', 'male', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&h=800&fit=crop', ARRAY['minimalis', 'clean', 'putih'], 285000, true, 42),
('outfit-nongkrong-earth-tone', 'Nongkrong Earth Tone', 'Gaya santai tapi tetap stylish buat nongkrong bareng temen. Earth tone palette yang warm dan approachable.', 'nongkrong', 'Hangout', 'cowok', 'male', 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&h=800&fit=crop', ARRAY['earth-tone', 'casual', 'warm'], 320000, true, 67),
('outfit-casual-streetwear', 'Casual Streetwear Harian', 'Oversized tee + cargo pants + chunky sneakers. Formula streetwear yang gak pernah gagal.', 'casual', 'Sehari-hari', 'cowok', 'male', 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=600&h=800&fit=crop', ARRAY['streetwear', 'oversized', 'harian'], 250000, true, 89),
('outfit-semi-formal-interview', 'Semi-formal Interview Ready', 'Outfit interview yang gak terlalu formal tapi tetap profesional. Cocok buat freshgrad.', 'semi-formal', 'Interview', 'cowok', 'male', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop', ARRAY['semi-formal', 'interview', 'profesional'], 450000, true, 34),
('outfit-kampus-smart-casual', 'Kampus Smart Casual', 'Polo shirt + celana slim fit + loafers. Kesan rapi tanpa terlihat terlalu formal di kampus.', 'kampus', 'Kuliah', 'cowok', 'male', 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&h=800&fit=crop', ARRAY['smart-casual', 'rapi', 'polo'], 310000, true, 56),
('outfit-old-money-lokal', 'Old Money Lokal', 'Vibes old money tapi versi budget Indonesia. Kemeja linen + celana bahan + sepatu kulit.', 'casual', 'Nongkrong', 'cowok', 'male', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=800&fit=crop', ARRAY['old-money', 'linen', 'klasik'], 380000, true, 123),
('outfit-gym-to-street', 'Gym to Street', 'Dari gym langsung nongkrong. Jogger pants + fitted tee + running shoes. Comfortable tapi tetap keren.', 'olahraga', 'Olahraga', 'cowok', 'male', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=800&fit=crop', ARRAY['athletic', 'sporty', 'comfortable'], 200000, true, 45),
('outfit-date-night-budget', 'Date Night Budget', 'Tampil keren buat kencan tanpa bikin dompet nangis. Dark color palette yang mysterious.', 'nongkrong', 'Kencan', 'cowok', 'male', 'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=600&h=800&fit=crop', ARRAY['date-night', 'gelap', 'mysterious'], 290000, true, 78),
('outfit-rainy-day-campus', 'Rainy Day Campus', 'Outfit anti gerimis buat musim hujan kampus. Hoodie + celana waterproof + boots.', 'kampus', 'Kuliah', 'cowok', 'male', 'https://images.unsplash.com/photo-1495366691023-cc4eadcc2d7e?w=600&h=800&fit=crop', ARRAY['rainy', 'hoodie', 'waterproof'], 270000, true, 31),
('outfit-weekend-chill', 'Weekend Chill Vibes', 'Outfit santai buat weekend. Oversized hoodie + shorts + sandal. Maximum comfort.', 'casual', 'Weekend', 'cowok', 'male', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=800&fit=crop', ARRAY['weekend', 'santai', 'comfortable'], 180000, true, 95);

-- Insert outfit items for each outfit
-- Outfit 1: Kampus Minimalis Putih
INSERT INTO outfit_items (outfit_id, name, item_type, thumbnail_url, estimated_price, shopee_affiliate_url, tiktok_shop_affiliate_url, position) VALUES
((SELECT id FROM outfits WHERE slug = 'outfit-kampus-minimalis-putih'), 'Kaos Polos Putih Premium', 'atasan', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop', 75000, 'https://shopee.co.id', 'https://tiktok.com/shop', 1),
((SELECT id FROM outfits WHERE slug = 'outfit-kampus-minimalis-putih'), 'Celana Chino Cream Slim Fit', 'bawahan', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&h=200&fit=crop', 120000, 'https://shopee.co.id', 'https://tiktok.com/shop', 2),
((SELECT id FROM outfits WHERE slug = 'outfit-kampus-minimalis-putih'), 'Sneakers Putih Classic', 'sepatu', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop', 90000, 'https://shopee.co.id', NULL, 3);

-- Outfit 2: Nongkrong Earth Tone
INSERT INTO outfit_items (outfit_id, name, item_type, thumbnail_url, estimated_price, shopee_affiliate_url, tiktok_shop_affiliate_url, position) VALUES
((SELECT id FROM outfits WHERE slug = 'outfit-nongkrong-earth-tone'), 'Kemeja Flannel Coklat', 'atasan', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop', 95000, 'https://shopee.co.id', 'https://tiktok.com/shop', 1),
((SELECT id FROM outfits WHERE slug = 'outfit-nongkrong-earth-tone'), 'Celana Cargo Olive', 'bawahan', 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=200&h=200&fit=crop', 130000, 'https://shopee.co.id', 'https://tiktok.com/shop', 2),
((SELECT id FROM outfits WHERE slug = 'outfit-nongkrong-earth-tone'), 'Boots Coklat Casual', 'sepatu', 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=200&h=200&fit=crop', 95000, 'https://shopee.co.id', NULL, 3);

-- Outfit 3: Casual Streetwear
INSERT INTO outfit_items (outfit_id, name, item_type, thumbnail_url, estimated_price, shopee_affiliate_url, tiktok_shop_affiliate_url, position) VALUES
((SELECT id FROM outfits WHERE slug = 'outfit-casual-streetwear'), 'Oversized Graphic Tee', 'atasan', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&h=200&fit=crop', 65000, 'https://shopee.co.id', 'https://tiktok.com/shop', 1),
((SELECT id FROM outfits WHERE slug = 'outfit-casual-streetwear'), 'Cargo Pants Hitam', 'bawahan', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200&h=200&fit=crop', 110000, 'https://shopee.co.id', 'https://tiktok.com/shop', 2),
((SELECT id FROM outfits WHERE slug = 'outfit-casual-streetwear'), 'Chunky Sneakers', 'sepatu', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&h=200&fit=crop', 75000, 'https://shopee.co.id', 'https://tiktok.com/shop', 3);

-- Outfit 4: Semi-formal Interview
INSERT INTO outfit_items (outfit_id, name, item_type, thumbnail_url, estimated_price, shopee_affiliate_url, tiktok_shop_affiliate_url, position) VALUES
((SELECT id FROM outfits WHERE slug = 'outfit-semi-formal-interview'), 'Kemeja Putih Slim Fit', 'atasan', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&h=200&fit=crop', 110000, 'https://shopee.co.id', 'https://tiktok.com/shop', 1),
((SELECT id FROM outfits WHERE slug = 'outfit-semi-formal-interview'), 'Celana Bahan Hitam', 'bawahan', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=200&fit=crop', 150000, 'https://shopee.co.id', 'https://tiktok.com/shop', 2),
((SELECT id FROM outfits WHERE slug = 'outfit-semi-formal-interview'), 'Sepatu Pantofel Budget', 'sepatu', 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=200&h=200&fit=crop', 130000, 'https://shopee.co.id', NULL, 3),
((SELECT id FROM outfits WHERE slug = 'outfit-semi-formal-interview'), 'Jam Tangan Minimalis', 'aksesoris', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=200&h=200&fit=crop', 60000, 'https://shopee.co.id', 'https://tiktok.com/shop', 4);

-- Outfit 5: Kampus Smart Casual
INSERT INTO outfit_items (outfit_id, name, item_type, thumbnail_url, estimated_price, shopee_affiliate_url, tiktok_shop_affiliate_url, position) VALUES
((SELECT id FROM outfits WHERE slug = 'outfit-kampus-smart-casual'), 'Polo Shirt Navy', 'atasan', 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=200&h=200&fit=crop', 85000, 'https://shopee.co.id', 'https://tiktok.com/shop', 1),
((SELECT id FROM outfits WHERE slug = 'outfit-kampus-smart-casual'), 'Celana Chino Slim Abu', 'bawahan', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&h=200&fit=crop', 125000, 'https://shopee.co.id', 'https://tiktok.com/shop', 2),
((SELECT id FROM outfits WHERE slug = 'outfit-kampus-smart-casual'), 'Loafers Coklat', 'sepatu', 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=200&h=200&fit=crop', 100000, 'https://shopee.co.id', NULL, 3);

-- Outfit 6: Old Money Lokal
INSERT INTO outfit_items (outfit_id, name, item_type, thumbnail_url, estimated_price, shopee_affiliate_url, tiktok_shop_affiliate_url, position) VALUES
((SELECT id FROM outfits WHERE slug = 'outfit-old-money-lokal'), 'Kemeja Linen Putih', 'atasan', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&h=200&fit=crop', 120000, 'https://shopee.co.id', 'https://tiktok.com/shop', 1),
((SELECT id FROM outfits WHERE slug = 'outfit-old-money-lokal'), 'Celana Bahan Krem', 'bawahan', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&h=200&fit=crop', 140000, 'https://shopee.co.id', 'https://tiktok.com/shop', 2),
((SELECT id FROM outfits WHERE slug = 'outfit-old-money-lokal'), 'Sepatu Kulit Coklat', 'sepatu', 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=200&h=200&fit=crop', 120000, 'https://shopee.co.id', 'https://tiktok.com/shop', 3);

-- Outfit 7: Gym to Street
INSERT INTO outfit_items (outfit_id, name, item_type, thumbnail_url, estimated_price, shopee_affiliate_url, tiktok_shop_affiliate_url, position) VALUES
((SELECT id FROM outfits WHERE slug = 'outfit-gym-to-street'), 'Fitted Tee Abu', 'atasan', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop', 50000, 'https://shopee.co.id', 'https://tiktok.com/shop', 1),
((SELECT id FROM outfits WHERE slug = 'outfit-gym-to-street'), 'Jogger Pants Hitam', 'bawahan', 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=200&h=200&fit=crop', 85000, 'https://shopee.co.id', 'https://tiktok.com/shop', 2),
((SELECT id FROM outfits WHERE slug = 'outfit-gym-to-street'), 'Running Shoes', 'sepatu', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop', 65000, 'https://shopee.co.id', 'https://tiktok.com/shop', 3);

-- Outfit 8: Date Night Budget
INSERT INTO outfit_items (outfit_id, name, item_type, thumbnail_url, estimated_price, shopee_affiliate_url, tiktok_shop_affiliate_url, position) VALUES
((SELECT id FROM outfits WHERE slug = 'outfit-date-night-budget'), 'Kaos Hitam Polos Premium', 'atasan', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=200&h=200&fit=crop', 70000, 'https://shopee.co.id', 'https://tiktok.com/shop', 1),
((SELECT id FROM outfits WHERE slug = 'outfit-date-night-budget'), 'Celana Jeans Slim Dark', 'bawahan', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop', 120000, 'https://shopee.co.id', 'https://tiktok.com/shop', 2),
((SELECT id FROM outfits WHERE slug = 'outfit-date-night-budget'), 'Sneakers Hitam Clean', 'sepatu', 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=200&h=200&fit=crop', 100000, 'https://shopee.co.id', NULL, 3);

-- Outfit 9: Rainy Day Campus
INSERT INTO outfit_items (outfit_id, name, item_type, thumbnail_url, estimated_price, shopee_affiliate_url, tiktok_shop_affiliate_url, position) VALUES
((SELECT id FROM outfits WHERE slug = 'outfit-rainy-day-campus'), 'Hoodie Abu Oversized', 'atasan', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=200&fit=crop', 95000, 'https://shopee.co.id', 'https://tiktok.com/shop', 1),
((SELECT id FROM outfits WHERE slug = 'outfit-rainy-day-campus'), 'Celana Training Waterproof', 'bawahan', 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=200&h=200&fit=crop', 100000, 'https://shopee.co.id', 'https://tiktok.com/shop', 2),
((SELECT id FROM outfits WHERE slug = 'outfit-rainy-day-campus'), 'Boots Anti Air Budget', 'sepatu', 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=200&h=200&fit=crop', 75000, 'https://shopee.co.id', NULL, 3);

-- Outfit 10: Weekend Chill Vibes
INSERT INTO outfit_items (outfit_id, name, item_type, thumbnail_url, estimated_price, shopee_affiliate_url, tiktok_shop_affiliate_url, position) VALUES
((SELECT id FROM outfits WHERE slug = 'outfit-weekend-chill'), 'Oversized Hoodie Cream', 'atasan', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=200&fit=crop', 85000, 'https://shopee.co.id', 'https://tiktok.com/shop', 1),
((SELECT id FROM outfits WHERE slug = 'outfit-weekend-chill'), 'Shorts Cargo Olive', 'bawahan', 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=200&h=200&fit=crop', 60000, 'https://shopee.co.id', 'https://tiktok.com/shop', 2),
((SELECT id FROM outfits WHERE slug = 'outfit-weekend-chill'), 'Sandal Slide Hitam', 'sepatu', 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=200&h=200&fit=crop', 35000, 'https://shopee.co.id', 'https://tiktok.com/shop', 3);
