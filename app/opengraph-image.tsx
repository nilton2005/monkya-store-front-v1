import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Monkya E-commerce Store";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const siteName = process.env.SITE_NAME || "Monkya E-commerce Store";

  return new ImageResponse(
    (
      <div
        style={{
          background: "black",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #404040",
            width: 160,
            height: 160,
            borderRadius: 24,
          }}
        >
          <svg width="64" height="58" viewBox="0 0 32 28" fill="white">
            <path d="M21.5758 9.75769L16 0L0 28H11.6255L21.5758 9.75769Z" />
            <path d="M26.2381 17.9167L20.7382 28H32L26.2381 17.9167Z" />
          </svg>
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 60,
            fontWeight: 700,
            color: "white",
          }}
        >
          {siteName}
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
