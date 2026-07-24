"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type ClickRipple = {
  id: number;
  left: number;
  top: number;
  width: number;
  height: number;
  x: number;
  y: number;
  size: number;
  borderRadius: string;
};

type PendingNavigation = {
  fromPath: string;
};

const RIPPLE_DURATION_MS = 720;
const NAVIGATION_TIMEOUT_MS = 15_000;

function getInteractiveSurface(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;

  const surface = target.closest<HTMLElement>(
    "button, a[href], [role='button']",
  );

  if (
    !surface ||
    surface.matches(":disabled") ||
    surface.getAttribute("aria-disabled") === "true"
  ) {
    return null;
  }

  return surface;
}

export function NavigationFeedback() {
  const pathname = usePathname();
  const [ripples, setRipples] = useState<ClickRipple[]>([]);
  const [navigation, setNavigation] = useState<PendingNavigation | null>(null);
  const nextRippleId = useRef(0);
  const rippleTimers = useRef(new Set<number>());
  const navigationTimer = useRef<number | null>(null);

  const navigationIsPending =
    navigation !== null && navigation.fromPath === pathname;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("ydf-navigation-pending", navigationIsPending);

    return () => {
      root.classList.remove("ydf-navigation-pending");
    };
  }, [navigationIsPending]);

  useEffect(() => {
    const activeRippleTimers = rippleTimers.current;

    const removeRippleLater = (id: number) => {
      const timer = window.setTimeout(() => {
        setRipples((current) => current.filter((ripple) => ripple.id !== id));
        activeRippleTimers.delete(timer);
      }, RIPPLE_DURATION_MS);

      activeRippleTimers.add(timer);
    };

    const addRipple = (
      surface: HTMLElement,
      clientX?: number,
      clientY?: number,
    ) => {
      const rect = surface.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const x =
        clientX === undefined ? rect.width / 2 : clientX - rect.left;
      const y =
        clientY === undefined ? rect.height / 2 : clientY - rect.top;
      const radius = Math.hypot(
        Math.max(x, rect.width - x),
        Math.max(y, rect.height - y),
      );
      const id = nextRippleId.current++;

      setRipples((current) => [
        ...current.slice(-5),
        {
          id,
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          x,
          y,
          size: radius * 2,
          borderRadius: window.getComputedStyle(surface).borderRadius,
        },
      ]);
      removeRippleLater(id);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const surface = getInteractiveSurface(event.target);
      if (surface) addRipple(surface, event.clientX, event.clientY);
    };

    const handleClick = (event: MouseEvent) => {
      const surface = getInteractiveSurface(event.target);

      // Keyboard-activated controls do not emit a pointer event.
      if (surface && event.detail === 0) addRipple(surface);

      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = surface?.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (
        anchor.hasAttribute("download") ||
        (anchor.target && anchor.target !== "_self")
      ) {
        return;
      }

      const destination = new URL(anchor.href, window.location.href);
      if (
        destination.origin !== window.location.origin ||
        destination.pathname === window.location.pathname
      ) {
        return;
      }

      if (navigationTimer.current !== null) {
        window.clearTimeout(navigationTimer.current);
      }

      setNavigation({ fromPath: window.location.pathname });
      navigationTimer.current = window.setTimeout(() => {
        setNavigation(null);
        navigationTimer.current = null;
      }, NAVIGATION_TIMEOUT_MS);
    };

    // Capture phase keeps feedback immediate even when a component stops
    // propagation or Next.js handles the navigation during its own click event.
    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("click", handleClick, true);

      activeRippleTimers.forEach((timer) => window.clearTimeout(timer));
      activeRippleTimers.clear();

      if (navigationTimer.current !== null) {
        window.clearTimeout(navigationTimer.current);
      }
    };
  }, []);

  return (
    <>
      <span className="sr-only" role="status" aria-live="polite">
        {navigationIsPending ? "Loading page" : ""}
      </span>

      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ydf-click-ripple"
          aria-hidden="true"
          style={{
            left: ripple.left,
            top: ripple.top,
            width: ripple.width,
            height: ripple.height,
            borderRadius: ripple.borderRadius,
          }}
        >
          <span
            style={{
              left: ripple.x - ripple.size / 2,
              top: ripple.y - ripple.size / 2,
              width: ripple.size,
              height: ripple.size,
            }}
          />
        </span>
      ))}
    </>
  );
}
