import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
    <html lang="uz">
      <head>
        {/* Telegram WebApp SDK */}
        <script src="https://telegram.org/js/telegram-web-app.js" async></script>
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen relative overflow-hidden">
          {/* Background decoration */}
          <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
          
          <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
