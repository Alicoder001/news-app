export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="space-y-6 text-center">
        {/* Animated Loader */}
        <div className="relative w-12 h-12 mx-auto">
          <div className="absolute inset-0 rounded-full border-2 border-foreground/10" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-foreground animate-spin" />
        </div>

        {/* Loading Text */}
        <p className="text-sm text-muted-foreground font-medium tracking-wide">
          Yuklanmoqda...
        </p>
      </div>
    </div>
  );
}
