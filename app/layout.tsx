import type { Metadata } from "next";
import "./globals.css";

import VLibrasScript from "@/components/VLibras/VLibrasScript";

export const metadata: Metadata = {
  title: "G.R.E.S. Guardiões da Capadócia",
  description:
    "Site oficial da G.R.E.S. Guardiões da Capadócia. Força, Foco, Fé e Samba no Pé!",


  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
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

        {/* Estrutura oficial do VLibras */}
        <div
          {...({ vw: "true" } as Record<string, string>)}
          className="enabled"
        >
          <div
            {...({
              "vw-access-button": "true",
            } as Record<string, string>)}
            className="active"
          />

          <div
            {...({
              "vw-plugin-wrapper": "true",
            } as Record<string, string>)}
          >
            <div className="vw-plugin-top-wrapper" />
          </div>
        </div>

        <VLibrasScript />
      </body>
    </html>
  );
}