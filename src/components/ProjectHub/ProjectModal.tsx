import React, { useState, useEffect, useRef } from 'react';
import { Project, DeploymentPlatform, ProjectStatus, SocialLink, WebsiteOccasion } from '../../types';
import { defaultBirthdaySiteData } from '../../data/initialData';
import {
  X,
  Sparkles,
  Globe,
  Github,
  Save,
  Plus,
  Trash2,
  Share2,
  ExternalLink,
  Image as ImageIcon,
  Upload,
  RotateCcw,
  Check
} from 'lucide-react';

export const DEFAULT_PROJECT_COVER =
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80';

const PRESET_COVERS = [
  { name: 'Gold Sparkle', url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80' },
  { name: 'Romantic Rose', url: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&auto=format&fit=crop&q=80' },
  { name: 'Midnight Sky', url: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=800&auto=format&fit=crop&q=80' },
  { name: 'Birthday Cake', url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&auto=format&fit=crop&q=80' },
  { name: 'Festive Lights', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80' },
];

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  projectToEdit?: Project | null;
  initialFromRequest?: {
    recipientName: string;
    clientName: string;
    clientContact: string;
    notes: string;
    orderId: string;
  } | null;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  projectToEdit,
  initialFromRequest,
}) => {
  const [name, setName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('in_progress');
  const [theme, setTheme] = useState('Romantic Rose & Gold');
  const [occasion, setOccasion] = useState<WebsiteOccasion>('birthday');
  const [price, setPrice] = useState('$35');
  const [description, setDescription] = useState('');
  const [isPublicShowcase, setIsPublicShowcase] = useState(true);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [deploymentPlatform, setDeploymentPlatform] = useState<DeploymentPlatform>('cloudflare');
  const [liveWebsiteUrl, setLiveWebsiteUrl] = useState('');
  const [githubRepoUrl, setGithubRepoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name);
      setRecipientName(projectToEdit.recipientName);
      setClientName(projectToEdit.clientName || '');
      setClientContact(projectToEdit.clientContact || '');
      setStatus(projectToEdit.status);
      setTheme(projectToEdit.theme);
      setOccasion(projectToEdit.occasion || 'birthday');
      setPrice(projectToEdit.price || '$35');
      setDescription(projectToEdit.description || '');
      setIsPublicShowcase(projectToEdit.isPublicShowcase !== false);
      setCoverImageUrl(projectToEdit.coverImageUrl || '');
      setDeploymentPlatform(projectToEdit.deploymentPlatform);
      setLiveWebsiteUrl(projectToEdit.liveWebsiteUrl || '');
      setGithubRepoUrl(projectToEdit.githubRepoUrl || '');
      setNotes(projectToEdit.notes || '');
      setIsPinned(projectToEdit.isPinned);
      setSocialLinks(projectToEdit.socialLinks ? [...projectToEdit.socialLinks] : []);
    } else if (initialFromRequest) {
      setName(`Celebration Website — ${initialFromRequest.recipientName}`);
      setRecipientName(initialFromRequest.recipientName);
      setClientName(initialFromRequest.clientName);
      setClientContact(initialFromRequest.clientContact);
      setStatus('in_progress');
      setTheme('Romantic Rose & Gold');
      setOccasion('birthday');
      setPrice('$35');
      setDescription('');
      setIsPublicShowcase(true);
      setCoverImageUrl('');
      setDeploymentPlatform('cloudflare');
      setLiveWebsiteUrl('');
      setGithubRepoUrl('');
      setNotes(initialFromRequest.notes);
      setIsPinned(false);
      setSocialLinks([]);
    } else {
      // New Empty Form
      setName('');
      setRecipientName('');
      setClientName('');
      setClientContact('');
      setStatus('in_progress');
      setTheme('Romantic Rose & Gold');
      setOccasion('birthday');
      setPrice('$35');
      setDescription('');
      setIsPublicShowcase(true);
      setCoverImageUrl('');
      setDeploymentPlatform('cloudflare');
      setLiveWebsiteUrl('');
      setGithubRepoUrl('');
      setNotes('');
      setIsPinned(false);
      setSocialLinks([]);
    }
  }, [projectToEdit, initialFromRequest, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please choose an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCoverImageUrl(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSocialLink = () => {
    const newLink: SocialLink = {
      id: `soc-${Date.now()}`,
      platform: 'tiktok',
      url: '',
      viewCount: null,
      notes: '',
    };
    setSocialLinks([...socialLinks, newLink]);
  };

  const handleRemoveSocialLink = (id: string) => {
    setSocialLinks(socialLinks.filter((l) => l.id !== id));
  };

  const handleUpdateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    setSocialLinks(
      socialLinks.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !recipientName.trim()) return;

    const finalProject: Project = {
      id: projectToEdit ? projectToEdit.id : `proj-${Date.now()}`,
      name: name.trim(),
      recipientName: recipientName.trim(),
      clientName: clientName.trim() || undefined,
      clientContact: clientContact.trim() || undefined,
      status,
      theme: theme.trim() || 'Classic Celebration',
      occasion,
      price: price.trim() || '$35',
      description: description.trim() || undefined,
      isPublicShowcase,
      coverImageUrl: coverImageUrl.trim() || DEFAULT_PROJECT_COVER,
      githubRepoUrl: githubRepoUrl.trim() || undefined,
      liveWebsiteUrl: liveWebsiteUrl.trim() || undefined,
      deploymentPlatform,
      deploymentNotes: projectToEdit?.deploymentNotes || '',
      lastDeployedAt: projectToEdit?.lastDeployedAt || (liveWebsiteUrl ? new Date().toISOString() : undefined),
      notes: notes.trim() || undefined,
      isPinned,
      socialLinks: socialLinks.filter((l) => l.url.trim() !== ''),
      builderData: projectToEdit
        ? {
            ...projectToEdit.builderData,
            recipient: {
              ...projectToEdit.builderData.recipient,
              name: recipientName.trim(),
            },
          }
        : {
            ...defaultBirthdaySiteData,
            recipient: {
              ...defaultBirthdaySiteData.recipient,
              name: recipientName.trim(),
            },
            hero: {
              ...defaultBirthdaySiteData.hero,
              title: `Happy Birthday, ${recipientName.trim()}!`,
            },
          },
      orderId: projectToEdit?.orderId || initialFromRequest?.orderId,
      createdAt: projectToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(finalProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700/80 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100 font-['Outfit']">
                {projectToEdit ? 'Edit Birthday Website' : 'New Birthday Website Project'}
              </h2>
              <p className="text-xs text-zinc-400">
                Manage repository, live deployment, client details, and showcase reels.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Row 1: Name & Recipient */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Website / Project Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Birthday Website — Ayesha"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Recipient Name (Celebrant) *
              </label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Ayesha, David, Chloe"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Row 2: Occasion & Price & Client Showcase Details */}
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-amber-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Client Showcase & Catalog Settings
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-300 select-none">
                <input
                  type="checkbox"
                  checked={isPublicShowcase}
                  onChange={(e) => setIsPublicShowcase(e.target.checked)}
                  className="rounded border-zinc-700 text-amber-500 focus:ring-amber-500/20 bg-zinc-900"
                />
                <span>Visible on Client Website</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Occasion / Category
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value as WebsiteOccasion)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="birthday">🎂 Birthday Wishing Website</option>
                  <option value="feel_special">💖 Make Someone Feel Special</option>
                  <option value="best_friend">👯 Best Friend Day</option>
                  <option value="teachers_day">🎓 Teachers Day & Mentors</option>
                  <option value="propose">💍 Proposal & "Will You Marry Me?"</option>
                  <option value="marriage">💒 Marriage Cards & Wedding</option>
                  <option value="other">🎉 Other Special Events & Milestones</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Price Mentioned for Clients (PKR)
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. PKR 1,000 to PKR 2,000 (e.g. PKR 1,500)"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Showcase Tagline / Highlights for Clients
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Digital wax seal letter, photo timeline, music player, surprise reveal gifts."
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Project Preview Image Feature */}
          <div className="p-4 rounded-2xl bg-[#0b0e18] border border-purple-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-400" />
                <label className="text-xs font-semibold text-zinc-200">
                  Project Preview Image / Banner
                </label>
              </div>
              {coverImageUrl ? (
                <button
                  type="button"
                  onClick={() => setCoverImageUrl('')}
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to Default</span>
                </button>
              ) : (
                <span className="text-[11px] text-purple-300/70 font-medium">Default Celebration Image Active</span>
              )}
            </div>

            {/* Live Interactive Banner Preview */}
            <div className="relative h-36 w-full rounded-xl overflow-hidden border border-[#1e253d] bg-[#070911] shadow-inner">
              <img
                src={coverImageUrl || DEFAULT_PROJECT_COVER}
                alt="Project Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_PROJECT_COVER;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090c16]/90 via-black/30 to-black/40 flex flex-col justify-between p-3 pointer-events-none">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-black/60 text-purple-200 border border-purple-500/40 backdrop-blur-sm">
                    {coverImageUrl ? 'Custom Image Loaded' : 'Default Preview Image'}
                  </span>
                </div>
                <div>
                  <span className="text-white text-base font-serif italic drop-shadow-md tracking-wide">
                    Happy Birthday {recipientName.trim() || 'Celebrant'}
                  </span>
                </div>
              </div>
            </div>

            {/* URL Input & Device Upload Button */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <div className="sm:col-span-2">
                <input
                  type="url"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="Paste your image URL (e.g. https://.../photo.jpg)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-full min-h-[38px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#181a33] hover:bg-[#22244a] border border-purple-500/40 text-purple-200 text-xs font-semibold transition-all cursor-pointer active:scale-98"
                >
                  <Upload className="w-3.5 h-3.5 text-purple-300" />
                  <span>Upload from Device</span>
                </button>
              </div>
            </div>

            {/* Quick Presets Carousel */}
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1">
              <span className="text-[10px] text-zinc-400 whitespace-nowrap mr-1 font-medium">Themes:</span>
              {PRESET_COVERS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setCoverImageUrl(preset.url)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                    coverImageUrl === preset.url
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-[#121626] hover:bg-[#1b2238] text-zinc-400 hover:text-zinc-200 border border-[#1d253d]'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Client Name & Client Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Client Name (Who ordered it)
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Hamza Malik"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Client Contact / Social Handle
              </label>
              <input
                type="text"
                value={clientContact}
                onChange={(e) => setClientContact(e.target.value)}
                placeholder="e.g. @hamza_m (IG) / +1 555-0192"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Row 3: Status, Platform, Theme */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Project Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="in_progress">In Production</option>
                <option value="ready">Ready for Preview</option>
                <option value="live">Live Website</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Hosting Platform
              </label>
              <select
                value={deploymentPlatform}
                onChange={(e) => setDeploymentPlatform(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="cloudflare">Cloudflare Pages</option>
                <option value="netlify">Netlify</option>
                <option value="vercel">Vercel</option>
                <option value="github_pages">GitHub Pages</option>
                <option value="other">Other / Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Design Theme
              </label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g. Romantic Rose & Gold"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Row 4: URLs (Live Website & GitHub Repo) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-zinc-300 mb-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live Website URL</span>
              </label>
              <input
                type="url"
                value={liveWebsiteUrl}
                onChange={(e) => setLiveWebsiteUrl(e.target.value)}
                placeholder="https://ayesha-birthday.pages.dev"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-zinc-300 mb-1.5">
                <Github className="w-3.5 h-3.5 text-zinc-400" />
                <span>GitHub Repository URL</span>
              </label>
              <input
                type="url"
                value={githubRepoUrl}
                onChange={(e) => setGithubRepoUrl(e.target.value)}
                placeholder="https://github.com/myusername/ayesha-bday"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Multi-Platform Social Showcase Links Section (Requirement #4) */}
          <div className="pt-2 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
                  <Share2 className="w-3.5 h-3.5 text-pink-400" />
                  Multi-Platform Social Showcase Videos
                </span>
                <p className="text-[11px] text-zinc-500">
                  Add links for TikTok, Instagram Reels, YouTube Shorts, etc. with optional view counts.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddSocialLink}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 text-amber-300 hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Platform</span>
              </button>
            </div>

            {socialLinks.length === 0 ? (
              <div className="p-3.5 rounded-xl border border-dashed border-zinc-800 text-center text-xs text-zinc-500">
                No social links added yet. Click &quot;Add Platform&quot; to link your showcase reels.
              </div>
            ) : (
              <div className="space-y-2.5">
                {socialLinks.map((link) => (
                  <div
                    key={link.id}
                    className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/90 flex flex-col sm:flex-row items-start sm:items-center gap-2.5"
                  >
                    {/* Platform Selector */}
                    <select
                      value={link.platform}
                      onChange={(e) =>
                        handleUpdateSocialLink(link.id, { platform: e.target.value as any })
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 focus:outline-none cursor-pointer"
                    >
                      <option value="tiktok">🎵 TikTok</option>
                      <option value="instagram">📸 Instagram Reel</option>
                      <option value="youtube">▶️ YouTube / Shorts</option>
                      <option value="facebook">📘 Facebook</option>
                      <option value="pinterest">📌 Pinterest</option>
                      <option value="x">𝕏</option>
                      <option value="threads">🧵 Threads</option>
                      <option value="snapchat">👻 Snapchat</option>
                      <option value="other">🔗 Other</option>
                    </select>

                    {/* URL */}
                    <input
                      type="url"
                      required
                      value={link.url}
                      onChange={(e) => handleUpdateSocialLink(link.id, { url: e.target.value })}
                      placeholder="Video URL (e.g. https://tiktok.com/@creator/video/123)"
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                    />

                    {/* Views */}
                    <input
                      type="number"
                      value={link.viewCount || ''}
                      onChange={(e) =>
                        handleUpdateSocialLink(link.id, {
                          viewCount: e.target.value ? parseInt(e.target.value, 10) : null,
                        })
                      }
                      placeholder="Views (e.g. 450000)"
                      className="w-28 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                    />

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveSocialLink(link.id)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                      title="Remove link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes & Pinned toggle */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Creator Notes & Special Instructions
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Custom wax seal requested. Delivered preview via WhatsApp."
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPinned"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="w-4 h-4 rounded bg-zinc-950 border-zinc-700 text-amber-500 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="isPinned" className="text-xs text-zinc-300 select-none cursor-pointer">
              Pin / Favorite this project to the top of the dashboard
            </label>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:brightness-110 shadow-lg shadow-purple-900/30 active:scale-95 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{projectToEdit ? 'Save Changes' : 'Create Project'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
