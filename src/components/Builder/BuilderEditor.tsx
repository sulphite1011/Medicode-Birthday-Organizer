import React, { useState } from 'react';
import { BirthdaySiteData, Project } from '../../types';
import { exportBirthdayDataCode, downloadFile } from '../../services/exportTemplate';
import {
  Sparkles,
  Save,
  Copy,
  Check,
  Download,
  Mail,
  Music,
  Image,
  MessageSquare,
  Gift,
  Palette,
  Clock,
  User,
  Plus,
  Trash2
} from 'lucide-react';

interface BuilderEditorProps {
  project: Project;
  siteData: BirthdaySiteData;
  onChange: (newData: BirthdaySiteData) => void;
  onSaveToProject: () => void;
}

export const BuilderEditor: React.FC<BuilderEditorProps> = ({
  project,
  siteData,
  onChange,
  onSaveToProject,
}) => {
  const [activeTab, setActiveTab] = useState<
    'recipient' | 'hero' | 'letter' | 'theme' | 'music' | 'memories' | 'wishes' | 'gifts'
  >('recipient');

  const [copiedCode, setCopiedCode] = useState(false);

  // Copy code handler
  const handleCopyCode = () => {
    const code = exportBirthdayDataCode(siteData);
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Download birthdayData.ts handler
  const handleDownload = () => {
    const code = exportBirthdayDataCode(siteData);
    downloadFile(code, 'birthdayData.ts');
  };

  // Helper to update root data
  const updateData = (updater: (prev: BirthdaySiteData) => BirthdaySiteData) => {
    onChange(updater(siteData));
  };

  // Theme presets
  const applyThemePreset = (name: string, primary: string, accent: string) => {
    updateData((prev) => ({
      ...prev,
      themeConfig: {
        ...prev.themeConfig,
        presetName: name,
        primaryColor: primary,
        accentColor: accent,
      },
    }));
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900/70 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
      
      {/* Top Bar: Title & Quick Export Buttons */}
      <div className="p-3.5 sm:px-5 border-b border-zinc-800 flex items-center justify-between gap-3 bg-zinc-950/70 flex-wrap">
        <div>
          <div className="text-xs font-bold text-zinc-100 flex items-center gap-1.5 font-['Outfit']">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Birthday Site Generator</span>
          </div>
          <div className="text-[11px] text-zinc-400">
            Project: <span className="text-amber-400 font-semibold">{project.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Code */}
          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
            title="Copy birthdayData.ts code to clipboard"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
          </button>

          {/* Download File */}
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
            title="Download birthdayData.ts directly"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>

          {/* Save to Project */}
          <button
            type="button"
            onClick={onSaveToProject}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-zinc-950 bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 shadow-md shadow-rose-950/20 active:scale-95 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-3 py-2 border-b border-zinc-800/80 bg-zinc-950/40 flex items-center gap-1 overflow-x-auto no-scrollbar text-xs">
        <button
          onClick={() => setActiveTab('recipient')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'recipient' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Recipient</span>
        </button>
        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'hero' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hero</span>
        </button>
        <button
          onClick={() => setActiveTab('letter')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'letter' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Letter</span>
        </button>
        <button
          onClick={() => setActiveTab('theme')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'theme' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Theme & Colors</span>
        </button>
        <button
          onClick={() => setActiveTab('memories')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'memories' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <Image className="w-3.5 h-3.5" />
          <span>Memories ({siteData.memories.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('wishes')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'wishes' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Wishes ({siteData.wishes.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('gifts')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'gifts' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          <span>Gifts ({siteData.gifts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('music')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'music' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>Music</span>
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        
        {/* Tab 1: Recipient Details */}
        {activeTab === 'recipient' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-['Outfit']">
              Recipient & Celebrant Details
            </h3>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Recipient Full Name *
              </label>
              <input
                type="text"
                value={siteData.recipient.name}
                onChange={(e) =>
                  updateData((prev) => ({
                    ...prev,
                    recipient: { ...prev.recipient, name: e.target.value },
                    hero: { ...prev.hero, title: `Happy Birthday, ${e.target.value}!` },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Nickname (Optional)
                </label>
                <input
                  type="text"
                  value={siteData.recipient.nickname || ''}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      recipient: { ...prev.recipient, nickname: e.target.value },
                    }))
                  }
                  placeholder="e.g. Aye, Sweetheart"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Age Turning (Optional)
                </label>
                <input
                  type="number"
                  value={siteData.recipient.age || ''}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      recipient: {
                        ...prev.recipient,
                        age: e.target.value ? parseInt(e.target.value, 10) : undefined,
                      },
                    }))
                  }
                  placeholder="e.g. 25"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Birth Date / Celebration Date
              </label>
              <input
                type="date"
                value={siteData.recipient.birthDate}
                onChange={(e) =>
                  updateData((prev) => ({
                    ...prev,
                    recipient: { ...prev.recipient, birthDate: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Hero Section */}
        {activeTab === 'hero' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-['Outfit']">
              Hero Header Banner
            </h3>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Badge / Eyebrow Text
              </label>
              <input
                type="text"
                value={siteData.hero.badgeText}
                onChange={(e) =>
                  updateData((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, badgeText: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Main Headline Title
              </label>
              <input
                type="text"
                value={siteData.hero.title}
                onChange={(e) =>
                  updateData((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, title: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Subtitle Description
              </label>
              <textarea
                rows={3}
                value={siteData.hero.subtitle}
                onChange={(e) =>
                  updateData((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, subtitle: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Birthday Letter */}
        {activeTab === 'letter' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-['Outfit']">
              Parchment Letter & Wax Seal
            </h3>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Letter Heading Title
              </label>
              <input
                type="text"
                value={siteData.letter.title}
                onChange={(e) =>
                  updateData((prev) => ({
                    ...prev,
                    letter: { ...prev.letter, title: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Sender Name
                </label>
                <input
                  type="text"
                  value={siteData.letter.senderName}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      letter: { ...prev.letter, senderName: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Signature
                </label>
                <input
                  type="text"
                  value={siteData.letter.signature}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      letter: { ...prev.letter, signature: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Letter Content (Paragraphs separated by line breaks)
              </label>
              <textarea
                rows={6}
                value={siteData.letter.paragraphs.join('\n\n')}
                onChange={(e) =>
                  updateData((prev) => ({
                    ...prev,
                    letter: {
                      ...prev.letter,
                      paragraphs: e.target.value.split('\n\n').filter((p) => p.trim() !== ''),
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500 font-serif leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Tab 4: Theme Presets */}
        {activeTab === 'theme' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-['Outfit']">
              Color Palette & Visual Theme
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => applyThemePreset('Romantic Rose & Gold', '#f43f5e', '#fbbf24')}
                className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-rose-500/60 text-left flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-zinc-200">🌹 Romantic Rose & Gold</div>
                  <div className="text-[10px] text-zinc-500">Love stories & anniversaries</div>
                </div>
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded-full bg-rose-500" />
                  <div className="w-4 h-4 rounded-full bg-amber-400" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => applyThemePreset('Lavender Dream & Sparkles', '#a855f7', '#ec4899')}
                className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-purple-500/60 text-left flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-zinc-200">✨ Lavender Dream</div>
                  <div className="text-[10px] text-zinc-500">Magical purple & pink accents</div>
                </div>
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded-full bg-purple-500" />
                  <div className="w-4 h-4 rounded-full bg-pink-500" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => applyThemePreset('Midnight Sapphire & Stars', '#3b82f6', '#06b6d4')}
                className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-blue-500/60 text-left flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-zinc-200">🌌 Midnight Sapphire</div>
                  <div className="text-[10px] text-zinc-500">Deep celestial blue</div>
                </div>
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded-full bg-blue-500" />
                  <div className="w-4 h-4 rounded-full bg-cyan-400" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => applyThemePreset('Golden Champagne Celebration', '#eab308', '#f97316')}
                className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/60 text-left flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-zinc-200">🥂 Golden Champagne</div>
                  <div className="text-[10px] text-zinc-500">Milestone 21st, 30th, 50th</div>
                </div>
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded-full bg-amber-500" />
                  <div className="w-4 h-4 rounded-full bg-orange-500" />
                </div>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Primary Brand Hex
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={siteData.themeConfig.primaryColor}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        themeConfig: { ...prev.themeConfig, primaryColor: e.target.value },
                      }))
                    }
                    className="w-9 h-9 rounded-lg bg-zinc-950 border border-zinc-800 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={siteData.themeConfig.primaryColor}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        themeConfig: { ...prev.themeConfig, primaryColor: e.target.value },
                      }))
                    }
                    className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Accent Color Hex
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={siteData.themeConfig.accentColor}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        themeConfig: { ...prev.themeConfig, accentColor: e.target.value },
                      }))
                    }
                    className="w-9 h-9 rounded-lg bg-zinc-950 border border-zinc-800 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={siteData.themeConfig.accentColor}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        themeConfig: { ...prev.themeConfig, accentColor: e.target.value },
                      }))
                    }
                    className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Memories Photo Reel */}
        {activeTab === 'memories' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-['Outfit']">
                Photo Gallery Memories
              </h3>
              <button
                type="button"
                onClick={() =>
                  updateData((prev) => ({
                    ...prev,
                    memories: [
                      ...prev.memories,
                      {
                        id: `mem-${Date.now()}`,
                        title: 'Special Memory',
                        description: 'A beautiful day to remember.',
                        imageUrl:
                          'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&auto=format&fit=crop&q=80',
                        tag: 'Cherished',
                      },
                    ],
                  }))
                }
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Photo</span>
              </button>
            </div>

            <div className="space-y-3">
              {siteData.memories.map((mem, index) => (
                <div
                  key={mem.id}
                  className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-400">Photo #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateData((prev) => ({
                          ...prev,
                          memories: prev.memories.filter((m) => m.id !== mem.id),
                        }))
                      }
                      className="text-zinc-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={mem.title}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          memories: prev.memories.map((m) =>
                            m.id === mem.id ? { ...m, title: e.target.value } : m
                          ),
                        }))
                      }
                      placeholder="Title"
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200"
                    />
                    <input
                      type="text"
                      value={mem.tag || ''}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          memories: prev.memories.map((m) =>
                            m.id === mem.id ? { ...m, tag: e.target.value } : m
                          ),
                        }))
                      }
                      placeholder="Tag (e.g. Summer '23)"
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200"
                    />
                  </div>

                  <input
                    type="url"
                    value={mem.imageUrl}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        memories: prev.memories.map((m) =>
                          m.id === mem.id ? { ...m, imageUrl: e.target.value } : m
                        ),
                      }))
                    }
                    placeholder="Image URL"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200"
                  />

                  <textarea
                    rows={2}
                    value={mem.description}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        memories: prev.memories.map((m) =>
                          m.id === mem.id ? { ...m, description: e.target.value } : m
                        ),
                      }))
                    }
                    placeholder="Short description"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Wishes */}
        {activeTab === 'wishes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-['Outfit']">
                Wishes Wall Messages
              </h3>
              <button
                type="button"
                onClick={() =>
                  updateData((prev) => ({
                    ...prev,
                    wishes: [
                      ...prev.wishes,
                      {
                        id: `wish-${Date.now()}`,
                        from: 'Friend',
                        relationship: 'Best Friend',
                        message: 'Wishing you a magical year ahead filled with joy!',
                      },
                    ],
                  }))
                }
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Wish</span>
              </button>
            </div>

            <div className="space-y-3">
              {siteData.wishes.map((w) => (
                <div key={w.id} className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-300">From: {w.from}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateData((prev) => ({
                          ...prev,
                          wishes: prev.wishes.filter((wish) => wish.id !== w.id),
                        }))
                      }
                      className="text-zinc-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={w.from}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          wishes: prev.wishes.map((wish) =>
                            wish.id === w.id ? { ...wish, from: e.target.value } : wish
                          ),
                        }))
                      }
                      placeholder="Name"
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200"
                    />
                    <input
                      type="text"
                      value={w.relationship || ''}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          wishes: prev.wishes.map((wish) =>
                            wish.id === w.id ? { ...wish, relationship: e.target.value } : wish
                          ),
                        }))
                      }
                      placeholder="Relationship (e.g. Sister)"
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200"
                    />
                  </div>

                  <textarea
                    rows={2}
                    value={w.message}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        wishes: prev.wishes.map((wish) =>
                          wish.id === w.id ? { ...wish, message: e.target.value } : wish
                        ),
                      }))
                    }
                    placeholder="Warm wish message"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: Mystery Gifts */}
        {activeTab === 'gifts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-['Outfit']">
                Mystery Surprise Gifts
              </h3>
              <button
                type="button"
                onClick={() =>
                  updateData((prev) => ({
                    ...prev,
                    gifts: [
                      ...prev.gifts,
                      {
                        id: `gift-${Date.now()}`,
                        title: 'Surprise Box',
                        hint: 'Tap to unwrap a surprise',
                        revealMessage: 'A special weekend getaway voucher! ✈️',
                        icon: 'gift',
                        isOpened: false,
                      },
                    ],
                  }))
                }
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Gift</span>
              </button>
            </div>

            <div className="space-y-3">
              {siteData.gifts.map((g) => (
                <div key={g.id} className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-300">{g.title}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateData((prev) => ({
                          ...prev,
                          gifts: prev.gifts.filter((gift) => gift.id !== g.id),
                        }))
                      }
                      className="text-zinc-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={g.title}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        gifts: prev.gifts.map((gift) =>
                          gift.id === g.id ? { ...gift, title: e.target.value } : gift
                        ),
                      }))
                    }
                    placeholder="Box Title"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200"
                  />

                  <input
                    type="text"
                    value={g.hint}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        gifts: prev.gifts.map((gift) =>
                          gift.id === g.id ? { ...gift, hint: e.target.value } : gift
                        ),
                      }))
                    }
                    placeholder="Hint before clicking"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200"
                  />

                  <textarea
                    rows={2}
                    value={g.revealMessage}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        gifts: prev.gifts.map((gift) =>
                          gift.id === g.id ? { ...gift, revealMessage: e.target.value } : gift
                        ),
                      }))
                    }
                    placeholder="Message revealed after tapping"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 8: Music */}
        {activeTab === 'music' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-['Outfit']">
              Audio Soundtrack Settings
            </h3>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <input
                type="checkbox"
                id="musicToggle"
                checked={siteData.music.enabled}
                onChange={(e) =>
                  updateData((prev) => ({
                    ...prev,
                    music: { ...prev.music, enabled: e.target.checked },
                  }))
                }
                className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-amber-500 cursor-pointer"
              />
              <label htmlFor="musicToggle" className="text-xs font-semibold text-zinc-200 select-none cursor-pointer">
                Enable Background Music Player on Birthday Site
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Song Title
              </label>
              <input
                type="text"
                value={siteData.music.title}
                onChange={(e) =>
                  updateData((prev) => ({
                    ...prev,
                    music: { ...prev.music, title: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Artist / Mood
              </label>
              <input
                type="text"
                value={siteData.music.artist}
                onChange={(e) =>
                  updateData((prev) => ({
                    ...prev,
                    music: { ...prev.music, artist: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Audio File / Stream URL (MP3)
              </label>
              <input
                type="url"
                value={siteData.music.url}
                onChange={(e) =>
                  updateData((prev) => ({
                    ...prev,
                    music: { ...prev.music, url: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
