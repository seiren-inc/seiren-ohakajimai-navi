"use client"

import { HomeHeader } from "./sections/Header"
import { Hero } from "./sections/Hero"
import { Pains } from "./sections/Pains"
import { Features } from "./sections/Features"
import { Flow } from "./sections/Flow"
import { Services } from "./sections/Services"
import { Gyosei } from "./sections/Gyosei"
import { Permit } from "./sections/Permit"
import { Cases } from "./sections/Cases"
import { LineSection } from "./sections/LineSection"
import { Social } from "./sections/Social"
import { FAQ } from "./sections/FAQ"
import { FinalCTA } from "./sections/FinalCTA"
import { HomeFooter } from "./sections/Footer"
import { EcosystemShowcase } from "@/components/features/ecosystem/EcosystemShowcase"

/**
 * Ohakajimai Navi — Homepage (LP)
 *
 * Section order is conversion-tuned: empathy → trust → procedure → social → close.
 * SEO/JSON-LD wiring lives in `src/app/page.tsx` and `src/app/layout.tsx`;
 * this file purely composes the visible sections.
 *
 * FAQ uses `homepageFaqs` from `@/components/seo/faq-json-ld` as the single
 * source of truth — keeps visible content and FAQPage schema in sync.
 */
export default function HomepageClient() {
  return (
    <>
      <HomeHeader />
      <main className="bg-seiren-bg text-seiren-body">
        <Hero />
        <Pains />
        <Features />
        <Flow />
        <Services />
        <Gyosei />
        <Permit />
        <Cases />
        <LineSection />
        <Social />
        <EcosystemShowcase />
        <FAQ />
        <FinalCTA />
      </main>
      <HomeFooter />
      <div className="mobile-cta-spacer" aria-hidden />
    </>
  )
}
