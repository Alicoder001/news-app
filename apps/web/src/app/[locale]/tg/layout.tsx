import type { Metadata } from "next";
import { TelegramProvider } from "@/components/telegram-provider";

export const metadata: Metadata = {
  title: "Aishunos | Telegram Mini App",
  description: "IT yangiliklari - Telegram Mini App",
};

export default function TelegramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TelegramProvider>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background decoration - same as main website */}
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <main className="relative z-10">
          {children}
        </main>
      </div>
    </TelegramProvider>
  );
}
