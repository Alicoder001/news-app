import { Header } from "@/components/header";
import { TechPattern } from "@/components/tech-pattern";
import { Footer } from "@/components/footer";

export default function WebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative text-foreground transition-colors duration-500 flex flex-col">
      {/* Background decoration - Vibrant gradient orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Primary orb - top left - Deep Blue */}
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-blue-400/25 to-indigo-500/25 dark:from-blue-600/20 dark:to-indigo-700/15 blur-[80px] dark:blur-[120px]" />
        {/* Secondary orb - bottom right - Sky Blue */}
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-sky-400/25 to-blue-500/20 dark:from-sky-600/15 dark:to-blue-700/10 blur-[80px] dark:blur-[120px]" />
        {/* Accent orb - center right - Soft Blue/Indigo */}
        <div className="absolute top-[30%] -right-[5%] w-[40%] h-[50%] rounded-full bg-gradient-to-l from-blue-300/20 to-indigo-400/20 dark:from-blue-500/10 dark:to-indigo-600/8 blur-[60px] dark:blur-[100px]" />
      </div>
      
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
