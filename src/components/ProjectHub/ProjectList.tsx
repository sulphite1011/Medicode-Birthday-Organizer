import React, { useState, useMemo } from 'react';
import { Project, DeploymentPlatform, ProjectStatus, SocialPlatform } from '../../types';
import { ProjectCard } from './ProjectCard';
import {
  Search,
  Filter,
  ArrowUpDown,
  Star,
  Plus,
  FolderHeart,
  Globe,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  onNewProject: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onDuplicateProject: (project: Project) => void;
  onTogglePin: (project: Project) => void;
  onManageSocials: (project: Project) => void;
  onOpenBuilder: (project: Project) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onNewProject,
  onEditProject,
  onDeleteProject,
  onDuplicateProject,
  onTogglePin,
  onManageSocials,
  onOpenBuilder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [platformFilter, setPlatformFilter] = useState<DeploymentPlatform | 'all'>('all');
  const [socialPlatformFilter, setSocialPlatformFilter] = useState<SocialPlatform | 'all'>('all');
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'recently_updated'>('newest');

  // Available themes extracted from projects
  const uniqueThemes = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.theme) set.add(p.theme);
    });
    return Array.from(set);
  }, [projects]);
  const [themeFilter, setThemeFilter] = useState<string>('all');

  // Filtering Logic
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Pinned check
      if (pinnedOnly && !p.isPinned) return false;

      // Status check
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;

      // Platform check
      if (platformFilter !== 'all' && p.deploymentPlatform !== platformFilter) return false;

      // Theme check
      if (themeFilter !== 'all' && p.theme !== themeFilter) return false;

      // Social Platform check
      if (socialPlatformFilter !== 'all') {
        const hasPlatform = p.socialLinks?.some((sl) => sl.platform === socialPlatformFilter);
        if (!hasPlatform) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesRecipient = p.recipientName.toLowerCase().includes(query);
        const matchesClient = p.clientName?.toLowerCase().includes(query) || false;
        const matchesGithub = p.githubRepoUrl?.toLowerCase().includes(query) || false;
        const matchesLive = p.liveWebsiteUrl?.toLowerCase().includes(query) || false;
        const matchesNotes = p.notes?.toLowerCase().includes(query) || false;

        if (!matchesName && !matchesRecipient && !matchesClient && !matchesGithub && !matchesLive && !matchesNotes) {
          return false;
        }
      }

      return true;
    });
  }, [
    projects,
    pinnedOnly,
    statusFilter,
    platformFilter,
    themeFilter,
    socialPlatformFilter,
    searchQuery,
  ]);

  // Sorting Logic
  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
      // Pinned always take precedence if not strictly sorting otherwise
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }

      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'recently_updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [filteredProjects, sortBy]);

  const hasActiveFilters =
    searchQuery !== '' ||
    statusFilter !== 'all' ||
    platformFilter !== 'all' ||
    socialPlatformFilter !== 'all' ||
    themeFilter !== 'all' ||
    pinnedOnly;

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPlatformFilter('all');
    setSocialPlatformFilter('all');
    setThemeFilter('all');
    setPinnedOnly(false);
  };

  return (
    <div className="space-y-5">
      
      {/* Search & Control Toolbar */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md space-y-3.5">
        
        {/* Top Row: Search input, Pinned toggle, Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project name, recipient, client, live URL, GitHub repo..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Controls: Pinned toggle, Sort selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPinnedOnly(!pinnedOnly)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                pinnedOnly
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${pinnedOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>Favorites</span>
            </button>

            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-zinc-900">Newest Created</option>
                <option value="recently_updated" className="bg-zinc-900">Recently Updated</option>
                <option value="name" className="bg-zinc-900">Name (A-Z)</option>
                <option value="oldest" className="bg-zinc-900">Oldest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom Row: Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-800/60 text-xs">
          
          <div className="flex items-center gap-1.5 text-zinc-400 font-medium mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-zinc-700 cursor-pointer"
          >
            <option value="all">Status: All</option>
            <option value="live">Live Websites</option>
            <option value="ready">Ready for Preview</option>
            <option value="in_progress">In Production</option>
            <option value="draft">Drafts</option>
            <option value="archived">Archived</option>
          </select>

          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-zinc-700 cursor-pointer"
          >
            <option value="all">Platform: All</option>
            <option value="cloudflare">Cloudflare Pages</option>
            <option value="netlify">Netlify</option>
            <option value="vercel">Vercel</option>
            <option value="github_pages">GitHub Pages</option>
            <option value="other">Other / Custom</option>
          </select>

          {/* Social Platform Filter */}
          <select
            value={socialPlatformFilter}
            onChange={(e) => setSocialPlatformFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-zinc-700 cursor-pointer"
          >
            <option value="all">Social Showcase: All</option>
            <option value="tiktok">TikTok Video</option>
            <option value="instagram">Instagram Reel</option>
            <option value="youtube">YouTube / Shorts</option>
            <option value="facebook">Facebook</option>
            <option value="pinterest">Pinterest</option>
            <option value="x">X</option>
          </select>

          {/* Theme Filter */}
          {uniqueThemes.length > 0 && (
            <select
              value={themeFilter}
              onChange={(e) => setThemeFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-zinc-700 cursor-pointer"
            >
              <option value="all">Theme: All</option>
              {uniqueThemes.map((th) => (
                <option key={th} value={th}>
                  {th}
                </option>
              ))}
            </select>
          )}

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="ml-auto text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}

        </div>

      </div>

      {/* Grid of Project Cards */}
      {sortedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {sortedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={onEditProject}
              onDelete={onDeleteProject}
              onDuplicate={onDuplicateProject}
              onTogglePin={onTogglePin}
              onManageSocials={onManageSocials}
              onOpenBuilder={onOpenBuilder}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 px-4 rounded-3xl bg-zinc-900/40 border border-dashed border-zinc-800 text-center flex flex-col items-center justify-center max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-zinc-800/80 flex items-center justify-center text-zinc-500 mb-4">
            <FolderHeart className="w-7 h-7 text-rose-400/60" />
          </div>
          <h3 className="text-lg font-bold text-zinc-200 font-['Outfit'] mb-1">
            {hasActiveFilters ? 'No Matching Birthday Websites' : 'No Projects Found'}
          </h3>
          <p className="text-xs text-zinc-400 mb-6 max-w-xs">
            {hasActiveFilters
              ? 'Try changing your search keywords or clearing active filters to see all birthday websites.'
              : 'Create your first birthday website project to manage code, deployments, and social showcase reels.'}
          </p>
          {hasActiveFilters ? (
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors"
            >
              Clear All Filters
            </button>
          ) : (
            <button
              onClick={onNewProject}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-950 bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 shadow-md shadow-rose-950/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Website</span>
            </button>
          )}
        </div>
      )}

    </div>
  );
};
