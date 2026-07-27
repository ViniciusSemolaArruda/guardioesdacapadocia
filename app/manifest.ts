import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "G.R.E.S. Guardiões da Capadócia",
    short_name: "Guardiões",
    description:
      "Site oficial da G.R.E.S. Guardiões da Capadócia. Força, Foco, Fé e Samba no Pé!",

    start_url: "/",
    scope: "/",
    display: "standalone",

    background_color: "#8c0713",
    theme_color: "#8c0713",

    orientation: "portrait-primary",

    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}