import fs from 'fs';
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

function normalizeName(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

async function run() {
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

  const studentsFile = fs.readFileSync('src/lib/students-data.ts', 'utf8');
  const match = studentsFile.match(/export const OFFICIAL_STUDENTS: OfficialStudent\[\] = (\[[\s\S]*?\]);/);
  const officialStudents = eval(match[1]);
  console.log('Total official students in master database:', officialStudents.length);

  // Per session maps: NIS set and Normalized Name set
  const sessionNisMap = { sesi_1: new Set(), sesi_2: new Set(), sesi_3: new Set(), sesi_4: new Set() };
  const sessionNameMap = { sesi_1: new Set(), sesi_2: new Set(), sesi_3: new Set(), sesi_4: new Set() };

  allRows.forEach(r => {
    const sId = getSessionId(r.created_at);
    if (sessionNisMap[sId]) {
      if (r.nomor_id) sessionNisMap[sId].add(r.nomor_id.trim());
      if (r.nama) sessionNisMap[sId].add(normalizeName(r.nama));
      if (r.nama) sessionNameMap[sId].add(normalizeName(r.nama));
    }
  });

  const missingEntries = [];

  officialStudents.forEach(st => {
    const cleanNis = st.nis.trim();
    const cleanName = normalizeName(st.nama);

    SESSIONS.forEach(session => {
      const hasNis = sessionNisMap[session.id].has(cleanNis);
      const hasName = sessionNameMap[session.id].has(cleanName);

      if (!hasNis && !hasName) {
        missingEntries.push({
          student: st,
          session: session,
        });
      }
    });
  });

  console.log('\n=== HASIL DETEKSI PRESISI SANTRI BELUM MENGISI ===');
  console.log(`Total entri yang belum terisi: ${missingEntries.length} pengisian (dari 3.108 target kuota)`);
  
  SESSIONS.forEach(sess => {
    const count = missingEntries.filter(m => m.session.id === sess.id).length;
    console.log(`- ${sess.name}: ${count} santri belum mengisi (Sudah terisi: ${777 - count}/777)`);
  });

  fs.writeFileSync('scripts/missing-entries.json', JSON.stringify(missingEntries, null, 2));
  console.log('\nData tersimpan di scripts/missing-entries.json');
}

run();
