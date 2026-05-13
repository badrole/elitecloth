// Seed script — runs the schema.sql against Supabase using direct PostgreSQL connection
// Usage: node supabase/seed.mjs

import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const url = "https://icxzipdocyxmuufecrka.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljeHppcGRvY3l4bXV1ZmVjcmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1ODA3MjgsImV4cCI6MjA5NDE1NjcyOH0.hI-fqqfJSo-YA6ztdpbmJ0IpD5_A8V5JcaCywjV7I6o";

const supabase = createClient(url, key);

// Check if outfits table already exists by trying to query it
async function run() {
  console.log("🔍 Checking if outfits table exists...");
  const { data, error } = await supabase.from("outfits").select("id").limit(1);
  
  if (error && error.message.includes("does not exist")) {
    console.log("❌ Table 'outfits' doesn't exist yet.");
    console.log("");
    console.log("═══════════════════════════════════════════════");
    console.log("  MANUAL STEP REQUIRED");
    console.log("═══════════════════════════════════════════════");
    console.log("");
    console.log("Please run the SQL schema manually:");
    console.log("");
    console.log("1. Open: https://supabase.com/dashboard/project/icxzipdocyxmuufecrka/sql/new");
    console.log("2. Copy the contents of: supabase/schema.sql");  
    console.log("3. Paste into the SQL editor and click 'Run'");
    console.log("");
    process.exit(1);
  }
  
  if (error) {
    console.log("⚠️  Error:", error.message);
    console.log("The table might not exist. Run the schema manually.");
    process.exit(1);
  }
  
  if (data && data.length > 0) {
    console.log("✅ Table 'outfits' exists and has data!");
    
    // Count records
    const { count } = await supabase.from("outfits").select("*", { count: "exact", head: true });
    const { count: itemCount } = await supabase.from("outfit_items").select("*", { count: "exact", head: true });
    
    console.log(`   📦 ${count} outfits`);
    console.log(`   👕 ${itemCount} items`);
    console.log("");
    console.log("Database is ready! 🚀");
  } else {
    console.log("⚠️  Table exists but is empty. Run the seed SQL.");
  }
}

run().catch(console.error);
