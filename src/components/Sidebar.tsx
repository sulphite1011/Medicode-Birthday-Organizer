import React from 'react';
import {
  LayoutDashboard,
  FolderHeart,
  Inbox,
  CodeXml,
  Rocket,
  Database,
  Settings,
  Plus,
  MessageSquarePlus,
  Crown,
  Sparkles,
  X
} from 'lucide-react';
import { NavigationTab } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  projectCount: number;
  pendingRequestsCount: number;
  onNewProject: () => void;
  onNewRequest: () => void;
  onOpenBuilder: () => void;
  onOpenSettings: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  projectCount,
  pendingRequestsCount,
  onNewProject,
  onNewRequest,
  onOpenBuilder,
  onOpenSettings,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'projects' as NavigationTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'projects' as NavigationTab,
      label: 'Projects',
      icon: FolderHeart,
      badge: projectCount,
    },
    {
      id: 'requests' as NavigationTab,
      label: 'Client Requests',
      icon: Inbox,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : null,
    },
    {
      id: 'builder' as NavigationTab,
      label: 'Website Builder',
      icon: CodeXml,
      badge: null,
    },
    {
      id: 'deployments' as NavigationTab,
      label: 'Deployments',
      icon: Rocket,
      badge: null,
    },
    {
      id: 'backup' as NavigationTab,
      label: 'Cloud & Backup',
      icon: Database,
      badge: null,
    },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#080b13] border-r border-[#1a2035] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Brand Logo */}
        <div>
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#141a2b]">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => handleNavClick('projects')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-[1.5px] shadow-lg shadow-purple-950/40">
                <div className="w-full h-full bg-[#0d121f] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white font-['Outfit'] block">
                  WishCraft <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-400 to-purple-400">Studio</span>
                </span>
                <span className="text-[10px] text-zinc-400 tracking-wider uppercase font-medium">
                  Command Center
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-4 py-5 space-y-1">
            <button
              onClick={() => handleNavClick('projects')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'projects'
                  ? 'bg-gradient-to-r from-purple-900/40 to-indigo-900/30 text-white border border-purple-500/30 shadow-md shadow-purple-950/20'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#111626]'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className={`w-4 h-4 ${activeTab === 'projects' ? 'text-purple-400' : 'text-zinc-400'}`} />
                <span>Dashboard</span>
              </div>
            </button>

            <button
              onClick={() => handleNavClick('projects')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'projects'
                  ? 'text-zinc-200 hover:bg-[#111626]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#111626]'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderHeart className="w-4 h-4 text-rose-400" />
                <span>Projects</span>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#1b233a] text-purple-300 border border-purple-800/40">
                {projectCount}
              </span>
            </button>

            <button
              onClick={() => handleNavClick('requests')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'requests'
                  ? 'bg-gradient-to-r from-purple-900/40 to-indigo-900/30 text-white border border-purple-500/30 shadow-md shadow-purple-950/20'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#111626]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Inbox className={`w-4 h-4 ${activeTab === 'requests' ? 'text-amber-400' : 'text-zinc-400'}`} />
                <span>Client Requests</span>
              </div>
              {pendingRequestsCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick('builder')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'builder'
                  ? 'bg-gradient-to-r from-purple-900/40 to-indigo-900/30 text-white border border-purple-500/30 shadow-md shadow-purple-950/20'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#111626]'
              }`}
            >
              <div className="flex items-center gap-3">
                <CodeXml className={`w-4 h-4 ${activeTab === 'builder' ? 'text-violet-400' : 'text-zinc-400'}`} />
                <span>Website Builder</span>
              </div>
            </button>

            <button
              onClick={() => handleNavClick('deployments')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'deployments'
                  ? 'bg-gradient-to-r from-purple-900/40 to-indigo-900/30 text-white border border-purple-500/30 shadow-md shadow-purple-950/20'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#111626]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Rocket className={`w-4 h-4 ${activeTab === 'deployments' ? 'text-emerald-400' : 'text-zinc-400'}`} />
                <span>Deployments</span>
              </div>
            </button>

            <button
              onClick={() => handleNavClick('backup')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'backup'
                  ? 'bg-gradient-to-r from-purple-900/40 to-indigo-900/30 text-white border border-purple-500/30 shadow-md shadow-purple-950/20'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#111626]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Database className={`w-4 h-4 ${activeTab === 'backup' ? 'text-sky-400' : 'text-zinc-400'}`} />
                <span>Cloud & Backup</span>
              </div>
            </button>

            <button
              onClick={onOpenSettings}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-[#111626] transition-all"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-zinc-400" />
                <span>Settings</span>
              </div>
            </button>
          </div>

          {/* Quick Actions Section */}
          <div className="px-5 pt-2 pb-4">
            <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-3 px-1">
              Quick Actions
            </div>
            
            <div className="space-y-2">
              <button
                onClick={onNewProject}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-purple-900/30 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ New Project</span>
              </button>

              <button
                onClick={onNewRequest}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#111624] hover:bg-[#171e33] text-zinc-300 hover:text-white border border-[#1e263d] text-xs font-semibold transition-all cursor-pointer"
              >
                <MessageSquarePlus className="w-3.5 h-3.5 text-amber-400" />
                <span>New Request</span>
              </button>

              <button
                onClick={onOpenBuilder}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#111624] hover:bg-[#171e33] text-zinc-300 hover:text-white border border-[#1e263d] text-xs font-semibold transition-all cursor-pointer"
              >
                <CodeXml className="w-3.5 h-3.5 text-violet-400" />
                <span>Open Builder</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Card: Emotional Branding Prompt */}
        <div className="p-4 m-4 rounded-2xl bg-gradient-to-b from-[#14122e] to-[#0d1021] border border-purple-500/25 relative overflow-hidden shadow-xl shadow-purple-950/20">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-pink-500/10 via-purple-500/10 to-transparent pointer-events-none rounded-bl-full" />
          <div className="relative z-10">
            <div className="w-8 h-8 rounded-lg bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-2.5">
              <Crown className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-zinc-100 font-['Outfit'] mb-1">
              Make every birthday unforgettable
            </h4>
            <p className="text-[11px] text-zinc-400">
              Beautiful websites. Real emotions.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
