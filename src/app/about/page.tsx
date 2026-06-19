import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Film, Award } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Our Studio",
  description: "Learn about the story, founder, and cinematic philosophy behind Aura Studio, Chennai's premium photography team.",
};

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen pt-32 pb-24 bg-background page-container">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-20">
          <span className="text-accent tracking-[0.3em] text-xs uppercase font-semibold">
            Our Vision & Journey
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-foreground font-light">
            About Aura Studio
          </h1>
          <p className="text-foreground/75 font-light leading-relaxed text-sm sm:text-base mt-2">
            Capturing the raw elegance, cinematic lighting, and authentic emotions of life's greatest chapters since 2016.
          </p>
          <div className="h-[1px] w-20 bg-accent/45 mx-auto mt-2" />
        </div>

        {/* Founding Story Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-28">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <span className="text-accent text-xs uppercase tracking-widest font-semibold">
              The Genesis
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground font-light">
              Crafting Timeless Cinematic Art
            </h2>
            <p className="text-foreground/80 font-light leading-relaxed text-base">
              Aura Studio was born out of a desire to break away from traditional, stiff pose-and-shoot photography. We wanted to treat every wedding, engagement, and celebration like a cinematic feature film—complete with dramatic composition, natural lighting, and a narrative-driven flow.
            </p>
            <p className="text-foreground/80 font-light leading-relaxed text-base">
              Our team consists of directors of photography, editors, and photographers who possess an editorial eye. We operate at the intersection of photography and cinema, capturing split-second authentic moments that evoke raw feelings even decades later.
            </p>
          </div>
          <div className="lg:col-span-5 relative h-[450px] rounded-2xl overflow-hidden border border-border/5 shadow-2xl about-story-image">
            <Image
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1000&auto=format&fit=crop"
              alt="Vintage camera setup"
              fill
              className="object-cover"
              sizes="(max-w-768px) 100vw, 40vw"
            />
          </div>
        </section>

        {/* Founder Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-28 bg-card p-8 sm:p-12 rounded-3xl border border-border/5">
          <div className="lg:col-span-5 relative h-[400px] rounded-2xl overflow-hidden border border-border/5 shadow-xl lg:order-2 about-founder-image">
            <Image
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop"
              alt="Founder of Aura Studio"
              fill
              className="object-cover"
              sizes="(max-w-768px) 100vw, 30vw"
            />
          </div>
          <div className="lg:col-span-7 flex flex-col gap-6 lg:order-1">
            <span className="text-accent text-xs uppercase tracking-widest font-semibold">
              Meet the Founder
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground font-light">
              Ananya Krishnan
            </h2>
            <p className="text-xs uppercase tracking-widest text-foreground/60 font-mono">
              Creative Director & Lead Photographer
            </p>
            <p className="text-foreground/80 font-light leading-relaxed text-sm sm:text-base">
              "Photography is not about documenting facts; it is about capturing how a moment felt. When I look through the viewfinder, I am looking for the unspoken connections—the brief moments of vulnerability and joy that make us human. At Aura Studio, we treat your memories as sacred, converting them into visual treasures."
            </p>
            <p className="text-foreground/80 font-light leading-relaxed text-sm sm:text-base">
              Ananya has shot over 200 weddings across India, Europe, and Southeast Asia. Her work has been featured in leading design and bridal magazines including Vogue India, Harper's Bazaar Bride, and WedMeGood.
            </p>
          </div>
        </section>

        {/* Creative Philosophy Grid */}
        <section className="flex flex-col gap-12 mb-20">
          <h2 className="font-serif text-3xl text-center text-foreground font-light">
            Our Core Creative Pillars
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-light p-8 rounded-2xl border border-border/10 flex flex-col gap-4 shadow-sm hover:border-accent/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Film className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-foreground font-light">Cinematic Lighting</h3>
              <p className="text-sm text-foreground/75 font-light leading-relaxed">
                We harness natural shadows and golden hour beams to paint depth, texture, and drama into every photo, avoiding flat and artificial flashes.
              </p>
            </div>

            <div className="glass-light p-8 rounded-2xl border border-border/10 flex flex-col gap-4 shadow-sm hover:border-accent/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-foreground font-light">Candid Storytelling</h3>
              <p className="text-sm text-foreground/75 font-light leading-relaxed">
                We focus on organic, unposed interactions. We guide you gently so you feel comfortable, letting the natural chemistry take center stage.
              </p>
            </div>

            <div className="glass-light p-8 rounded-2xl border border-border/10 flex flex-col gap-4 shadow-sm hover:border-accent/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-foreground font-light">Artisanal Grading</h3>
              <p className="text-sm text-foreground/75 font-light leading-relaxed">
                Each photograph goes through a custom color grading pipeline to establish a cohesive, warm, and timeless cinematic color palette.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/contact"
            className="px-8 py-3.5 rounded-full bg-accent text-white hover:bg-accent-hover transition-all duration-300 text-xs uppercase tracking-widest font-semibold inline-block shadow-md"
          >
            Work With Us
          </Link>
        </div>
      </div>
    </div>
  );
}
