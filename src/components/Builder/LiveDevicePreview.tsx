import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { BirthdaySiteData } from '../../types';
import {
  Smartphone,
  Tablet,
  Monitor,
  Volume2,
  VolumeX,
  Sparkles,
  Gift,
  Mail,
  Heart,
  Calendar,
  Clock,
  PartyPopper,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Check,
  ChevronRight
} from 'lucide-react';

interface LiveDevicePreviewProps {
  data: BirthdaySiteData;
  deviceMode: 'desktop' | 'tablet' | 'mobile';
  setDeviceMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
}

export const LiveDevicePreview: React.FC<LiveDevicePreviewProps> = ({
  data,
  deviceMode,
  setDeviceMode,
}) => {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [openedGifts, setOpenedGifts] = useState<{ [id: string]: boolean }>({});
  const [poppedBalloons, setPoppedBalloons] = useState<number[]>([]);
  const [zoomScale, setZoomScale] = useState(1);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: [data.themeConfig.primaryColor, data.themeConfig.accentColor, '#fbbf24', '#38bdf8'],
      });
    } catch (e) {
      // ignore
    }
  };

  const handlePopBalloon = (idx: number) => {
    if (!poppedBalloons.includes(idx)) {
      setPoppedBalloons([...poppedBalloons, idx]);
      triggerConfetti();
    }
  };

  const handleToggleGift = (giftId: string) => {
    setOpenedGifts((prev) => ({
      ...prev,
      [giftId]: !prev[giftId],
    }));
    triggerConfetti();
  };

  // Device width classes
  const getContainerStyles = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'w-[375px] max-w-full rounded-[44px] shadow-2xl ring-[10px] ring-zinc-800/90';
      case 'tablet':
        return 'w-[680px] max-w-full rounded-[36px] shadow-2xl ring-[10px] ring-zinc-800/90';
      case 'desktop':
      default:
        return 'w-full max-w-4xl rounded-2xl shadow-2xl border border-zinc-800';
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950/60 rounded-3xl border border-zinc-800/80 overflow-hidden">
      
      {/* Top Device & Control Bar */}
      <div className="p-3 sm:px-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between gap-3 flex-wrap">
        
        {/* Device Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-950 border border-zinc-800">
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              deviceMode === 'mobile' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              deviceMode === 'tablet' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet</span>
          </button>
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              deviceMode === 'desktop' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
        </div>

        {/* Live Simulation Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Confetti Trigger */}
          <button
            onClick={triggerConfetti}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all cursor-pointer active:scale-95"
            title="Shoot celebration confetti"
          >
            <PartyPopper className="w-3.5 h-3.5" />
            <span>Shoot Confetti</span>
          </button>

          {/* Music Preview Toggle */}
          {data.music.enabled && (
            <button
              onClick={() => setIsPlayingMusic(!isPlayingMusic)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isPlayingMusic
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}
              title="Preview background audio track"
            >
              {isPlayingMusic ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{isPlayingMusic ? 'Music Playing' : 'Test Music'}</span>
            </button>
          )}

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400">
            <button
              onClick={() => setZoomScale(Math.max(0.7, zoomScale - 0.1))}
              className="p-1 hover:text-zinc-200"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[10px] w-9 text-center">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              onClick={() => setZoomScale(Math.min(1.2, zoomScale + 0.1))}
              className="p-1 hover:text-zinc-200"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Simulator Viewport Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-zinc-950/90 relative">
        
        {/* The Device Frame */}
        <div
          style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top center' }}
          className={`transition-all duration-300 overflow-hidden bg-zinc-950 flex flex-col relative ${getContainerStyles()}`}
        >
          
          {/* Phone Status Bar (if mobile) */}
          {deviceMode === 'mobile' && (
            <div className="h-9 w-full bg-zinc-950 px-6 flex items-center justify-between text-[11px] text-zinc-400 select-none shrink-0 border-b border-zinc-900">
              <span className="font-semibold">9:41</span>
              {/* Dynamic Island / Pill */}
              <div className="w-20 h-4 bg-zinc-900 rounded-full mx-auto" />
              <div className="flex items-center gap-1 font-mono text-[10px]">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Real simulated Birthday Website Content */}
          <div className="overflow-y-auto max-h-[720px] no-scrollbar text-zinc-100 selection:bg-rose-500/30">
            
            {/* Hero Section */}
            <div className="relative p-6 sm:p-10 text-center overflow-hidden bg-gradient-to-b from-rose-950/30 via-zinc-950 to-zinc-950">
              
              {/* Floating Balloons Simulation */}
              <div className="flex justify-center gap-3 mb-4">
                {[0, 1, 2, 3].map((idx) => {
                  const isPopped = poppedBalloons.includes(idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => handlePopBalloon(idx)}
                      className={`text-2xl transition-all duration-300 cursor-pointer ${
                        isPopped ? 'scale-0 opacity-0' : 'hover:scale-125 animate-bounce'
                      }`}
                      style={{ animationDelay: `${idx * 180}ms` }}
                      title="Tap to pop balloon!"
                    >
                      🎈
                    </button>
                  );
                })}
              </div>

              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20 mb-3">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{data.hero.badgeText}</span>
              </div>

              {/* Main Title */}
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-['Outfit'] mb-2 text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-rose-200 to-amber-200">
                {data.hero.title}
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed mb-6">
                {data.hero.subtitle}
              </p>

              {/* Countdown Clock Widget */}
              {data.countdown.enabled && (
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-lg mb-6">
                  <Clock className="w-4 h-4 text-rose-400" />
                  <div className="flex items-center gap-2 text-xs font-mono font-bold">
                    <span className="text-amber-400">12 Days</span>
                    <span className="text-zinc-600">:</span>
                    <span className="text-zinc-200">08 Hours</span>
                    <span className="text-zinc-600">:</span>
                    <span className="text-rose-400">45 Mins</span>
                  </div>
                </div>
              )}

              {/* Interactive Open Birthday Letter Button */}
              <div>
                <button
                  onClick={() => setIsLetterOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-zinc-950 bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 shadow-lg shadow-rose-950/40 active:scale-95 transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Unseal Birthday Letter</span>
                </button>
              </div>

            </div>

            {/* Photo Memories Gallery */}
            {data.memories.length > 0 && (
              <div className="p-5 sm:p-8 border-t border-zinc-900 bg-zinc-950/40">
                <div className="text-center mb-5">
                  <h3 className="text-sm sm:text-base font-bold text-zinc-100 font-['Outfit']">
                    📸 Favorite Memories & Moments
                  </h3>
                  <p className="text-[11px] text-zinc-500">Every photo tells a magical story</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {data.memories.map((mem) => (
                    <div
                      key={mem.id}
                      className="rounded-2xl bg-zinc-900 border border-zinc-800/80 overflow-hidden shadow-sm group hover:border-zinc-700 transition-all"
                    >
                      <div className="h-36 w-full overflow-hidden bg-zinc-800 relative">
                        <img
                          src={mem.imageUrl}
                          alt={mem.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {mem.tag && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-950/80 text-amber-300 border border-zinc-700">
                            {mem.tag}
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <h4 className="text-xs font-bold text-zinc-200 line-clamp-1">{mem.title}</h4>
                        <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">{mem.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wishes Wall */}
            {data.wishes.length > 0 && (
              <div className="p-5 sm:p-8 border-t border-zinc-900">
                <div className="text-center mb-5">
                  <h3 className="text-sm sm:text-base font-bold text-zinc-100 font-['Outfit']">
                    💌 Warm Wishes & Messages
                  </h3>
                  <p className="text-[11px] text-zinc-500">From the people who love you most</p>
                </div>

                <div className="space-y-2.5 max-w-lg mx-auto">
                  {data.wishes.map((wish) => (
                    <div
                      key={wish.id}
                      className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-3"
                    >
                      {wish.avatarUrl ? (
                        <img
                          src={wish.avatarUrl}
                          alt={wish.from}
                          className="w-9 h-9 rounded-full object-cover shrink-0 border border-zinc-700"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 text-xs font-bold">
                          {wish.from.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-200">{wish.from}</span>
                          {wish.relationship && (
                            <span className="text-[10px] text-zinc-500">({wish.relationship})</span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 mt-1 leading-relaxed italic">
                          &ldquo;{wish.message}&rdquo;
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Surprise Gift Boxes */}
            {data.gifts.length > 0 && (
              <div className="p-5 sm:p-8 border-t border-zinc-900 bg-zinc-950/40 text-center">
                <h3 className="text-sm sm:text-base font-bold text-zinc-100 font-['Outfit'] mb-1">
                  🎁 Mystery Birthday Surprises
                </h3>
                <p className="text-[11px] text-zinc-500 mb-5">Tap any package to unwrap your surprise</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
                  {data.gifts.map((gift) => {
                    const isOpened = Boolean(openedGifts[gift.id]);
                    return (
                      <div
                        key={gift.id}
                        onClick={() => handleToggleGift(gift.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                          isOpened
                            ? 'bg-amber-500/10 border-amber-500/40'
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:scale-102'
                        }`}
                      >
                        <div className="text-3xl mb-2 animate-bounce">
                          {isOpened ? '🎉' : '🎁'}
                        </div>
                        <div className="text-xs font-bold text-zinc-200 font-['Outfit']">
                          {gift.title}
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1">
                          {isOpened ? gift.revealMessage : gift.hint}
                        </p>
                        <span className="inline-block mt-2 text-[10px] font-semibold text-rose-400">
                          {isOpened ? '✓ Unwrapped' : 'Tap to open'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="p-6 text-center text-xs text-zinc-600 border-t border-zinc-900">
              Made with love for {data.recipient.name} ✨
            </div>

          </div>

          {/* Letter Modal (Digital Wax Seal Parchment) */}
          {isLetterOpen && (
            <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
              <div className="relative w-full max-w-sm bg-[#1c1917] border border-amber-700/40 rounded-3xl p-6 text-zinc-200 shadow-2xl space-y-4 max-h-[90%] overflow-y-auto">
                
                {/* Wax Seal Header */}
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-rose-700 text-rose-100 flex items-center justify-center mx-auto text-xl font-serif font-bold shadow-lg ring-4 ring-rose-900/60 mb-2">
                    {data.recipient.name.charAt(0)}
                  </div>
                  <h3 className="text-base font-bold font-serif text-amber-200">
                    {data.letter.title}
                  </h3>
                  <div className="text-[11px] text-amber-400/80 italic">
                    From: {data.letter.senderName}
                  </div>
                </div>

                {/* Letter Body */}
                <div className="space-y-2.5 text-xs leading-relaxed text-stone-300 font-serif">
                  {data.letter.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                {/* Signature */}
                <div className="pt-2 border-t border-amber-900/50 text-right font-serif text-amber-300 italic text-xs">
                  {data.letter.signature}
                </div>

                {/* Close */}
                <button
                  onClick={() => setIsLetterOpen(false)}
                  className="w-full py-2 rounded-xl text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 transition-colors cursor-pointer"
                >
                  Fold & Close Letter
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
