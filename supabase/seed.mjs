// Seed helper for checking whether the Supabase schema is already available.
// Usage: node supabase/seed.mjs

import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing Supabase configuration.");
  console.error(
    "Set SUPABASE_URL and SUPABASE_ANON_KEY, or NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
  process.exit(1);
}

const supabase = createClient(url, key);

async function run() {
  console.log("Checking whether the outfits table exists...");

  const { data, error } = await supabase.from("outfits").select("id").limit(1);

  if (error && error.message.includes("does not exist")) {
    console.log("Table 'outfits' does not exist yet.");
    console.log("");
    console.log("Manual step required:");
    console.log("1. Open the Supabase SQL editor for your project.");
    console.log("2. Copy the contents of supabase/schema.sql.");
    console.log("3. Paste it into the SQL editor and run it.");
    process.exit(1);
  }

  if (error) {
    console.log("Supabase returned an error:", error.message);
    console.log("The table may not exist yet. Run the schema manually.");
    process.exit(1);
  }

  if (data && data.length > 0) {
    console.log("Table 'outfits' exists and already has data.");

    const { count } = await supabase
      .from("outfits")
      .select("*", { count: "exact", head: true });
    const { count: itemCount } = await supabase
      .from("outfit_items")
      .select("*", { count: "exact", head: true });

    console.log(`Outfits: ${count ?? 0}`);
    console.log(`Items: ${itemCount ?? 0}`);
    console.log("Database is ready.");
    return;
  }

  console.log("Table exists but is empty. Run the seed SQL.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
