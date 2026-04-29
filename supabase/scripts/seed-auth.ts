import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error("Missing Supabase env vars");
}

const supabase = createClient(url, key);

async function seedAdmin() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: "admin@local.test",
    password: "password123",
    email_confirm: true,
    user_metadata: {
      role: "admin",
    },
  });

  if (error) {
    console.error("Error creating admin:", error);
  } else {
    console.log("Admin created:", data.user?.email);
  }
}

seedAdmin();
