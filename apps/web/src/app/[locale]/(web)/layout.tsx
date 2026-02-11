import { Header } from "@/components/header";
import { TechPattern } from "@/components/tech-pattern";
import { Footer } from "@/components/footer";
import { NeonOrbs } from "@/components/neon-orbs";
import { AdBanner } from "@/components/ad-banner";

export default function WebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative text-foreground transition-colors duration-500 flex flex-col">
      {/* Animated Neon Background */}
      <NeonOrbs />
      
      {/* AI/Tech themed SVG pattern overlay */}
      <TechPattern />
      
      <Header />
      
      <main className="relative z-10 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 py-4 pt-16 flex-1 w-full">
        {/* Top Leaderboard Ad */}
        <div className="w-full flex justify-center mb-4">
          <AdBanner slot="top-leaderboard" format="leaderboard" />
        </div>
        {children}
      </main>

      <Footer />
    </div>
  );
}
