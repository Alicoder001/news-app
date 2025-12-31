import { Header } from "@/components/header";

export default function WebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative bg-background text-foreground transition-colors duration-1000">
      {/* Background decoration - Subtler, deep atmospheric glow */}
      <div className="fixed top-[-20%] left-[-20%] w-[70%] h-[70%] bg-purple-900/[0.03] dark:bg-purple-900/[0.08] rounded-full blur-[180px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-blue-900/[0.03] dark:bg-blue-900/[0.08] rounded-full blur-[180px] pointer-events-none" />
      
      <Header />
      
      <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-12 pt-20">
        {children}
      </main>
    </div>
  );
}
