import { Instagram as InstaIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site-data";

export function Instagram() {
  return (
    <section className="border-t border-border py-24">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <InstaIcon className="mx-auto mb-4 h-10 w-10 text-primary" />
        <h2 className="font-display text-4xl sm:text-5xl">JÄLGI INSTAGRAMIS</h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Vaata viimased lõikused, behind-the-scenes ja eksklusiivsed pakkumised
          @{SITE.instagram} kontolt.
        </p>

        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-2 sm:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <a
              key={i}
              href={`https://instagram.com/${SITE.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-gradient-to-br from-secondary to-card"
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-40 transition-opacity group-hover:opacity-100">
                <InstaIcon className="h-6 w-6 text-primary" />
              </div>
            </a>
          ))}
        </div>

        <Button asChild size="lg" className="mt-10 font-display tracking-wider">
          <a href={`https://instagram.com/${SITE.instagram}`} target="_blank" rel="noopener noreferrer">
            <InstaIcon className="mr-2 h-5 w-5" />
            Jälgi @{SITE.instagram}
          </a>
        </Button>
      </div>
    </section>
  );
}
