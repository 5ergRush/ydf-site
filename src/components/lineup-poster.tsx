"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type {
  Artist,
  LineupPoster as LineupPosterData,
  LineupSpotlight,
} from "@/types/festival";

type LineupPosterProps = {
  artists: Artist[];
  poster: LineupPosterData;
};

const focusableSelector =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
const posterImageSizes =
  "(min-width: 1280px) 860px, (min-width: 768px) 82vw, 100vw";
const activePosterOverlayFill = "rgba(12, 0, 24, 0.64)";
const spotlightBeamFill = "rgba(255, 232, 180, 0.055)";
const spotlightPoolFill = "rgba(255, 196, 117, 0.07)";
const spotlightRevealFilter =
  "brightness(1.08) contrast(1.04) saturate(1.05)";

function getDecodedLocationHash() {
  const hash = window.location.hash.slice(1);

  if (!hash) {
    return "";
  }

  try {
    return decodeURIComponent(hash);
  } catch {
    return "";
  }
}

function getBeamPath(spotlight: LineupSpotlight) {
  const topLeft = spotlight.beamStartX - spotlight.beamTopWidth / 2;
  const topRight = spotlight.beamStartX + spotlight.beamTopWidth / 2;
  const bottomLeft = spotlight.targetX - spotlight.beamBottomWidth / 2;
  const bottomRight = spotlight.targetX + spotlight.beamBottomWidth / 2;
  const bottomY = spotlight.targetY + spotlight.poolHeight * 0.28;
  const controlY = spotlight.beamStartY + (spotlight.targetY - spotlight.beamStartY) * 0.42;
  const lean = (spotlight.targetX - spotlight.beamStartX) * 0.18;

  return [
    `M ${topLeft} ${spotlight.beamStartY}`,
    `C ${topLeft + lean} ${controlY} ${bottomLeft} ${spotlight.targetY - 8} ${bottomLeft} ${bottomY}`,
    `L ${bottomRight} ${bottomY}`,
    `C ${bottomRight} ${spotlight.targetY - 8} ${topRight + lean} ${controlY} ${topRight} ${spotlight.beamStartY}`,
    "Z",
  ].join(" ");
}

function getRevealStyle(spotlight: LineupSpotlight): CSSProperties {
  const revealWidth = Math.max(spotlight.poolWidth * 0.62, 18);
  const revealHeight = Math.max(spotlight.poolHeight * 0.78, 16);
  const revealMask = [
    `radial-gradient(ellipse ${revealWidth}% ${revealHeight}%`,
    `at ${spotlight.targetX}% ${spotlight.targetY}%,`,
    "rgba(0, 0, 0, 1) 0%,",
    "rgba(0, 0, 0, 0.98) 42%,",
    "rgba(0, 0, 0, 0.58) 68%,",
    "transparent 100%)",
  ].join(" ");

  return {
    filter: spotlightRevealFilter,
    maskImage: revealMask,
    maskRepeat: "no-repeat",
    WebkitMaskImage: revealMask,
    WebkitMaskRepeat: "no-repeat",
  };
}

function getLabelTransform(placement: LineupSpotlight["labelPlacement"]) {
  switch (placement) {
    case "left":
      return "translate(calc(-100% - 0.75rem), -50%)";
    case "right":
      return "translate(0.75rem, -50%)";
    case "top":
      return "translate(-50%, calc(-100% - 0.75rem))";
    case "bottom":
    default:
      return "translate(-50%, 0.75rem)";
  }
}

export function LineupPoster({ artists, poster }: LineupPosterProps) {
  const [activeArtistId, setActiveArtistId] = useState<string | null>(null);
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const [lastSpotlightArtistId, setLastSpotlightArtistId] = useState<
    string | null
  >(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const hotspotButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const selectedArtist = useMemo(
    () =>
      selectedArtistId
        ? artists.find((artist) => artist.id === selectedArtistId) ?? null
        : null,
    [artists, selectedArtistId],
  );
  const visualArtistId = activeArtistId ?? selectedArtistId;
  const renderedSpotlightArtistId = visualArtistId ?? lastSpotlightArtistId;
  const spotlightArtist = useMemo(
    () =>
      renderedSpotlightArtistId
        ? artists.find((artist) => artist.id === renderedSpotlightArtistId) ??
          null
        : null,
    [artists, renderedSpotlightArtistId],
  );
  const activeSpotlight = spotlightArtist?.hotspot.spotlight ?? null;
  const activeBeamPath = activeSpotlight ? getBeamPath(activeSpotlight) : "";
  const revealStyle = activeSpotlight
    ? getRevealStyle(activeSpotlight)
    : undefined;
  const spotlightIsActive = Boolean(visualArtistId);

  const closeModal = useCallback(() => {
    const restoreArtistId = selectedArtistId;
    setSelectedArtistId(null);
    setActiveArtistId(null);

    const currentHash = getDecodedLocationHash();
    if (artists.some((artist) => artist.id === currentHash)) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }

    window.setTimeout(() => {
      const previousTarget = lastFocusedRef.current;

      if (previousTarget?.isConnected) {
        previousTarget.focus();
        return;
      }

      if (restoreArtistId) {
        hotspotButtonRefs.current[restoreArtistId]?.focus();
      }
    }, 0);
  }, [artists, selectedArtistId]);

  const openArtist = useCallback((artistId: string) => {
    if (
      document.activeElement instanceof HTMLElement &&
      document.activeElement !== document.body
    ) {
      lastFocusedRef.current = document.activeElement;
    }

    setLastSpotlightArtistId(artistId);
    setActiveArtistId(artistId);
    setSelectedArtistId(artistId);
  }, []);

  useEffect(() => {
    const openFromHash = () => {
      const artistId = getDecodedLocationHash();
      const artist = artists.find((lineupArtist) => lineupArtist.id === artistId);

      if (!artist) {
        setActiveArtistId(null);
        setSelectedArtistId(null);
        return;
      }

      lastFocusedRef.current = hotspotButtonRefs.current[artist.id] ?? null;
      setLastSpotlightArtistId(artist.id);
      setActiveArtistId(artist.id);
      setSelectedArtistId(artist.id);
    };

    openFromHash();
    window.addEventListener("hashchange", openFromHash);

    return () => {
      window.removeEventListener("hashchange", openFromHash);
    };
  }, [artists]);

  useEffect(() => {
    if (!selectedArtistId) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) {
        return;
      }

      const focusableElements = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => element.offsetParent !== null);

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal, selectedArtistId]);

  return (
    <div className="relative mx-auto max-w-4xl">
      <div className="brand-glow relative overflow-hidden rounded-[2rem] border border-white/14 bg-near-black/70 p-2 shadow-[0_30px_90px_rgb(255_0_92_/_0.18)] sm:rounded-[2.5rem] sm:p-3">
        <div
          className="relative overflow-hidden rounded-[1.45rem] bg-[radial-gradient(circle_at_50%_18%,rgb(255_176_0_/_0.22),transparent_16rem),linear-gradient(135deg,#2a005f,#120014)] sm:rounded-[2rem]"
          style={{ aspectRatio: `${poster.width} / ${poster.height}` }}
        >
          <Image
            src={poster.src}
            alt={poster.alt}
            fill
            priority
            sizes={posterImageSizes}
            className="object-cover"
          />

          <div
            className={[
              "pointer-events-none absolute inset-0 z-10 transition-opacity duration-200 ease-out",
              spotlightIsActive ? "opacity-100" : "opacity-0",
            ].join(" ")}
            style={{ backgroundColor: activePosterOverlayFill }}
            aria-hidden="true"
          />

          {activeSpotlight ? (
            <div
              className={[
                "pointer-events-none absolute inset-0 z-20 transition-opacity duration-200 ease-out",
                spotlightIsActive ? "opacity-100" : "opacity-0",
              ].join(" ")}
              style={revealStyle}
              aria-hidden="true"
            >
              <Image
                src={poster.src}
                alt=""
                fill
                sizes={posterImageSizes}
                className="object-cover"
              />
            </div>
          ) : null}

          {activeSpotlight ? (
            <svg
              aria-hidden="true"
              className={[
                "pointer-events-none absolute inset-0 z-30 transition-opacity duration-200 ease-out",
                spotlightIsActive ? "opacity-100" : "opacity-0",
              ].join(" ")}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="lineup-spotlight-beam"
                  gradientUnits="userSpaceOnUse"
                  x1={activeSpotlight.beamStartX}
                  y1={activeSpotlight.beamStartY}
                  x2={activeSpotlight.targetX}
                  y2={activeSpotlight.targetY}
                >
                  <stop offset="0" stopColor="#fff8df" stopOpacity="0.12" />
                  <stop offset="0.45" stopColor="#ffe7b0" stopOpacity="0.07" />
                  <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
                <radialGradient id="lineup-spotlight-pool">
                  <stop offset="0" stopColor="#fff0c8" stopOpacity="0.12" />
                  <stop offset="0.45" stopColor="#ffbf73" stopOpacity="0.045" />
                  <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
                <filter
                  id="lineup-spotlight-beam-blur"
                  filterUnits="userSpaceOnUse"
                  x="-20"
                  y="-20"
                  width="140"
                  height="140"
                >
                  <feGaussianBlur stdDeviation="3.8" />
                </filter>
                <filter
                  id="lineup-spotlight-pool-blur"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="1.8" />
                </filter>
              </defs>
              <path
                d={activeBeamPath}
                fill={spotlightBeamFill}
                filter="url(#lineup-spotlight-beam-blur)"
              />
              <path d={activeBeamPath} fill="url(#lineup-spotlight-beam)" />
              <ellipse
                cx={activeSpotlight.targetX}
                cy={activeSpotlight.targetY}
                rx={activeSpotlight.poolWidth / 2}
                ry={activeSpotlight.poolHeight / 2}
                fill={spotlightPoolFill}
                filter="url(#lineup-spotlight-pool-blur)"
              />
              <ellipse
                cx={activeSpotlight.targetX}
                cy={activeSpotlight.targetY}
                rx={activeSpotlight.poolWidth / 2}
                ry={activeSpotlight.poolHeight / 2}
                fill="url(#lineup-spotlight-pool)"
              />
            </svg>
          ) : null}

          {artists.map((artist) => {
            const isActive =
              activeArtistId === artist.id || selectedArtistId === artist.id;
            const hotspotStyle: CSSProperties = {
              left: `${artist.hotspot.hitArea.x}%`,
              top: `${artist.hotspot.hitArea.y}%`,
              width: `${artist.hotspot.hitArea.width}%`,
              height: `${artist.hotspot.hitArea.height}%`,
              zIndex: isActive ? 30 : artist.hotspot.zIndex ?? 1,
            };

            return (
              <button
                id={artist.id}
                key={artist.id}
                ref={(node) => {
                  hotspotButtonRefs.current[artist.id] = node;
                }}
                type="button"
                aria-label={`Open ${artist.name} details`}
                aria-haspopup="dialog"
                aria-controls={
                  selectedArtistId === artist.id
                    ? `${artist.id}-modal`
                    : undefined
                }
                aria-expanded={selectedArtistId === artist.id}
                className="absolute cursor-pointer touch-manipulation appearance-none rounded-2xl border-0 bg-transparent p-0 transition-all duration-300 ease-out focus-visible:outline-none sm:rounded-[1.35rem]"
                style={hotspotStyle}
                onMouseEnter={() => {
                  setLastSpotlightArtistId(artist.id);
                  setActiveArtistId(artist.id);
                }}
                onMouseLeave={() => {
                  if (selectedArtistId !== artist.id) {
                    setActiveArtistId(null);
                  }
                }}
                onFocus={() => {
                  setLastSpotlightArtistId(artist.id);
                  setActiveArtistId(artist.id);
                }}
                onBlur={() => {
                  if (selectedArtistId !== artist.id) {
                    setActiveArtistId(null);
                  }
                }}
                onClick={() => openArtist(artist.id)}
              />
            );
          })}

          {spotlightArtist && activeSpotlight ? (
            <div
              className={[
                "pointer-events-none absolute z-40 max-w-[13rem] transition-opacity duration-200 ease-out",
                spotlightIsActive ? "opacity-100" : "opacity-0",
              ].join(" ")}
              style={{
                left: `${activeSpotlight.labelX}%`,
                top: `${activeSpotlight.labelY}%`,
                transform: getLabelTransform(activeSpotlight.labelPlacement),
              }}
              aria-hidden="true"
            >
              <div className="rounded-2xl border border-white/22 bg-near-black/54 px-3 py-2 text-white shadow-[0_14px_36px_rgb(18_0_20_/_0.4)] backdrop-blur-md sm:px-4">
                <p className="truncate text-xs font-black uppercase tracking-[0.18em]">
                  {spotlightArtist.name}
                </p>
                <p className="mt-1 truncate text-[0.68rem] font-semibold text-white/68">
                  {spotlightArtist.category} - {spotlightArtist.location}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="pointer-events-none absolute -inset-x-4 -bottom-10 -z-10 h-28 rounded-full bg-[radial-gradient(ellipse_at_center,rgb(255_0_92_/_0.28),transparent_70%)] blur-2xl" />

      {selectedArtist ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-near-black/74 px-4 py-4 backdrop-blur-md sm:items-center sm:py-8"
          role="presentation"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            ref={modalRef}
            id={`${selectedArtist.id}-modal`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${selectedArtist.id}-modal-title`}
            aria-describedby={`${selectedArtist.id}-modal-description`}
            className="max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-[1.75rem] border border-white/16 bg-[linear-gradient(145deg,rgb(42_0_95_/_0.96),rgb(18_0_20_/_0.98))] p-6 shadow-[0_28px_90px_rgb(0_0_0_/_0.55)] sm:rounded-[2rem] sm:p-8"
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">
                  {selectedArtist.category}
                </p>
                <h3
                  id={`${selectedArtist.id}-modal-title`}
                  className="mt-3 font-display text-4xl font-black leading-tight text-white sm:text-5xl"
                >
                  {selectedArtist.name}
                </h3>
                <p className="mt-2 text-sm font-semibold text-white/68">
                  {selectedArtist.location}
                </p>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close artist details"
                className="shrink-0 rounded-full border border-white/16 bg-white/10 px-4 py-2 text-sm font-black text-white transition-colors hover:bg-white/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                onClick={closeModal}
              >
                X
              </button>
            </div>

            <ul
              aria-label={`${selectedArtist.name} styles`}
              className="mt-6 flex flex-wrap gap-2"
            >
              {selectedArtist.styles.map((style) => (
                <li key={style}>
                  <span className="rounded-full border border-accent/24 bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                    {style}
                  </span>
                </li>
              ))}
            </ul>

            <div
              id={`${selectedArtist.id}-modal-description`}
              className="mt-6 space-y-4 text-sm leading-7 text-white/76 sm:text-base sm:leading-8"
            >
              {selectedArtist.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
