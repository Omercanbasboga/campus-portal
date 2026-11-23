// A made-up university for the demo: unit tree, staff and students.
// Seeded, so the same people show up on every load. Names are drawn from
// common Turkish first names and surnames; nobody here is a real person.

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}
const r = rng(7);
const int = (a, b) => Math.floor(a + r() * (b - a + 1));
const pick = (arr) => arr[Math.floor(r() * arr.length)];
const chance = (p) => r() < p;
const pad = (n) => String(n).padStart(2, "0");
// a timestamp within the last `days` days, so "recent" lists look recent
const recent = (days) => {
  const d = new Date(Date.now() - int(0, days * 24 * 60) * 60000);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
};
const date = (y0, y1) => `${int(y0, y1)}-${pad(int(1, 12))}-${pad(int(1, 28))}`;

const ASCII = {
  ç: "c",
  ğ: "g",
  ı: "i",
  ö: "o",
  ş: "s",
  ü: "u",
  Ç: "c",
  Ğ: "g",
  İ: "i",
  Ö: "o",
  Ş: "s",
  Ü: "u",
};
const slug = (s) =>
  s
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, (c) => ASCII[c])
    .toLowerCase()
    .replace(/\s+/g, "");

const FIRST_F = [
  "Ayşe",
  "Zeynep",
  "Elif",
  "Selin",
  "Derya",
  "İrem",
  "Gizem",
  "Ece",
  "Pelin",
  "Melis",
  "Nazlı",
  "Dilara",
  "Buse",
  "Ceren",
  "Esra",
  "Hande",
  "Merve",
  "Özge",
  "Sena",
  "Tuba",
];
const FIRST_M = [
  "Mehmet",
  "Emre",
  "Can",
  "Burak",
  "Kerem",
  "Onur",
  "Barış",
  "Tolga",
  "Umut",
  "Serkan",
  "Hakan",
  "Arda",
  "Deniz",
  "Efe",
  "Kaan",
  "Murat",
  "Okan",
  "Sinan",
  "Tarık",
  "Yiğit",
];
const LAST = [
  "Kaya",
  "Demir",
  "Çelik",
  "Şahin",
  "Yıldız",
  "Öztürk",
  "Arslan",
  "Koç",
  "Aydın",
  "Polat",
  "Kurt",
  "Çetin",
  "Taş",
  "Erdem",
  "Güneş",
  "Yalçın",
  "Bulut",
  "Aksoy",
  "Korkmaz",
  "Doğan",
  "Keskin",
  "Uysal",
  "Özkan",
  "Tekin",
  "Kılıç",
  "Aslan",
  "Karaca",
  "Eren",
  "Sezer",
  "Toprak",
];
const CITIES = [
  ["İstanbul", "Beşiktaş"],
  ["İstanbul", "Kadıköy"],
  ["Ankara", "Çankaya"],
  ["İzmir", "Bornova"],
  ["Bursa", "Nilüfer"],
  ["Eskişehir", "Tepebaşı"],
  ["Antalya", "Muratpaşa"],
  ["Trabzon", "Ortahisar"],
];

// ---- unit tree -----------------------------------------------------------
let seq = 0;
const units = [];
function unit(name, nodeType, parent, children = []) {
  seq += 1;
  const u = {
    id: `b${String(seq).padStart(4, "0")}-0000-4000-8000-${String(seq).padStart(12, "0")}`,
    uniqId: String(1000 + seq * 7),
    nodeId: String(1000 + seq * 7),
    name,
    nodeType,
    parentUnit: parent ? parent.name : null,
    parentId: parent ? parent.id : null,
    isActive: true,
    userId: null,
    createdDate: `${date(2015, 2021)}T09:00:00`,
    updateDate: `${date(2024, 2026)}T14:30:00`,
    children: [],
  };
  units.push(u);
  children.forEach(([n, t, kids]) => u.children.push(unit(n, t, u, kids)));
  return u;
}

const ROOT = unit("Rektörlük", "REKTORLUK", null, [
  [
    "Genel Sekreterlik",
    "GENEL_SEKRETERLIK",
    [
      [
        "Bilgi İşlem Daire Başkanlığı",
        "DAIRE",
        [
          ["Yazılım Geliştirme Şube Müdürlüğü", "SUBE", []],
          ["Sistem ve Ağ Şube Müdürlüğü", "SUBE", []],
        ],
      ],
      [
        "Personel Daire Başkanlığı",
        "DAIRE",
        [
          ["Özlük İşleri Şube Müdürlüğü", "SUBE", []],
          ["Atama Şube Müdürlüğü", "SUBE", []],
        ],
      ],
      ["Öğrenci İşleri Daire Başkanlığı", "DAIRE", []],
      [
        "Sağlık Kültür ve Spor Daire Başkanlığı",
        "DAIRE",
        [
          ["Yurtlar ve Konutlar Şube Müdürlüğü", "SUBE", []],
          ["Spor Şube Müdürlüğü", "SUBE", []],
        ],
      ],
      ["Kütüphane ve Dokümantasyon Daire Başkanlığı", "DAIRE", []],
      [
        "İdari ve Mali İşler Daire Başkanlığı",
        "DAIRE",
        [
          ["Tahakkuk Şube Müdürlüğü", "SUBE", []],
          ["Satın Alma Şube Müdürlüğü", "SUBE", []],
        ],
      ],
    ],
  ],
  [
    "Mühendislik Fakültesi",
    "FAKULTE",
    [
      [
        "Bilgisayar Mühendisliği Bölümü",
        "BOLUM",
        [
          ["Yazılım Anabilim Dalı", "ABD", []],
          ["Bilgisayar Sistemleri Anabilim Dalı", "ABD", []],
        ],
      ],
      ["Elektrik-Elektronik Mühendisliği Bölümü", "BOLUM", []],
      ["İnşaat Mühendisliği Bölümü", "BOLUM", []],
      ["Endüstri Mühendisliği Bölümü", "BOLUM", []],
      ["Makina Mühendisliği Bölümü", "BOLUM", []],
    ],
  ],
  [
    "Fen-Edebiyat Fakültesi",
    "FAKULTE",
    [
      ["Matematik Bölümü", "BOLUM", []],
      ["Fizik Bölümü", "BOLUM", []],
      ["Tarih Bölümü", "BOLUM", []],
      ["Psikoloji Bölümü", "BOLUM", []],
      ["Türk Dili ve Edebiyatı Bölümü", "BOLUM", []],
    ],
  ],
  [
    "İktisadi ve İdari Bilimler Fakültesi",
    "FAKULTE",
    [
      ["İşletme Bölümü", "BOLUM", []],
      ["Ekonomi Bölümü", "BOLUM", []],
      ["Siyaset Bilimi ve Uluslararası İlişkiler Bölümü", "BOLUM", []],
    ],
  ],
  [
    "Eğitim Fakültesi",
    "FAKULTE",
    [
      ["Bilgisayar ve Öğretim Teknolojileri Eğitimi Bölümü", "BOLUM", []],
      ["Yabancı Diller Eğitimi Bölümü", "BOLUM", []],
    ],
  ],
  ["Yabancı Diller Yüksekokulu", "YUKSEKOKUL", []],
  ["Fen Bilimleri Enstitüsü", "ENSTITU", []],
  ["Sosyal Bilimler Enstitüsü", "ENSTITU", []],
  ["Bilimsel Araştırma Projeleri Koordinatörlüğü", "KOORDINATORLUK", []],
]);

const byId = Object.fromEntries(units.map((u) => [u.id, u]));
const byUniq = Object.fromEntries(units.map((u) => [u.uniqId, u]));
const parentOf = (u) => (u.parentId ? byId[u.parentId] : null);
const pathTo = (u) => {
  const out = [];
  for (let c = u; c; c = parentOf(c)) out.unshift(c);
  return out;
};
const academicUnits = units.filter((u) =>
  ["BOLUM", "ABD", "YUKSEKOKUL", "ENSTITU"].includes(u.nodeType)
);
const adminUnits = units.filter((u) => ["DAIRE", "SUBE", "KOORDINATORLUK"].includes(u.nodeType));
const departments = units.filter((u) => u.nodeType === "BOLUM");

// ---- staff --------------------------------------------------------------
const ACAD_TITLES = ["Prof. Dr.", "Doç. Dr.", "Dr. Öğr. Üyesi", "Öğr. Gör.", "Arş. Gör."];
const ADMIN_TITLES = ["Memur", "Şef", "Bilgisayar İşletmeni", "Programcı", "Şube Müdürü", "Uzman"];
const OTHER_TITLES = ["Sözleşmeli Personel", "Teknisyen", "Destek Personeli"];
const SCHOOLS = [
  "Ankara Üniversitesi",
  "Ege Üniversitesi",
  "Hacettepe Üniversitesi",
  "Orta Doğu Teknik Üniversitesi",
  "İstanbul Teknik Üniversitesi",
  "Uludağ Üniversitesi",
];

const maskedTc = () => `•••••••${pad(int(10, 99))}${pad(int(10, 99))}`;

const staff = Array.from({ length: 140 }, (_, i) => {
  const female = chance(0.5);
  const ad = pick(female ? FIRST_F : FIRST_M);
  const soyad = pick(LAST);
  const tip = i % 7 < 3 ? "AKADEMIK" : i % 7 < 6 ? "IDARI" : "DIGER_PERSONEL";
  const u = tip === "AKADEMIK" ? pick(academicUnits) : pick(adminUnits);
  const titleAd =
    tip === "AKADEMIK"
      ? pick(ACAD_TITLES)
      : tip === "IDARI"
        ? pick(ADMIN_TITLES)
        : pick(OTHER_TITLES);
  const retired = chance(0.06);
  const resigned = !retired && chance(0.05);
  const path = pathTo(u);
  const start = int(2004, 2023);
  const email = `${slug(ad)}.${slug(soyad)}${i % 9 === 0 ? i : ""}@ornek.edu.tr`;
  const fiili = [
    {
      aktif: true,
      bolumId: u.uniqId,
      birimAd: u.name,
      masterBirimAd: path[1]?.name || ROOT.name,
      unvanAd: titleAd,
      baslangicTarihi: `${start}-${pad(int(1, 12))}-01`,
    },
  ];
  const idari =
    tip === "AKADEMIK" && chance(0.25)
      ? [
          {
            birimAd: path[path.length - 2]?.name || u.name,
            masterBirimAd: path[1]?.name || ROOT.name,
            unvanAd: pick([
              "Bölüm Başkan Yardımcısı",
              "Dekan Yardımcısı",
              "Anabilim Dalı Başkanı",
              "Koordinatör",
            ]),
            unvanSeviye: int(2, 4),
            baslangicTarihi: date(2020, 2025),
            isAsil: chance(0.7),
            isVekaleten: chance(0.3),
            is13b4: chance(0.1),
          },
        ]
      : [];
  return {
    id: String(20000 + i),
    ad,
    soyad,
    adSoyad: `${ad} ${soyad}`,
    cinsiyet: female ? "Kadın" : "Erkek",
    kurumEmail: email,
    email,
    foto: null,
    cepTel: `05${int(30, 59)} ${int(100, 999)} ${pad(int(10, 99))} ${pad(int(10, 99))}`,
    tckimlikno: maskedTc(),
    dogumTarihi: date(1965, 1999),
    kurumSicilNo: String(100000 + i * 13),
    jobrecordTipi: tip,
    jobrecordAlttipi:
      tip === "AKADEMIK"
        ? "Öğretim Elemanı"
        : tip === "IDARI"
          ? "Genel İdari Hizmetler"
          : "Sözleşmeli",
    jobrecordDurum: retired ? "Emekli" : resigned ? "İstifa" : "Aktif",
    isActive: !retired && !resigned,
    emekliMi: retired,
    ayrilmaTipi: resigned ? "ISTIFA" : null,
    unvan: { ad: titleAd },
    akademikUnvan: tip === "AKADEMIK" ? { ad: titleAd } : null,
    birimId: u.uniqId,
    bolumId: u.uniqId,
    birimAdi: u.name,
    bolumAdi: u.name,
    birim: { name: u.name },
    aktifCalismaYeri: { birimAd: u.name, masterBirimAd: path[1]?.name || ROOT.name },
    personnelTree: [...path].reverse().map((p) => ({ name: p.name, id: p.id })),
    fiiliGorevler: fiili,
    idariGorevler: idari,
    univBastar: `${start}-09-01`,
    memuriyetBastar: `${start - int(0, 3)}-09-01`,
    isDoktorali:
      tip === "AKADEMIK" && titleAd.startsWith("Dr")
        ? true
        : tip === "AKADEMIK" && !titleAd.includes("Gör"),
    doktoraTarihi: tip === "AKADEMIK" ? date(2003, 2020) : null,
    docentTarihi: titleAd.includes("Doç") || titleAd.includes("Prof") ? date(2010, 2020) : null,
    profesorTarihi: titleAd.includes("Prof") ? date(2016, 2024) : null,
    orcid: tip === "AKADEMIK" ? `0000-000${int(1, 3)}-${int(1000, 9999)}-${int(1000, 9999)}` : null,
    akademikUnvanGecmisi:
      tip === "AKADEMIK"
        ? ACAD_TITLES.slice(ACAD_TITLES.indexOf(titleAd))
            .reverse()
            .map((t, k) => ({ unvanAdi: t, baslangicTarihi: `${start + k * 4}-10-01` }))
        : [],
    okullar: [
      {
        okulAd: pick(SCHOOLS),
        bolum:
          tip === "AKADEMIK"
            ? u.name.replace(" Bölümü", "")
            : pick(["İşletme", "Kamu Yönetimi", "Bilgisayar Programcılığı", "İktisat"]),
        ogrenimdurumu:
          tip === "AKADEMIK" ? "Doktora" : pick(["Lisans", "Ön Lisans", "Yüksek Lisans"]),
        mezuniyetTarihi: date(1990, 2020),
      },
    ],
    createdAt: recent(120),
    updatedAt: recent(14),
  };
});
// every unit gets a manager: someone working in that unit or below it,
// an academic for academic units where possible
const ACADEMIC_KINDS = ["FAKULTE", "BOLUM", "ABD", "ENSTITU", "YUKSEKOKUL"];
const taken = new Set();
const unitsDeepFirst = [...units].sort((a, b) => pathTo(b).length - pathTo(a).length);
unitsDeepFirst.forEach((u) => {
  const inTree = (p) => pathTo(byUniq[p.birimId]).some((x) => x.id === u.id);
  const pool = staff.filter((p) => p.isActive && !taken.has(p.id) && inTree(p));
  const wantAcademic = ACADEMIC_KINDS.includes(u.nodeType);
  const ranked = pool.sort(
    (a, b) =>
      (wantAcademic ? (b.jobrecordTipi === "AKADEMIK") - (a.jobrecordTipi === "AKADEMIK") : 0) ||
      b.unvan.ad.startsWith("Prof") - a.unvan.ad.startsWith("Prof")
  );
  const manager = ranked[0] || staff.find((p) => p.isActive && !taken.has(p.id));
  if (manager) {
    taken.add(manager.id);
    u.userId = manager.id;
  }
});

// ---- students -----------------------------------------------------------
const CLUBS = [
  "Robotik Kulübü",
  "Satranç Kulübü",
  "Dağcılık Kulübü",
  "Fotoğrafçılık Kulübü",
  "Müzik Kulübü",
  "Bilişim Kulübü",
  "Tiyatro Kulübü",
  "Girişimcilik Kulübü",
];
const students = Array.from({ length: 260 }, (_, i) => {
  const female = chance(0.5);
  const ad = pick(female ? FIRST_F : FIRST_M);
  const soyad = pick(LAST);
  const dep = pick(departments);
  const fac = parentOf(dep);
  const year = int(2019, 2025);
  const no = `${year}${pad(int(10, 99))}${String(i).padStart(3, "0")}`;
  const kayitli = chance(0.88);
  const [il, ilce] = pick(CITIES);
  return {
    id: String(50000 + i),
    ad,
    soyad,
    ogrenciNo: no,
    studentNumber: no,
    cinsiyet: female ? "Kadın" : "Erkek",
    bolum: dep.name,
    bolumAdi: dep.name,
    bolumId: dep.uniqId,
    fakulte: fac.name,
    okulEmail: `${slug(ad)}.${slug(soyad)}${i}@ogr.ornek.edu.tr`,
    email: `${slug(ad)}${int(10, 99)}@example.com`,
    foto: null,
    gpa: (2 + r() * 2).toFixed(2),
    kayitlilik: kayitli ? "KAYITLI" : "KAYITSIZ",
    durumu: kayitli ? "Aktif" : pick(["Kayıt dondurdu", "Mezun", "Kaydı silindi"]),
    donemDurumu: kayitli ? "Ders kaydı yapıldı" : "-",
    statu: pick(["Lisans", "Lisans", "Lisans", "Yüksek Lisans"]),
    yurtMu: chance(0.22),
    disiplinCezasiVar: chance(0.03),
    kayitTarihi: `${year}-09-${pad(int(10, 25))}`,
    toplamDonem: (2026 - year) * 2,
    girisTipi: pick(["ÖSYM", "ÖSYM", "Yatay geçiş", "Dikey geçiş"]),
    universiteGiris: `${year}-09-01`,
    bolumEgiris: `${year}-09-01`,
    bolumTip: "Örgün",
    uyruk: "T.C.",
    tckimlik: maskedTc(),
    pasaportNo: null,
    ceptel: `05${int(30, 59)} ${int(100, 999)} ${pad(int(10, 99))} ${pad(int(10, 99))}`,
    telefon: null,
    il,
    ilce,
    il2: il,
    ilce2: ilce,
    adres1: `${pick(["Atatürk", "Cumhuriyet", "İnönü", "Gazi"])} Cad. No: ${int(1, 120)}`,
    adres2: null,
    tercihSirasi: int(1, 24),
    yerlesilePuanTuru: pick(["SAY", "EA", "SÖZ"]),
    yerKullanilanPuani: (380 + r() * 160).toFixed(3),
    yerKullanilanBasariSirasi: int(1500, 120000),
    sertifika: null,
    kulupler: CLUBS.filter(() => chance(0.15)).map((name) => ({
      name,
      adi: name,
      kayitTarihi: date(year, 2026),
    })),
    createdAt: recent(120),
    updatedAt: recent(14),
  };
});

// figures the org chart shows on each card, counted over the whole subtree
const subtree = (u) => [u, ...u.children.flatMap(subtree)];
units.forEach((u) => {
  const ids = new Set(subtree(u).map((x) => x.uniqId));
  const manager = staff.find((p) => p.id === u.userId);
  u.managerName = manager ? manager.adSoyad : null;
  u.managerTitle = manager ? manager.unvan.ad : null;
  u.staffCount = staff.filter((p) => p.isActive && ids.has(p.birimId)).length;
  u.studentCount = students.filter((x) => ids.has(x.bolumId)).length;
});

export { ROOT, units, byId, byUniq, pathTo, staff, students };
