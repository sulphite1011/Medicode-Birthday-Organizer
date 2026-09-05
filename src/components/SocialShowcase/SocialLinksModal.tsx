import React, { useState, useEffect } from 'react';
import { Project, SocialLink, SocialPlatform } from '../../types';
import {
  X,
  Share2,
  Plus,
  Trash2,
  ExternalLink,
  Save,
  Sparkles,
  Eye
} from 'lucide-react';

interface SocialLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSave: (updatedProject: Project) => void;
}

export const SocialLinksModal: React.FC<SocialLinksModalProps> = ({
  isOpen,
  onClose,
  project,
  onSave,
}) => {
  const [links, setLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    if (project) {
      setLinks(project.socialLinks ? JSON.parse(JSON.stringify(project.socialLinks)) : []);
    }
  }, [project, isOpen]);

  if (!isOpen || !project) return null;

  const handleAddPlatform = (platform: SocialPlatform) => {
    const newLink: SocialLink = {
      id: `soc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      platform,
      url: '',
      viewCount: null,
      notes: '',
    };
    setLinks([...links, newLink]);
  };

  const handleUpdate = (id: string, updates: Partial<SocialLink>) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const handleRemove = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
  };

  const handleSave = () => {
    const filtered = links.filter((l) => l.url.trim() !== '');
    const updated: Project = {
      ...project,
      socialLinks: filtered,
      updatedAt: new Date().toISOString(),
    };
    onSave(updated);
    onClose();
  };

  const formatViewDisplay = (val?: number | null) => {
    if (!val) return '';
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
    return val.toString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700/80 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100 font-['Outfit']">
                Multi-Platform Showcase Videos
              </h2>
              <p className="text-xs text-zinc-400">
                Project: <span className="text-amber-400 font-semibold">{project.name}</span>
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

        {/* Quick Add Presets Row */}
        <div className="px-5 sm:px-6 pt-4 pb-2 border-b border-zinc-800/60 bg-zinc-950/40">
          <span className="text-[11px] font-semibold text-zinc-400 block mb-2">
            Quick Add Platform Link:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleAddPlatform('tiktok')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-pink-300 border border-pink-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>🎵</span> + TikTok
            </button>
            <button
              type="button"
              onClick={() => handleAddPlatform('instagram')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-pink-300 border border-purple-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>📸</span> + Instagram Reel
            </button>
            <button
              type="button"
              onClick={() => handleAddPlatform('youtube')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-red-300 border border-red-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>▶️</span> + YouTube Shorts
            </button>
            <button
              type="button"
              onClick={() => handleAddPlatform('facebook')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-blue-300 border border-blue-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>📘</span> + Facebook
            </button>
            <button
              type="button"
              onClick={() => handleAddPlatform('pinterest')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-rose-300 border border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>📌</span> + Pinterest
            </button>
            <button
              type="button"
              onClick={() => handleAddPlatform('x')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>𝕏</span> + X
            </button>
          </div>
        </div>

        {/* Links List */}
        <div className="p-5 sm:p-6 max-h-[55vh] overflow-y-auto space-y-3">
          {links.length === 0 ? (
            <div className="py-12 px-4 rounded-2xl border border-dashed border-zinc-800 text-center flex flex-col items-center justify-center">
              <Share2 className="w-8 h-8 text-zinc-600 mb-2" />
              <p className="text-sm font-semibold text-zinc-300 mb-1">
                No Showcase Video Links Yet
              </p>
              <p className="text-xs text-zinc-500 max-w-xs mb-4">
                Attach video showcase links for this birthday website to track where you published your videos and monitor views.
              </p>
              <button
                type="button"
                onClick={() => handleAddPlatform('tiktok')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add TikTok Video</span>
              </button>
            </div>
          ) : (
            links.map((link, index) => (
              <div
                key={link.id}
                className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2.5"
              >
                {/* Header of Item */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-500">#{index + 1}</span>
                    <select
                      value={link.platform}
                      onChange={(e) => handleUpdate(link.id, { platform: e.target.value as any })}
                      className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 font-semibold focus:outline-none cursor-pointer"
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
                  </div>

                  <div className="flex items-center gap-1">
                    {link.url && (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-lg text-sky-400 hover:bg-zinc-900 transition-colors"
                        title="Test link (open in new tab)"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemove(link.id)}
                      className="p-1 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-900 transition-colors"
                      title="Remove platform link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2">
                    <input
                      type="url"
                      required
                      value={link.url}
                      onChange={(e) => handleUpdate(link.id, { url: e.target.value })}
                      placeholder="Showcase Video URL (e.g. https://...)"
                      className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      value={link.viewCount || ''}
                      onChange={(e) =>
                        handleUpdate(link.id, {
                          viewCount: e.target.value ? parseInt(e.target.value, 10) : null,
                        })
                      }
                      placeholder="Views (e.g. 450000)"
                      className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                    />
                    {link.viewCount ? (
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-amber-400 font-mono pointer-events-none">
                        {formatViewDisplay(link.viewCount)}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Optional Notes */}
                <input
                  type="text"
                  value={link.notes || ''}
                  onChange={(e) => handleUpdate(link.id, { notes: e.target.value })}
                  placeholder="Optional notes: e.g. 'FYP viral, pinned top comment linking to bio'"
                  className="w-full px-3 py-1.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
                />

              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="text-xs text-zinc-500">
            {links.filter((l) => l.url.trim() !== '').length} active link(s) ready
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-zinc-950 bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 shadow-md shadow-rose-950/20 active:scale-95 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Showcase Links</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
