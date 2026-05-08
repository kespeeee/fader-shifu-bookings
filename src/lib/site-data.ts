export const SITE = {
  name: "FaderShifu",
  fullName: "FS Barber Shop",
  tagline: "I make you win.",
  phone: "+372 5854 8877",
  email: "fadershifu@gmail.com",
  whatsapp: "+37258548877",
  instagram: "FaderShifu",
  address: "Tallinna mnt 36, 65605 Võru, Võrumaa, Estonia",
  // Lahtiolekuajad puuduvad — broneerimine vastavalt barberi vabadele aegadele
  hours: [] as { day: string; time: string }[],
};

export const SERVICES = [
  { name: "Lõikus / Fade", desc: "Täpne lõikus ja feid sinu stiili järgi.", price: "25 €" },
  { name: "Disain", desc: "Eraldi disainielement või muster lõikusele.", price: "+5 €" },
  { name: "Habe", desc: "Kontuurid, vormimine ja viimistlus.", price: "+5 €" },
  { name: "Kulmud", desc: "Korrektsioon ja puhas kontuur.", price: "+5 €" },
  { name: "Afterhours", desc: "Lõikus väljaspool tavalist aega.", price: "+5 €" },
];

export const TESTIMONIALS = [
  { name: "Marko T.", rating: 5, text: "Parim feid, mille olen saanud. Stefan teab täpselt mida teeb." },
  { name: "Karl R.", rating: 5, text: "Professionaalne suhtumine ja super tulemus. Soovitan kõigile!" },
  { name: "Henri L.", rating: 5, text: "Habemekontuur on alati täpselt selline nagu vaja." },
  { name: "Tõnu K.", rating: 5, text: "Atmosfäär on top, muusika hea ja lõikus veel parem." },
  { name: "Andre P.", rating: 5, text: "Olen proovinud paljusid kohti — siia ma jään." },
];

export const GALLERY_FILTERS = [
  { id: "all", label: "Kõik" },
  { id: "fades", label: "Feidid" },
  { id: "beards", label: "Habemed" },
  { id: "kids", label: "Lapsed" },
];

export const GALLERY = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  category: ["fades", "beards", "kids", "fades"][i % 4],
  title: ["Kõrge feid", "Habemekontuur", "Lastelõikus", "Tekstuur top"][i % 4],
}));
