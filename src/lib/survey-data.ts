export interface SurveyQuestion {
  id: string;
  themeId: string;
  butirNum: number;
  dimension: string;
  question: string;
  description?: string;
}

export interface SurveyTheme {
  id: string;
  kaihNumber: number;
  title: string;
  subtitle: string;
  tier?: string;
  iconName: "BookOpen" | "Users" | "Sun" | "Sparkles" | "Activity" | "Moon" | "UtensilsCrossed" | "Building2" | "Home";
  questions: SurveyQuestion[];
}

export interface JurusanOption {
  id: string;
  label: string;
  description: string;
}

export const JURUSAN_OPTIONS: JurusanOption[] = [
  {
    id: "tahfizh",
    label: "Kelas Tahfizh & Riset",
    description: "Fokus literasi riset, halaqah Qur'an subuh, dan Time Qur'an ba'da Maghrib",
  },
  {
    id: "reguler",
    label: "Kelas Reguler (Sains & Sosial)",
    description: "Fokus literasi modul/pelajaran, jam tambahan, dan persiapan ujian akademik",
  },
  {
    id: "internasional",
    label: "Kelas Internasional",
    description: "Fokus literasi digital berbahasa asing di laptop & wawasan global",
  },
];

export const STUDENT_CLASSES = [
  { value: "Siswa Kelas X", label: "Kelas X" },
  { value: "Siswa Kelas XI", label: "Kelas XI" },
  { value: "Siswa Kelas XII", label: "Kelas XII" },
];

export const GENDER_OPTIONS = [
  { value: "Ikhwan", label: "Ikhwan" },
  { value: "Akhwat", label: "Akhwat" },
];

import { OFFICIAL_STUDENTS, OfficialStudent } from "./students-data";

export interface StudentRosterItem {
  id: string;
  nama: string;
  kelas: string;
  rombel?: string;
  jenisKelamin: "Ikhwan" | "Akhwat";
  nis: string;
}

export const STUDENT_ROSTER: StudentRosterItem[] = OFFICIAL_STUDENTS.map((s) => ({
  id: s.id,
  nama: s.nama,
  kelas: s.tingkat,
  rombel: s.rombel,
  jenisKelamin: s.jenisKelamin,
  nis: s.nis,
}));

export const LIKERT_OPTIONS = [
  { value: 1, label: "Sangat Tidak Sesuai", short: "STS", color: "bg-red-50 text-red-700 border-red-200" },
  { value: 2, label: "Kurang Sesuai", short: "KS", color: "bg-amber-50 text-amber-800 border-amber-200" },
  { value: 3, label: "Sesuai", short: "S", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: 4, label: "Sangat Sesuai", short: "SS", color: "bg-green-100 text-green-800 border-green-300" },
];

/**
 * Generator 7 KAIH (7 Karakter Utama Ihsanul Fikri) resmi
 * Menghasilkan 7 tema / halaman kuesioner dengan total 35 butir (5 butir per KAIH)
 */
export function getKaihThemes(jurusan: string = "tahfizh"): SurveyTheme[] {
  const isReguler = jurusan === "reguler";
  const isInternasional = jurusan === "internasional";

  return [
    {
      id: "kaih_1",
      kaihNumber: 1,
      title: isInternasional
        ? "KAIH 1: Gemar Membaca & Literasi Digital Global"
        : isReguler
        ? "KAIH 1: Gemar Membaca & Literasi Akademik"
        : "KAIH 1: Gemar Membaca & Literasi Riset",
      subtitle: isInternasional
        ? "Literasi digital berbahasa asing di laptop, fokus belajar digital di kelas tanpa distraksi tab hiburan (Tier 1 — Bobot ×3)."
        : isReguler
        ? "Literasi materi pelajaran umum, modul jam tambahan, dan latihan pemecahan soal analitis (Tier 1 — Bobot ×3)."
        : "Meluangkan waktu muthala'ah, membaca literatur referensi pelajaran dan buku wawasan mandiri (Tier 1 — Bobot ×3).",
      tier: "Tier 1 — Bobot ×3",
      iconName: "BookOpen",
      questions: [
        {
          id: "k1_1",
          themeId: "kaih_1",
          butirNum: 1,
          dimension: "Action",
          question: isReguler || isInternasional
            ? "Saya memanfaatkan waktu luang untuk membaca buku teks pelajaran, modul jam tambahan, atau latihan soal materi pilihan/umum."
            : "Saya meluangkan waktu di perpustakaan atau sesi muthala'ah (belajar malam) untuk membaca buku referensi pelajaran, buku wawasan umum, atau literatur penunjang belajar di luar tugas wajib.",
          description: "Konsistensi memanfaatkan waktu mandiri untuk memperkaya literasi dan bahan bacaan bermutu.",
        },
        {
          id: "k1_2",
          themeId: "kaih_1",
          butirNum: 2,
          dimension: "Atensi Selektif",
          question: isInternasional
            ? "Saat membaca teks berbahasa asing yang panjang dan padat istilah sulit di laptop, saya mampu mengunci fokus untuk menyaring ide pokok tanpa teralihkan oleh kerumitan kalimat maupun distraksi layar."
            : isReguler
            ? "Saat mempelajari materi pelajaran umum atau modul jam tambahan yang rumit, saya mampu memusatkan fokus tanpa terdistraksi."
            : "Saat membaca buku teks pelajaran atau literatur yang rumit, saya mampu memusatkan fokus mendalam tanpa tergoda untuk mengobrol dengan santri lain.",
          description: "Ketahanan mempertahankan konsentrasi penuh dari gangguan obrolan atau distraksi lingkungan.",
        },
        {
          id: "k1_3",
          themeId: "kaih_1",
          butirNum: 3,
          dimension: "Atensi Terbuka",
          question: isInternasional
            ? "Saat membaca berbagai literatur atau wawasan global, saya peka menangkap keberagaman perspektif, konteks budaya, dan makna tersirat yang ingin disampaikan penulis."
            : isReguler
            ? "Saat diskusi di kelas pelajaran umum/pilihan, saya peka menangkap berbagai sudut pandang pemecahan soal dari teman dan guru."
            : "Saat menyimak diskusi kelas atau ceramah guru, saya peka menangkap berbagai sudut pandang pemikiran yang berbeda tanpa terburu-buru menghakimi atau menyela.",
          description: "Keterbukaan pikiran dalam menyerap perbedaan gagasan secara objektif dan santun.",
        },
        {
          id: "k1_4",
          themeId: "kaih_1",
          butirNum: 4,
          dimension: "Atensi Eksekutif",
          question: isInternasional
            ? "Ketika menghadapi bacaan artikel asing di laptop yang sangat berat dan melelahkan, saya memiliki kendali diri untuk memaksa fokus saya tetap bertahan sampai target pemahaman bacaan tercapai."
            : isReguler
            ? "Saya mampu menyusun rencana belajar dan manajemen tugas yang efektif untuk mengimbangi banyaknya jam pelajaran tambahan."
            : "Saya mampu menyusun alur logika yang terstruktur dan berbasis data di kepala saya sebelum berbicara dalam diskusi atau menulis laporan tugas.",
          description: "Regulasi kognitif dalam mengolah data serta menyusun alur pemikiran yang sistematis.",
        },
        {
          id: "k1_5",
          themeId: "kaih_1",
          butirNum: 5,
          dimension: "Confidency",
          question: isInternasional
            ? "Saya percaya diri mempresentasikan ulasan kritis atau mempertahankan argumen berbasis data literatur internasional menggunakan bahasa asing di depan kelas."
            : isReguler
            ? "Saya berani mengangkat tangan untuk bertanya, menjawab soal sulit, atau presentasi di kelas pelajaran umum maupun pilihan."
            : "Saya berani mengajukan pandangan kritis, menyanggah argumen, atau mempresentasikan tugas/proyek di depan tanpa terhambat pandangan mereka.",
          description: "Keberanian moral dan rasa percaya diri dalam mengutarakan gagasan ilmiah di hadapan forum.",
        },
      ],
    },
    {
      id: "kaih_2",
      kaihNumber: 2,
      title: "KAIH 2: Bermasyarakat, Ukhuwah & Adab Sosial",
      subtitle: "Penanaman jiwa kepemimpinan santri, kerukunan antarkamar, dan etika interaksi islami (Tier 1 — Bobot ×3).",
      tier: "Tier 1 — Bobot ×3",
      iconName: "Users",
      questions: [
        {
          id: "k2_1",
          themeId: "kaih_2",
          butirNum: 6,
          dimension: "Action",
          question: "Di luar jam wajib KBM, saya aktif mengambil peran dalam dinamika asrama, baik dalam kepengurusan santri, kepanitiaan kegiatan, maupun menjaga kebersihan kamar.",
          description: "Inisiatif kontribusi nyata dalam kehidupan berasrama dan organisasi santri.",
        },
        {
          id: "k2_2",
          themeId: "kaih_2",
          butirNum: 7,
          dimension: "Atensi Selektif",
          question: "Saat berkomunikasi dengan musyrif, ustadz, atau teman, saya menyimak secara seksama tanpa terganggu rasa cemas akan penilaian buruk orang lain.",
          description: "Mendengarkan dengan tulus tanpa prasangka dan rasa minder.",
        },
        {
          id: "k2_3",
          themeId: "kaih_2",
          butirNum: 8,
          dimension: "Atensi Terbuka",
          question: "Saya peka membaca permasalahan di asrama serta menyadari perasaan dan kondisi teman saya.",
          description: "Empati sosial dan kepedulian terhadap kenyamanan sesama santri.",
        },
        {
          id: "k2_4",
          themeId: "kaih_2",
          butirNum: 9,
          dimension: "Atensi Eksekutif",
          question: "Ketika terjadi perbedaan pendapat atau konflik di lingkungan asrama/kelompok kerja, saya mampu menahan ego dan coba mengarahkan masalah ke musyawarah yang solutif.",
          description: "Kematangan emosional dan kemampuan meredakan perselisihan secara bijaksana.",
        },
        {
          id: "k2_5",
          themeId: "kaih_2",
          butirNum: 10,
          dimension: "Confidency",
          question: "Saya merasa percaya diri dan luwes saat harus memimpin diskusi/musyawarah santri, berbicara di depan umum, atau mengambil keputusan.",
          description: "Keluwesan dan kemantapan diri saat mengemban amanah di depan publik.",
        },
      ],
    },
    {
      id: "kaih_3",
      kaihNumber: 3,
      title: isReguler || isInternasional
        ? "KAIH 3: Bangun Pagi & Kesiapan Jam Tambahan"
        : "KAIH 3: Bangun Pagi & Halaqah Subuh",
      subtitle: isReguler || isInternasional
        ? "Kesiagaan mental setelah Time Qur'an subuh & apel gabungan menghadapi jam pelajaran tambahan (Tier 2 — Bobot ×2)."
        : "Kedisiplinan qiyamullail, ketepatan waktu shalat berjamaah subuh di masjid, dan kesegaran fisik (Tier 2 — Bobot ×2).",
      tier: "Tier 2 — Bobot ×2",
      iconName: "Sun",
      questions: [
        {
          id: "k3_1",
          themeId: "kaih_3",
          butirNum: 11,
          dimension: "Action",
          question: "Saya bangun mandiri sebelum azan Subuh untuk menunaikan qiyamul lail dan mempersiapkan diri ke masjid tepat waktu.",
          description: "Kemandirian bangun dini hari tanpa harus bergantung penuh pada ketukan musyrif.",
        },
        {
          id: "k3_2",
          themeId: "kaih_3",
          butirNum: 12,
          dimension: "Atensi Selektif",
          question: isReguler || isInternasional
            ? "Setelah Time Qur'an subuh dan apel, pikiran saya langsung terkunci fokus saat KBM dan jam pelajaran tambahan dimulai."
            : "Saat halaqah Qur'an pagi (Subuh s.d. 05.00), saya mampu melawan kantuk dan lamunan untuk fokus muroja'ah bersama serta simak antar teman.",
          description: "Daya juang menepis rasa kantuk untuk menjaga kualitas setoran dan muraja'ah.",
        },
        {
          id: "k3_3",
          themeId: "kaih_3",
          butirNum: 13,
          dimension: "Atensi Terbuka",
          question: isReguler || isInternasional
            ? "Saya memiliki kesadaran penuh terhadap agenda hari ini sehingga sigap merespons perubahan instruksi musyrif saat apel pagi maupun guru di kelas."
            : "Berkat istirahat yang cukup, pikiran saya terasa segar sejak pagi, sehingga saya sigap menangkap agenda hari ini serta merespons instruksi ustadz saat apel maupun di kelas.",
          description: "Kesiapsiagaan indra dan respon cepat dalam menerima pengarahan pagi hari.",
        },
        {
          id: "k3_4",
          themeId: "kaih_3",
          butirNum: 14,
          dimension: "Atensi Eksekutif",
          question: isReguler || isInternasional
            ? "Saya mampu mengelola persiapan pagi (mandi, sarapan, menyusun perlengkapan belajar) secara tertib dan mandiri tanpa harus terus ditegur pembina asrama."
            : "Saya mampu mengelola persiapan pagi secara tertib dan mandiri tanpa harus ditegur pembina asrama.",
          description: "Keteraturan manajemen waktu pribadi mulai dari mandi, sarapan, hingga kelengkapan sekolah.",
        },
        {
          id: "k3_5",
          themeId: "kaih_3",
          butirNum: 15,
          dimension: "Confidency",
          question: isReguler || isInternasional
            ? "Saya melangkah masuk ke ruang kelas dengan perasaan tenang, teratur, dan siap menghadapi beban target akademik harian tanpa rasa panik."
            : "Saya melangkah masuk ke ruang kelas dengan perasaan tenang, teratur, dan siap menghadapi beban target hafalan harian tanpa rasa panik.",
          description: "Kesiapan batin yang mantap menghadapi target dan evaluasi harian.",
        },
      ],
    },
    {
      id: "kaih_4",
      kaihNumber: 4,
      title: isReguler || isInternasional
        ? "KAIH 4: Beribadah & Belajar Mandiri Maghrib"
        : "KAIH 4: Beribadah & Time Qur'an",
      subtitle: isReguler || isInternasional
        ? "Kekhusyukan ibadah fardhu, wirid yaumiyah, dan belajar mandiri ba'da Maghrib s.d. Isya' (Tier 2 — Bobot ×2)."
        : "Istiqamah shalat berjamaah di shaf awal, dzikir Al-Ma'tsurat, dan ketercapaian target hafalan juz (Tier 2 — Bobot ×2).",
      tier: "Tier 2 — Bobot ×2",
      iconName: "Sparkles",
      questions: [
        {
          id: "k4_1",
          themeId: "kaih_4",
          butirNum: 16,
          dimension: "Action",
          question: isReguler || isInternasional
            ? "Saya konsisten menjaga salat berjemaah di shaf awal, merutinkan wirid Al-Ma'tsurat, dan menuntaskan target tilawah harian (mutaba'ah yaumiyah)."
            : "Saya konsisten menjaga salat berjemaah di shaf awal, merutinkan wirid Al-Ma'tsurat, dan disiplin menuntaskan target ziyaadah serta muraja'ah harian.",
          description: "Komitmen menjaga ibadah wajib di shaf terdepan dan amalan sunnah yaumiyah.",
        },
        {
          id: "k4_2",
          themeId: "kaih_4",
          butirNum: 17,
          dimension: "Atensi Selektif",
          question: isReguler || isInternasional
            ? "Saat menghadapi ujian formatif atau tes pada mata pelajaran pilihan dan umum, saya mampu meredam rasa panik dan fokus berpikir."
            : "Saat sesi Time Qur'an ba'da Maghrib dan solat, saya terlatih menenangkan hati dan mengembalikan lamunan yang melayang untuk tetap fokus.",
          description: "Kekhusyukan hati memusatkan pikiran pada ayat Al-Qur'an dan ibadah.",
        },
        {
          id: "k4_3",
          themeId: "kaih_4",
          butirNum: 18,
          dimension: "Atensi Terbuka",
          question: isReguler || isInternasional
            ? "Ketika nilai ujian pelajaran tambahan saya kurang memuaskan, saya berlapang dada dan berinisiatif mencari celah perbaikan."
            : "Ketika hafalan tersendat atau ditegur ustadz saat setoran, saya berlapang dada menerima koreksi dan tenang menyusun jadwal muraja'ah ulang.",
          description: "Sikap tawadhu' dan lapang dada saat menerima koreksi tajwid atau hafalan.",
        },
        {
          id: "k4_4",
          themeId: "kaih_4",
          butirNum: 19,
          dimension: "Atensi Eksekutif",
          question: isReguler || isInternasional
            ? "Di tengah padatnya jam tambahan pelajaran pilihan dan umum, saya mampu mengatur waktu belajar secara disiplin."
            : "Di tengah padatnya agenda (halaqah subuh, halaqah di sela KBM, dan Time Qur'an maghrib), saya mampu mengendalikan stres target juz dan tetap melaksanakan kewajiban beragama serta membagi waktu secara tertib.",
          description: "Resiliensi mental dalam menyeimbangkan rutinitas ibadah, hafalan, dan mapel sekolah.",
        },
        {
          id: "k4_5",
          themeId: "kaih_4",
          butirNum: 20,
          dimension: "Confidency",
          question: isReguler || isInternasional
            ? "Saya memiliki keyakinan diri yang kokoh dan tidak minder bersaing karena menggantungkan keberhasilan akademik pada ikhtiar maksimal dan tawakal."
            : "Saya memiliki keyakinan diri yang kokoh dan tidak minder bersaing karena menggantungkan keberhasilan pada ikhtiar maksimal dan tawakal.",
          description: "Keyakinan tauhid bahwa hasil terbaik diraih melalui perpaduan ikhtiar sungguh-sungguh dan tawakal.",
        },
      ],
    },
    {
      id: "kaih_5",
      kaihNumber: 5,
      title: "KAIH 5: Gemar Berolahraga & Ketahanan Fisik",
      subtitle: "Kebugaran jasmani santri, ketahanan konsentrasi muthala'ah, dan ketangkasan motorik lapangan.",
      tier: "Tier 3",
      iconName: "Activity",
      questions: [
        {
          id: "k5_1",
          themeId: "kaih_5",
          butirNum: 21,
          dimension: "Action",
          question: "Saya berinisiatif secara mandiri untuk meluangkan waktu melakukan aktivitas fisik seperti olahraga, bela diri, atau panahan, guna menjaga kebugaran tubuh.",
          description: "Konsistensi menjaga kebugaran fisik melalui program keolahragaan sekolah dan asrama.",
        },
        {
          id: "k5_2",
          themeId: "kaih_5",
          butirNum: 22,
          dimension: "Atensi Selektif",
          question: "Stamina fisik saya terlatih kuat sehingga saya mampu mempertahankan fokus berpikir mendalam hingga sesi muthala'ah (belajar malam) tanpa terdistraksi rasa lelah.",
          description: "Daya tahan tubuh prima yang menopang ketahanan berpikir saat sesi belajar malam.",
        },
        {
          id: "k5_3",
          themeId: "kaih_5",
          butirNum: 23,
          dimension: "Atensi Terbuka",
          question: "Ketangkasan fisik dan koordinasi indra saya responsif saat mengikuti kegiatan kepramukaan, praktik laboratorium, maupun aksi bakti asrama.",
          description: "Koordinasi motorik dan kesiagaan fisik dalam kegiatan lapangan luar ruang.",
        },
        {
          id: "k5_4",
          themeId: "kaih_5",
          butirNum: 24,
          dimension: "Atensi Eksekutif",
          question: "Dalam aktivitas fisik atau olahraga, saya mampu mengatur ritme tenaga dan menahan dorongan untuk menyerah saat tubuh mulai terasa letih.",
          description: "Regulasi daya tahan tubuh dan semangat pantang menyerah sebelum target tuntas.",
        },
        {
          id: "k5_5",
          themeId: "kaih_5",
          butirNum: 25,
          dimension: "Confidency",
          question: "Postur tubuh yang bugar dan tegap membuat saya percaya diri secara fisik saat harus berdiri memimpin barisan, khitobah, atau upacara santri.",
          description: "Kemantapan sikap fisik yang memancarkan wibawa dan kedisiplinan seorang santri.",
        },
      ],
    },
    {
      id: "kaih_6",
      kaihNumber: 6,
      title: "KAIH 6: Istirahat Teratur & Disiplin Jam Tidur Asrama",
      subtitle: "Kepatuhan tata tertib jam malam asrama (tathfi'ul anwar), kesegaran bangun, dan stabilitas emosi.",
      tier: "Tier 3",
      iconName: "Moon",
      questions: [
        {
          id: "k6_1",
          themeId: "kaih_6",
          butirNum: 26,
          dimension: "Action",
          question: "Saya langsung beristirahat saat jam malam asrama telah tiba dan menahan diri dari begadang atau ngalong untuk hal yang tidak penting.",
          description: "Kepatuhan mematikan lampu kamar asrama tepat waktu untuk menjaga hak tubuh beristirahat.",
        },
        {
          id: "k6_2",
          themeId: "kaih_6",
          butirNum: 27,
          dimension: "Atensi Selektif",
          question: "Saya mampu mempertahankan kesiagaan dan menepis rasa kantuk saat mendengarkan penjelasan guru di kelas atau ustadz saat halaqah.",
          description: "Menjaga mata dan pikiran tetap segar menyimak penjelasan guru tanpa tertidur.",
        },
        {
          id: "k6_3",
          themeId: "kaih_6",
          butirNum: 28,
          dimension: "Atensi Terbuka",
          question: "Saat menerima materi pelajaran atau tugas, pikiran saya tetap tenang, fleksibel, dan tidak panik memproses informasi yang rumit.",
          description: "Kelenturan kognitif otak yang terisi energi cukup dalam memproses problem rumit.",
        },
        {
          id: "k6_4",
          themeId: "kaih_6",
          butirNum: 29,
          dimension: "Atensi Eksekutif",
          question: "Tubuh yang cukup istirahat menjaga kesabaran saya sehingga tidak mudah terpancing emosi saat menghadapi situasi melelahkan di asrama.",
          description: "Kestabilan emosional santri agar tidak mudah tersinggung atau lekas marah karena letih.",
        },
        {
          id: "k6_5",
          themeId: "kaih_6",
          butirNum: 30,
          dimension: "Confidency",
          question: "Mental dan energi saya tercukupi sehingga saya tidak mudah panik atau mendadak bingung ketika guru menunjuk saya secara langsung untuk menjawab pertanyaan.",
          description: "Kesiapan mental menjawab spontan tanpa blank saat ditunjuk guru di kelas.",
        },
      ],
    },
    {
      id: "kaih_7",
      kaihNumber: 7,
      title: "KAIH 7: Makan Makanan Bergizi & Menjaga Adab Makan",
      subtitle: "Keteraturan pola konsumsi dapur asrama, hidrasi air putih, dan pengendalian impuls jajan.",
      tier: "Tier 3",
      iconName: "UtensilsCrossed",
      questions: [
        {
          id: "k7_1",
          themeId: "kaih_7",
          butirNum: 31,
          dimension: "Action",
          question: "Saya selalu makan tepat waktu dan rutin menjaga kecukupan minum air putih selama beraktivitas dari pagi hingga malam.",
          description: "Menjaga jadwal makan utama dapur asrama dan pemenuhan hidrasi harian tubuh.",
        },
        {
          id: "k7_2",
          themeId: "kaih_7",
          butirNum: 32,
          dimension: "Atensi Selektif",
          question: "Kecukupan energi dari pola makan yang teratur menjaga ketahanan konsentrasi saya sepanjang hari tanpa terganggu rasa lemas atau lapar.",
          description: "Stabilitas asupan nutrisi yang menyokong stamina belajar dari jam pertama hingga sore.",
        },
        {
          id: "k7_3",
          themeId: "kaih_7",
          butirNum: 33,
          dimension: "Atensi Terbuka",
          question: "Saya peka merasakan tanda-tanda kelelahan atau dehidrasi pada tubuh saya sendiri dan segera mengambil tindakan terkait.",
          description: "Kesadaran peka terhadap sinyal fisik diri sendiri agar tidak sampai jatuh sakit.",
        },
        {
          id: "k7_4",
          themeId: "kaih_7",
          butirNum: 34,
          dimension: "Atensi Eksekutif",
          question: "Saya memiliki kendali diri untuk membatasi jajan makanan instan atau minuman manis di kantin yang dapat membuat badan cepat lesu.",
          description: "Disiplin memilih makanan sehat serta menghindari konsumsi junk food berlebih.",
        },
        {
          id: "k7_5",
          themeId: "kaih_7",
          butirNum: 35,
          dimension: "Confidency",
          question: "Stamina tubuh yang prima membuat saya tampil segar, aktif berbicara, dan bersemangat berkontribusi sepanjang hari di hadapan guru dan teman.",
          description: "Semangat dan vitalitas tinggi dalam mengikuti seluruh rangkaian agenda sekolah.",
        },
      ],
    },
  ];
}

export const SURVEY_THEMES: SurveyTheme[] = getKaihThemes("tahfizh");


export interface WhitelistProfile {
  nama: string;
  nis: string;
  kelas: string;
  peran: string;
  avatar: string;
  avatarPosition?: string;
  bio: string;
}

export const WHITELIST_MEMBERS: WhitelistProfile[] = [
  {
    nama: "Naufal Abyan Maulana",
    nis: "2054",
    kelas: "XI-2",
    peran: "Project Lead & Koordinator Proyek",
    avatar: "/naufal-abyan-maulana.jpg",
    bio: "Bertanggung jawab atas koordinasi keseluruhan perancangan sistem kuesioner mutu, kepemimpinan tim proyek, dan sinkronisasi instrumen evaluasi SMAIT Ihsanul Fikri.",
  },
  {
    nama: "Faiq Ahmad Zaidan",
    nis: "3942",
    kelas: "XI-6",
    peran: "Data Analyst",
    avatar: "/faiq-ahmad-zaidan.jpg",
    bio: "Mengolah kalkulasi agregasi statistik respon, distribusi kepuasan skala Likert terpadu, dan analisis data mutu sarpras, pembelajaran, serta keasramaan.",
  },
  {
    nama: "Muhammad Fatahillah",
    nis: "4010",
    kelas: "XI-4",
    peran: "Dashboard Lead UI/UX & Desain Sistem",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    bio: "Merancang arsitektur antarmuka dashboard responsif berbasis shadcn/ui, tata visual bertema identitas SMAIT Ihsanul Fikri, serta pengalaman pengguna yang interaktif.",
  },
  {
    nama: "Muhammad Gus Ubay Izzulhaq",
    nis: "4014",
    kelas: "XI-4",
    peran: "Gemini Insight Lead",
    avatar: "/muhammad-gus-ubay-izzulhaq.jpg",
    avatarPosition: "object-[78%_25%]",
    bio: "Mengembangkan integrasi analitik cerdas, penalaran wawasan komprehensif, dan interpretasi naratif rekomendasi mutu berbasis AI untuk kemajuan sekolah.",
  },
  {
    nama: "Arbi Saiful Bahri",
    nis: "2089",
    kelas: "XI-4",
    peran: "Presentation Lead",
    avatar: "/arbi-saiful-bahri.jpg",
    bio: "Memimpin penyusunan visualisasi laporan eksekutif, materi diseminasi hasil temuan survei, dan presentasi pertanggungjawaban proyek kepada dewan sekolah.",
  },
  {
    nama: "Rizal Hanifa Pratama",
    nis: "19890101",
    kelas: "Pembimbing",
    peran: "Technology & AI Project Mentor",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
    bio: "Mendampingi jalannya riset proyek, supervisi implementasi kecerdasan buatan (AI) dan aplikasi web, serta memfasilitasi integrasi sistem kuesioner terpadu di sekolah.",
  },
  {
    nama: "Taufan Maulana Haris",
    nis: "19910202",
    kelas: "Pembimbing",
    peran: "Substantive Advisor & Penjamin Mutu 7 KAIH",
    avatar: "/taufan-maulana-haris.png",
    bio: "Mengawal kebenaran data, objektivitas metodologi, serta memastikan keselarasan butir evaluasi kuesioner dengan standar 7 Karakter Utama Ihsanul Fikri (7 KAIH).",
  },
];
