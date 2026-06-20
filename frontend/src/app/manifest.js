export default function manifest() {
  return {
    name: "ProdSync",
    short_name: "ProdSync",
    description:
      "Gestão industrial em tempo real para máquinas, paradas, operadores e indicadores de produção.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#00357a",
    lang: "pt-BR",
    icons: [
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}