export interface Photo {
  id: string;
  image_url: string;
}

export interface Album {
  id: string;
  title: string;
  slug: string;
  category: string;
  cover_image: string;
  created_at: string;
  description?: string;
  photos: Photo[];
}

export interface HeroImage {
  id: string;
  image_url: string;
  display_order: number;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  coverImage: string;
  features: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  image: string;
}

export const MOCK_HERO_IMAGES: HeroImage[] = [
  {
    id: 'hero-1',
    image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1920&auto=format&fit=crop',
    display_order: 1,
  },
  {
    id: 'hero-2',
    image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1920&auto=format&fit=crop',
    display_order: 2,
  },
  {
    id: 'hero-3',
    image_url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1920&auto=format&fit=crop',
    display_order: 3,
  },
];

export const MOCK_ALBUMS: Album[] = [
  {
    id: 'album-1',
    title: 'Sarah & John Wedding',
    slug: 'sarah-john-wedding-chennai',
    category: 'weddings',
    cover_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    created_at: '2026-05-15T08:00:00Z',
    description: 'An elegant traditional-meets-modern wedding celebration held at the Leela Palace, Chennai.',
    photos: [
      { id: 'p1-1', image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop' },
      { id: 'p1-2', image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop' },
      { id: 'p1-3', image_url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop' },
      { id: 'p1-4', image_url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop' },
      { id: 'p1-5', image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop' },
      { id: 'p1-6', image_url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1200&auto=format&fit=crop' },
    ],
  },
  {
    id: 'album-2',
    title: 'Aditi & Rahul Pre-Wedding',
    slug: 'aditi-rahul-pre-wedding-mahabalipuram',
    category: 'pre-weddings',
    cover_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop',
    created_at: '2026-04-20T08:00:00Z',
    description: 'A sunrise pre-wedding session capturing love against the backdrop of historical Shore Temple ruins and beach waves in Mahabalipuram.',
    photos: [
      { id: 'p2-1', image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop' },
      { id: 'p2-2', image_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1200&auto=format&fit=crop' },
      { id: 'p2-3', image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop' },
      { id: 'p2-4', image_url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=1200&auto=format&fit=crop' },
    ],
  },
  {
    id: 'album-3',
    title: 'Meera & Siddharth Engagement',
    slug: 'meera-siddharth-engagement',
    category: 'engagements',
    cover_image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1200&auto=format&fit=crop',
    created_at: '2026-05-02T08:00:00Z',
    description: 'A modern, intimate ring exchange ceremony at the Taj Connemara with elegant floral decor.',
    photos: [
      { id: 'p3-1', image_url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1200&auto=format&fit=crop' },
      { id: 'p3-2', image_url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=1200&auto=format&fit=crop' },
      { id: 'p3-3', image_url: 'https://images.unsplash.com/photo-1621616875450-79f224480400?q=80&w=1200&auto=format&fit=crop' },
    ],
  },
  {
    id: 'album-4',
    title: 'Aanchal Maternity Session',
    slug: 'aanchal-maternity-session-chennai',
    category: 'maternity',
    cover_image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1200&auto=format&fit=crop',
    created_at: '2026-03-12T08:00:00Z',
    description: 'A dreamy, natural light indoor and outdoor maternity photoshoot displaying the joy of motherhood.',
    photos: [
      { id: 'p4-1', image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1200&auto=format&fit=crop' },
      { id: 'p4-2', image_url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1200&auto=format&fit=crop' },
    ],
  },
  {
    id: 'album-5',
    title: 'TEDx Chennai 2026',
    slug: 'tedx-chennai-2026-event',
    category: 'events',
    cover_image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
    created_at: '2026-02-28T08:00:00Z',
    description: 'Capturing dynamic speakers, high-energy performances, and enthusiastic audience interactions at the TEDx Chennai event.',
    photos: [
      { id: 'p5-1', image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop' },
      { id: 'p5-2', image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop' },
      { id: 'p5-3', image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop' },
    ],
  },
  {
    id: 'album-6',
    title: 'Zoho Corporate Portraits',
    slug: 'zoho-corporate-portraits-2026',
    category: 'corporate',
    cover_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    created_at: '2026-01-15T08:00:00Z',
    description: 'Clean, modern executive portraits and workspace lifestyle shots for brand identity and corporate usage.',
    photos: [
      { id: 'p6-1', image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop' },
      { id: 'p6-2', image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop' },
      { id: 'p6-3', image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop' },
    ],
  },
];

export const SERVICES: Service[] = [
  {
    id: 's-wedding',
    title: 'Wedding Photography',
    slug: 'wedding-photography-chennai',
    description: 'Cinematic storytelling of your special day, capturing raw emotions, beautiful rituals, and grand celebrations.',
    longDescription: 'Our signature service provides a complete visual narrative of your wedding. We balance editorial style portraits with candid reportage, ensuring every smile, tear, and dance move is captured in stunning clarity. Utilizing advanced camera bodies, lighting rigs, and professional color grading, we preserve your memories as premium visual art.',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    features: [
      'Two principal photographers',
      'High-resolution edited digital gallery',
      'Luxury leather-bound wedding album (40 pages)',
      'Complimentary consultation & planning session',
      'Online password-protected shareable gallery',
    ],
  },
  {
    id: 's-pre-wedding',
    title: 'Pre-Wedding Photography',
    slug: 'pre-wedding-photography-chennai',
    description: 'Dreamy outdoor couples shoots at scenic beaches, monuments, and locations tailored to your love story.',
    longDescription: 'A custom-tailored creative session that showcases your unique chemistry as a couple. We assist with location selection (from serene Mahabalipuram beaches to heritage properties), styling direction, and conceptual storytelling. This session also helps you get comfortable in front of the camera before the big day.',
    coverImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop',
    features: [
      '4-6 hours creative session',
      'Multiple outfits & conceptual themes',
      'Cinematic teaser video (60 seconds)',
      '40 fully-retouched premium digital images',
      'Aerial drone coverage where permitted',
    ],
  },
  {
    id: 's-event',
    title: 'Event Photography',
    slug: 'event-photography-chennai',
    description: 'Premium coverage for corporate conferences, speaker summits, cultural performances, and private parties.',
    longDescription: 'Professional coverage for event planners and hosts. We capture keynote speakers, guest engagement, branding collateral, atmospheric setups, and natural event flow, delivering highly polished promotional content optimized for social media, PR campaigns, and internal documentation.',
    coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
    features: [
      'Candid & key-moment event coverage',
      'Next-day highlight delivery for social media',
      'High-speed digital delivery of complete set',
      'Branding & sponsor activation focus',
      'Unlimited usage rights for marketing',
    ],
  },
  {
    id: 's-corporate',
    title: 'Corporate & Brands',
    slug: 'corporate-photography-chennai',
    description: 'High-end headshots, team culture portraits, product shoots, and creative visual assets for brand marketing.',
    longDescription: 'Elevate your brand with professional corporate visual assets. We design custom-lit business portraits, corporate lifestyle images, and office workspace photos that communicate professionalism, transparency, and high quality for website bios, LinkedIn, and annual corporate reports.',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    features: [
      'Studio-lit corporate headshots',
      'Executive board portraits',
      'Workspace office lifestyle catalog',
      'Professional color grading & blemish retouching',
      'Corporate branding identity alignment',
    ],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Sarah & Johnathan',
    role: 'Wedding Clients',
    text: 'Aura Studio exceeded every expectation! Their team was incredibly professional, blended into the crowd seamlessly, and captured emotions we did not even realize were happening. The final gallery was pure cinematic magic.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
  },
  {
    id: 't-2',
    name: 'Rohan Sharma',
    role: 'Corporate Communications, Zoho',
    text: 'We hired Aura Studio for our annual corporate meet and executive portraits. Their attention to lighting, posture, and brand guidelines was top-notch. Highly recommend for any business requiring premium corporate assets.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
  },
  {
    id: 't-3',
    name: 'Aditi & Rahul',
    role: 'Pre-Wedding Couple',
    text: 'Our beach photoshoot was spectacular. The photographers made us feel extremely comfortable, gave clear directions, and the drone shots were breathtaking. We will cherish these memories forever!',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
  },
];
