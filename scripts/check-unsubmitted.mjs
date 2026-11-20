import fs from 'fs';

function parseCSVLine(text) {
  const result = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i+1] === '"') {
        cell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cell);
      cell = '';
    } else {
      cell += c;
    }
  }
  result.push(cell);
  return result;
}

const studentsDataRaw = fs.readFileSync('C:/Users/HpPC/Documents/ProjectVERTIKALIF/src/lib/students-data.ts', 'utf8');
const match = studentsDataRaw.match(/export const OFFICIAL_STUDENTS: OfficialStudent\[\] = (\[[\s\S]*?\]);/);
let officialStudents = [];
if (match) {
  officialStudents = eval(match[1]);
}
console.log('Total Official Students:', officialStudents.length);

const csv = fs.readFileSync('C:/Users/HpPC/Documents/ProjectVERTIKALIF/vertikalif_all_responses_dump.csv', 'utf8');
const lines = csv.split('\n').filter(l => l.trim().length > 0);
const headers = parseCSVLine(lines[0]);
console.log('Headers count:', headers.length);
headers.forEach((h, idx) => console.log(idx, h));

const submittedNIS = new Set();
const submittedNames = new Set();

for (let i = 1; i < lines.length; i++) {
  const parts = parseCSVLine(lines[i]);
  // Look for Nama Santri and NIS / ID
  const nama = parts[4] ? parts[4].trim().toLowerCase() : '';
  const nis = parts[7] ? parts[7].trim() : '';
  if (nis) submittedNIS.add(nis);
  if (nama) submittedNames.add(nama);
}

console.log('Unique submitted NIS:', submittedNIS.size);
console.log('Unique submitted Names:', submittedNames.size);

const unsubmitted = officialStudents.filter(s => {
  const hasNIS = submittedNIS.has(s.nis.trim());
  const hasName = submittedNames.has(s.nama.toLowerCase().trim());
  return !hasNIS && !hasName;
});

console.log('=== HASIL ANALISIS SANTRI BELUM MENGISI ===');
console.log('Total Official Students:', officialStudents.length);
console.log('Santri yang SUDAH mengisi:', officialStudents.length - unsubmitted.length);
console.log('Santri yang BELUM mengisi:', unsubmitted.length);

const byTingkat = {};
unsubmitted.forEach(s => {
  byTingkat[s.tingkat] = (byTingkat[s.tingkat] || 0) + 1;
});
console.log('\nBelum Mengisi per Tingkat:');
console.table(byTingkat);

const byRombel = {};
unsubmitted.forEach(s => {
  byRombel[s.rombel] = (byRombel[s.rombel] || 0) + 1;
});
console.log('\nBelum Mengisi per Rombel:');
console.table(byRombel);

console.log('\nDaftar Lengkap 12 Santri yang Belum Mengisi:');
unsubmitted.forEach((s, idx) => {
  console.log(`${idx + 1}. [NIS: ${s.nis}] ${s.nama} | ${s.tingkat} | Rombel: ${s.rombel} | ${s.jenisKelamin}`);
});
