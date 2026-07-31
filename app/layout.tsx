import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost";
  const protocol = headerList.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const socialImage = `${protocol}://${host}/og.png`;

  return {
    title: "Circle of Death by Piso",
    description: "Il drinking game mobile con 52 sfide diverse: ogni numero e ogni seme contano.",
    applicationName: "Circle of Death",
    openGraph: {
      title: "Circle of Death by Piso",
      description: "52 carte. 52 sfide. Un solo telefono per tutto il gruppo.",
      type: "website",
      images: [{ url: socialImage, width: 1536, height: 1024, alt: "Circle of Death by Piso" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Circle of Death by Piso",
      description: "52 carte. 52 sfide. Un solo telefono per tutto il gruppo.",
      images: [socialImage],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0b0d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
