
"use client"

import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Award, Target } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function AboutPage() {
  const { translations } = useLanguage();
  const t = translations.about;
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section id="about" className="w-full py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-headline font-bold tracking-tight text-foreground sm:text-5xl">{t.title}</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">{t.subtitle}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                    <h2 className="text-3xl font-headline font-bold tracking-tight text-foreground sm:text-4xl">
                        {t.storyTitle}
                    </h2>
                    <p className="mt-6 text-muted-foreground">
                        {t.storyText}
                    </p>
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex items-start gap-4">
                        <Target className="w-8 h-8 text-primary" />
                        <div>
                            <h3 className="font-semibold text-foreground">{t.missionTitle}</h3>
                            <p className="text-sm text-muted-foreground">{t.missionText}</p>
                        </div>
                        </div>
                        <div className="flex items-start gap-4">
                        <Award className="w-8 h-8 text-primary" />
                        <div>
                            <h3 className="font-semibold text-foreground">{t.visionTitle}</h3>
                            <p className="text-sm text-muted-foreground">{t.visionText}</p>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div className="w-full h-80 relative rounded-lg overflow-hidden shadow-lg">
                        <Image src="https://placehold.co/600x400.png" alt={t.imageAlt} layout="fill" objectFit="cover" data-ai-hint="farmer holding compost" />
                    </div>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
