/* Bilingual content + shared data for the portfolio. */

export type Lang = "fr" | "en";

export interface Content {
  nav: { about: string; skills: string; work: string; services: string; contact: string; cta: string };
  hero: {
    tags: string[]; name1: string; name2: string; sub: string;
    primary: string; ghost: string; scroll: string; marquee: string[];
  };
  about: {
    eyebrow: string; index: string; tab: string;
    lead: [string, string, string];
    body: string[];
    stats: { n: string; k: string }[];
  };
  skills: {
    eyebrow: string; index: string; title: [string, string]; sub: string;
    disciplinesLabel: string; disciplines: string[];
  };
  work: { eyebrow: string; index: string; title: [string, string]; hint: string; viewAll: string };
  services: { eyebrow: string; index: string; title: [string, string] };
  contact: {
    eyebrow: string; index: string; lead: [string, string]; sub: string;
    emailK: string; phoneK: string; locK: string; loc: string; socialsLabel: string;
    form: {
      nameL: string; nameP: string; emailL: string; emailP: string;
      subjL: string; subjP: string; msgL: string; msgP: string;
      send: string; sending: string;
      errName: string; errEmail: string; errMsg: string;
      successT: string; successP: string;
    };
  };
  footer: { tagline: string; rights: string; top: string; made: string };
}

export const CONTENT: Record<Lang, Content> = {
  fr: {
    nav: { about: "À propos", skills: "Compétences", work: "Projets", services: "Services", contact: "Contact", cta: "Travaillons ensemble" },
    hero: {
      tags: ["Designer Graphique", "Monteur Vidéo", "Fianarantsoa · MG"],
      name1: "RAZAFINDRAVONJY SOLOFONIRINA",
      name2: "ELYSÉ",
      sub: "Designer graphique et monteur vidéo. Je transforme les idées en identités visuelles fortes — affiches, logos et contenus qui captent le regard.",
      primary: "Voir mes projets",
      ghost: "Me contacter",
      scroll: "Défiler",
      marquee: ["Affiches", "Identité visuelle", "Logos", "Réseaux sociaux", "Montage vidéo", "Branding"],
    },
    about: {
      eyebrow: "À propos",
      index: "01 — Profil",
      tab: "Depuis 2024",
      lead: ["Je donne forme aux", "idées", " avec passion et précision."],
      body: [
        "Je m'appelle RAZAFINDRAVONJY Solofonirina Elysé, designer graphique avec 2 ans d'expérience. Mon travail mêle composition rigoureuse, typographie audacieuse et sens du détail pour créer des visuels qui marquent.",
        "De l'affiche au logo en passant par les réseaux sociaux et le montage vidéo, j'accompagne chaque projet de l'idée à la livraison — en restant fidèle à l'identité et au message du client.",
      ],
      stats: [
        { n: "2+", k: "Années d'expérience" },
        { n: "6", k: "Outils maîtrisés" },
        { n: "20+", k: "Projets livrés" },
      ],
    },
    skills: {
      eyebrow: "Boîte à outils",
      index: "02 — Compétences",
      title: ["Les outils de mon", "métier"],
      sub: "Une suite créative complète, du print au motion design.",
      disciplinesLabel: "Disciplines",
      disciplines: ["Direction artistique", "Mise en page", "Typographie", "Branding", "Retouche photo", "Habillage réseaux sociaux", "Montage & étalonnage", "Sous-titrage"],
    },
    work: {
      eyebrow: "Sélection",
      index: "03 — Projets",
      title: ["Travaux", "récents"],
      hint: "Cliquez sur un projet pour en savoir plus",
      viewAll: "Voir le projet",
    },
    services: {
      eyebrow: "Ce que je propose",
      index: "04 — Services",
      title: ["Mes", "services"],
    },
    contact: {
      eyebrow: "Contact",
      index: "05 — Contact",
      lead: ["Créons", "ensemble"],
      sub: "Un projet en tête ? Parlons-en. Je réponds généralement sous 24 h.",
      emailK: "Email", phoneK: "Téléphone", locK: "Lieu", loc: "Fianarantsoa, Madagascar",
      socialsLabel: "Réseaux",
      form: {
        nameL: "Votre nom", nameP: "Jean Rakoto",
        emailL: "Votre email", emailP: "vous@exemple.com",
        subjL: "Sujet", subjP: "Affiche, logo, montage…",
        msgL: "Votre message", msgP: "Décrivez votre projet…",
        send: "Envoyer le message",
        sending: "Envoi…",
        errName: "Veuillez indiquer votre nom",
        errEmail: "Email invalide",
        errMsg: "Veuillez écrire un message",
        successT: "Message envoyé !",
        successP: "Merci. Je vous répondrai très vite.",
      },
    },
    footer: { tagline: "Designer Graphique & Monteur Vidéo", rights: "Tous droits réservés", top: "Haut de page", made: "Conçu avec soin · 2026" },
  },

  en: {
    nav: { about: "About", skills: "Skills", work: "Work", services: "Services", contact: "Contact", cta: "Let's work together" },
    hero: {
      tags: ["Graphic Designer", "Video Editor", "Fianarantsoa · MG"],
      name1: "SOLOFONIRINA",
      name2: "ELYSÉ",
      sub: "Graphic designer and video editor. I turn ideas into strong visual identities — posters, logos and content that grab attention.",
      primary: "View my work",
      ghost: "Get in touch",
      scroll: "Scroll",
      marquee: ["Posters", "Visual identity", "Logos", "Social media", "Video editing", "Branding"],
    },
    about: {
      eyebrow: "About",
      index: "01 — Profile",
      tab: "Since 2024",
      lead: ["I give shape to", "ideas", " with passion and precision."],
      body: [
        "I'm RAZAFINDRAVONJY Solofonirina Elysé, a graphic designer with 2 years of experience. My work blends rigorous composition, bold typography and an eye for detail to create visuals that stick.",
        "From posters and logos to social media and video editing, I guide every project from idea to delivery — staying true to the client's identity and message.",
      ],
      stats: [
        { n: "2+", k: "Years of experience" },
        { n: "6", k: "Tools mastered" },
        { n: "20+", k: "Projects delivered" },
      ],
    },
    skills: {
      eyebrow: "Toolkit",
      index: "02 — Skills",
      title: ["The tools of my", "craft"],
      sub: "A full creative suite, from print to motion design.",
      disciplinesLabel: "Disciplines",
      disciplines: ["Art direction", "Layout", "Typography", "Branding", "Photo retouching", "Social media design", "Editing & color grading", "Subtitling"],
    },
    work: {
      eyebrow: "Selected",
      index: "03 — Work",
      title: ["Recent", "work"],
      hint: "Click a project to learn more",
      viewAll: "View project",
    },
    services: {
      eyebrow: "What I offer",
      index: "04 — Services",
      title: ["My", "services"],
    },
    contact: {
      eyebrow: "Contact",
      index: "05 — Contact",
      lead: ["Let's create", "together"],
      sub: "Got a project in mind? Let's talk. I usually reply within 24 hours.",
      emailK: "Email", phoneK: "Phone", locK: "Location", loc: "Fianarantsoa, Madagascar",
      socialsLabel: "Socials",
      form: {
        nameL: "Your name", nameP: "John Doe",
        emailL: "Your email", emailP: "you@example.com",
        subjL: "Subject", subjP: "Poster, logo, editing…",
        msgL: "Your message", msgP: "Tell me about your project…",
        send: "Send message",
        sending: "Sending…",
        errName: "Please enter your name",
        errEmail: "Invalid email",
        errMsg: "Please write a message",
        successT: "Message sent!",
        successP: "Thank you. I'll get back to you soon.",
      },
    },
    footer: { tagline: "Graphic Designer & Video Editor", rights: "All rights reserved", top: "Back to top", made: "Crafted with care · 2026" },
  },
};

export interface Tool { name: string; abbr: string; roleFr: string; roleEn: string; lvl: number }

export const TOOLS: Tool[] = [
  { name: "Photoshop", abbr: "Ps", roleFr: "Retouche & composition", roleEn: "Retouching & compositing", lvl: 90 },
  { name: "Illustrator", abbr: "Ai", roleFr: "Logos & vectoriel", roleEn: "Logos & vector", lvl: 88 },
  { name: "Figma", abbr: "Fi", roleFr: "UI & maquettes", roleEn: "UI & mockups", lvl: 80 },
  { name: "Canva", abbr: "Cv", roleFr: "Visuels rapides", roleEn: "Quick visuals", lvl: 92 },
  { name: "CapCut", abbr: "Cc", roleFr: "Montage mobile", roleEn: "Mobile editing", lvl: 85 },
  { name: "Filmora", abbr: "Fm", roleFr: "Montage & étalonnage", roleEn: "Editing & grading", lvl: 82 },
];

export interface Service { fr: { t: string; d: string }; en: { t: string; d: string } }

export const SERVICES: Service[] = [
  { fr: { t: "Affiches & Print", d: "Affiches événementielles, flyers et supports imprimés à fort impact visuel." },
    en: { t: "Posters & Print", d: "Event posters, flyers and print materials with strong visual impact." } },
  { fr: { t: "Logos & Identité", d: "Création de logos et systèmes d'identité visuelle cohérents et mémorables." },
    en: { t: "Logos & Identity", d: "Logo design and coherent, memorable visual identity systems." } },
  { fr: { t: "Réseaux Sociaux", d: "Habillage de pages, carrousels et publications pensés pour l'engagement." },
    en: { t: "Social Media", d: "Page branding, carousels and posts crafted for engagement." } },
  { fr: { t: "Montage Vidéo", d: "Montage, étalonnage et sous-titrage pour des contenus dynamiques." },
    en: { t: "Video Editing", d: "Editing, color grading and subtitling for dynamic content." } },
];

export interface Social { label: string; short: string; href: string }

export const SOCIALS: Social[] = [
  { label: "LinkedIn",  short: "In", href: "https://linkedin.com/in/elyse-razafindravonjy-9355b32b5/" },
  { label: "GitHub",    short: "Gh", href: "https://github.com/ElyseRaz" },
  { label: "WhatsApp",  short: "WA", href: "https://wa.me/261346571348" },
];

export const CONTACT_EMAIL = "erazafindravonjy@gmail.com";
export const CONTACT_PHONE_HREF = "+261380612312";
export const CONTACT_PHONE_DISPLAY = "+261 38 06 123 12";
