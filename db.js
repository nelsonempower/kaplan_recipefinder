import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://nrmfdcjkycytzohodcaq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ybWZkY2preWN5dHpvaG9kY2FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MDU2MDUsImV4cCI6MjEwNjA4MTYwNX0.kXd1Dir2G0IDeCtguEDfRwht4jHrn-WHKUhhySyQWmk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
