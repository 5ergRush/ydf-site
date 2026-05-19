export type NavItem = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type Stat = {
  value: string;
  label: string;
};

export type HighlightItem = {
  title: string;
  description: string;
};

export type PageIntro = {
  eyebrow: string;
  title: string;
  description: string;
};

export type PageSection = PageIntro & {
  ctaLabel?: string;
  ctaHref?: string;
};

export type LineupHitArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type LineupSpotlight = {
  beamStartX: number;
  beamStartY: number;
  targetX: number;
  targetY: number;
  beamTopWidth: number;
  beamBottomWidth: number;
  poolWidth: number;
  poolHeight: number;
  labelX: number;
  labelY: number;
  labelPlacement?: "left" | "right" | "top" | "bottom";
};

export type LineupHotspot = {
  hitArea: LineupHitArea;
  spotlight: LineupSpotlight;
  zIndex?: number;
};

export type LineupPoster = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type HeroContent = PageIntro & {
  primaryCta: NavItem;
  secondaryCta: NavItem;
};

export type FestivalInfo = {
  name: string;
  shortName: string;
  tagline: string;
  dates: string;
  location: string;
  siteUrl: string;
  contactEmail: string;
  navigation: NavItem[];
  socials: SocialLink[];
  hero: HeroContent;
  about: PageIntro & {
    highlights: HighlightItem[];
  };
  stats: Stat[];
  finalCta: PageIntro & {
    note: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    contactHeading: string;
    socialsHeading: string;
  };
};

export type Artist = {
  id: string;
  name: string;
  category: "Couple" | "DJ" | "Instructor";
  location: string;
  image?: string;
  imageAlt?: string;
  styles: string[];
  excerpt: string;
  description: string[];
  hotspot: LineupHotspot;
};

export type Venue = {
  id: string;
  name: string;
  area: string;
  address: string;
  description: string;
  spaces: string[];
  mapLabel: string;
};
