import { Header } from "@/components/header";
import { TechPattern } from "@/components/tech-pattern";
import { Footer } from "@/components/footer";
import { NeonOrbs } from "@/components/neon-orbs";

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
      
      <main className="relative z-10 max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16 py-12 pt-20 flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}
