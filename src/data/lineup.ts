import type { Artist, PageIntro, PageSection } from "@/types/festival";

export const lineupPageIntro: PageIntro = {
  eyebrow: "Lineup",
  title: "Bachata artists and couples curated for a technique-rich first edition.",
  description:
    "From lady styling and sensual technique to BachaZouk, musicality, and social-floor confidence, the lineup is built around focused bachata learning and memorable dance nights.",
};

export const lineupGridSection: PageSection = {
  eyebrow: "Featured artists",
  title: "A lineup built around bachata technique, connection, and musical flow.",
  description:
    "Each artist brings a distinct bachata voice, from precise body mechanics and partner connection to musical improvisation and expressive styling.",
};

export const lineupPreviewSection: PageSection = {
  eyebrow: "Lineup preview",
  title: "Artists and couples shaping the bachata week.",
  description:
    "A first look at the teachers shaping the workshop rooms, socials, and bachata moments across the festival.",
  ctaLabel: "Meet the full lineup",
  ctaHref: "/lineup",
};

export const lineup: Artist[] = [
  {
    id: "mai-lala",
    name: "Mai Lala",
    category: "Instructor",
    location: "Cairo, Egypt 🇪🇬",
    styles: ["Lady Styling", "Body Isolations", "Sensual Bachata"],
    excerpt:
      "An Egyptian bachata instructor known for Lady Styling classes built around isolations, hip fluidity, and soft sensual elegance.",
    description: [
      "Mai Lala is an Egyptian bachata instructor who has built a unique artistic identity through her specialized Lady Styling classes.",
      "Her work focuses on body isolations, hip fluidity, and soft sensual elegance, empowering dancers to express their own personality through the music.",
    ],
  },
  {
    id: "nestoras-natalie",
    name: "Nestoras & Natalie",
    category: "Couple",
    location: "Cyprus 🇨🇾",
    styles: ["BachaZouk", "Bachata Sensual", "Zouk Flow"],
    excerpt:
      "Cyprus-based artists known for Bachazouk, blending Bachata Sensual foundations with authentic Zouk mechanics.",
    description: [
      "Where Bachata meets the flow of Zouk.",
      "Nestoras & Natalie are Bachata and Zouk artists based in Cyprus, known for their signature Bachazouk style. With strong foundations and certifications in Bachata Sensual, along with certified training in Zouk, they blend authentic Zouk mechanics with Bachata to create fluid, musical movement.",
      "Their teaching focuses on body control, technique, and partner connection, helping dancers develop smooth, powerful, and expressive movement on the dance floor.",
    ],
  },
  {
    id: "alex-tata",
    name: "Alex & Tata",
    category: "Couple",
    location: "Tbilisi, Georgia 🇬🇪",
    styles: ["ConRi Style", "Technique", "Dominican Influences"],
    excerpt:
      "Certified ConRi Style ambassadors and competition winners bringing precise, technical bachata classes from Tbilisi.",
    description: [
      "Alex & Tata have been dancing and teaching together for 3 years in Tbilisi, Georgia.",
      "They are certified instructors and official ambassadors of ConRi Style, winners of the Social Media Dance Contest 2025, and recent winners of the bachata qualifier to compete in the world finals in Geneva.",
      "Alex is the Champion of Bachata Caucasus Championship 2023. Tata is the winner of Gatica's \"Drama\" Challenge.",
      "With backgrounds in ballroom, contemporary, ballet, and hip-hop, they mix sensual, zouk, and Dominican bachata influences in their dance.",
      "Expect precise, technical classes full of exercises and breakdowns designed to upgrade dancers' technique and confidence.",
    ],
  },
  {
    id: "murad-ella",
    name: "Murad & Ella",
    category: "Couple",
    location: "Armenia 🇦🇲",
    styles: ["BachaZouk", "Bachata Sensual", "Detailed Technique"],
    excerpt:
      "Co-founders of Baila Bachata dance school, teaching detailed BachaZouk with deep social dance and stage experience.",
    description: [
      "Murad has 10 years of social dance experience and 5 years of teaching experience. He is the co-founder of Baila Bachata dance school and has taught at festivals in different countries. His style includes bachata sensual, bachazouk, salsa, and kizomba, with a very detailed and profound teaching approach.",
      "Ella has more than 20 years of dance experience across ballroom, contemporary, and social dance, and around 6 years of teaching experience. She is the co-founder of Baila Bachata dance school. Her love for bachata began 9 years ago when she first entered a Latin club.",
      "Ella is the winner of SeaSky Social Dance Competition 2018 and Latin Crazy Tribe J&J PRO Competition 2025.",
      "Together, they teach one of today's most trending bachata styles - BachaZouk, their number one love.",
    ],
  },
  {
    id: "adrian-virginia",
    name: "Adrián & Virginia",
    category: "Couple",
    location: "Madrid, Spain 🇪🇸",
    styles: ["Bachata Flavour", "Musicality", "Improvisation"],
    excerpt:
      "Madrid-based artists sharing Bachata Flavour, a musical blend of traditional and sensual bachata with dynamic energy changes.",
    description: [
      "Adrián and Virginia have been dancing together for 3 years and are currently based in Madrid, Spain.",
      "They share their own style, Bachata Flavour - a blend of traditional and sensual bachata with a strong focus on musicality, dynamics, and energy changes.",
      "Although they have competed in choreography competitions, their true passion is improvisation and Jack & Jill, where they have earned awards at international events.",
      "They love creating a fun, musical, and inspiring experience both on and off the dance floor.",
    ],
  },
  {
    id: "ramon-andrea",
    name: "Ramón & Andrea",
    category: "Couple",
    location: "Madrid, Spain 🇪🇸",
    styles: ["Bachata New Generation", "Sensual Technique", "Musicality"],
    excerpt:
      "Madrid-based Bachata New Generation artists focused on advanced sensual technique, fusion, flow, and partner connection.",
    description: [
      "Ramón & Andrea are a dance couple based in Madrid, Spain, specializing in Bachata New Generation Style.",
      "Their main focus is advanced sensual technique, incorporating elements of Zouk and fusion, partner connection, movement flow, and musicality.",
      "They develop their work through demos, social dancing, and events, always emphasizing deep connection, musical interpretation, and the overall quality of partner dancing.",
      "Festival participants should not miss the chance to learn from them and dance with them at the parties.",
    ],
  },
];
