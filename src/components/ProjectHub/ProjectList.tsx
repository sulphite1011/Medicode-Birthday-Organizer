import React, { useState, useMemo } from 'react';
import { Project, DeploymentPlatform, ProjectStatus, SocialPlatform } from '../../types';
import { ProjectCard } from './ProjectCard';
import {
  Search,
  ArrowUpDown,
  Star,
  Plus,
  FolderHeart,
  SlidersHorizontal,
  X,
  LayoutGrid,
  List
} from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  onNewProject: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onDuplicateProject: (project: Project) => void;
  onTogglePin: (project: Project) => void;
  onManageSocials: (project: Project) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onNewProject,
  onEditProject,
  onDeleteProject,
  onDuplicateProject,
  onTogglePin,
  onManageSocials,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [platformFilter, setPlatformFilter] = useState<DeploymentPlatform | 'all'>('all');
  const [socialPlatformFilter, setSocialPlatformFilter] = useState<SocialPlatform | 'all'>('all');
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'recently_updated'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
      if (pinnedOnly && !p.isPinned) return false;
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (platformFilter !== 'all' && p.deploymentPlatform !== platformFilter) return false;
      if (themeFilter !== 'all' && p.theme !== themeFilter) return false;
      if (socialPlatformFilter !== 'all') {
        const hasPlatform = p.socialLinks?.some((sl) => sl.platform === socialPlatformFilter);
        if (!hasPlatform) return false;
      }

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
    <div id="projects-section" className="space-y-6">
      
      {/* Search & Control Toolbar */}
      <div className="p-4 rounded-2xl bg-[#0a0d17] border border-[#171e30] space-y-3.5 shadow-xl shadow-black/20">
        
        {/* Top Row: Search input, Pinned toggle, Sort, View mode */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project name, recipient, client, live URL, GitHub repo..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#0f1422] border border-[#1d253b] text-xs sm:text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/60 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Controls: Pinned toggle, Sort, View Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPinnedOnly(!pinnedOnly)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                pinnedOnly
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                  : 'bg-[#0f1422] text-zinc-400 border-[#1d253b] hover:border-zinc-700'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${pinnedOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>Favorites</span>
            </button>

            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0f1422] border border-[#1d253b]">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-[#0f1422]">Sort: Newest</option>
                <option value="recently_updated" className="bg-[#0f1422]">Recently Updated</option>
                <option value="name" className="bg-[#0f1422]">Name (A-Z)</option>
                <option value="oldest" className="bg-[#0f1422]">Oldest</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center p-0.5 rounded-xl bg-[#0f1422] border border-[#1d253b]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-purple-600/30 text-purple-300'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-purple-600/30 text-purple-300'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row: Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#141a2b] text-xs">
          
          <div className="flex items-center gap-1.5 text-zinc-400 font-medium mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg bg-[#0f1422] border border-[#1d253b] text-zinc-300 focus:outline-none focus:border-purple-500/50 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="live">Live Websites</option>
            <option value="ready">Ready / Delivered</option>
            <option value="in_progress">In Progress</option>
            <option value="draft">Drafts</option>
          </select>

          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg bg-[#0f1422] border border-[#1d253b] text-zinc-300 focus:outline-none focus:border-purple-500/50 cursor-pointer"
          >
            <option value="all">All Platforms</option>
            <option value="cloudflare">Cloudflare Pages</option>
            <option value="netlify">Netlify</option>
            <option value="vercel">Vercel</option>
            <option value="github_pages">GitHub Pages</option>
          </select>

          {/* Social Platform Filter */}
          <select
            value={socialPlatformFilter}
            onChange={(e) => setSocialPlatformFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg bg-[#0f1422] border border-[#1d253b] text-zinc-300 focus:outline-none focus:border-purple-500/50 cursor-pointer"
          >
            <option value="all">All Socials</option>
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
            <option value="facebook">Facebook</option>
            <option value="pinterest">Pinterest</option>
          </select>

          {/* Theme Filter */}
          {uniqueThemes.length > 0 && (
            <select
              value={themeFilter}
              onChange={(e) => setThemeFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[#0f1422] border border-[#1d253b] text-zinc-300 focus:outline-none focus:border-purple-500/50 cursor-pointer"
            >
              <option value="all">All Themes</option>
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

      {/* Grid or List of Project Cards */}
      {sortedProjects.length > 0 ? (
        <div className={
          viewMode === 'grid'
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            : "grid grid-cols-1 gap-4"
        }>
          {sortedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={onEditProject}
              onDelete={onDeleteProject}
              onDuplicate={onDuplicateProject}
              onTogglePin={onTogglePin}
              onManageSocials={onManageSocials}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 px-6 rounded-3xl bg-[#090d16] border border-dashed border-[#1e263d] text-center flex flex-col items-center justify-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-900/30 to-pink-900/30 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 shadow-xl shadow-purple-950/20">
            <FolderHeart className="w-8 h-8 text-rose-400" />
          </div>
          <h3 className="text-xl font-bold text-white font-['Outfit'] mb-2">
            {hasActiveFilters ? 'No Matching Birthday Websites' : 'No Birthday Websites Created Yet'}
          </h3>
          <p className="text-xs text-zinc-400 mb-6 max-w-sm leading-relaxed">
            {hasActiveFilters
              ? 'Try changing your search terms or clearing active filters to view your projects.'
              : 'Start your creative journey! Create a website for a client or loved one, customize its preview image, theme and links, and track showcase videos.'}
          </p>
          {hasActiveFilters ? (
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#13192a] text-zinc-200 hover:bg-[#1a233b] border border-[#212b45] transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          ) : (
            <button
              onClick={onNewProject}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:brightness-110 shadow-lg shadow-purple-900/40 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create First Project</span>
            </button>
          )}
        </div>
      )}

    </div>
  );
};
