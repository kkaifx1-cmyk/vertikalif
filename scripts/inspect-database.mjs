import fs from 'fs';
import path from 'path';
import { createClient } from "@supabase/supabase-js";

const envContent = fs.readFileSync('.env', 'utf8');
let supabaseUrl = "https://pxpyjryuwjseltfyzpye.supabase.co";
let supabaseAnonKey = "sb_publishable_nu0XdTozTNkftJlNIw0DuA_HU8G6Vau";

envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v) {
    const val = v.join('=').trim().replace(/^"|"$/g, '');
    if (k.trim() === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = val;
    if (k.trim() === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') supabaseAnonKey = val;
  }
});

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SESSIONS = [
  { id: 'sesi_1', dateStr: '2026-11-02', name: 'Sesi 1 (Senin, 02 Nov 2026)' },
  { id: 'sesi_2', dateStr: '2026-11-05', name: 'Sesi 2 (Kamis, 05 Nov 2026)' },
  { id: 'sesi_3', dateStr: '2026-11-11', name: 'Sesi 3 (Rabu, 11 Nov 2026)' },
  { id: 'sesi_4', dateStr: '2026-11-14', name: 'Sesi 4 (Sabtu, 14 Nov 2026)' },
];

function extractWibDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

function getSessionId(dateStr) {
  const d = extractWibDate(dateStr);
  if (d === '2026-11-02') return 'sesi_1';
  if (d === '2026-11-05') return 'sesi_2';
  if (d === '2026-11-14') return 'sesi_4';
  return 'sesi_3';
}

async function run() {
  // Fetch all responses from Supabase
  let allRows = [];
  let page = 0;
  const pageSize = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*')
      .range(page * pageSize, (page + 1) * pageSize - 1);
    if (error) {
      console.error('Fetch error:', error);
      break;
    }
    if (!data || data.length === 0) break;
    allRows = allRows.concat(data);
    if (data.length < pageSize) break;
    page++;
  }

  console.log('Total responses fetched from Supabase:', allRows.length);

  // Read official students
  const studentsFile = fs.readFileSync('src/lib/students-data.ts', 'utf8');
  const match = studentsFile.match(/export const OFFICIAL_STUDENTS: OfficialStudent\[\] = (\[[\s\S]*?\]);/);
  const officialStudents = eval(match[1]);
  console.log('Total official students:', officialStudents.length);

  // Group responses by session
  const sessionStudents = {
    sesi_1: new Set(),
    sesi_2: new Set(),
    sesi_3: new Set(),
    sesi_4: new Set(),
  };

  allRows.forEach(r => {
    const sId = getSessionId(r.created_at);
    const nis = (r.nomor_id || '').trim();
    const name = (r.nama || '').trim().toLowerCase();
    const key = nis || name;
    if (sessionStudents[sId]) {
      sessionStudents[sId].add(key);
    }
  });

  console.log('\n=== STATUS PENGISIAN PER SESI (DARI TOTAL 777 SANTRI) ===');
  SESSIONS.forEach(s => {
    const count = sessionStudents[s.id].size;
    const missing = officialStudents.length - count;
    const pct = ((count / officialStudents.length) * 100).toFixed(1);
    console.log(`${s.name}:`);
    console.log(`  Sudah mengisi: ${count} santri (${pct}%)`);
    console.log(`  Belum mengisi: ${missing} santri\n`);
  });

  // Calculate overall missing combinations
  let totalMissing = 0;
  const missingBySession = { sesi_1: [], sesi_2: [], sesi_3: [], sesi_4: [] };

  officialStudents.forEach(st => {
    const nis = st.nis.trim();
    const name = st.nama.trim().toLowerCase();
    SESSIONS.forEach(s => {
      const set = sessionStudents[s.id];
      if (!set.has(nis) && !set.has(name)) {
        totalMissing++;
        missingBySession[s.id].push(st);
      }
    });
  });

  console.log('Total pengisian yang belum terisi (santri x sesi):', totalMissing);
  SESSIONS.forEach(s => {
    console.log(`- ${s.id} (${s.name}): ${missingBySession[s.id].length} santri belum mengisi`);
  });
}

run();
