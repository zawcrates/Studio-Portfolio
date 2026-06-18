'use strict';

'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, MessageSquare, Phone, Mail, MapPin } from 'lucide-react';
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-8 sm:p-12 rounded-3xl border border-accent/30 text-center flex flex-col items-center gap-6 max-w-lg mx-auto shadow-2xl shadow-gold/5"
      >
        <CheckCircle2 className="w-16 h-16 text-accent animate-bounce" />
        <h2 className="font-serif text-3xl text-foreground font-light">Inquiry Received!</h2>
        <p className="text-gray-300 font-light text-sm sm:text-base leading-relaxed">
          Thank you for reaching out to Aura Studio. We have successfully logged your session details. 
        </p>
        <p className="text-accent font-light text-xs uppercase tracking-widest mt-2">
          Redirecting to WhatsApp to start your chat...
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="mt-4 text-xs font-semibold text-gray-400 hover:text-foreground uppercase tracking-widest underline underline-offset-4 transition-colors"
        >
          Submit another inquiry
        </button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
      {/* Contact Details Panel */}
      <div className="lg:col-span-5 flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <span className="text-accent tracking-[0.2em] text-xs uppercase font-semibold">
            Get in touch
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground font-light">
            Let's Talk About Your Shoot
          </h2>
          <p className="text-gray-400 font-light leading-relaxed text-sm sm:text-base">
            Have a date in mind or want to discuss packaging options? Fill out the form, and let's bring your vision to life.
          </p>
        </div>

        <ul className="flex flex-col gap-6 font-light text-sm text-gray-300 border-t border-border/5 pt-8">
          <li className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif text-foreground font-medium text-base">Studio Address</p>
              <p className="text-gray-400 mt-1 text-xs sm:text-sm">
                12, Khader Nawaz Khan Rd, Nungambakkam, Chennai, Tamil Nadu 600006
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif text-foreground font-medium text-base">Phone Inquiries</p>
              <a href="tel:+919876543210" className="text-gray-400 hover:text-accent mt-1 inline-block text-xs sm:text-sm">
                +91 98765 43210
              </a>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif text-foreground font-medium text-base">Direct Email</p>
              <a href="mailto:hello@aurastudio.in" className="text-gray-400 hover:text-accent mt-1 inline-block text-xs sm:text-sm">
                hello@aurastudio.in
              </a>
            </div>
          </li>
        </ul>

        {/* Highlight Note */}
        <div className="glass p-6 rounded-2xl border border-border/5 text-xs text-gray-400 leading-relaxed font-light">
          <p className="font-semibold text-foreground uppercase tracking-wider mb-1">Lead Flow Notice:</p>
          Submitting this form logs your inquiry in our database and opens WhatsApp Web/Mobile with all details pre-formatted. This ensures instant booking priority.
        </div>
      </div>

      {/* Form Form */}
      <div className="lg:col-span-7">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 glass p-8 sm:p-10 rounded-3xl border border-border/5 shadow-2xl">
          {errorMessage && (
            <div className="p-4 bg-red-950/40 border border-red-500/20 text-red-200 rounded-xl text-xs">
              {errorMessage}
            </div>
          )}

          {/* Name Field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Priya Sharma"
              {...register('name')}
              className="px-4 py-3.5 bg-background border border-border/10 rounded-xl text-foreground text-sm focus:border-accent focus:outline-none transition-colors placeholder:text-gray-600"
            />
            {errors.name && (
              <span className="text-xs text-red-400 font-light mt-0.5">{errors.name.message}</span>
            )}
          </div>

          {/* Contact Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="e.g. 9876543210"
                {...register('phone')}
                className="px-4 py-3.5 bg-background border border-border/10 rounded-xl text-foreground text-sm focus:border-accent focus:outline-none transition-colors placeholder:text-gray-600"
              />
              {errors.phone && (
                <span className="text-xs text-red-400 font-light mt-0.5">{errors.phone.message}</span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="e.g. priya@gmail.com"
                {...register('email')}
                className="px-4 py-3.5 bg-background border border-border/10 rounded-xl text-foreground text-sm focus:border-accent focus:outline-none transition-colors placeholder:text-gray-600"
              />
              {errors.email && (
                <span className="text-xs text-red-400 font-light mt-0.5">{errors.email.message}</span>
              )}
            </div>
          </div>

          {/* Event Details Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Event Type */}
            <div className="flex flex-col gap-2">
              <label htmlFor="event_type" className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                Event Type
              </label>
              <select
                id="event_type"
                {...register('event_type')}
                className="px-4 py-3.5 bg-background border border-border/10 rounded-xl text-foreground text-sm focus:border-accent focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="" disabled className="text-gray-700">Select Event</option>
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type} className="bg-card text-foreground">
                    {type}
                  </option>
                ))}
              </select>
              {errors.event_type && (
                <span className="text-xs text-red-400 font-light mt-0.5">{errors.event_type.message}</span>
              )}
            </div>

            {/* Event Date */}
            <div className="flex flex-col gap-2">
              <label htmlFor="event_date" className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                Event Date
              </label>
              <input
                id="event_date"
                type="date"
                {...register('event_date')}
                className="px-4 py-3.5 bg-background border border-border/10 rounded-xl text-foreground text-sm focus:border-accent focus:outline-none transition-colors cursor-pointer"
              />
              {errors.event_date && (
                <span className="text-xs text-red-400 font-light mt-0.5">{errors.event_date.message}</span>
              )}
            </div>
          </div>

          {/* Message Field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
              Inquiry / Message
            </label>
            <textarea
              id="message"
              rows={4}
              placeholder="Tell us about your plans, locations, and styling requests..."
              {...register('message')}
              className="px-4 py-3.5 bg-background border border-border/10 rounded-xl text-foreground text-sm focus:border-accent focus:outline-none transition-colors resize-none placeholder:text-gray-600"
            />
            {errors.message && (
              <span className="text-xs text-red-400 font-light mt-0.5">{errors.message.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 py-4 rounded-xl bg-accent hover:bg-accent-hover text-black font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Sending Inquiry...</span>
            ) : (
              <>
                <span>Submit & Chat on WhatsApp</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
