import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IT News | AI Powered Tech Media",
  description: "Avtomatlashtirilgan IT va texnologiya sohasidagi yangiliklar platformasi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        {/* Telegram WebApp SDK */}
        <script src="https://telegram.org/js/telegram-web-app.js" async></script>
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen relative overflow-hidden bg-background text-foreground transition-colors duration-1000">
            {/* Background decoration - Vibrant and deep to provide the "wow" factor */}
            <div className="fixed top-[-15%] left-[-15%] w-[60%] h-[60%] bg-purple-600/[0.1] dark:bg-purple-600/[0.2] rounded-full blur-[160px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="fixed bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-blue-600/[0.1] dark:bg-blue-600/[0.2] rounded-full blur-[160px] pointer-events-none animate-pulse" style={{ animationDuration: '12s' }} />
            <div className="fixed top-[20%] right-[10%] w-[30%] h-[30%] bg-pink-500/[0.05] dark:bg-pink-500/[0.1] rounded-full blur-[120px] pointer-events-none" />
            
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
