export const SITE = {
  name: "FaderShifu",
  fullName: "FS Barber Shop",
  tagline: "Täpsed lõiked. Eliitfeidid.",
  phone: "+372 5555 5555",
  email: "info@fadershifu.ee",
  whatsapp: "+37255555555",
  instagram: "fadershifu",
  address: "Vana-Tallinna 12, 10115 Tallinn",
  hours: [
    { day: "Esmaspäev", time: "10:00 – 19:00" },
    { day: "Teisipäev", time: "10:00 – 19:00" },
    { day: "Kolmapäev", time: "10:00 – 19:00" },
    { day: "Neljapäev", time: "10:00 – 20:00" },
    { day: "Reede", time: "10:00 – 20:00" },
    { day: "Laupäev", time: "10:00 – 17:00" },
    { day: "Pühapäev", time: "Suletud" },
  ],
};

export const SERVICES = [
  { name: "Feid", desc: "Täpne kõrvalõikus klassikalisest tugevani.", price: "25 €" },
  { name: "Juukselõikus", desc: "Lõikus käärI ja masinaga, sinu stiili järgi.", price: "30 €" },
  { name: "Habeme trimmerdamine", desc: "Kontuurid, vormimine ja viimistlus.", price: "15 €" },
  { name: "Kontuuri lõikus", desc: "Sirged jooned, terav viimistlus.", price: "10 €" },
  { name: "Lastelõikus (kuni 12 a)", desc: "Mugav lõikus väiksematele klientidele.", price: "20 €" },
  { name: "Lõikus + habe", desc: "Täielik look — juuksed ja habe.", price: "40 €" },
  { name: "Pea raseerimine", desc: "Sile viimistlus terariistaga.", price: "20 €" },
  { name: "VIP pakett", desc: "Lõikus, habe, pesu ja stiil.", price: "55 €" },
];

export const TESTIMONIALS = [
  { name: "Marko T.", rating: 5, text: "Parim feid Tallinnas. Käin ainult FaderShifu juures juba 2 aastat." },
  { name: "Karl R.", rating: 5, text: "Professionaalne suhtumine ja super tulemus. Soovitan kõigile!" },
  { name: "Henri L.", rating: 5, text: "Habemekontuur on alati täpselt selline nagu vaja. Mees teab oma asja." },
  { name: "Tõnu K.", rating: 5, text: "Atmosfäär on top, muusika hea ja lõikus veel parem." },
  { name: "Andre P.", rating: 5, text: "Olen proovinud paljusid kohti — siia ma jään." },
];

export const GALLERY_FILTERS = [
  { id: "all", label: "Kõik" },
  { id: "fades", label: "Feidid" },
  { id: "beards", label: "Habemed" },
  { id: "kids", label: "Lapsed" },
];

// Placeholder images — replace with real photos later
export const GALLERY = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  category: ["fades", "beards", "kids", "fades"][i % 4],
  title: ["Kõrge feid", "Habemekontuur", "Lastelõikus", "Tekstuur top"][i % 4],
}));
