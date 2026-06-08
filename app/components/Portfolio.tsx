"use client";

import { useCallback } from "react";
import { useReveal } from "../lib/useReveal";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Marquee from "./Marquee";
import About from "./About";
import Skills from "./Skills";
import Gallery from "./Gallery";
import Services from "./Services";
import Contact from "./Contact";
import Footer from "./Footer";

export default function Portfolio() {
  useReveal();

  const onJump = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 70,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <>
      <div className="atmosphere" />
      <div className="grain" />
      <Navbar onJump={onJump} />
      <main>
        <Hero onJump={onJump} />
        <Marquee />
        <About />
        <Skills />
        <Gallery />
        <Services />
        <Contact />
        <Footer onJump={onJump} />
      </main>
    </>
  );
}
