import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Booking } from "@/components/site/Booking";
import { Services } from "@/components/site/Services";
import { Gallery } from "@/components/site/Gallery";
import { About } from "@/components/site/About";
import { Testimonials } from "@/components/site/Testimonials";
import { Instagram } from "@/components/site/Instagram";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { StickyBookingButton } from "@/components/site/StickyBookingButton";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FaderShifu Barber Shop — Täpsed lõiked. Eliitfeidid." },
      {
        name: "description",
        content:
          "FaderShifu Barber Shop Tallinnas — premium feidid, juukselõikused ja habemehooldus. Broneeri aeg veebis.",
      },
      { property: "og:title", content: "FaderShifu Barber Shop — Tallinn" },
      { property: "og:description", content: "Eliitfeidid ja habemekunst. Broneeri aeg veebis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Booking />
        <Services />
        <Gallery />
        <About />
        <Testimonials />
        <Instagram />
        <Contact />
      </main>
      <Footer />
      <StickyBookingButton />
      <Toaster theme="dark" position="top-center" richColors />
    </div>
  );
}
