import React from 'react';
import { Sparkles, Moon, Sun, Sunrise } from 'lucide-react';

interface HeroBannerProps {
  creatorName: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ creatorName }) => {
  // Determine greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', icon: Sunrise };
    if (hour < 18) return { text: 'Good Afternoon', icon: Sun };
    return { text: 'Good Evening', icon: Moon };
  };

  const { text: greetingText, icon: GreetingIcon } = getGreeting();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#171336] via-[#101428] to-[#1c1232] border border-purple-500/25 p-6 sm:p-7 shadow-2xl shadow-purple-950/30">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-0 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left: Greeting and Motivational Subtitle */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600/30 to-pink-600/30 border border-purple-400/30 flex items-center justify-center text-purple-300 shadow-inner flex-shrink-0">
            <GreetingIcon className="w-6 h-6 text-purple-300" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit'] flex items-center gap-2">
              <span>{greetingText}, {creatorName}</span>
              <span className="inline-block animate-bounce">👋</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
              Your creativity turns special moments into unforgettable memories.
            </p>
          </div>
        </div>

        {/* Right: Cosmic Celestial Badge */}
        <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[#0c101e]/80 border border-purple-500/30 backdrop-blur-md shadow-lg shadow-black/40">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-rose-400 animate-pulse" />
          <div className="text-right">
            <span className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-purple-300 italic font-['Outfit']">
              ✦ More Birthdays More Happiness ✦
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
