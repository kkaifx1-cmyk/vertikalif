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

const csv = fs.readFileSync('C:/Users/HpPC/Documents/ProjectVERTIKALIF/vertikalif_all_responses_dump.csv', 'utf8');
const lines = csv.split('\n').filter(l => l.trim().length > 0);

const sessionCounts = {};
const studentSessions = new Map();

for (let i = 1; i < lines.length; i++) {
  const parts = parseCSVLine(lines[i]);
  const session = parts[3] ? parts[3].trim() : '';
  const nama = parts[4] ? parts[4].trim() : '';
  const nis = parts[7] ? parts[7].trim() : '';
  const key = nis || nama;

  sessionCounts[session] = (sessionCounts[session] || 0) + 1;
  if (!studentSessions.has(key)) {
    studentSessions.set(key, new Set());
  }
  studentSessions.get(key).add(session);
}

console.log('Session counts:', sessionCounts);
console.log('Total students with at least 1 response:', studentSessions.size);

const unsubmittedNIS = ['1120', '1188', '2033', '3942', '2160', '2194', '3052', '3087', '3114', '3118', '3155', '3166'];
console.log('Do any of the 12 have records?');
unsubmittedNIS.forEach(nis => {
  console.log(nis, studentSessions.has(nis));
});
