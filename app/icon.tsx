import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Trait accent en haut à gauche */}
        <div
          style={{
            position: "absolute",
            top: 4,
            left: 4,
            width: 8,
            height: 2,
            background: "#00BFFF",
          }}
        />
        {/* Initiale E */}
        <div
          style={{
            color: "#ffffff",
            fontSize: 18,
            fontWeight: 900,
            fontFamily: "serif",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          E
        </div>
        {/* Point accent en bas à droite */}
        <div
          style={{
            position: "absolute",
            bottom: 5,
            right: 5,
            width: 4,
            height: 4,
            background: "#00BFFF",
            borderRadius: "50%",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
