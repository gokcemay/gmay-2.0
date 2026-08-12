export const profileLinks = {
  linkedin: "https://www.linkedin.com/in/gmehmetay",
  youtube: "https://www.youtube.com/@GokceAY",
  substack: "https://gmehmetay.substack.com",
  avesis: "https://avesis.ogu.edu.tr/gma",
  scholar: "https://scholar.google.com/citations?hl=tr&user=Pq5x1iYAAAAJ",
  orcid: "https://orcid.org/0000-0001-8354-5070",
} as const;

export const emails = {
  academic: "gma@ogu.edu.tr",
  general: "gmehmetay@gmail.com",
} as const;

export const academicProfiles = [
  { label: "AVESIS", href: profileLinks.avesis },
  { label: "Google Scholar", href: profileLinks.scholar },
  { label: "ORCID", href: profileLinks.orcid },
];

export const professionalProfiles = [
  { label: "LinkedIn", href: profileLinks.linkedin },
  ...academicProfiles,
];

export const book = {
  shortTitle: "Makine Mühendisleri için 100 Prompt",
  fullTitle:
    "Makine Mühendisleri için 100 Prompt: Dijital Dönüşüm ve Endüstri 4.0 Rehberi",
  author: "Dr. Gökçe Mehmet Ay",
  url: "https://play.google.com/store/books/details?id=rRVaEQAAQBAJ",
  coverAlt:
    "Makine Mühendisleri için 100 Prompt: Dijital Dönüşüm ve Endüstri 4.0 Rehberi kitap kapağı",
} as const;
