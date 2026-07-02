import React, { Suspense } from 'react';
import ContactForm from '@/components/ContactForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Book a Session | Contact Us",
  description: "Get in touch with Aura Studio Chennai. Send an inquiry for wedding photography, pre-wedding sessions, and corporate shoots.",
};

export default function ContactPage() {
  return (
    <div className="w-full min-h-screen pt-32 pb-24 bg-background relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-glow-accent rounded-full pointer-events-none -translate-x-1/2 blur-[100px] opacity-70" />
      <div className="absolute top-2/3 right-0 w-[600px] h-[600px] bg-glow-sage rounded-full pointer-events-none translate-x-1/3 blur-[120px] opacity-70" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Contact Form wrapped in Suspense for search params usage */}
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <ContactForm />
        </Suspense>
      </div>
    </div>
  );
}
