import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "G.R.E.S. Guardiões da Capadócia",
  description:
    "Site oficial da G.R.E.S. Guardiões da Capadócia. Tradição, cultura e amor pelo samba.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}