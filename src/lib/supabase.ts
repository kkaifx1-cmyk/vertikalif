import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pxpyjryuwjseltfyzpye.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_nu0XdTozTNkftJlNIw0DuA_HU8G6Vau";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
