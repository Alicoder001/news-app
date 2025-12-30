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
            {/* Background decoration - Subtler, deep atmospheric glow */}
            <div className="fixed top-[-20%] left-[-20%] w-[70%] h-[70%] bg-purple-900/[0.03] dark:bg-purple-900/[0.08] rounded-full blur-[180px] pointer-events-none" />
            <div className="fixed bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-blue-900/[0.03] dark:bg-blue-900/[0.08] rounded-full blur-[180px] pointer-events-none" />
            
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
