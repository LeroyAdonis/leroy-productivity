"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initGSAP() {
  const ctx = gsap.context(() => {
    gsap.utils.toArray(".parallax-layer").forEach((layer, i) => {
      gsap.to(layer, {
        yPercent: (i + 1) * -8,
        ease: "none",
        scrollTrigger: { trigger: layer.parentElement, scrub: 0.5 },
      });
    });
  });

  return ctx;
}

export function cleanupGSAP(ctx: gsap.Context) {
  ctx.revert();
}

export function animateGlassEntrance(selector: string) {
  gsap.from(selector, {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: "power2.out",
    stagger: 0.1,
  });
}

export { gsap, ScrollTrigger };
