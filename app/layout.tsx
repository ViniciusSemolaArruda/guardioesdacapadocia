import type { Metadata, Viewport } from "next";
import "./globals.css";

import VLibras from "@/components/VLibras/VLibras";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://guardioesdacapadocia.vercel.app/";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "G.R.E.S. Guardiões da Capadócia",
    template: "%s | Guardiões da Capadócia",
  },

  description:
    "Site oficial da G.R.E.S. Guardiões da Capadócia. Força, Foco, Fé e Samba no Pé!",

  applicationName: "Guardiões da Capadócia",

  manifest: "/manifest.webmanifest",

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/icon-192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: "/icon-512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],

    shortcut: "/favicon.ico",

    apple: [
      {
        url: "/apple-touch-icon.png",
        type: "image/png",
        sizes: "180x180",
      },
    ],
  },

  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "G.R.E.S. Guardiões da Capadócia",
    title: "G.R.E.S. Guardiões da Capadócia",
    description:
      "Força, Foco, Fé e Samba no Pé! Conheça a história da G.R.E.S. Guardiões da Capadócia.",
    images: [
      {
        url: "/compartilhamento.jpg",
        width: 1200,
        height: 630,
        alt: "G.R.E.S. Guardiões da Capadócia",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "G.R.E.S. Guardiões da Capadócia",
    description:
      "Força, Foco, Fé e Samba no Pé! Conheça a história da G.R.E.S. Guardiões da Capadócia.",
    images: ["/compartilhamento.jpg"],
  },

  appleWebApp: {
    capable: true,
    title: "Guardiões",
    statusBarStyle: "black-translucent",
  },

  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#8c0713",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}

        <VLibras />
      </body>
    </html>
  );
}