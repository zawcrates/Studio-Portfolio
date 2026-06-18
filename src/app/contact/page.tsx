import React, { Suspense } from 'react';
import ContactForm from '@/components/ContactForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Book a Session | Contact Us",
  description: "Get in touch with Aura Studio Chennai. Send an inquiry for wedding photography, pre-wedding sessions, and corporate shoots.",
};

export default function ContactPage() {
  return (
    <div className="w-full min-h-screen pt-32 pb-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
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
