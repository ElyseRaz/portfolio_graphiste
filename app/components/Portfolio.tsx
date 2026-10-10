"use client";

import { useCallback } from "react";
import dynamic from "next/dynamic";
import { useReveal } from "../lib/useReveal";
import Navbar from "./Navbar";
import Hero from "./Hero";

const Marquee = dynamic(() => import("./Marquee"));
const About = dynamic(() => import("./About"));
const Gallery = dynamic(() => import("./Gallery"));
const Services = dynamic(() => import("./Services"));
const Contact = dynamic(() => import("./Contact"));
const Footer = dynamic(() => import("./Footer"));

export default function Portfolio() {
  useReveal();

  const onJump = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <>
      <Navbar onJump={onJump} />
      <main>
        <Hero onJump={onJump} />
        <Marquee />
        <Gallery />
        <Services />
        <About />
        <Contact />
        <Footer onJump={onJump} />
      </main>
    </>
  );
}
