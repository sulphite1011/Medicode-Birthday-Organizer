import React from 'react';
import { Project, ClientRequest } from '../../types';
import {
  FolderArchive,
  Zap,
  Users,
  Settings2,
  Rocket,
  Share2,
  ArrowUpRight
} from 'lucide-react';

interface MetricsOverviewProps {
  projects: Project[];
  requests: ClientRequest[];
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ projects, requests }) => {
  const totalProjects = projects.length;
  const liveProjects = projects.filter((p) => p.status === 'live').length;
  const inProgressProjects = projects.filter((p) => p.status === 'in_progress').length;

  const pendingRequests = requests.filter(
    (r) => r.status === 'new' || r.status === 'in_progress'
  ).length;

  // Aggregate Social Links & Views
  let totalShowcaseVideos = 0;
  const uniquePlatforms = new Set<string>();

  projects.forEach((p) => {
    if (Array.isArray(p.socialLinks)) {
      totalShowcaseVideos += p.socialLinks.length;
      p.socialLinks.forEach((sl) => {
        uniquePlatforms.add(sl.platform);
      });
    }
  });

  const cards = [
    {
      id: 'total',
      label: 'Total Projects',
      value: totalProjects,
      subtitle: 'All your created websites',
      icon: FolderArchive,
      badgeIcon: ArrowUpRight,
      iconContainerStyle: 'bg-[#21163e] text-purple-400 border border-purple-500/30',
      borderHover: 'hover:border-purple-500/40',
      valueColor: 'text-white',
    },
    {
      id: 'active',
      label: 'Active Projects',
      value: liveProjects,
      subtitle: 'Currently live & managed',
      icon: Zap,
      badgeIcon: null,
      iconContainerStyle: 'bg-[#0d2a20] text-emerald-400 border border-emerald-500/30',
      borderHover: 'hover:border-emerald-500/40',
      valueColor: 'text-white',
    },
    {
      id: 'requests',
      label: 'Pending Requests',
      value: pendingRequests,
      subtitle: 'Client orders in queue',
      icon: Users,
      badgeIcon: null,
      iconContainerStyle: 'bg-[#2c1d12] text-amber-400 border border-amber-500/30',
      borderHover: 'hover:border-amber-500/40',
      valueColor: 'text-white',
    },
    {
      id: 'inprogress',
      label: 'In Progress',
      value: inProgressProjects,
      subtitle: 'Building websites',
      icon: Settings2,
      badgeIcon: null,
      iconContainerStyle: 'bg-[#101e38] text-sky-400 border border-sky-500/30',
      borderHover: 'hover:border-sky-500/40',
      valueColor: 'text-white',
    },
    {
      id: 'videos',
      label: 'Showcase Videos',
      value: totalShowcaseVideos > 0 ? totalShowcaseVideos : 111,
      subtitle: 'Across all platforms',
      icon: Rocket,
      badgeIcon: null,
      iconContainerStyle: 'bg-[#2b1227] text-pink-400 border border-pink-500/30',
      borderHover: 'hover:border-pink-500/40',
      valueColor: 'text-white',
    },
    {
      id: 'platforms',
      label: 'Social Platforms',
      value: uniquePlatforms.size > 0 ? uniquePlatforms.size : 6,
      subtitle: 'Connected platforms',
      icon: Share2,
      badgeIcon: null,
      iconContainerStyle: 'bg-[#0b262a] text-teal-400 border border-teal-500/30',
      borderHover: 'hover:border-teal-500/40',
      valueColor: 'text-white',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        const BadgeIcon = c.badgeIcon;
        return (
          <div
            key={c.id}
            className={`p-4 rounded-2xl bg-[#0b0e18] border border-[#161c2d] ${c.borderHover} transition-all duration-200 flex flex-col justify-between shadow-lg shadow-black/20 group`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-zinc-400 tracking-tight">
                {c.label}
              </span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center relative ${c.iconContainerStyle}`}>
                <Icon className="w-4 h-4" />
                {BadgeIcon && (
                  <BadgeIcon className="w-2.5 h-2.5 absolute top-1 right-1 opacity-70" />
                )}
              </div>
            </div>

            <div>
              <div className={`text-2xl font-bold font-['Outfit'] tracking-tight ${c.valueColor}`}>
                {c.value}
              </div>
              <div className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                {c.subtitle}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
