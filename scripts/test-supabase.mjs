import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pxpyjryuwjseltfyzpye.supabase.co";
const supabaseAnonKey = "sb_publishable_nu0XdTozTNkftJlNIw0DuA_HU8G6Vau";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("Testing Supabase connection...");
  const { data, error } = await supabase.from("survey_responses").select("*");
  console.log("Result:", { data, error });
}

test();
