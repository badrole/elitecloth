-- ═══════════════════════════════════════════════════════
-- Elitecloth — Security Fix: Remove dangerous public write policies
-- 
-- PENTING: Jalankan schema.sql TERLEBIH DAHULU jika tabel belum ada.
-- File ini hanya menghapus policy, bukan membuat tabel.
-- ═══════════════════════════════════════════════════════

DO $$
BEGIN
  -- Remove public write policies on outfits (if table exists)
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'outfits' AND schemaname = 'public') THEN
    DROP POLICY IF EXISTS "Public can insert outfits" ON outfits;
    DROP POLICY IF EXISTS "Public can update outfits" ON outfits;
    DROP POLICY IF EXISTS "Public can delete outfits" ON outfits;
  END IF;

  -- Remove public write policies on outfit_items (if table exists)
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'outfit_items' AND schemaname = 'public') THEN
    DROP POLICY IF EXISTS "Public can insert outfit items" ON outfit_items;
    DROP POLICY IF EXISTS "Public can update outfit items" ON outfit_items;
    DROP POLICY IF EXISTS "Public can delete outfit items" ON outfit_items;
  END IF;
END $$;

-- Remove public upload policy on storage
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
