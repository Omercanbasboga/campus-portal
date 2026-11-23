import axios from "axios";
import { ROOT, units, byId, byUniq, pathTo, staff, students } from "./mockData";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
// no backend configured -> answer from the bundled sample university
const USE_MOCK = !BASE_URL || process.env.REACT_APP_USE_MOCK === "true";

const lower = (s) => (s || "").toLocaleLowerCase("tr-TR");

function pageOf(list, params = {}) {
  const page = Number(params.page || 0);
  const size = Number(params.size || 10);
  return {
    content: list.slice(page * size, page * size + size),
    totalElements: list.length,
    totalPages: Math.max(1, Math.ceil(list.length / size)),
    number: page,
    size,
  };
}

// a cleared select sends null or "", which means "no filter"
const isSet = (v) => v !== undefined && v !== null && v !== "";

function filterStaff(params = {}) {
  let list = staff;
  if (params.search) {
    const q = lower(params.search);
    list = list.filter((p) => lower(`${p.ad} ${p.soyad} ${p.kurumEmail}`).includes(q));
  }
  if (params.jobrecordTipi) {
    const types = String(params.jobrecordTipi).split(",");
    list = list.filter((p) => types.includes(p.jobrecordTipi));
  }
  if (isSet(params.emekliMi))
    list = list.filter((p) => p.emekliMi === (String(params.emekliMi) === "true"));
  if (params.ayrilmaTipi) list = list.filter((p) => p.ayrilmaTipi === params.ayrilmaTipi);
  if (isSet(params.isActive))
    list = list.filter((p) => p.isActive === (String(params.isActive) === "true"));
  return list;
}

function filterStudents(params = {}) {
  let list = students;
  if (params.search) {
    const q = lower(params.search);
    list = list.filter((s) =>
      lower(`${s.ad} ${s.soyad} ${s.ogrenciNo} ${s.okulEmail}`).includes(q)
    );
  }
  if (params.kayitlilik) list = list.filter((s) => s.kayitlilik === params.kayitlilik);
  if (isSet(params.yurtMu))
    list = list.filter((s) => s.yurtMu === (String(params.yurtMu) === "true"));
  if (isSet(params.disiplinCezasiVar))
    list = list.filter(
      (s) => s.disiplinCezasiVar === (String(params.disiplinCezasiVar) === "true")
    );
  if (params.bolum) list = list.filter((s) => s.bolumId === String(params.bolum));
  return list;
}

const subtreeIds = (u) => [u.uniqId, ...u.children.flatMap(subtreeIds)];
const latest = (list, key) => [...list].sort((a, b) => b[key].localeCompare(a[key])).slice(0, 8);
const strip = (u) => ({ ...u, children: u.children.map(strip) });

// [pattern, handler(match, params)] - first match wins
const ROUTES = [
  [
    /^\/api\/v1\/personel\/stats$/,
    () => ({
      sonEklenen: latest(staff, "createdAt"),
      sonGuncellenen: latest(staff, "updatedAt"),
      sonAyrilan: latest(
        staff.filter((x) => !x.isActive),
        "updatedAt"
      ),
    }),
  ],
  [
    /^\/api\/v1\/personel\/aktif$/,
    (_, p) =>
      pageOf(
        staff.filter((x) => x.isActive),
        p
      ),
  ],
  [/^\/api\/v1\/personel\/list$/, (_, p) => pageOf(filterStaff(p), p)],
  [
    /^\/api\/v1\/personel\/relatives\/(.+)$/,
    () => [
      {
        YakinAd: "Ali",
        YakinSoyad: "Örnek",
        YakinlikDerecesi: "Eşi",
        YakinCinsiyet: "Erkek",
        YakinDogumTarihi: "1984-05-12",
        YakinIsDurumu: "Çalışıyor",
        YakinTCKimlikNo: "•••••••1290",
      },
      {
        YakinAd: "Deniz",
        YakinSoyad: "Örnek",
        YakinlikDerecesi: "Çocuğu",
        YakinCinsiyet: "Kadın",
        YakinDogumTarihi: "2014-02-03",
        YakinIsDurumu: "Öğrenci",
        YakinTCKimlikNo: "•••••••4418",
      },
    ],
  ],
  [
    /^\/api\/v1\/personel\/([^/]+)\/personel(?:\/(idari|akademik))?$/,
    ([, deptId, kind]) => {
      const u = byId[deptId] || byUniq[deptId];
      if (!u) return [];
      const ids = new Set(subtreeIds(u));
      return staff.filter(
        (p) =>
          ids.has(p.birimId) &&
          (!kind ||
            (kind === "idari" ? p.jobrecordTipi !== "AKADEMIK" : p.jobrecordTipi === "AKADEMIK"))
      );
    },
  ],
  [/^\/api\/v1\/personel\/([^/]+)\/detay$/, ([, id]) => staff.find((x) => x.id === id) || null],
  [/^\/api\/v1\/personel\/([^/]+)$/, ([, id]) => staff.find((x) => x.id === id) || null],
  [
    /^\/api\/v1\/students\/stats$/,
    () => ({
      sonEklenen: latest(students, "createdAt"),
      sonGuncellenen: latest(students, "updatedAt"),
      sonAyrilan: latest(
        students.filter((x) => x.kayitlilik === "KAYITSIZ"),
        "updatedAt"
      ),
    }),
  ],
  [/^\/api\/v1\/students(?:\/list|\/aktif)?$/, (_, p) => pageOf(filterStudents(p), p)],
  [
    /^\/api\/v1\/students\/search$/,
    (_, p) => pageOf(filterStudents({ ...p, search: p.keyword }), p),
  ],
  [
    /^\/api\/v1\/students\/bolum\/([^/?]+)$/,
    ([, deptId], p) => {
      const u = byId[deptId] || byUniq[deptId];
      const ids = u ? new Set(subtreeIds(u)) : new Set();
      return pageOf(
        students.filter((s) => ids.has(s.bolumId)),
        p
      );
    },
  ],
  [/^\/api\/v1\/students\/([^/]+)$/, ([, id]) => students.find((x) => x.id === id) || null],
  [/^\/api\/departments\/tree$/, () => [strip(ROOT)]],
  [
    /^\/api\/departments\/hierarchy\/(.+)$/,
    ([, uniq]) => {
      const u = byUniq[uniq] || byId[uniq];
      return u
        ? pathTo(u).map((x, i, all) => ({ ...x, children: undefined, sequence: all.length - i }))
        : [];
    },
  ],
  [/^\/api\/departments\/([^/]+)\/tree$/, ([, id]) => (byId[id] ? strip(byId[id]) : null)],
  [
    /^\/api\/departments\/([^/]+)\/path$/,
    ([, id]) => (byId[id] ? pathTo(byId[id]).map((x) => ({ ...x, children: undefined })) : []),
  ],
  [
    /^\/api\/departments\/([^/]+)$/,
    ([, id]) => {
      const u = byId[id] || byUniq[id];
      return u ? { ...u, children: undefined, parentName: u.parentUnit } : null;
    },
  ],
];

function parseUrl(config) {
  const [path, qs] = config.url.split("?");
  const params = { ...Object.fromEntries(new URLSearchParams(qs || "")), ...(config.params || {}) };
  return { path, params };
}

async function mockAdapter(config) {
  const { path, params } = parseUrl(config);
  await new Promise((res) => setTimeout(res, 120 + Math.random() * 200));
  if ((config.method || "get").toLowerCase() !== "get") {
    // edits are accepted and echoed back; nothing is stored between reloads
    return {
      data: JSON.parse(config.data || "{}"),
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  }
  for (const [re, handler] of ROUTES) {
    const m = path.match(re);
    if (m) {
      const data = handler(m, params);
      if (data === null) break;
      return { data, status: 200, statusText: "OK", headers: {}, config };
    }
  }
  return Promise.reject({
    response: { status: 404, data: { message: `Kayıt bulunamadı: ${path}` } },
    message: "404",
    config,
  });
}

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  ...(USE_MOCK && { adapter: mockAdapter }),
});

export { units };
export default api;
