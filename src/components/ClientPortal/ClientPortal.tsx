import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ExternalLink,
  Play,
  Heart,
  Mail,
  Phone,
  CheckCircle2,
  Send,
  Calendar,
  Gift,
  Music,
  Clock,
  ShieldCheck,
  ChevronRight,
  X,
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';
import { Project, ClientRequest, AppSettings, WebsiteOccasion } from '../../types';
import { formatPrice } from '../../utils/formatters';

interface ClientPortalProps {
  projects: Project[];
  settings: AppSettings;
  onOpenAdminLogin: () => void;
  onSubmitOrder: (order: Partial<ClientRequest>) => Promise<void>;
}

const OCCASION_CATEGORIES: { id: 'all' | WebsiteOccasion; label: string; icon: string; description: string }[] = [
  {
    id: 'all',
    label: 'All Websites',
    icon: '🌟',
    description: 'Browse our complete collection of custom celebration experiences.',
  },
  {
    id: 'birthday',
    label: 'Birthday Websites',
    icon: '🎂',
    description: 'Interactive countdowns, photo timelines, wax-sealed letters & birthday cake animations.',
  },
  {
    id: 'propose',
    label: 'Proposal & Marry Me',
    icon: '💍',
    description: 'Breathtaking "Will You Marry Me?" animations, romantic love stories & interactive ring boxes.',
  },
  {
    id: 'marriage',
    label: 'Marriage Cards & Weddings',
    icon: '💒',
    description: 'Digital luxury wedding invitations, event timelines, couple memories & RSVP walls.',
  },
  {
    id: 'feel_special',
    label: 'Feel Special & Loved',
    icon: '💖',
    description: '"Reasons Why You Are Loved", constellation starry skies & deep appreciation cards.',
  },
  {
    id: 'best_friend',
    label: 'Best Friend Day',
    icon: '👯',
    description: 'Friendship polaroid scrapbooks, inside jokes soundboards & nostalgic memories.',
  },
  {
    id: 'teachers_day',
    label: 'Teachers Day & Mentors',
    icon: '🎓',
    description: 'Heartfelt student tribute walls, gratitude certificates & class photo archives.',
  },
  {
    id: 'other',
    label: 'Other Milestones',
    icon: '🎉',
    description: 'Anniversaries, graduations, new baby arrivals & heartfelt surprises.',
  },
];

export const ClientPortal: React.FC<ClientPortalProps> = ({
  projects,
  settings,
  onSubmitOrder,
}) => {
  const [selectedOccasion, setSelectedOccasion] = useState<'all' | WebsiteOccasion>('all');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProjectForOrder, setSelectedProjectForOrder] = useState<Project | null>(null);
  
  // Video Showcase Modal State
  const [activeVideoProject, setActiveVideoProject] = useState<Project | null>(null);

  // Order Form State
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [clientGmail, setClientGmail] = useState('');
  const [contactError, setContactError] = useState('');
  const [occasion, setOccasion] = useState<WebsiteOccasion>('birthday');
  const [recipientName, setRecipientName] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [budget, setBudget] = useState('PKR 1,500');
  const [requirements, setRequirements] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const tikTokUrl = settings.creatorTikTokUrl || 'https://www.tiktok.com/@medicode404?_r=1&_t=ZN-99X4OALeBs6';
  const instagramUrl = settings.creatorInstagramUrl || 'https://www.instagram.com/medicode404?stkn=NGVwNHBkaHBtaHNm';

  // Filter public projects
  const publicProjects = useMemo(() => {
    return projects.filter((p) => p.isPublicShowcase !== false);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedOccasion === 'all') return publicProjects;
    return publicProjects.filter((p) => (p.occasion || 'birthday') === selectedOccasion);
  }, [publicProjects, selectedOccasion]);

  const handleOpenOrder = (project?: Project) => {
    if (project) {
      setSelectedProjectForOrder(project);
      setOccasion(project.occasion || 'birthday');
      setBudget(project.price ? formatPrice(project.price) : 'PKR 1,500');
      setRecipientName(project.recipientName || '');
      setRequirements(`I would love a custom website styled like "${project.name}".`);
    } else {
      setSelectedProjectForOrder(null);
      setOccasion(selectedOccasion === 'all' ? 'birthday' : selectedOccasion);
      setBudget('PKR 1,500');
      setRecipientName('');
      setRequirements('');
    }
    setContactError('');
    setOrderSuccess(false);
    setIsOrderModalOpen(true);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError('');

    if (!clientName.trim()) {
      return;
    }

    // User should have option to give ONE way of contact (WhatsApp OR Gmail), not both necessary
    const hasContact = clientContact.trim().length > 0;
    const hasGmail = clientGmail.trim().length > 0;

    if (!hasContact && !hasGmail) {
      setContactError('Please provide at least one contact method (WhatsApp/Phone OR Gmail) so Hamad can reach you.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitOrder({
        clientName: clientName.trim(),
        clientContact: clientContact.trim(),
        clientGmail: clientGmail.trim(),
        recipientName: recipientName.trim() || 'Special Person',
        occasion,
        websiteType: OCCASION_CATEGORIES.find((c) => c.id === occasion)?.label || 'Celebration Website',
        requirements: requirements.trim() || 'Custom celebration website with photos and music.',
        budget: budget.trim() || 'PKR 1,500',
        orderDate: new Date().toISOString().split('T')[0],
        dueDate: targetDate || undefined,
        status: 'new',
        paymentStatus: 'unpaid',
      });
      setOrderSuccess(true);
    } catch (err) {
      console.error('Order submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070911] text-zinc-100 font-['Outfit'] selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* 1. Public Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#070911]/90 backdrop-blur-xl border-b border-zinc-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-zinc-950 font-black shadow-lg shadow-amber-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white">
                {settings.studioName || 'WishCraft Studio'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                By {settings.creatorName || 'Hamad'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Custom Celebration Websites, Love Letters & Digital Cards (1000 - 2000 PKR)
            </p>
          </div>
        </div>

        {/* Right Nav Actions: Direct DMs to TikTok and Instagram */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* TikTok DM Button */}
          <a
            href={tikTokUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-semibold text-zinc-200 hover:text-white transition-all shadow-sm cursor-pointer"
            title="DM Hamad on TikTok @medicode404"
          >
            <span className="text-sm">🎵</span>
            <span className="hidden sm:inline">TikTok DM</span>
          </a>

          {/* Instagram DM Button */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-rose-500/20 hover:from-purple-500/30 hover:to-rose-500/30 border border-rose-500/40 text-xs font-semibold text-rose-200 hover:text-white transition-all shadow-sm cursor-pointer"
            title="DM Hamad on Instagram @medicode404"
          >
            <span className="text-sm">📸</span>
            <span className="hidden sm:inline">Instagram DM</span>
          </a>

          {/* Primary CTA: Order / Leave DM */}
          <button
            onClick={() => handleOpenOrder()}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-zinc-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Order Website</span>
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-10 px-4 sm:px-8 max-w-7xl mx-auto text-center">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 border border-amber-500/30 backdrop-blur-md text-amber-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Handcrafted Interactive Websites & Celebration Cards • 1,000 to 2,000 PKR</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Make Someone Feel <br />
            <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-purple-400 bg-clip-text text-transparent">
              Truly Special & Loved
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-300/90 leading-relaxed font-normal max-w-2xl mx-auto">
            We turn your memories, photos, personalized letters, and favorite songs into unforgettable interactive websites. Perfect for <strong className="text-white">Birthdays</strong>, <strong className="text-white">Marriage Proposals</strong>, <strong className="text-white">Wedding Cards</strong>, <strong className="text-white">Best Friends</strong>, and <strong className="text-white">Teachers Day</strong>.
          </p>

          {/* Social DM Quick Bar */}
          <div className="pt-1 flex flex-wrap items-center justify-center gap-3">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-xs font-bold text-rose-300 hover:text-white transition-all"
            >
              <span>📸 DM on Instagram:</span>
              <span className="underline font-mono">@medicode404</span>
            </a>
            <a
              href={tikTokUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-200 hover:text-white transition-all"
            >
              <span>🎵 DM on TikTok:</span>
              <span className="underline font-mono">@medicode404</span>
            </a>
          </div>

          {/* Quick Value Pillars */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs text-zinc-300">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
              <Music className="w-3.5 h-3.5 text-rose-400" />
              <span>Background Music Player</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>Surprise Reveal Gifts</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Delivered in 24–48 Hours</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Affordable PKR 1,000 - 2,000</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => handleOpenOrder()}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-zinc-950 font-bold text-sm shadow-xl shadow-amber-500/25 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Send Order Inquiry / Leave a DM</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <a
              href="#catalog"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Explore Demos & TikTok Videos</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. Occasion Categories Tabs */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 pb-4">
        <div className="border-b border-zinc-800/80 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Choose Your Special Occasion</span>
            </h2>
            <span className="text-xs text-zinc-400 font-medium">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'Design' : 'Designs'} Available
            </span>
          </div>

          {/* Category Chips Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {OCCASION_CATEGORIES.map((cat) => {
              const isSelected = selectedOccasion === cat.id;
              const count =
                cat.id === 'all'
                  ? publicProjects.length
                  : publicProjects.filter((p) => (p.occasion || 'birthday') === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedOccasion(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                      : 'bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isSelected ? 'bg-black/30 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Showcase Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-zinc-900/50 border border-zinc-800 p-8">
            <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">Custom Websites Crafted on Demand</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1 mb-5">
              Hamad crafts bespoke custom websites for this occasion! Leave a DM and we will design a personalized experience with your photos, music, and story.
            </p>
            <button
              onClick={() => handleOpenOrder()}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              Order Custom Website Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredProjects.map((project) => {
              const hasVideo = project.socialLinks && project.socialLinks.length > 0;
              const tikTokLink = project.socialLinks?.find((l) => l.platform === 'tiktok');
              const instaLink = project.socialLinks?.find((l) => l.platform === 'instagram');

              return (
                <div
                  key={project.id}
                  className="group rounded-3xl bg-[#0e1220] border border-zinc-800/90 hover:border-amber-500/50 shadow-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10"
                >
                  {/* Card Media Preview */}
                  <div className="relative h-56 w-full overflow-hidden bg-zinc-950">
                    <img
                      src={
                        project.coverImageUrl ||
                        'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80'
                      }
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e1220] via-black/40 to-black/30" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/70 text-white backdrop-blur-md border border-white/20 shadow-md">
                        {project.occasion === 'propose'
                          ? '💍 Proposal Card'
                          : project.occasion === 'marriage'
                          ? '💒 Wedding Card'
                          : project.occasion === 'teachers_day'
                          ? '🎓 Teachers Day'
                          : project.occasion === 'best_friend'
                          ? '👯 Best Friend Day'
                          : project.occasion === 'feel_special'
                          ? '💖 Feel Special'
                          : '🎂 Birthday Site'}
                      </span>

                      {/* Prominent Price Tag in PKR */}
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20">
                        {formatPrice(project.price)}
                      </span>
                    </div>

                    {/* Video Badge / Quick Trigger */}
                    {hasVideo && (
                      <button
                        onClick={() => setActiveVideoProject(project)}
                        className="absolute bottom-3 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/90 hover:bg-rose-500 text-white text-[11px] font-bold shadow-lg backdrop-blur-sm cursor-pointer transition-transform hover:scale-105"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>Watch Demo Video</span>
                      </button>
                    )}

                    {/* Live Demo Trigger */}
                    {project.liveWebsiteUrl && (
                      <a
                        href={project.liveWebsiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute bottom-3 right-3.5 flex items-center gap-1 px-3 py-1 rounded-full bg-black/80 hover:bg-black text-amber-300 text-[11px] font-semibold border border-amber-500/30 backdrop-blur-sm transition-colors"
                      >
                        <span>Live Preview</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {/* Card Content Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-lg font-bold text-white tracking-tight font-['Outfit']">
                          {project.name}
                        </h3>
                      </div>

                      <p className="text-xs text-zinc-300/80 mt-2 line-clamp-2 leading-relaxed">
                        {project.description ||
                          'Includes digital wax-sealed letter, romantic background music, photo memory slideshow, and interactive animations.'}
                      </p>

                      {/* Feature Pills */}
                      <div className="mt-3.5 flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-medium bg-zinc-800/80 text-zinc-300 border border-zinc-700/50">
                          🎵 Music Player
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-medium bg-zinc-800/80 text-zinc-300 border border-zinc-700/50">
                          💌 Sealed Letter
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-medium bg-zinc-800/80 text-zinc-300 border border-zinc-700/50">
                          📸 Photo Story
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-medium bg-zinc-800/80 text-zinc-300 border border-zinc-700/50">
                          📱 Mobile Optimized
                        </span>
                      </div>

                      {/* Direct TikTok or Instagram links if available */}
                      {(tikTokLink || instaLink) && (
                        <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex items-center gap-2">
                          <span className="text-[11px] text-zinc-400 font-medium">Watch:</span>
                          {tikTokLink && (
                            <a
                              href={tikTokLink.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/70 text-[11px] text-zinc-200 hover:text-white transition-colors"
                            >
                              <span>🎵 TikTok Video</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                          {instaLink && (
                            <a
                              href={instaLink.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-[11px] text-rose-300 hover:text-white transition-colors"
                            >
                              <span>📸 Instagram Reel</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Actions */}
                    <div className="pt-3 border-t border-zinc-800 flex items-center gap-2">
                      <button
                        onClick={() => handleOpenOrder(project)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10 active:scale-98 transition-all cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Order Website ({formatPrice(project.price)})</span>
                      </button>

                      {hasVideo && (
                        <button
                          onClick={() => setActiveVideoProject(project)}
                          className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                          title="Watch video demo"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}

                      {project.liveWebsiteUrl && (
                        <a
                          href={project.liveWebsiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                          title="Open Live Preview"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="rounded-3xl bg-gradient-to-b from-[#0f1424] to-[#090c16] border border-zinc-800 p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              How You Can Order Your Custom Website
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              You provide your photos, wishes, and favorite songs — Hamad crafts, deploys, and delivers your unique website link.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-base">
                1
              </div>
              <h3 className="text-base font-bold text-white">Send Order Inquiry on Website</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Click &ldquo;Order Website&rdquo; to leave your name, WhatsApp or Gmail (only one needed), recipient info, and budget in PKR.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 font-bold flex items-center justify-center text-base">
                2
              </div>
              <h3 className="text-base font-bold text-white">Connect on Instagram or TikTok DM</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Hamad reviews your order and connects via your contact or Instagram DM (@medicode404). Send photos, songs, and text wishes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-base">
                3
              </div>
              <h3 className="text-base font-bold text-white">Receive Private Link at Midnight</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                You receive a private, lightning-fast web link ready to send to your special person at 12:00 midnight for maximum surprise!
              </p>
            </div>
          </div>

          <div className="mt-10 pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleOpenOrder()}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-zinc-950 font-bold text-sm shadow-xl shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
            >
              Order Your Custom Celebration Website
            </button>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold text-sm transition-all cursor-pointer"
            >
              DM on Instagram (@medicode404)
            </a>
          </div>
        </div>
      </section>

      {/* 6. Footer (Admin access button strictly removed from client website) */}
      <footer className="border-t border-zinc-800/80 bg-[#05070d] py-10 px-4 sm:px-8 text-center text-xs text-zinc-500 space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-zinc-400 text-xs">
          <span>✨ Custom Celebration Websites</span>
          <span>•</span>
          <span>🎂 Birthdays & Anniversaries</span>
          <span>•</span>
          <span>💍 Proposals & Weddings</span>
          <span>•</span>
          <span>👯 Best Friends & Mentors</span>
        </div>

        {/* Social DMs in Footer */}
        <div className="flex items-center justify-center gap-4 text-xs">
          <a
            href={tikTokUrl}
            target="_blank"
            rel="noreferrer"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            🎵 TikTok: @medicode404
          </a>
          <span>•</span>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="text-zinc-400 hover:text-rose-400 transition-colors"
          >
            📸 Instagram: @medicode404
          </a>
        </div>

        <p>© {new Date().getFullYear()} {settings.studioName || 'WishCraft Studio'} — Handcrafted with love by {settings.creatorName || 'Hamad'}.</p>
      </footer>

      {/* 7. Video Showcase Modal */}
      {activeVideoProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-6 overflow-hidden">
            <button
              onClick={() => setActiveVideoProject(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <Play className="w-5 h-5 fill-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Social Media Video Showcase</h3>
                <p className="text-xs text-zinc-400">{activeVideoProject.name}</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 mb-4">
              Watch the live reaction and website walkthrough video uploaded by Hamad on TikTok or Instagram:
            </p>

            <div className="space-y-2.5 max-h-72 overflow-y-auto">
              {activeVideoProject.socialLinks && activeVideoProject.socialLinks.length > 0 ? (
                activeVideoProject.socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">
                        {link.platform === 'tiktok'
                          ? '🎵'
                          : link.platform === 'instagram'
                          ? '📸'
                          : '▶️'}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-white capitalize group-hover:text-amber-300">
                          {link.platform} Showcase Video
                        </span>
                        {link.viewCount && (
                          <p className="text-[11px] text-zinc-400">
                            {link.viewCount.toLocaleString()} views
                          </p>
                        )}
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-amber-400" />
                  </a>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-center text-xs text-zinc-400">
                  <p>Check out Hamad&apos;s channels for latest video demos:</p>
                  <div className="mt-2 flex justify-center gap-3">
                    <a href={tikTokUrl} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">
                      TikTok @medicode404
                    </a>
                    <span>•</span>
                    <a href={instagramUrl} target="_blank" rel="noreferrer" className="text-rose-400 hover:underline">
                      Instagram @medicode404
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-zinc-800 flex items-center justify-between">
              <button
                onClick={() => {
                  const proj = activeVideoProject;
                  setActiveVideoProject(null);
                  handleOpenOrder(proj);
                }}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Order Website Like This</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Order / Leave a DM Inquiry Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-zinc-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden my-auto">
            
            {/* Modal Header with High-Visibility Cut (Close) Icon */}
            <div className="sticky top-0 z-20 shrink-0 px-5 py-4 sm:px-6 sm:py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/95 backdrop-blur-md">
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-10 h-10 shrink-0 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit'] truncate">
                    {orderSuccess ? 'Order Inquiry Sent!' : 'Order a Custom Website & Leave DM'}
                  </h3>
                  <p className="text-xs text-zinc-400 truncate">
                    Directly sent to Hamad&apos;s main website dashboard.
                  </p>
                </div>
              </div>

              {/* Cut Icon (Close X Button) - High Contrast & Unhidden */}
              <button
                type="button"
                onClick={() => setIsOrderModalOpen(false)}
                title="Close (Cut) dialog"
                aria-label="Close"
                className="shrink-0 w-10 h-10 rounded-full bg-zinc-800 hover:bg-rose-500/20 text-zinc-200 hover:text-rose-400 border border-zinc-700 hover:border-rose-500/50 flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-md"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
              {orderSuccess ? (
                <div className="py-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-white">
                    Thank You, {clientName}!
                  </h4>
                  <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
                    Hamad has received your order on his main website DM dashboard for <strong className="text-amber-400">{recipientName || 'your special person'}</strong>.
                    He will reach out to you via {clientContact ? <strong className="text-white">WhatsApp/Phone: {clientContact}</strong> : null} {clientContact && clientGmail ? ' or ' : null} {clientGmail ? <strong className="text-white">Gmail: {clientGmail}</strong> : null}.
                  </p>

                  <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400">
                    <p className="font-semibold text-zinc-200 mb-1.5">You can also DM Hamad directly right now:</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-rose-500/20 hover:from-purple-500/30 hover:to-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5"
                      >
                        <span>📸 DM on Instagram (@medicode404)</span>
                      </a>
                      <a
                        href={tikTokUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold text-xs flex items-center justify-center gap-1.5"
                      >
                        <span>🎵 DM on TikTok (@medicode404)</span>
                      </a>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setIsOrderModalOpen(false)}
                      className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 hover:text-white cursor-pointer"
                    >
                      Close and Browse More Designs
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  {selectedProjectForOrder && (
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
                      <img
                        src={selectedProjectForOrder.coverImageUrl}
                        alt="Selected Template"
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <span className="text-[11px] font-semibold text-amber-400">Selected Design:</span>
                        <p className="text-xs font-bold text-white">{selectedProjectForOrder.name}</p>
                      </div>
                      <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-500 text-zinc-950">
                        {formatPrice(selectedProjectForOrder.price)}
                      </span>
                    </div>
                  )}

                  {/* Client Name */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Liam, Sarah, Ayesha"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Contact Method Notice: user should have option to give ONE way of contact */}
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                    <span className="text-sm">💡</span>
                    <span>
                      Provide <strong>either</strong> your WhatsApp No. or Gmail (or both if you prefer). At least one contact method is required so Hamad can reach you!
                    </span>
                  </div>

                  {/* Contact Details (WhatsApp or Gmail) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span>WhatsApp / Phone No.</span>
                      </label>
                      <input
                        type="text"
                        value={clientContact}
                        onChange={(e) => {
                          setClientContact(e.target.value);
                          if (contactError) setContactError('');
                        }}
                        placeholder="e.g. 03001234567"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                      />
                      <span className="text-[10px] text-zinc-500 mt-1 block">Optional if Gmail provided</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-amber-400" />
                        <span>Gmail Address</span>
                      </label>
                      <input
                        type="email"
                        value={clientGmail}
                        onChange={(e) => {
                          setClientGmail(e.target.value);
                          if (contactError) setContactError('');
                        }}
                        placeholder="e.g. client@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                      />
                      <span className="text-[10px] text-zinc-500 mt-1 block">Optional if WhatsApp provided</span>
                    </div>
                  </div>

                  {contactError && (
                    <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{contactError}</span>
                    </div>
                  )}

                  {/* Celebration Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        Occasion Type *
                      </label>
                      <select
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value as WebsiteOccasion)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                      >
                        <option value="birthday">🎂 Birthday Wishing Website</option>
                        <option value="feel_special">💖 Make Someone Feel Special</option>
                        <option value="best_friend">👯 Best Friend Day</option>
                        <option value="teachers_day">🎓 Teachers Day & Mentors</option>
                        <option value="propose">💍 Proposal & "Will You Marry Me?"</option>
                        <option value="marriage">💒 Marriage Cards & Wedding</option>
                        <option value="other">🎉 Other Special Events</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        Recipient Name (Who is this for?) *
                      </label>
                      <input
                        type="text"
                        required
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="e.g. Ayesha, My Fiancée, Chloe"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Due Date & Budget in PKR */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-sky-400" />
                        <span>Event Date / Target Deadline</span>
                      </label>
                      <input
                        type="date"
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        Selected Package / Budget (PKR)
                      </label>
                      <select
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                      >
                        {budget && !['PKR 1,000', 'PKR 1,200', 'PKR 1,500', 'PKR 1,800', 'PKR 2,000', 'Custom PKR'].includes(budget) && (
                          <option value={budget}>{budget} (Selected Template Price)</option>
                        )}
                        <option value="PKR 1,000">PKR 1,000 — Essential Celebration Website</option>
                        <option value="PKR 1,200">PKR 1,200 — Deluxe Interactive (Music + Photo Slideshow)</option>
                        <option value="PKR 1,500">PKR 1,500 — Romance & Proposal Special (Music + Wax Letter)</option>
                        <option value="PKR 1,800">PKR 1,800 — Grand Surprise & Video Memories Edition</option>
                        <option value="PKR 2,000">PKR 2,000 — Luxury Wedding Card & Royal Milestone</option>
                        <option value="Custom PKR">Custom PKR Budget / Special Project</option>
                      </select>
                    </div>
                  </div>

                  {/* Notes & Special Wishes */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Special Ideas, Song Choice or Custom Message (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      placeholder="Tell us about the music track you want, how many photos you have, or any special surprise ideas you want Hamad to include..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Submit Button & Cancel Action */}
                  <div className="pt-2 space-y-2.5">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsOrderModalOpen(false)}
                        className="py-3 px-5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 disabled:opacity-50 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
                      >
                        {isSubmitting ? (
                          <span>Sending Your Order to Hamad...</span>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Submit Order to Hamad&apos;s Main Website DM</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-4 pt-1">
                      <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-zinc-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                      >
                        <span>📸 Or DM on Instagram</span>
                      </a>
                      <span className="text-zinc-600">•</span>
                      <a
                        href={tikTokUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <span>🎵 Or DM on TikTok</span>
                      </a>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
