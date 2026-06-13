# Photo Studio Portfolio Website

## Project Vision

Build a premium, portfolio-first photography website that showcases the studio's best work, generates leads through WhatsApp and Email, and allows the studio owner to manage portfolio content through a simple admin dashboard.

The website should feel elegant, cinematic, and visually immersive while maintaining excellent performance and SEO.

---

# Core Objectives

## Business Objectives

* Establish a professional online presence
* Showcase photography work effectively
* Increase inquiries and bookings
* Improve local search visibility
* Enable easy portfolio management

## User Objectives

Visitors should be able to:

* View photography work
* Browse services
* Learn about the studio
* Contact the studio easily
* Reach WhatsApp instantly

---

# Target Audience

## Primary Audience

* Wedding Clients
* Pre-Wedding Clients
* Engagement Couples
* Families

## Secondary Audience

* Event Organizers
* Corporate Clients
* Brands
* Content Creators

---

# Website Architecture

## Public Website

### Home

Sections:

1. Navigation
2. Hero Gallery
3. Studio Introduction
4. Featured Portfolio
5. Services Overview
6. Testimonials
7. Contact CTA
8. Footer

---

### Portfolio

Categories:

* Weddings
* Pre-Weddings
* Engagements
* Maternity
* Events
* Corporate

Structure:

Portfolio
→ Category
→ Album
→ Gallery

Example:

/portfolio/weddings

/portfolio/sarah-john-wedding-chennai

---

### Services

Dedicated service pages:

* Wedding Photography
* Pre-Wedding Photography
* Event Photography
* Corporate Photography
* Cinematography
* Drone Coverage

Each page includes:

* Hero Section
* Portfolio Samples
* Service Details
* Testimonials
* Contact CTA

---

### About

Sections:

* Studio Story
* Founder Introduction
* Team
* Behind The Scenes

---

### Contact

Fields:

* Name
* Phone
* Email
* Event Type
* Event Date
* Message

Actions:

* WhatsApp Inquiry
* Email Inquiry

---

# Admin Dashboard

Route:

/admin

Protected using Supabase Authentication.

---

## Dashboard

Overview Statistics:

* Total Albums
* Total Photos
* Recent Updates

---

## Hero Management

Features:

* Upload Hero Images
* Delete Hero Images
* Reorder Images

---

## Portfolio Management

Features:

* Create Album
* Edit Album
* Delete Album
* Upload Photos
* Remove Photos
* Change Album Cover

---

## Inquiry Management

Features:

* View Inquiries
* Track Inquiry Status

Status Options:

* New
* Contacted
* Closed

---

# Inquiry Flow

## WhatsApp

Primary Lead Channel

Visitor submits form.

System generates:

* Name
* Event Type
* Event Date
* Message

Redirects to WhatsApp with a pre-filled message.

---

## Email

Secondary Lead Channel

Studio receives inquiry via email.

---

# Database Structure

## albums

Fields:

* id
* title
* slug
* category
* cover_image
* created_at

---

## photos

Fields:

* id
* album_id
* image_url
* created_at

---

## hero_images

Fields:

* id
* image_url
* display_order

---

## inquiries

Fields:

* id
* name
* phone
* email
* event_type
* event_date
* message
* status
* created_at

---

# Storage Structure

hero/

albums/

studio/

---

# SEO Strategy

## Local SEO Focus

Target Location:

* Chennai (configurable)

Primary Keywords:

* Wedding Photographer Chennai
* Pre Wedding Photography Chennai
* Event Photographer Chennai
* Corporate Photographer Chennai

---

## SEO-Friendly URLs

Examples:

/wedding-photography-chennai

/pre-wedding-photography-chennai

/event-photography-chennai

/portfolio/sarah-john-wedding-chennai

---

## Metadata

Every page should include:

* Unique Title
* Description
* Open Graph Tags
* Twitter Cards

---

## Image SEO

Requirements:

* Descriptive file names
* Optimized image sizes
* Meaningful alt text

Example:

"Bride and groom wedding ceremony in Chennai"

---

## Technical SEO

* Sitemap.xml
* Robots.txt
* Structured Data
* Local Business Schema
* Fast Loading Pages
* Mobile Optimization

---

# Design System

## Visual Direction

Style:

* Premium
* Elegant
* Minimal
* Cinematic

---

## Design Principles

* Portfolio First
* Large Visuals
* Clean Typography
* Smooth Animations
* Mobile First

---

# Technology Stack

## Frontend

* Next.js 15
* TypeScript
* Tailwind CSS
* Framer Motion

## Backend

* Supabase Auth
* Supabase Database
* Supabase Storage

## Deployment

* Vercel

## Communication

* WhatsApp Integration
* Email Integration

---

# Future Roadmap

## Phase 2

Client Galleries

Features:

* Private Gallery Links
* Password Protection
* Photo Downloads
* Favorites Selection

---

## Phase 3

Advanced Business Features

* Online Booking
* Package Management
* Payment Integration
* CRM Integration
* Automated Quotations

---

# MVP Deliverables

## Public Website

* Home
* Portfolio
* Services
* About
* Contact

## Dashboard

* Login
* Hero Management
* Portfolio Management
* Inquiry Management

## Integrations

* WhatsApp Redirect
* Email Contact
* SEO Foundation

---

# Success Metrics

* Fast Loading Speed
* Mobile Responsiveness
* SEO Visibility
* Inquiry Conversion Rate
* Ease of Content Management
* Professional Brand Presentation
