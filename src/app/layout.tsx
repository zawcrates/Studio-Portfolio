import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
// import Navbar from "@/components/Navbar"; // hidden for redesign
import Footer from "@/components/Footer";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Aura Studio | Premium Wedding & Event Photographer Chennai",
    template: "%s | Aura Studio Chennai",
  },
  description: "Aura Studio is a premium, portfolio-first photography and cinematography studio based in Chennai. We capture weddings, pre-weddings, engagements, events, and corporate moments in cinematic style.",
  keywords: ["Wedding Photographer Chennai", "Pre Wedding Photography Chennai", "Event Photographer Chennai", "Corporate Photographer Chennai", "Cinematography Chennai", "Aura Studio"],
  authors: [{ name: "Aura Studio" }],
  openGraph: {
    title: "Aura Studio | Premium Wedding & Event Photographer Chennai",
    description: "Premium cinematic wedding and event photography studio based in Chennai. Browse our portfolio and book your session.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aura Studio | Premium Photographer Chennai",
    description: "Premium cinematic wedding and event photography studio based in Chennai.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="antialiased min-h-screen flex flex-col justify-between">
        {/* <Navbar /> — hidden for redesign */}
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
