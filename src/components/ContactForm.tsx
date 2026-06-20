'use strict';

'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid 10-digit phone number'),
  email: z.string().email('Please enter a valid email address'),
  event_type: z.string().min(1, 'Please select an event type'),
  event_date: z.string().min(1, 'Please select the event date'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const EVENT_TYPES = [
  'Wedding Photography',
  'Pre-Wedding Shoot',
  'Engagement Ceremony',
  'Maternity Session',
  'Events & Parties',
  'Corporate & Brands',
  'Other Portfolio Session',
];

export default function ContactForm() {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      event_type: '',
      event_date: '',
      message: '',
    },
  });

  // Pre-fill event type if passed in URL query params
  useEffect(() => {
    const eventParam = searchParams.get('event');
    if (eventParam && EVENT_TYPES.includes(eventParam)) {
      setValue('event_type', eventParam);
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Persist to Database via secure Server API
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Failed to submit inquiry.');
      }

      // 2. Format WhatsApp Pre-filled message
      const targetPhone = '919876543210'; // Configured studio phone number
      const formattedMessage = `Hello Aura Studio! I would like to inquire about booking a session.

*Inquiry Details:*
• *Name:* ${data.name}
• *Phone:* ${data.phone}
• *Email:* ${data.email}
• *Event Type:* ${data.event_type}
• *Event Date:* ${data.event_date}

*Message:*
${data.message}`;

      const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(formattedMessage)}`;

      // 3. Mark success and trigger redirect
      setIsSuccess(true);
      reset();

      // Open WhatsApp in a new tab after a brief delay
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 1000);

    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-light p-8 sm:p-16 rounded-none border border-border/10 text-center flex flex-col items-center gap-6 max-w-lg mx-auto shadow-2xl relative"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-glow-accent pointer-events-none blur-[60px] opacity-40" />
        <CheckCircle2 className="w-16 h-16 text-accent animate-pulse" />
        <h2 className="font-serif text-3xl text-foreground font-light">Inquiry Logged</h2>
        <p className="text-foreground/80 font-light text-sm sm:text-base leading-relaxed">
          Thank you for reaching out. Your inquiry has been securely stored in our booking pipeline.
        </p>
        <p className="text-accent font-mono text-xs uppercase tracking-widest mt-2">
          Opening WhatsApp to initiate direct chat...
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="mt-6 text-xs font-semibold text-foreground/50 hover:text-accent uppercase tracking-widest underline underline-offset-4 transition-colors"
        >
          Submit another inquiry
        </button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
      {/* Contact Details Panel */}
      <div className="lg:col-span-5 flex flex-col gap-8 lg:sticky lg:top-28">
        <div className="flex flex-col gap-3">
          <span className="text-accent tracking-[0.2em] text-xs uppercase font-semibold font-mono">
            [ Contact the Studio ]
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-foreground font-light leading-tight">
            Let's Co-create <br />
            Your <span className="italic text-accent">Story</span>
          </h2>
          <div className="w-12 h-[1px] bg-accent/30 my-1" />
          <p className="text-foreground/80 font-light leading-relaxed text-sm sm:text-base">
            Have a date in mind or want to discuss packaging options? Fill out the form, and let's craft something unforgettable.
          </p>
        </div>

        <ul className="flex flex-col gap-6 font-light text-sm text-foreground/85 border-t border-border/10 pt-8">
          <li className="flex gap-4">
            <div className="w-12 h-12 rounded-none bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif text-foreground font-light text-lg">Studio Address</p>
              <p className="text-foreground/70 mt-1 text-xs sm:text-sm">
                12, Khader Nawaz Khan Rd, Nungambakkam, Chennai, Tamil Nadu 600006
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-12 h-12 rounded-none bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif text-foreground font-light text-lg">Phone Inquiries</p>
              <a href="tel:+919876543210" className="text-foreground/70 hover:text-accent mt-1 inline-block text-xs sm:text-sm transition-colors">
                +91 98765 43210
              </a>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-12 h-12 rounded-none bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif text-foreground font-light text-lg">Direct Email</p>
              <a href="mailto:hello@aurastudio.in" className="text-foreground/70 hover:text-accent mt-1 inline-block text-xs sm:text-sm transition-colors">
                hello@aurastudio.in
              </a>
            </div>
          </li>
        </ul>

        {/* Highlight Note */}
        <div className="glass-light p-6 rounded-none border border-border/10 text-xs text-foreground/70 leading-relaxed font-light shadow-sm">
          <p className="font-serif font-semibold text-accent uppercase tracking-wider mb-1">Booking Flow Notice:</p>
          Submitting this form logs your inquiry in our database and opens WhatsApp Web/Mobile with all details pre-formatted. This ensures instant booking priority.
        </div>
      </div>

      {/* Form Panel */}
      <div className="lg:col-span-7">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 glass-light p-8 sm:p-12 rounded-none border border-border/10 shadow-2xl relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-glow-accent pointer-events-none blur-[80px] opacity-35" />
          
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-none text-xs">
              {errorMessage}
            </div>
          )}

          {/* Name Field */}
          <div className="flex flex-col gap-2 relative z-10">
            <label htmlFor="name" className="text-xs uppercase tracking-widest text-foreground/75 font-semibold font-mono">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Priya Sharma"
              {...register('name')}
              className="px-4 py-3.5 bg-cardbg/20 border border-border/20 rounded-none text-foreground text-sm focus:border-accent focus:ring-1 focus:ring-accent/25 focus:outline-none transition-all placeholder:text-foreground/35"
            />
            {errors.name && (
              <span className="text-xs text-red-600 font-light mt-0.5">{errors.name.message}</span>
            )}
          </div>

          {/* Contact Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-xs uppercase tracking-widest text-foreground/75 font-semibold font-mono">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="e.g. 9876543210"
                {...register('phone')}
                className="px-4 py-3.5 bg-cardbg/20 border border-border/20 rounded-none text-foreground text-sm focus:border-accent focus:ring-1 focus:ring-accent/25 focus:outline-none transition-all placeholder:text-foreground/35"
              />
              {errors.phone && (
                <span className="text-xs text-red-600 font-light mt-0.5">{errors.phone.message}</span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs uppercase tracking-widest text-foreground/75 font-semibold font-mono">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="e.g. priya@gmail.com"
                {...register('email')}
                className="px-4 py-3.5 bg-cardbg/20 border border-border/20 rounded-none text-foreground text-sm focus:border-accent focus:ring-1 focus:ring-accent/25 focus:outline-none transition-all placeholder:text-foreground/35"
              />
              {errors.email && (
                <span className="text-xs text-red-600 font-light mt-0.5">{errors.email.message}</span>
              )}
            </div>
          </div>

          {/* Event Details Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
            {/* Event Type */}
            <div className="flex flex-col gap-2">
              <label htmlFor="event_type" className="text-xs uppercase tracking-widest text-foreground/75 font-semibold font-mono">
                Event Type
              </label>
              <div className="relative">
                <select
                  id="event_type"
                  {...register('event_type')}
                  className="w-full px-4 py-3.5 bg-[#FCF8EC]/40 border border-border/20 rounded-none text-foreground text-sm focus:border-accent focus:ring-1 focus:ring-accent/25 focus:outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled className="text-foreground/50">Select Event</option>
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type} className="bg-cardbg text-foreground">
                      {type}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-foreground/60">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
              {errors.event_type && (
                <span className="text-xs text-red-600 font-light mt-0.5">{errors.event_type.message}</span>
              )}
            </div>

            {/* Event Date */}
            <div className="flex flex-col gap-2">
              <label htmlFor="event_date" className="text-xs uppercase tracking-widest text-foreground/75 font-semibold font-mono">
                Event Date
              </label>
              <input
                id="event_date"
                type="date"
                {...register('event_date')}
                className="px-4 py-3.5 bg-cardbg/20 border border-border/20 rounded-none text-foreground text-sm focus:border-accent focus:ring-1 focus:ring-accent/25 focus:outline-none transition-all cursor-pointer"
              />
              {errors.event_date && (
                <span className="text-xs text-red-600 font-light mt-0.5">{errors.event_date.message}</span>
              )}
            </div>
          </div>

          {/* Message Field */}
          <div className="flex flex-col gap-2 relative z-10">
            <label htmlFor="message" className="text-xs uppercase tracking-widest text-foreground/75 font-semibold font-mono">
              Inquiry / Message
            </label>
            <textarea
              id="message"
              rows={4}
              placeholder="Tell us about your plans, locations, and styling requests..."
              {...register('message')}
              className="px-4 py-3.5 bg-cardbg/20 border border-border/20 rounded-none text-foreground text-sm focus:border-accent focus:ring-1 focus:ring-accent/25 focus:outline-none transition-all resize-none placeholder:text-foreground/35"
            />
            {errors.message && (
              <span className="text-xs text-red-600 font-light mt-0.5">{errors.message.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 py-4 rounded-none bg-accent hover:bg-accent-hover text-white font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 shadow-md disabled:opacity-50 cursor-pointer relative z-10"
          >
            {isSubmitting ? (
              <span>Sending Inquiry...</span>
            ) : (
              <>
                <span>Submit & Chat on WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
