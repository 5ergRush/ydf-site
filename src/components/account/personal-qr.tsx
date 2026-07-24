"use client";

import { QRCodeSVG } from "qrcode.react";

export function PersonalQr({ value }: { value: string }) {
  return (
    <div className="inline-flex rounded-[1.75rem] bg-white p-5 shadow-[0_20px_60px_rgb(18_0_20_/_0.35)]">
      <QRCodeSVG
        value={value}
        size={208}
        level="H"
        marginSize={1}
        title="Personal YDF lookup QR code"
      />
    </div>
  );
}
