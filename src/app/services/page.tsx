import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ArrowRight, Video, Heart, Sparkles, Award, Camera, MessageSquare, Sliders, Compass } from 'lucide-react';
import { getServices } from '@/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Photography & Cinematography Services",
  description: "Learn about our premium wedding, pre-wedding, event, and corporate photography packages, pricing structure, and deliverables.",
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="w-full min-h-screen bg-background relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-glow-accent rounded-full pointer-events-none -translate-x-1/2 blur-[100px]" />
      <div className="absolute top-2/3 right-0 w-[600px] h-[600px] bg-glow-sage rounded-full pointer-events-none translate-x-1/3 blur-[120px]" />

      {/* Modern Hero Header Banner */}
      <section className="relative pt-40 pb-24 overflow-hidden border-b border-border/5">
        {/* Banner image with dark overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1920&auto=format&fit=crop"
            alt="Photography backdrop"
            fill
            className="object-cover opacity-15 grayscale"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center text-center">
          <span className="text-accent tracking-[0.3em] text-xs uppercase font-semibold mb-3">
            Creative Collections & Deliverables
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-foreground font-light tracking-wide max-w-3xl leading-tight">
            Our Photography <span className="italic text-accent font-serif">& Cinematography</span> Services
          </h1>
          <p className="text-foreground/75 font-light leading-relaxed text-sm sm:text-base mt-6 max-w-2xl">
            Bespoke art direction, calibrated lighting, and meticulous post-production designed to tell your stories beautifully.
          </p>
          <div className="h-[1px] w-20 bg-accent/45 mt-8" />
        </div>
      </section>

      {/* Services List Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-32 relative z-10">
        {services.map((service, index) => {
          const isEven = index % 2 === 0;
          return (
            <section
              key={service.id}
              id={service.slug}
              className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center scroll-mt-36"
            >
              {/* Single Image Block */}
              <div
                className={`lg:col-span-5 relative h-[380px] sm:h-[450px] rounded-2xl overflow-hidden border border-border/5 shadow-2xl group ${
                  isEven ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                <Image
                  src={service.coverImage}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-103"
                  sizes="(max-w-768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>

              {/* Service Details */}
              <div
                className={`lg:col-span-7 flex flex-col gap-6 ${
                  isEven ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <span className="text-accent text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                  {index === 0 && <Heart className="w-4 h-4" />}
                  {index === 1 && <Sparkles className="w-4 h-4" />}
                  {index === 2 && <Video className="w-4 h-4" />}
                  {index === 3 && <Award className="w-4 h-4" />}
                  Category 0{index + 1}
                </span>

                <h2 className="font-serif text-3xl sm:text-4xl text-foreground font-light">
                  {service.title}
                </h2>

                <p className="text-foreground/80 font-light leading-relaxed text-sm sm:text-base">
                  {service.longDescription}
                </p>

                {/* Deliverables display as capsules grid */}
                <div className="flex flex-col gap-4 mt-2">
                  <p className="text-xs uppercase tracking-widest font-semibold text-foreground/90">
                    What we deliver:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {service.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="glass-light p-4 rounded-xl flex items-start gap-3 border border-border/10 shadow-sm transition-all duration-300 hover:border-accent/30"
                      >
                        <Check className="w-4.5 h-4.5 text-accent shrink-0 mt-0.5" />
                        <span className="text-xs text-foreground/80 leading-relaxed font-light">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mt-4">
                  <Link
                    href={`/contact?event=${encodeURIComponent(service.title)}`}
                    className="px-6 py-3 rounded-full bg-accent text-white hover:bg-accent-hover transition-colors text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5 shadow-md"
                  >
                    <span>Book this Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/portfolio?category=${service.id.replace('s-', '')}s`}
                    className="px-6 py-3 rounded-full border border-border/10 text-foreground hover:border-accent hover:text-accent transition-colors text-xs uppercase tracking-widest font-semibold bg-background/40"
                  >
                    View Category Portfolio
                  </Link>
                </div>
              </div>
            </section>
          );
        })}
      </section>

      {/* "Our Creative Approach" Process Section */}
      <section className="py-24 bg-cardbg/50 border-y border-border/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-glow-accent opacity-50 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col gap-16">
          {/* Section Header */}
          <div className="text-center flex flex-col items-center gap-3">
            <span className="text-accent tracking-[0.2em] text-xs uppercase font-semibold">
              The Journey
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-foreground font-light">
              Our Creative Process
            </h2>
            <p className="text-foreground/70 font-light text-xs sm:text-sm max-w-md mt-2 leading-relaxed">
              How we work alongside you to capture, refine, and deliver your stories.
            </p>
            <div className="h-[1px] w-20 bg-accent/45 mt-4" />
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="glass-light p-8 rounded-2xl border border-border/10 flex flex-col gap-5 relative hover:border-accent/30 transition-all duration-300">
              <span className="absolute top-6 right-8 font-serif text-5xl text-accent/10 font-bold">01</span>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-serif text-xl font-light text-foreground">Bespoke Consultation</h3>
                <p className="text-xs text-foreground/75 font-light leading-relaxed">
                  We discuss visual concepts, styling, wardrobe direction, and schedule timelines to align perfectly with your dream.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-light p-8 rounded-2xl border border-border/10 flex flex-col gap-5 relative hover:border-accent/30 transition-all duration-300">
              <span className="absolute top-6 right-8 font-serif text-5xl text-accent/10 font-bold">02</span>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <Compass className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-serif text-xl font-light text-foreground">Art Direction</h3>
                <p className="text-xs text-foreground/75 font-light leading-relaxed">
                  We curate location backdrops, lighting designs, compositions, and custom layouts to ensure an editorial final result.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-light p-8 rounded-2xl border border-border/10 flex flex-col gap-5 relative hover:border-accent/30 transition-all duration-300">
              <span className="absolute top-6 right-8 font-serif text-5xl text-accent/10 font-bold">03</span>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <Camera className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-serif text-xl font-light text-foreground">The Session</h3>
                <p className="text-xs text-foreground/75 font-light leading-relaxed">
                  An unobtrusive and highly comfortable shoot session where we capture both structured poses and raw, authentic candids.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="glass-light p-8 rounded-2xl border border-border/10 flex flex-col gap-5 relative hover:border-accent/30 transition-all duration-300">
              <span className="absolute top-6 right-8 font-serif text-5xl text-accent/10 font-bold">04</span>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <Sliders className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-serif text-xl font-light text-foreground">Cinematic Post-Edit</h3>
                <p className="text-xs text-foreground/75 font-light leading-relaxed">
                  Every frame undergoes precision color grading, retouching, and detail enhancement, delivered in a premium digital catalog.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Immersive Booking CTA */}
      <section className="py-28 relative overflow-hidden bg-neutral-950 text-white">
        <div className="absolute inset-0 bg-glow-accent opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(78,34,15,0.15),transparent_60%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-8 relative z-10">
          <span className="text-[#d4af37] tracking-[0.25em] text-[10px] sm:text-xs uppercase font-semibold">
            Reserve Your Session
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl text-white font-light leading-tight">
            Ready to Capture <br />
            <span className="text-shine italic font-serif">Your Story?</span>
          </h2>
          <p className="max-w-md text-gray-400 font-light text-sm sm:text-base leading-relaxed">
            Spaces are limited. Contact our art director to schedule a consultation and book your photography team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-full bg-accent text-white hover:bg-accent-hover transition-all duration-300 text-xs uppercase tracking-widest font-semibold shadow-lg"
            >
              Contact the Studio
            </Link>
            <a
              href="https://wa.me/919876543210?text=Hi%20Aura%20Studio!%20I'm%20interested%20in%20booking%20a%20photography%20session."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-full border border-white/10 hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 bg-white/5"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
