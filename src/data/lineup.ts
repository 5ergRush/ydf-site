import type {
  Artist,
  LineupPoster,
  PageIntro,
  PageSection,
} from "@/types/festival";

export const lineupPoster: LineupPoster = {
  src: "/images/full-lineup.png",
  alt: "Full bachata lineup poster for Yerevan Dance Festival",
  width: 476,
  height: 497,
};

export const lineupPageIntro: PageIntro = {
  eyebrow: "Lineup",
  title: "Meet the full bachata lineup",
  description:
    "Hover or tap an artist to explore their background, style, and festival role.",
};

export const lineupPosterSection: PageSection = {
  eyebrow: "Lineup",
  title: "Meet the full bachata lineup",
  description:
    "Hover or tap an artist to explore their background, style, and festival role.",
};

export const lineupGridSection = lineupPosterSection;

export const lineupPreviewSection: PageSection = {
  eyebrow: "Lineup preview",
  title: "Artists and couples shaping the bachata week.",
  description:
    "A first look at the teachers shaping the workshop rooms, socials, and bachata moments across the festival.",
  ctaLabel: "Meet the full lineup",
  ctaHref: "/lineup",
};

// Hit areas are intentionally forgiving for touch and keyboard focus. Spotlight
// positions are separate, temporary presentation coordinates for the
// low-resolution poster and use poster-wide 0..100 SVG coordinates. Retune them
// after the final high-resolution poster lands.
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
    hotspot: {
      hitArea: {
        x: 0,
        y: 57,
        width: 29,
        height: 41,
      },
      spotlight: {
        beamStartX: 20,
        beamStartY: -12,
        targetX: 13,
        targetY: 82,
        beamTopWidth: 18,
        beamBottomWidth: 28,
        poolWidth: 31,
        poolHeight: 32,
        labelX: 19,
        labelY: 65,
        labelPlacement: "right",
      },
      zIndex: 6,
    },
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
    hotspot: {
      hitArea: {
        x: 36,
        y: 20,
        width: 31,
        height: 36,
      },
      spotlight: {
        beamStartX: 51,
        beamStartY: -14,
        targetX: 54,
        targetY: 41,
        beamTopWidth: 17,
        beamBottomWidth: 33,
        poolWidth: 39,
        poolHeight: 27,
        labelX: 54,
        labelY: 58,
        labelPlacement: "bottom",
      },
      zIndex: 3,
    },
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
    hotspot: {
      hitArea: {
        x: 0,
        y: 27,
        width: 35,
        height: 36,
      },
      spotlight: {
        beamStartX: 12,
        beamStartY: -13,
        targetX: 17,
        targetY: 45,
        beamTopWidth: 18,
        beamBottomWidth: 34,
        poolWidth: 38,
        poolHeight: 29,
        labelX: 17,
        labelY: 28,
        labelPlacement: "top",
      },
      zIndex: 4,
    },
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
    hotspot: {
      hitArea: {
        x: 17,
        y: 49,
        width: 42,
        height: 49,
      },
      spotlight: {
        beamStartX: 42,
        beamStartY: -12,
        targetX: 36,
        targetY: 77,
        beamTopWidth: 19,
        beamBottomWidth: 42,
        poolWidth: 44,
        poolHeight: 36,
        labelX: 37,
        labelY: 54,
        labelPlacement: "top",
      },
      zIndex: 7,
    },
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
    hotspot: {
      hitArea: {
        x: 55,
        y: 54,
        width: 45,
        height: 44,
      },
      spotlight: {
        beamStartX: 77,
        beamStartY: -12,
        targetX: 76,
        targetY: 81,
        beamTopWidth: 22,
        beamBottomWidth: 46,
        poolWidth: 48,
        poolHeight: 34,
        labelX: 75,
        labelY: 61,
        labelPlacement: "top",
      },
      zIndex: 8,
    },
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
    hotspot: {
      hitArea: {
        x: 67,
        y: 25,
        width: 33,
        height: 34,
      },
      spotlight: {
        beamStartX: 88,
        beamStartY: -13,
        targetX: 84,
        targetY: 44,
        beamTopWidth: 20,
        beamBottomWidth: 35,
        poolWidth: 38,
        poolHeight: 28,
        labelX: 84,
        labelY: 63,
        labelPlacement: "bottom",
      },
      zIndex: 5,
    },
  },
];
