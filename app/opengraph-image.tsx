import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.fullName} — moda feminina e masculina em ${site.address.city}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#171717",
          color: "#F7F4EE",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 96, letterSpacing: 26, marginRight: -26 }}>LEQUARTTIÊ</div>
        <div style={{ width: 180, height: 1, background: "rgba(247,244,238,0.4)", margin: "36px 0" }} />
        <div style={{ fontSize: 22, letterSpacing: 12, textTransform: "uppercase", color: "#A99D90" }}>
          Magasin de Mode · Feminino & Masculino
        </div>
        <div style={{ position: "absolute", bottom: 48, fontSize: 20, letterSpacing: 4, color: "rgba(247,244,238,0.55)" }}>
          {`${site.address.city} – ${site.address.state}`}
        </div>
      </div>
    ),
    size,
  );
}
