import { ImageResponse } from "next/og";
import { getOutfitBySlug } from "@/lib/supabase";

export const runtime = "edge";
export const alt = "Outfit Preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { outfit } = await getOutfitBySlug(slug);

  if (!outfit) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0a0a",
            color: "#f5f0e8",
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          ELITECLOTH
        </div>
      ),
      size
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#0a0a0a",
          position: "relative",
        }}
      >
        {/* Cover image */}
        <img
          src={outfit.cover_image_url}
          alt=""
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.6,
          }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.4) 50%, rgba(10,10,10,0.7) 100%)",
          }}
        />
        {/* Content */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "60px",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#EE4D2D",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 12,
            }}
          >
            ELITECLOTH
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: "#f5f0e8",
              lineHeight: 1.2,
              maxWidth: "80%",
            }}
          >
            {outfit.name}
          </div>
          <div
            style={{
              fontSize: 22,
              color: "rgba(245,240,232,0.5)",
              marginTop: 16,
              maxWidth: "70%",
            }}
          >
            {outfit.description?.slice(0, 100)}
          </div>
        </div>
      </div>
    ),
    size
  );
}
