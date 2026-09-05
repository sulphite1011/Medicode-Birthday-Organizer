import React, { useState } from 'react';
import {
  ExternalLink,
  Github,
  Star,
  MoreVertical,
  Edit,
  Copy,
  Check,
  Trash2,
  CopyPlus,
  Globe,
  Share2,
  CodeXml,
  Sparkles,
  Calendar
} from 'lucide-react';
import { Project, SocialLink, SocialPlatform } from '../../types';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onDuplicate: (project: Project) => void;
  onTogglePin: (project: Project) => void;
  onManageSocials: (project: Project) => void;
  onOpenBuilder: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  onDuplicate,
  onTogglePin,
  onManageSocials,
  onOpenBuilder,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case 'tiktok':
        return '🎵';
      case 'instagram':
        return '📸';
      case 'youtube':
        return '▶️';
      case 'facebook':
        return '📘';
      case 'pinterest':
        return '📌';
      case 'x':
        return '𝕏';
      case 'threads':
        return '🧵';
      case 'snapchat':
        return '👻';
      default:
        return '🔗';
    }
  };

  const getPlatformBadgeStyle = (platform: SocialPlatform) => {
    switch (platform) {
      case 'tiktok':
        return 'bg-zinc-900 text-pink-400 border-pink-500/30 hover:border-pink-400';
      case 'instagram':
        return 'bg-gradient-to-r from-purple-950/50 to-pink-950/50 text-pink-300 border-pink-500/30 hover:border-pink-400';
      case 'youtube':
        return 'bg-red-950/40 text-red-400 border-red-500/30 hover:border-red-400';
      case 'facebook':
        return 'bg-blue-950/40 text-blue-300 border-blue-500/30 hover:border-blue-400';
      case 'pinterest':
        return 'bg-rose-950/40 text-rose-300 border-rose-500/30 hover:border-rose-400';
      case 'x':
        return 'bg-zinc-900 text-zinc-200 border-zinc-700 hover:border-zinc-500';
      default:
        return 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-500';
    }
  };

  const formatViews = (views?: number | null) => {
    if (!views) return null;
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views.toLocaleString();
  };

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'live':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Website
          </span>
        );
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            Ready for Preview
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            In Production
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
            Draft
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-zinc-900 text-zinc-500 border border-zinc-800">
            Archived
          </span>
        );
    }
  };

  const getPlatformLabel = (platform: Project['deploymentPlatform']) => {
    switch (platform) {
      case 'cloudflare':
        return 'Cloudflare Pages';
      case 'netlify':
        return 'Netlify';
      case 'vercel':
        return 'Vercel';
      case 'github_pages':
        return 'GitHub Pages';
      default:
        return 'Custom Host';
    }
  };

  return (
    <div className={`relative rounded-2xl bg-zinc-900/70 border transition-all duration-200 flex flex-col justify-between ${
      project.isPinned
        ? 'border-amber-500/40 shadow-lg shadow-amber-950/20 ring-1 ring-amber-500/20'
        : 'border-zinc-800/80 hover:border-zinc-700 shadow-sm'
    }`}>
      
      {/* Top Card Area */}
      <div className="p-5">
        
        {/* Header Row: Status, Platform, Pin, Menu */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {getStatusBadge(project.status)}
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
              {getPlatformLabel(project.deploymentPlatform)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onTogglePin(project)}
              title={project.isPinned ? 'Unpin project' : 'Pin to top'}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                project.isPinned
                  ? 'text-amber-400 hover:text-amber-300 bg-amber-500/10'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <Star className={`w-4 h-4 ${project.isPinned ? 'fill-amber-400' : ''}`} />
            </button>

            {/* Quick Actions Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-8 z-30 w-48 rounded-xl bg-zinc-900 border border-zinc-700/80 shadow-2xl p-1.5 text-xs">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onEdit(project);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-200 hover:bg-zinc-800 transition-colors text-left"
                    >
                      <Edit className="w-3.5 h-3.5 text-amber-400" />
                      Edit Project Details
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onOpenBuilder(project);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-200 hover:bg-zinc-800 transition-colors text-left"
                    >
                      <CodeXml className="w-3.5 h-3.5 text-violet-400" />
                      Customize in Builder
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onManageSocials(project);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-200 hover:bg-zinc-800 transition-colors text-left"
                    >
                      <Share2 className="w-3.5 h-3.5 text-pink-400" />
                      Social Showcase Links
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onDuplicate(project);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-200 hover:bg-zinc-800 transition-colors text-left"
                    >
                      <CopyPlus className="w-3.5 h-3.5 text-sky-400" />
                      Duplicate Website
                    </button>
                    <div className="my-1 border-t border-zinc-800" />
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onDelete(project.id);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-950/40 transition-colors text-left"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      Delete Project
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Project Name & Recipient */}
        <div className="mb-3">
          <h3 className="text-base font-bold text-zinc-100 tracking-tight line-clamp-1 font-['Outfit']">
            {project.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
            <span className="font-semibold text-rose-400/90 flex items-center gap-1">
              🎂 Recipient: {project.recipientName}
            </span>
            {project.clientName && (
              <>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400 line-clamp-1">Client: {project.clientName}</span>
              </>
            )}
          </div>
        </div>

        {/* Theme Pill & Date */}
        <div className="flex items-center gap-2 mb-4 text-xs text-zinc-500">
          <span className="px-2 py-0.5 rounded-md bg-zinc-800/60 text-zinc-300 border border-zinc-700/50 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            {project.theme}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-zinc-500">
            <Calendar className="w-3 h-3" />
            {new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {/* Notes if any */}
        {project.notes && (
          <p className="text-xs text-zinc-400/90 bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-800/60 line-clamp-2 mb-4">
            {project.notes}
          </p>
        )}

        {/* Multi-Platform Social Showcase Links Section (Requirement #4) */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400 mb-2">
            <span className="flex items-center gap-1">
              <Share2 className="w-3 h-3 text-rose-400" />
              Social Showcase ({project.socialLinks?.length || 0})
            </span>
            <button
              onClick={() => onManageSocials(project)}
              className="text-amber-400 hover:text-amber-300 text-[10px] font-semibold transition-colors cursor-pointer"
            >
              + Add / Edit
            </button>
          </div>

          {project.socialLinks && project.socialLinks.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {project.socialLinks.map((link) => {
                const viewsStr = formatViews(link.viewCount);
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all hover:scale-105 active:scale-95 shadow-sm ${getPlatformBadgeStyle(
                      link.platform
                    )}`}
                    title={`${link.platform.toUpperCase()}: ${link.url} ${link.notes ? `(${link.notes})` : ''}`}
                  >
                    <span>{getPlatformIcon(link.platform)}</span>
                    <span className="capitalize">{link.platform}</span>
                    {viewsStr && (
                      <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-zinc-950/60 font-mono text-zinc-200">
                        {viewsStr}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          ) : (
            <div
              onClick={() => onManageSocials(project)}
              className="text-center py-2 px-3 rounded-xl border border-dashed border-zinc-800 text-[11px] text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 cursor-pointer transition-colors"
            >
              No showcase videos linked yet. Click to add TikTok, Reels, Shorts...
            </div>
          )}
        </div>

      </div>

      {/* Footer Area with Quick Links & Code Launcher */}
      <div className="p-3.5 px-5 bg-zinc-950/60 border-t border-zinc-800/80 rounded-b-2xl flex items-center justify-between gap-2">
        
        {/* Left Link Buttons */}
        <div className="flex items-center gap-2">
          {project.liveWebsiteUrl ? (
            <div className="flex items-center">
              <a
                href={project.liveWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-l-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-r-0 border-emerald-500/30 text-xs font-semibold transition-colors"
                title="Open Live Website"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Live Site</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
              <button
                onClick={(e) => handleCopy(project.liveWebsiteUrl!, 'live', e)}
                className="px-2 py-1.5 rounded-r-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs transition-colors"
                title="Copy Live URL"
              >
                {copiedField === 'live' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ) : (
            <span className="text-xs text-zinc-600 italic">No live URL</span>
          )}

          {project.githubRepoUrl && (
            <div className="flex items-center">
              <a
                href={project.githubRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-l-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-r-0 border-zinc-700 text-xs font-semibold transition-colors"
                title="Open GitHub Repository"
              >
                <Github className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Repo</span>
              </a>
              <button
                onClick={(e) => handleCopy(project.githubRepoUrl!, 'github', e)}
                className="px-2 py-1.5 rounded-r-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs transition-colors"
                title="Copy GitHub URL"
              >
                {copiedField === 'github' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Right: Open in Builder button */}
        <button
          onClick={() => onOpenBuilder(project)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600/30 to-rose-600/30 hover:from-violet-600/40 hover:to-rose-600/40 text-violet-200 border border-violet-500/30 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
          title="Open Website Customizer & Generator"
        >
          <CodeXml className="w-3.5 h-3.5 text-violet-300" />
          <span>Builder</span>
        </button>

      </div>

    </div>
  );
};
