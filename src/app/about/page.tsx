import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, Heart, Film, Globe, MessageSquare, Award, ArrowRight } from 'lucide-react';
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
          <h1 className="font-serif text-4xl sm:text-6xl text-foreground font-light tracking-tight">
            About Aura Studio
          </h1>
          <p className="text-foreground/70 font-light leading-relaxed text-sm sm:text-base mt-2">
            Capturing the raw elegance, cinematic lighting, and authentic emotions of life's greatest chapters since 2016.
          </p>
          <div className="h-[1px] w-20 bg-accent/45 mx-auto mt-4" />
        </div>

        {/* Founding Story Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-32">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <span className="text-accent text-xs uppercase tracking-widest font-semibold font-mono">
              [ The Genesis ]
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-foreground font-light leading-tight">
              Crafting Timeless <br />
              <span className="italic text-accent">Cinematic Art</span>
            </h2>
            <div className="w-12 h-[1px] bg-accent/30 my-1" />
            <p className="text-foreground/80 font-light leading-relaxed text-base">
              Aura Studio was born out of a desire to break away from traditional, stiff pose-and-shoot photography. We wanted to treat every wedding, engagement, and celebration like a cinematic feature film—complete with dramatic composition, natural lighting, and a narrative-driven flow.
            </p>
            <p className="text-foreground/80 font-light leading-relaxed text-base">
              Our team consists of directors of photography, editors, and photographers who possess an editorial eye. We operate at the intersection of photography and cinema, capturing split-second authentic moments that evoke raw feelings even decades later.
            </p>
          </div>
          <div className="lg:col-span-5 relative h-[480px] rounded-none overflow-hidden border border-border/10 shadow-2xl group">
            <Image
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1000&auto=format&fit=crop"
              alt="Vintage camera setup"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-103"
              sizes="(max-w-768px) 100vw, 40vw"
            />
            {/* Ambient border overlay */}
            <div className="absolute inset-0 border border-transparent group-hover:border-accent/35 rounded-none transition-all duration-700 m-3 pointer-events-none" />
          </div>
        </section>

        {/* Founder Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-32 bg-cardbg/50 p-8 sm:p-16 rounded-none border border-border/10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-glow-accent pointer-events-none blur-[80px] opacity-40" />
          
          <div className="lg:col-span-5 relative h-[450px] rounded-none overflow-hidden border border-border/10 shadow-xl lg:order-2 group">
            <Image
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop"
              alt="Founder of Aura Studio"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-103"
              sizes="(max-w-768px) 100vw, 30vw"
            />
            <div className="absolute inset-0 border border-transparent group-hover:border-accent/35 rounded-none transition-all duration-700 m-3 pointer-events-none" />
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6 lg:order-1 relative z-10">
            <span className="text-accent text-xs uppercase tracking-widest font-semibold font-mono">
              [ Meet the Founder ]
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground font-light">
              Ananya Krishnan
            </h2>
            <p className="text-xs uppercase tracking-widest text-accent font-semibold font-mono -mt-3">
              Creative Director & Lead Photographer
            </p>
            
            <div className="border-l-2 border-accent/40 pl-6 my-2 italic text-foreground font-serif text-lg leading-relaxed text-foreground/90">
              "Photography is not about documenting facts; it is about capturing how a moment felt. When I look through the viewfinder, I am looking for the unspoken connections—the brief moments of vulnerability and joy that make us human. At Aura Studio, we treat your memories as sacred, converting them into visual treasures."
            </div>

            <p className="text-foreground/80 font-light leading-relaxed text-sm sm:text-base">
              Ananya has shot over 200 weddings across India, Europe, and Southeast Asia. Her work has been featured in leading design and bridal magazines including Vogue India, Harper's Bazaar Bride, and WedMeGood.
            </p>
          </div>
        </section>

        {/* Co-founder / Second Person Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-32 bg-cardbg/50 p-8 sm:p-16 rounded-none border border-border/10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-glow-sage pointer-events-none blur-[80px] opacity-40" />
          
          <div className="lg:col-span-5 relative h-[450px] rounded-none overflow-hidden border border-border/10 shadow-xl lg:order-1 group">
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"
              alt="Co-Founder of Aura Studio"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-103"
              sizes="(max-w-768px) 100vw, 30vw"
            />
            <div className="absolute inset-0 border border-transparent group-hover:border-accent/35 rounded-none transition-all duration-700 m-3 pointer-events-none" />
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6 lg:order-2 relative z-10">
            <span className="text-accent text-xs uppercase tracking-widest font-semibold font-mono">
              [ Lead Cinematographer ]
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground font-light">
              Kabir Mehta
            </h2>
            <p className="text-xs uppercase tracking-widest text-accent font-semibold font-mono -mt-3">
              Co-Founder & Director of Cinema
            </p>
            
            <div className="border-l-2 border-accent/40 pl-6 my-2 italic text-foreground font-serif text-lg leading-relaxed text-foreground/90">
              "A single photograph captures a frame, but cinema captures the breath between those frames. Our films are not mere event summaries; they are visual poetry crafted to take you right back to the warmth, the music, and the laughter of your day."
            </div>

            <p className="text-foreground/80 font-light leading-relaxed text-sm sm:text-base">
              Kabir is an award-winning filmmaker and editor who graduated from the Film and Television Institute of India (FTII). Over the last decade, he has refined a style of wedding cinema that feels raw, documentary-like, and beautifully paced.
            </p>
          </div>
        </section>

        {/* Creative Philosophy Grid */}
        <section className="flex flex-col gap-12 mb-28">
          <div className="text-center flex flex-col items-center gap-3">
            <span className="text-accent tracking-[0.2em] text-xs uppercase font-semibold">
              Our Methodology
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground font-light">
              Our Core Creative Pillars
            </h2>
            <div className="h-[1px] w-16 bg-accent/45 mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            <div className="glass-light p-8 rounded-none border border-border/10 flex flex-col gap-5 shadow-sm hover:border-accent/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-none bg-accent/10 flex items-center justify-center text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                <Film className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-2xl text-foreground font-light">Cinematic Lighting</h3>
              <p className="text-sm text-foreground/70 font-light leading-relaxed">
                We harness natural shadows and golden hour beams to paint depth, texture, and drama into every photo, avoiding flat and artificial flashes.
              </p>
            </div>

            <div className="glass-light p-8 rounded-none border border-border/10 flex flex-col gap-5 shadow-sm hover:border-accent/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-none bg-accent/10 flex items-center justify-center text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-2xl text-foreground font-light">Candid Storytelling</h3>
              <p className="text-sm text-foreground/70 font-light leading-relaxed">
                We focus on organic, unposed interactions. We guide you gently so you feel comfortable, letting the natural chemistry take center stage.
              </p>
            </div>

            <div className="glass-light p-8 rounded-none border border-border/10 flex flex-col gap-5 shadow-sm hover:border-accent/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-none bg-accent/10 flex items-center justify-center text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-2xl text-foreground font-light">Artisanal Grading</h3>
              <p className="text-sm text-foreground/70 font-light leading-relaxed">
                Each photograph goes through a custom color grading pipeline to establish a cohesive, warm, and timeless cinematic color palette.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link
            href="/contact"
            className="px-8 py-3.5 rounded-full bg-accent text-white hover:bg-accent-hover transition-all duration-300 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 max-w-xs mx-auto shadow-md"
          >
            <span>Work With Us</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
