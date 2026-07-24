import type { Metadata } from "next";
import "./globals.css";

import VLibras from "@/components/VLibras/VLibras";

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
      <body>
        {children}

        {/* Widget oficial do VLibras */}
        <VLibras />
      </body>
    </html>
  );
}