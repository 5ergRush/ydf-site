"use client";

import { useEffect, useId, useRef } from "react";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      theme: "dark";
    },
  ) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function Turnstile({ siteKey }: { siteKey: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<string | null>(null);
  const inputId = useId();

  useEffect(() => {
    let cancelled = false;

    function renderWidget() {
      if (
        cancelled ||
        widgetRef.current ||
        !containerRef.current ||
        !window.turnstile
      ) {
        return;
      }

      widgetRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: "dark",
        callback(token) {
          const input = document.getElementById(inputId) as HTMLInputElement;
          input.value = token;
        },
        "expired-callback"() {
          const input = document.getElementById(inputId) as HTMLInputElement;
          input.value = "";
        },
      });
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-ydf-turnstile="true"]',
    );
    if (existing) {
      if (window.turnstile) renderWidget();
      else existing.addEventListener("load", renderWidget, { once: true });
    } else {
      const script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.dataset.ydfTurnstile = "true";
      script.addEventListener("load", renderWidget, { once: true });
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      if (widgetRef.current && window.turnstile) {
        window.turnstile.remove(widgetRef.current);
        widgetRef.current = null;
      }
    };
  }, [inputId, siteKey]);

  return (
    <>
      <input id={inputId} name="captchaToken" type="hidden" />
      <div ref={containerRef} className="min-h-[65px]" />
    </>
  );
}
