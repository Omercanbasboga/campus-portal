// Made-up responses for every endpoint the dashboard calls, so the demo runs
// without the session backend. Seeded, so every reload shows the same numbers.

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}
const r = rng(42);
const int = (a, b) => Math.floor(a + r() * (b - a + 1));
const pick = (arr) => arr[Math.floor(r() * arr.length)];
const round1 = (x) => Math.round(x * 10) / 10;

const TR_DAYS = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
const pad = (n) => String(n).padStart(2, "0");
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const daysBack = (n) =>
  Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return d;
  });

const CLIENTS = [
  "Öğrenci Portalı",
  "E-posta",
  "Ders Yönetim Sistemi",
  "Kütüphane",
  "Personel Portalı",
  "Kampüs Kart",
  "Kablosuz Ağ Girişi",
  "Belge Yönetimi",
];
const BROWSERS = ["Chrome", "Safari", "Edge", "Firefox", "Samsung Internet", "Opera"];
const OSES = ["Windows", "Android", "iOS", "macOS", "Linux"];
const NAMES = [
  "ayse.kaya",
  "mehmet.demir",
  "zeynep.celik",
  "emre.sahin",
  "elif.yildiz",
  "can.ozturk",
  "selin.arslan",
  "burak.koc",
  "derya.aydin",
  "kerem.polat",
  "irem.kurt",
  "onur.cetin",
  "gizem.tas",
  "baris.erdem",
  "ece.gunes",
  "tolga.yalcin",
  "pelin.bulut",
  "umut.aksoy",
  "melis.korkmaz",
  "serkan.dogan",
  "nazli.keskin",
  "hakan.uysal",
  "dilara.ozkan",
  "arda.tekin",
];
const email = (n) => `${n}@ornek.edu.tr`;
const ip = () => `${pick(["192.0.2", "198.51.100", "203.0.113"])}.${int(2, 254)}`;

// hourly shape of a campus day: quiet at night, peaks late morning and after lunch
const HOUR_WEIGHT = [
  0.05, 0.03, 0.02, 0.02, 0.02, 0.04, 0.12, 0.35, 0.75, 1.0, 0.95, 0.9, 0.7, 0.85, 0.92, 0.8, 0.65,
  0.5, 0.38, 0.32, 0.3, 0.25, 0.16, 0.09,
];

function systemTrends() {
  const days = daysBack(14).map((d) => {
    const weekend = d.getDay() === 0 || d.getDay() === 6;
    const base = weekend ? int(2600, 3600) : int(8200, 10400);
    const saatlik = HOUR_WEIGHT.map((w, h) => ({
      saat: `${pad(h)}:00`,
      giris: Math.round((base / 11) * w * (0.85 + r() * 0.3)),
    }));
    return { d, total: saatlik.reduce((a, x) => a + x.giris, 0), saatlik };
  });
  const last7 = days.slice(-7);
  const total = last7.reduce((a, x) => a + x.total, 0);
  const busiest = last7.reduce((a, x) => (x.total > a.total ? x : a));
  const hourTotals = Array(24).fill(0);
  last7.forEach((x) => x.saatlik.forEach((v, h) => (hourTotals[h] += v.giris)));
  const peakHour = hourTotals.indexOf(Math.max(...hourTotals));

  return {
    dashboard: {
      toplamGiris: total,
      enYogunGun: `${pad(busiest.d.getDate())}.${pad(busiest.d.getMonth() + 1)} ${TR_DAYS[busiest.d.getDay()]}`,
      enYogunSaat: `${pad(peakHour)}:00`,
      ortalamaGun: Math.round(total / 7),
      gunlukGirisList: last7.map((x) => ({
        tarihGun: `${pad(x.d.getMonth() + 1)}-${pad(x.d.getDate())} ${TR_DAYS[x.d.getDay()]}`,
        toplamGiris: x.total,
      })),
    },
    charts: {
      saatlikTrend: last7.map((x) => ({
        gunAdi: TR_DAYS[x.d.getDay()],
        saatlikVeriler: x.saatlik,
      })),
      heatmap: last7.flatMap((x) =>
        x.saatlik.map((v, h) => ({ islemTarihi: iso(x.d), saat: h, giris: v.giris }))
      ),
    },
  };
}

function browserOs() {
  const share = (names, weights) => {
    const total = weights.reduce((a, b) => a + b, 0);
    return names.map((ad, i) => ({
      ad,
      yuzde: round1((weights[i] / total) * 100),
      kullanimSayisi: Math.round((weights[i] / total) * 68400),
    }));
  };
  const browserDagilimi = share(BROWSERS, [58, 17, 12, 8, 3, 2]);
  const osDagilimi = share(OSES, [41, 27, 21, 9, 2]);
  const topKombinasyonlar = [];
  BROWSERS.slice(0, 4).forEach((b) =>
    OSES.slice(0, 4).forEach((o) => {
      if ((b === "Safari") !== (o === "iOS" || o === "macOS")) return;
      topKombinasyonlar.push({ browserAdi: b, osAdi: o, kullanimSayisi: int(900, 21000) });
    })
  );
  topKombinasyonlar.sort((a, b) => b.kullanimSayisi - a.kullanimSayisi);
  return {
    toplamKullanim: 68400,
    enCokBrowser: "Chrome",
    enCokOs: "Windows",
    farkliKombinasyon: 23,
    browserDagilimi,
    osDagilimi,
    topKombinasyonlar,
  };
}

function clientAnalytics() {
  const topClientlar = CLIENTS.map((clientAdi, i) => ({
    clientAdi,
    toplamKullanim: Math.round(31000 / (i + 1) ** 0.8 + int(0, 900)),
  }));
  const toplam = topClientlar.reduce((a, c) => a + c.toplamKullanim, 0);
  return {
    toplamKullanim: toplam,
    clientSayisi: CLIENTS.length,
    enAktifClient: CLIENTS[0],
    enAktifClientKullanim: topClientlar[0].toplamKullanim,
    ortalamaKullanimPerClient: Math.round(toplam / CLIENTS.length),
    topClientlar,
    baskinOsDagilimi: browserOs().osDagilimi,
    baskinBrowserDagilimi: browserOs().browserDagilimi,
  };
}

function clientTransitions() {
  const pairs = [
    ["Öğrenci Portalı", "Ders Yönetim Sistemi", 0.81],
    ["E-posta", "Belge Yönetimi", 0.64],
    ["Öğrenci Portalı", "E-posta", 0.58],
    ["Personel Portalı", "Belge Yönetimi", 0.55],
    ["Ders Yönetim Sistemi", "Kütüphane", 0.41],
    ["Kablosuz Ağ Girişi", "Öğrenci Portalı", 0.37],
    ["Kampüs Kart", "Personel Portalı", 0.29],
    ["Kütüphane", "E-posta", 0.22],
  ];
  const level = (g) => (g >= 0.6 ? "Yüksek" : g >= 0.35 ? "Orta" : "Düşük");
  const tumGecisler = pairs.map(([kaynak, hedef, guvenOrani]) => ({
    kaynak,
    hedef,
    guvenOrani,
    seviye: level(guvenOrani),
  }));
  return {
    toplamGecisKurali: pairs.length,
    enYuksekGuvenKaynak: pairs[0][0],
    enYuksekGuvenHedef: pairs[0][1],
    enYuksekGuvenOrani: pairs[0][2],
    benzersizClient: new Set(pairs.flatMap((p) => [p[0], p[1]])).size,
    edges: tumGecisler.map((t) => ({ kaynak: t.kaynak, hedef: t.hedef, guvenOrani: t.guvenOrani })),
    nodes: [...new Set(pairs.flatMap((p) => [p[0], p[1]]))].map((id) => ({ id })),
    tumGecisler,
  };
}

function cohort() {
  const weeks = 8;
  const heatmap = daysBack(weeks * 7)
    .filter((_, i) => i % 7 === 0)
    .map((d, w) => {
      const haftalar = [];
      for (let k = 0; k < weeks - w; k += 1) {
        const oran = k === 0 ? 100 : Math.max(8, 100 * Math.exp(-0.32 * k) * (0.9 + r() * 0.2));
        haftalar.push({ kacinciHafta: k, eldeTutmaOrani: oran });
      }
      return { kayitHaftasi: `${iso(d)} haftası`, haftalar };
    });
  const firstWeek = heatmap.filter((h) => h.haftalar[1]).map((h) => h.haftalar[1].eldeTutmaOrani);
  return {
    cohortSayisi: weeks,
    ort1HaftaTutma: firstWeek.reduce((a, b) => a + b, 0) / firstWeek.length,
    enIyiCohortHafta: heatmap[2].kayitHaftasi,
    enIyiCohortOran: heatmap[2].haftalar[1].eldeTutmaOrani,
    heatmap,
  };
}

function futurePredictions() {
  const gunlukTahminler = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const weekend = d.getDay() === 0 || d.getDay() === 6;
    const beklenenGiris = weekend ? int(2900, 3400) : int(8800, 10100);
    const aralik = Math.round(beklenenGiris * (0.08 + i * 0.012));
    return {
      tahminTarihi: iso(d),
      tarihEtiket: `${pad(d.getDate())}.${pad(d.getMonth() + 1)} ${TR_DAYS[d.getDay()]}`,
      beklenenGiris,
      altSinir: beklenenGiris - aralik,
      ustSinir: beklenenGiris + aralik,
      aralikGenisligi: aralik,
    };
  });
  const hi = gunlukTahminler.reduce((a, g) => (g.beklenenGiris > a.beklenenGiris ? g : a));
  const lo = gunlukTahminler.reduce((a, g) => (g.beklenenGiris < a.beklenenGiris ? g : a));
  return {
    gunlukTahminler,
    enYuksekTahmin: hi.beklenenGiris,
    enYuksekTahminTarihi: hi.tarihEtiket,
    enDusukTahmin: lo.beklenenGiris,
    enDusukTahminTarihi: lo.tarihEtiket,
    haftalikToplam: gunlukTahminler.reduce((a, g) => a + g.beklenenGiris, 0),
    ortGuvenAraligi: Math.round(
      gunlukTahminler.reduce((a, g) => a + g.aralikGenisligi, 0) / gunlukTahminler.length
    ),
  };
}

function peakPredictions() {
  const saatlikTahminler = [];
  for (let day = 1; day <= 2; day += 1) {
    const d = new Date();
    d.setDate(d.getDate() + day);
    HOUR_WEIGHT.forEach((w, h) => {
      const beklenenGiris = Math.round(900 * w * (0.9 + r() * 0.2));
      saatlikTahminler.push({
        zamanEtiket: `${pad(d.getDate())}.${pad(d.getMonth() + 1)} ${pad(h)}:00`,
        beklenenGiris,
        yuksekYogunluk: w >= 0.85,
      });
    });
  }
  const zirve = saatlikTahminler.reduce((a, s) => (s.beklenenGiris > a.beklenenGiris ? s : a));
  const yuksek = saatlikTahminler.filter((s) => s.yuksekYogunluk).length;
  return {
    saatlikTahminler,
    toplamTahmin: saatlikTahminler.reduce((a, s) => a + s.beklenenGiris, 0),
    zirveGiris: zirve.beklenenGiris,
    zirveSaatEtiket: zirve.zamanEtiket,
    yuksekYogunlukSaat: yuksek,
    normalSaat: saatlikTahminler.length - yuksek,
  };
}

function securityAlerts() {
  const saatlikAlarmlar = Array.from({ length: 24 }, (_, h) => ({
    saatEtiket: `${pad(h)}:00`,
    clientSpoofing: h > 8 && h < 19 ? int(0, 6) : int(0, 2),
    offHours: h < 7 || h > 21 ? int(2, 11) : 0,
  }));
  const clientSpoofingCount = saatlikAlarmlar.reduce((a, s) => a + s.clientSpoofing, 0);
  const offHoursCount = saatlikAlarmlar.reduce((a, s) => a + s.offHours, 0);
  const topAlarmUretenler = NAMES.slice(0, 8)
    .map((n) => {
      const toplamAlarm = int(3, 24);
      return { email: email(n), toplamAlarm, spoofingAlarm: int(0, toplamAlarm) };
    })
    .sort((a, b) => b.toplamAlarm - a.toplamAlarm);
  return {
    toplamAlarm: clientSpoofingCount + offHoursCount,
    clientSpoofingCount,
    offHoursCount,
    etkilenenHesap: 37,
    saatlikAlarmlar,
    alarmTuruDagilimi: [
      { alarmTuru: "CLIENT_SPOOFING", sayi: clientSpoofingCount },
      { alarmTuru: "OFF_HOURS", sayi: offHoursCount },
    ],
    ipDagilimi: Array.from({ length: 6 }, () => ({ ipAdresi: ip(), sayi: int(4, 30) })).sort(
      (a, b) => b.sayi - a.sayi
    ),
    topAlarmUretenler,
  };
}

function userProfiles() {
  const users = NAMES.map((n) => ({
    email: email(n),
    toplamGiris: int(40, 620),
    riskSkoru: round1(r() * 0.9),
  }));
  users.forEach((u) => (u.yuksekRisk = u.riskSkoru > 0.7));
  const top = [...users].sort((a, b) => b.toplamGiris - a.toplamGiris).slice(0, 10);
  const yuksek = users.filter((u) => u.yuksekRisk).length;
  return {
    toplamKullanici: 4820,
    aktifKullaniciSayisi: 4820 - 96,
    yuksekRiskKullaniciSayisi: 96,
    yuksekRiskliSayisi: 96 + yuksek,
    toplamGiris: users.reduce((a, u) => a + u.toplamGiris, 0) * 40,
    ortalamRiskSkoru: 0.23,
    riskDagilimi: [
      { aralik: "0.0 - 0.2", sayi: 2950 },
      { aralik: "0.2 - 0.4", sayi: 1130 },
      { aralik: "0.4 - 0.6", sayi: 470 },
      { aralik: "0.6 - 0.8", sayi: 174 },
      { aralik: "0.8 - 1.0", sayi: 96 },
    ],
    enCokGirisYapanlar: top,
  };
}

function userSegments() {
  const users = NAMES.map((n, i) => {
    const clusterId = i % 7 === 0 ? 2 : i % 3 === 0 ? 1 : 0;
    const base = [
      [30, 2],
      [180, 4],
      [420, 11],
    ][clusterId];
    return {
      id: i + 1,
      email: email(n),
      clusterId,
      totalLogins: base[0] + int(0, base[0] / 2),
      uniqueIps: base[1] + int(0, 3),
    };
  });
  const ozet = (id, clusterEtiket, aciklama) => {
    const us = users.filter((u) => u.clusterId === id);
    return {
      clusterId: id,
      clusterEtiket,
      aciklama,
      kullaniciSayisi: us.length * 200,
      toplamGiris: us.reduce((a, u) => a + u.totalLogins, 0) * 200,
    };
  };
  return {
    list: users,
    dashboard: {
      clusterOzetleri: [
        ozet(0, "Ara sıra girenler", "Haftada birkaç oturum, tek cihaz."),
        ozet(1, "Düzenli kullanıcılar", "Her gün giriş, birkaç farklı ağdan."),
        ozet(2, "Yoğun / çok ağlı", "Çok sayıda oturum ve IP; güvenlik açısından izlenir."),
      ],
      scatterVerisi: users,
    },
  };
}

const trends = systemTrends();
const segments = userSegments();
const profiles = userProfiles();

const ROUTES = {
  "/api/v1/session/agg-system-trends/dashboard": () => trends.dashboard,
  "/api/v1/session/agg-system-trends/charts": () => trends.charts,
  "/api/v1/session/agg-system-trends": () => trends,
  "/api/v1/session/browser-os-stats/dashboard": browserOs,
  "/api/v1/session/client-analytics/dashboard": clientAnalytics,
  "/api/v1/session/client-transitions/dashboard": clientTransitions,
  "/api/v1/session/cohort-analysis/dashboard": cohort,
  "/api/v1/session/future-predictions/dashboard": futurePredictions,
  "/api/v1/session/peak-predictions/dashboard": peakPredictions,
  "/api/v1/session/security-alerts/dashboard": securityAlerts,
  "/api/v1/session/user-profiles/dashboard": () => profiles,
  "/api/v1/session/user-profiles": () => profiles.enCokGirisYapanlar,
  "/api/v1/session/user-segments/dashboard": () => segments.dashboard,
  "/api/v1/session/user-segments": () => segments.list,
};

// axios adapter: answers from ROUTES after a short fake network delay
export default async function mockAdapter(config) {
  const path = config.url.split("?")[0];
  const handler = ROUTES[path];
  await new Promise((res) => setTimeout(res, 250 + Math.random() * 350));
  if (!handler) {
    return Promise.reject({ response: { status: 404 }, message: `no mock for ${path}` });
  }
  return { data: handler(), status: 200, statusText: "OK", headers: {}, config };
}
