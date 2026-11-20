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

const csv = fs.readFileSync('vertikalif_all_responses_dump.csv', 'utf8');
const lines = csv.split('\n').filter(l => l.trim().length > 0);

let count1 = 0, count2 = 0, count3 = 0, count4 = 0;
let perfectFours = 0;
const rowScores = [];

for (let i = 1; i < lines.length; i++) {
  const parts = parseCSVLine(lines[i]);
  let fours = 0;
  let sum = 0;
  for (let q = 15; q <= 49; q++) {
    const val = parseInt(parts[q]);
    sum += val;
    if (val === 1) count1++;
    if (val === 2) count2++;
    if (val === 3) count3++;
    if (val === 4) { count4++; fours++; }
  }
  rowScores.push((sum / 35).toFixed(2));
  if (fours === 35) perfectFours++;
}

const total = count1 + count2 + count3 + count4;
console.log('=== DISTRIBUSI LENGKAP PILIHAN JAWABAN (3.152 SANTRI) ===');
console.log('Skor 1 (Sangat Tidak Sesuai):', count1, `(${(count1 / total * 100).toFixed(2)}%)`);
console.log('Skor 2 (Tidak Sesuai)       :', count2, `(${(count2 / total * 100).toFixed(2)}%)`);
console.log('Skor 3 (Sesuai)             :', count3, `(${(count3 / total * 100).toFixed(2)}%)`);
console.log('Skor 4 (Sangat Sesuai)      :', count4, `(${(count4 / total * 100).toFixed(2)}%)`);
console.log('\nSantri dengan skor 4 SEMUA (Flat 4 / Sangat Sesuai Semua):', perfectFours, 'santri (0%)');
console.log('Rata-rata skor terendah santri:', Math.min(...rowScores.map(Number)));
console.log('Rata-rata skor tertinggi santri:', Math.max(...rowScores.map(Number)));
