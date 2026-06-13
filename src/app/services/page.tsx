import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ArrowRight, Star, Video, Heart, Sparkles, Award } from 'lucide-react';
import { getServices } from '@/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Photography & Cinematography Services",
  description: "Learn about our premium wedding, pre-wedding, event, and corporate photography packages, pricing structure, and deliverables.",
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="w-full min-h-screen pt-32 pb-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Page Header */}
        <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-20">
          <span className="text-gold tracking-[0.3em] text-xs uppercase font-semibold">
            Premium Packages & Creative Work
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-white font-light">
            Our Photography Services
          </h1>
          <p className="text-gray-400 font-light leading-relaxed text-sm sm:text-base mt-2">
            Professional deliverables, bespoke art direction, and cinematic lighting tailored for your weddings, personal milestones, or business needs.
          </p>
          <div className="h-[1px] w-20 bg-gold/45 mx-auto mt-2" />
        </div>

        {/* Services List */}
        <div className="flex flex-col gap-24">
          {services.map((service, index) => {
            const isEven = index % 2 === 0;
            return (
              <section
                key={service.id}
                id={service.slug}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center scroll-mt-36"
              >
                {/* Cover Image Block */}
                <div
                  className={`lg:col-span-5 relative h-[380px] sm:h-[450px] rounded-2xl overflow-hidden border border-white/5 shadow-2xl group ${
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                </div>

                {/* Details Block */}
                <div
                  className={`lg:col-span-7 flex flex-col gap-6 ${
                    isEven ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <span className="text-gold text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                    {index === 0 && <Heart className="w-4 h-4" />}
                    {index === 1 && <Sparkles className="w-4 h-4" />}
                    {index === 2 && <Video className="w-4 h-4" />}
                    {index === 3 && <Award className="w-4 h-4" />}
                    Category 0{index + 1}
                  </span>

                  <h2 className="font-serif text-3xl sm:text-4xl text-white font-light">
                    {service.title}
                  </h2>

                  <p className="text-gray-300 font-light leading-relaxed text-sm sm:text-base">
                    {service.longDescription}
                  </p>

                  {/* Included Deliverables */}
                  <div className="flex flex-col gap-3.5 mt-2 bg-card p-6 sm:p-8 rounded-2xl border border-white/5">
                    <p className="text-xs uppercase tracking-widest font-semibold text-white">
                      What's Included:
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-400 font-light">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-wrap gap-4 mt-2">
                    <Link
                      href={`/contact?event=${encodeURIComponent(service.title)}`}
                      className="px-6 py-3 rounded-full bg-gold text-black hover:bg-gold-hover transition-colors text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5 shadow-md"
                    >
                      Book this Service <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/portfolio?category=${service.id.replace('s-', '')}s`}
                      className="px-6 py-3 rounded-full border border-white/10 text-white hover:border-gold hover:text-gold transition-colors text-xs uppercase tracking-widest font-semibold"
                    >
                      View Category Portfolio
                    </Link>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
