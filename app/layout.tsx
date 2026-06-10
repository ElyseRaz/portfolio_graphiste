import type { Metadata } from "next";
import { Bebas_Neue, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { LanguageProvider } from "./lib/i18n";
import { ThemeProvider } from "./lib/theme";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const aileron = localFont({
  variable: "--font-aileron",
  display: "swap",
  src: [
    { path: "./fonts/Aileron-Light.otf", weight: "300", style: "normal" },
    { path: "./fonts/Aileron-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/Aileron-SemiBold.otf", weight: "600", style: "normal" },
    { path: "./fonts/Aileron-Bold.otf", weight: "700", style: "normal" },
    { path: "./fonts/Aileron-Heavy.otf", weight: "800", style: "normal" },
    { path: "./fonts/Aileron-Black.otf", weight: "900", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "RAZAFINDRAVONJY Solofonirina Elysé — Portfolio",
  description:
    "Portfolio de RAZAFINDRAVONJY Solofonirina Elysé — designer graphique et monteur vidéo basé à Antananarivo. Affiches, identités visuelles, logos, réseaux sociaux et montage vidéo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${bebas.variable} ${jetbrains.variable} ${aileron.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
      </head>
      <body>
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
