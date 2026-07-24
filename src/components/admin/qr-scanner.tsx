"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ScannerControls = { stop: () => void };

export function QrScanner() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<ScannerControls | null>(null);
  const router = useRouter();

  useEffect(() => {
    const video = videoRef.current;
    if (!open || !video) return;
    const videoElement: HTMLVideoElement = video;
    let cancelled = false;

    async function start() {
      try {
        const { BrowserQRCodeReader } = await import("@zxing/browser");
        const reader = new BrowserQRCodeReader();
        controlsRef.current = await reader.decodeFromVideoDevice(
          undefined,
          videoElement,
          (result) => {
            if (!result || cancelled) return;
            const raw = result.getText();
            let path = raw;
            try {
              path = new URL(raw).pathname;
            } catch {
              // A relative lookup path is also accepted.
            }
            const match = path.match(/^\/q\/([a-f0-9]{48})$/i);
            if (!match) {
              setError("This is not a valid YDF participant QR.");
              return;
            }
            controlsRef.current?.stop();
            setOpen(false);
            router.push(`/q/${match[1]}`);
          },
        );
      } catch {
        setError(
          "The camera could not start. Check browser permission or use search instead.",
        );
      }
    }

    void start();
    return () => {
      cancelled = true;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [open, router]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        className="rounded-full border border-accent/40 bg-accent/12 px-5 py-3 font-black text-accent"
      >
        Scan QR
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-near-black/90 p-4 backdrop-blur"
          role="dialog"
          aria-modal="true"
          aria-label="Scan participant QR"
        >
          <section className="brand-glass w-full max-w-xl rounded-[2rem] p-5 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-accent">
                  Camera scanner
                </p>
                <h2 className="mt-1 font-display text-3xl font-black">
                  Scan personal QR
                </h2>
              </div>
              <button
                type="button"
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
            <video
              ref={videoRef}
              className="mt-6 aspect-square w-full rounded-3xl bg-black object-cover"
              muted
              playsInline
            />
            {error && (
              <p className="mt-4 rounded-2xl bg-pink-red/10 p-4 text-sm text-pink-100">
                {error}
              </p>
            )}
            <p className="mt-4 text-sm leading-6 text-white/55">
              Camera access is used only in this browser window. No video is
              uploaded or stored.
            </p>
          </section>
        </div>
      )}
    </>
  );
}
