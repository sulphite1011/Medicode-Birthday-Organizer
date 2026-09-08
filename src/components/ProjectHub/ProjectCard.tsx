import React, { useState } from 'react';
import {
  ExternalLink,
  Github,
  Star,
  MoreVertical,
  Edit,
  Trash2,
  CopyPlus,
  Play,
  CodeXml,
  Sparkles,
  Calendar,
  Share2,
  User,
  MoreHorizontal
} from 'lucide-react';
import { Project, SocialPlatform } from '../../types';
import { formatPrice } from '../../utils/formatters';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onDuplicate: (project: Project) => void;
  onTogglePin: (project: Project) => void;
  onManageSocials: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  onDuplicate,
  onTogglePin,
  onManageSocials,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getCoverImage = (p: Project) => {
    if (p.coverImageUrl && p.coverImageUrl.trim()) return p.coverImageUrl;
    return 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80';
  };

  const getThemeEmoji = (theme: string) => {
    const t = theme.toLowerCase();
    if (t.includes('rose')) return '🌹';
    if (t.includes('celestial') || t.includes('midnight')) return '🌙';
    if (t.includes('amber') || t.includes('sunset')) return '🌅';
    if (t.includes('gold') || t.includes('luxe')) return '👑';
    return '✨';
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
      default:
        return '🔗';
    }
  };

  const formatViews = (views?: number | null) => {
    if (!views) return null;
    if (views >= 1000000) return (views / 1000000).toFixed(0) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(0) + 'K';
    return views.toLocaleString();
  };

  const getOccasionBadge = (occ?: string) => {
    switch (occ) {
      case 'propose':
        return { label: '💍 Proposal', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      case 'marriage':
        return { label: '💒 Wedding Card', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'best_friend':
        return { label: '👯 Best Friend', color: 'bg-pink-500/20 text-pink-300 border-pink-500/40' };
      case 'teachers_day':
        return { label: '🎓 Teachers Day', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'feel_special':
        return { label: '💖 Feel Special', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' };
      case 'other':
        return { label: '🎉 Special Event', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      case 'birthday':
      default:
        return { label: '🎂 Birthday', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    }
  };

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'live':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-950/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            In Progress
          </span>
        );
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            Delivered
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
            Draft
          </span>
        );
    }
  };

  const formattedDate = new Date(project.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className={`group relative rounded-2xl bg-[#0b0e18] border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl shadow-black/40 ${
      project.isPinned
        ? 'border-purple-500/40 ring-1 ring-purple-500/20'
        : 'border-[#171d2d] hover:border-purple-500/40'
    }`}>
      
      {/* Top Bar: Favorite Pill, Status Badge & Dropdown */}
      <div className="p-3.5 px-4 flex items-center justify-between gap-2 border-b border-[#141a29] bg-[#0d111d]">
        
        {/* Favorite Pill */}
        <button
          onClick={() => onTogglePin(project)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            project.isPinned
              ? 'bg-amber-400/15 text-amber-300 border border-amber-400/40 shadow-sm'
              : 'bg-[#151928] text-zinc-400 hover:text-amber-300 border border-[#20273d]'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${project.isPinned ? 'fill-amber-400 text-amber-400' : ''}`} />
          <span>Favorite</span>
        </button>

        {/* Right Status & Menu */}
        <div className="flex items-center gap-2">
          {project.price && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              {formatPrice(project.price)}
            </span>
          )}
          {getStatusBadge(project.status)}

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1a2135] transition-colors cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-8 z-40 w-48 rounded-xl bg-[#0f1424] border border-[#232c48] shadow-2xl p-1.5 text-xs text-zinc-200">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(project);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#1b233d] transition-colors text-left"
                  >
                    <Edit className="w-3.5 h-3.5 text-amber-400" />
                    Edit Details & Image
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onManageSocials(project);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#1b233d] transition-colors text-left"
                  >
                    <Share2 className="w-3.5 h-3.5 text-pink-400" />
                    Social Showcase
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onDuplicate(project);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#1b233d] transition-colors text-left"
                  >
                    <CopyPlus className="w-3.5 h-3.5 text-sky-400" />
                    Duplicate Project
                  </button>
                  <div className="my-1 border-t border-[#1d243b]" />
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onDelete(project.id);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-950/30 transition-colors text-left"
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

      {/* Cinematic Media / Video Preview Banner */}
      <div
        onClick={() => {
          if (project.liveWebsiteUrl) {
            window.open(project.liveWebsiteUrl, '_blank');
          } else {
            onEdit(project);
          }
        }}
        className="relative h-48 w-full overflow-hidden cursor-pointer group/thumb select-none"
        title={project.liveWebsiteUrl ? 'Open live website' : 'Click to edit project and set preview image / links'}
      >
        <img
          src={getCoverImage(project)}
          alt={project.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80';
          }}
          className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500"
        />
        
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e18] via-black/40 to-black/30" />

        {/* Styled Greeting & Occasion Tag on Image */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md shadow-sm ${getOccasionBadge(project.occasion).color}`}>
            {getOccasionBadge(project.occasion).label}
          </span>
          {project.isPublicShowcase !== false && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/60 text-zinc-300 border border-white/20 backdrop-blur-md">
              🌐 Client Portal
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
          <span className="text-white text-sm sm:text-base font-serif italic drop-shadow-md tracking-wide line-clamp-1">
            {project.occasion === 'propose'
              ? `💍 Proposal for ${project.recipientName}`
              : project.occasion === 'marriage'
              ? `💒 Wedding Card: ${project.recipientName}`
              : project.occasion === 'teachers_day'
              ? `🎓 Tribute to ${project.recipientName}`
              : project.occasion === 'best_friend'
              ? `👯 Best Friend: ${project.recipientName}`
              : `Celebrating ${project.recipientName}`}
          </span>
        </div>

        {/* Central Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-black/40 group-hover/thumb:bg-purple-600/80 backdrop-blur-md border border-white/30 group-hover/thumb:border-white/80 flex items-center justify-center text-white shadow-2xl transition-all duration-300 group-hover/thumb:scale-110">
            <Play className="w-5 h-5 ml-0.5 fill-white text-white" />
          </div>
        </div>
      </div>

      {/* Project Body Info */}
      <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
        
        {/* Title */}
        <div>
          <h3 className="text-base font-bold text-white tracking-tight font-['Outfit'] line-clamp-1">
            {project.name}
          </h3>

          {/* Metadata Rows: Recipient, Client, Date & Theme */}
          <div className="mt-2.5 space-y-1.5 text-xs text-zinc-300">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span>Recipient: <strong className="text-white font-semibold">{project.recipientName}</strong></span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-zinc-400" />
                <span className="line-clamp-1">Client: <strong className="text-zinc-200 font-medium">{project.clientName || 'TikTok User'}</strong></span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>Created: {formattedDate}</span>
              </div>

              {/* Theme Pill */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#131929] border border-[#222a42] text-[11px] font-medium text-zinc-200">
                <span>{getThemeEmoji(project.theme)}</span>
                <span className="line-clamp-1">{project.theme}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Social Showcase Row */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1.5">
            <span className="font-medium">Social Showcase ({project.socialLinks?.length || 0})</span>
            <button
              onClick={() => onManageSocials(project)}
              className="text-purple-400 hover:text-purple-300 font-semibold cursor-pointer text-[10px]"
            >
              + Add / Edit
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {project.socialLinks && project.socialLinks.length > 0 ? (
              project.socialLinks.map((sl) => {
                const views = formatViews(sl.viewCount);
                return (
                  <a
                    key={sl.id}
                    href={sl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#121626] hover:bg-[#192036] border border-[#1e253d] text-[11px] text-zinc-200 transition-colors shadow-sm"
                    title={`${sl.platform.toUpperCase()}: ${sl.url}`}
                  >
                    <span>{getPlatformIcon(sl.platform)}</span>
                    <span className="capitalize">{sl.platform}</span>
                    {views && (
                      <span className="font-mono text-[10px] text-zinc-400">
                        {views}
                      </span>
                    )}
                  </a>
                );
              })
            ) : (
              <span className="text-[11px] text-zinc-400 italic">No social videos linked</span>
            )}
          </div>
        </div>

      </div>

      {/* Card Action Buttons Footer */}
      <div className="p-3.5 px-4 bg-[#0d101c] border-t border-[#141a29] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {project.liveWebsiteUrl ? (
            <a
              href={project.liveWebsiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:brightness-110 text-white text-xs font-bold shadow-md shadow-purple-900/30 transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </a>
          ) : (
            <button
              onClick={() => onEdit(project)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:brightness-110 text-white text-xs font-bold shadow-md shadow-purple-900/30 transition-all cursor-pointer"
              title="Add live website link or custom preview image"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          )}

          {project.githubRepoUrl && (
            <a
              href={project.githubRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#141928] hover:bg-[#1a2135] text-zinc-300 hover:text-white border border-[#202840] text-xs font-semibold transition-all cursor-pointer"
              title="GitHub Repository"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          )}

          <button
            onClick={() => onEdit(project)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#141928] hover:bg-[#1a2135] text-zinc-300 hover:text-white border border-[#202840] text-xs font-semibold transition-all cursor-pointer"
            title="Edit Project"
          >
            <Edit className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        </div>

        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 rounded-xl bg-[#141928] hover:bg-[#1a2135] text-zinc-400 hover:text-white border border-[#202840] transition-all cursor-pointer"
          title="More actions"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
