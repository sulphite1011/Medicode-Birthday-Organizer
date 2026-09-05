import React from 'react';
import { Project, ClientRequest } from '../../types';
import {
  FolderHeart,
  Activity,
  CheckCircle2,
  Clock,
  Video,
  Share2,
  Eye,
  TrendingUp
} from 'lucide-react';

interface MetricsOverviewProps {
  projects: Project[];
  requests: ClientRequest[];
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ projects, requests }) => {
  const totalProjects = projects.length;
  const liveProjects = projects.filter((p) => p.status === 'live').length;
  const inProgressProjects = projects.filter((p) => p.status === 'in_progress').length;
  const readyProjects = projects.filter((p) => p.status === 'ready').length;

  const pendingRequests = requests.filter(
    (r) => r.status === 'new' || r.status === 'in_progress'
  ).length;

  // Aggregate Social Links & Views
  let totalShowcaseVideos = 0;
  let totalSocialViews = 0;
  const uniquePlatforms = new Set<string>();

  projects.forEach((p) => {
    if (Array.isArray(p.socialLinks)) {
      totalShowcaseVideos += p.socialLinks.length;
      p.socialLinks.forEach((sl) => {
        uniquePlatforms.add(sl.platform);
        if (typeof sl.viewCount === 'number') {
          totalSocialViews += sl.viewCount;
        }
      });
    }
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
      
      {/* Metric 1: Total Websites */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between text-zinc-400 mb-2">
          <span className="text-xs font-medium">All Websites</span>
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
            <FolderHeart className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-zinc-100 font-['Outfit']">{totalProjects}</div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Birthday projects</div>
        </div>
      </div>

      {/* Metric 2: Live / Delivered */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between text-zinc-400 mb-2">
          <span className="text-xs font-medium">Live Deployed</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-emerald-400 font-['Outfit']">{liveProjects}</div>
          <div className="text-[11px] text-zinc-500 mt-0.5">{readyProjects} ready for review</div>
        </div>
      </div>

      {/* Metric 3: In Progress */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between text-zinc-400 mb-2">
          <span className="text-xs font-medium">In Production</span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-amber-300 font-['Outfit']">{inProgressProjects}</div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Currently building</div>
        </div>
      </div>

      {/* Metric 4: Pending Client Requests */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between text-zinc-400 mb-2">
          <span className="text-xs font-medium">Pending Orders</span>
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-sky-300 font-['Outfit']">{pendingRequests}</div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Awaiting completion</div>
        </div>
      </div>

      {/* Metric 5: Showcase Videos Published */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between text-zinc-400 mb-2">
          <span className="text-xs font-medium">Showcase Videos</span>
          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
            <Video className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-violet-300 font-['Outfit']">{totalShowcaseVideos}</div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Across {uniquePlatforms.size} platforms</div>
        </div>
      </div>

      {/* Metric 6: Showcase Social Views */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between text-zinc-400 mb-2">
          <span className="text-xs font-medium">Showcase Views</span>
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
            <Eye className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-rose-400 font-['Outfit']">{formatNumber(totalSocialViews)}</div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Viral social reach</div>
        </div>
      </div>

    </div>
  );
};
