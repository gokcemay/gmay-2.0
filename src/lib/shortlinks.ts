/**
 * Legacy gmay.me short links (migrated from Netlify).
 *
 * How to add a new short link:
 *   1. Add one entry below: `SHORTCODE: "https://destination"`.
 *      The key IS the URL path segment and is case-sensitive (/KBT !== /kbt).
 *   2. Keep the destination URL exactly as issued — never strip query strings.
 *   3. Nothing else to do: /<SHORTCODE> is served by src/routes/$shortCode.tsx
 *      with an HTTP 302 redirect. Real app routes always win over short codes.
 *
 * Note: /CV is intentionally retired and must NOT be added here.
 */
export const shortLinks: Record<string, string> = {
  anket1: "https://forms.gle/bdjGZ9Ptq66pdEfc8",
  Makina: "https://prezi.com/view/6m5m3w4OdunAPSe006Hn/",
  LaTeX:
    "https://drive.google.com/file/d/11D5dZjB2OS-Cvbk2KS5uTSVg_uo-mTPY/view?usp=sharing",
  UA: "https://open.spotify.com/show/43yke9lz09liSqmEOTq9iM",
  F360: "https://www.tasarimveteknik.com/yeni-megep-materyalleri-fusion/",
  F360KUR:
    "https://www.autodesk.com.tr/products/fusion-360/students-teachers-educators",
  Yaglama:
    "https://drive.google.com/file/d/1YuNSS_nAKgyJklUNDhAR5mrT7E6SyPtr/view?usp=sharing",
  HSKobo: "https://www.kobo.com/tr/en/ebook/hekate-deki-sr",
  HSGoogle:
    "https://play.google.com/store/books/details/G%C3%B6k%C3%A7e_Mehmet_AY_Hekate_deki_S%C4%B1r?id=AtaRDwAAQBAJ",
  cikti:
    "https://docs.google.com/document/d/1VcYTvdapbd03NA92U4hJJJ3DORjjrwAGqJ6qqaxHqS4/edit?usp=sharing",
  ders: "https://drive.google.com/open?id=1T9va3XiVl7GJc-8W_UHKfS6J9qxL0TTS",
  EV: "https://drive.google.com/open?id=1MeBtaeSerUElxgEOMvI-aEcs12WoSmYy8f0VAytqRok",
  "EV-PVD":
    "https://drive.google.com/drive/folders/17NFXmSoZyrWmaYr_KiDVTNcmHeQPJ9ub?usp=sharing",
  BDT: "https://drive.google.com/file/d/1TgH3dYfsgXzLSPrbPf721g2fvg2hJydo/view?usp=sharing",
  StoaSunum:
    "https://docs.google.com/presentation/d/1fBkR0NScsTXLg5P1lQmykBzSYt782kPtFQ9ErHiLqdQ/edit?usp=sharing",
  TKT: "https://drive.google.com/file/d/1H_uDfrtFsYMvOhFl3pYOIjiMVymgMW_m/view?usp=sharing",
  "BDT-13H":
    "https://drive.google.com/drive/folders/15Ygjbl7rdvvOGacizHTIAuikwnwRjmL1?usp=sharing",
  BDT2025B:
    "https://drive.google.com/drive/folders/1jzCrrwPTsmMO7Kx6O6gYxSqSFDKAbnip?usp=sharing",
  BDTTekDers2025:
    "https://drive.google.com/drive/folders/1jzCrrwPTsmMO7Kx6O6gYxSqSFDKAbnip?usp=sharing",
  Erasmus:
    "https://docs.google.com/presentation/d/1r8w_8F-UsNnHy7ns11o6YxoVTIBY8dQgXThJvq5IeHs/edit?usp=sharing",
  KBT: "https://www.kitapyurdu.com/kitap/kanyonaltinda-bir-tekinsiz/609790.html",
  Final:
    "https://drive.google.com/drive/folders/1C9dxbtYGs_64Gb_MKg_yVgukWCbAX5Xr?usp=sharing",
  CVEN: "https://drive.google.com/file/d/10McC8gHiIbJQvEov_euP9pjQVbD90QmO/view?usp=sharing",
  Final2022S3:
    "https://drive.google.com/drive/folders/1V0cp8F6zvmn6dWIh1KB3gsu46LFSgspq?usp=sharing",
  MuhMlzYaz:
    "https://drive.google.com/file/d/16PEj_2BXCHwMNOOX8G92E5PxzxfTr9gl/view?usp=sharing",
  MlzFoy:
    "https://drive.google.com/file/d/1QfwbQoymFxidx1C9NpQ2TuKV1G-81j8Z/view?usp=sharing",
  Q1H: "https://forms.gle/ukVKN8AhebWfxvni8",
  DR23: "https://drive.google.com/file/d/10cDQzd7XK-kM3xapx1RcCjsIAtRTeG62/view?usp=share_link",
  Ofis: "https://calendar.app.google/duiyXFDkiCtcXiVv9",
  ETTOM:
    "https://docs.google.com/presentation/d/1vAKTXyp9ENMB3co6ZGapqeVD7cYPwy_nrjwJtUdvvAI/edit?usp=sharing",
  F2026:
    "https://drive.google.com/drive/folders/1lFoGZvRYRztS9yB8LX7MBd4E-VMQahkQ?usp=sharing",
  YZEgitim:
    "https://esogusem.ogu.edu.tr/egitim/uretken-yapay-zeka-kullanimi-egitimi/",
  YZESOGU:
    "https://drive.google.com/file/d/1XMDm00p4SlvSE9aDI0OHmhE9v9l70pGB/view?usp=sharing",
  YZKitap: "https://play.google.com/store/books/details?id=rRVaEQAAQBAJ",
  SP: "https://gmehmetay.gumroad.com/l/StratejikPusula?_gl=1*7uy42g*_ga*MTg0MjU1NDk0NS4xNzQ5NzE1NTcx*_ga_6LJN6D94N6*czE3NDk3MzAzMzgkbzMkZzEkdDE3NDk3MzAzNDckajUxJGwwJGgw",
  K5: "https://drive.google.com/file/d/143ncHsd70GA0F0IB7CJlrrQkojXjPIWd/view?usp=drive_link",
  YZMMO: "https://drive.google.com/file/d/1FLcRSjT-FgiH40g3g0Ec0tsgsHhiGZ58/view?usp=sharing",
  MBA25: "https://drive.google.com/file/d/1YRNBGVHPrxBHRvr74fxliiOa93A7xb3V/view?usp=sharing",
  BME: "https://drive.google.com/file/d/1-YARUXIyB-W-7FcGogl9sCyBK5rlQsTx/view?usp=sharing",
  ETTOM1: "https://drive.google.com/file/d/1NjJx4tm-aSwRiHWSg7QMnd83ZdV1iZIH/view?usp=sharing",
  IBK19: "https://drive.google.com/file/d/1RTy91-Y8FmVvwDnHOESgSKME2Kq46Rty/view?usp=sharing",
  T25: "https://drive.google.com/file/d/1lTHz1_IToq7uuPaKqXoe_zyCif20x3Hl/view?usp=sharing",
  TURAN26:
    "https://drive.google.com/drive/folders/1NPH_xihIdDTw6JTANSAWKkgZa3i5vQUU?usp=sharing",
  darbogaz: "https://drive.google.com/file/d/12s1ovCWsA0NhZgkDhW9uZ504Y4CNkhxl/view?usp=sharing",
  kayit: "https://tally.so/r/ODx7b8"
};

export function resolveShortLink(code: string): string | undefined {
  return Object.prototype.hasOwnProperty.call(shortLinks, code)
    ? shortLinks[code]
    : undefined;
}
