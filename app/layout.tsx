import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./lib/i18n";

const spaceGrotesk = Space_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RAZAFINDRAVONJY Solofonirina Elysé — Portfolio",
  description:
    "Portfolio de RAZAFINDRAVONJY Solofonirina Elysé — designer graphique et monteur vidéo basé à Fianarantsoa. Affiches, identités visuelles, logos, réseaux sociaux et montage vidéo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${spaceGrotesk.variable} ${jakarta.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
