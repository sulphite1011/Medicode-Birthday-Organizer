import React from 'react';
import {
  Sparkles,
  FolderHeart,
  Inbox,
  CodeXml,
  Rocket,
  CloudCheck,
  Plus,
  RefreshCw,
  AlertCircle,
  HardDrive
} from 'lucide-react';
import { SyncState } from '../types';

interface HeaderProps {
  activeTab: 'projects' | 'requests' | 'builder' | 'deployments' | 'backup';
  setActiveTab: (tab: 'projects' | 'requests' | 'builder' | 'deployments' | 'backup') => void;
  projectCount: number;
  pendingRequestsCount: number;
  syncState: SyncState;
  syncMessage?: string;
  onNewProject: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  projectCount,
  pendingRequestsCount,
  syncState,
  syncMessage,
  onNewProject,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setActiveTab('projects')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-500 via-rose-500 to-violet-600 p-0.5 shadow-lg shadow-rose-950/40">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg sm:text-xl tracking-tight text-zinc-100 font-['Outfit']">
                  WishCraft <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">Studio</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider bg-rose-500/10 text-rose-300 border border-rose-500/20 rounded-full">
                  Creator Edition
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Birthday Websites Command Center
              </p>
            </div>
          </div>

          {/* Center Navigation Hub */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl">
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'projects'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <FolderHeart className="w-4 h-4 text-rose-400" />
              <span>Projects</span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-zinc-800/80 text-zinc-300 border border-zinc-700">
                {projectCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('requests')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'requests'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <Inbox className="w-4 h-4 text-amber-400" />
              <span>Orders & Requests</span>
              {pendingRequestsCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('builder')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'builder'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <CodeXml className="w-4 h-4 text-violet-400" />
              <span>Site Generator</span>
            </button>

            <button
              onClick={() => setActiveTab('deployments')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'deployments'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <Rocket className="w-4 h-4 text-sky-400" />
              <span>Deployments</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'backup'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <CloudCheck className="w-4 h-4 text-emerald-400" />
              <span>Cloud & Backup</span>
            </button>
          </nav>

          {/* Right Action & Sync Status */}
          <div className="flex items-center gap-2.5">
            {/* Sync Badge */}
            <div
              onClick={() => setActiveTab('backup')}
              title={syncMessage || syncState}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 border border-zinc-800/80 cursor-pointer hover:border-zinc-700 transition-colors"
            >
              {syncState === 'connected' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-400 hidden sm:inline">Connected</span>
                </>
              )}
              {syncState === 'syncing' && (
                <>
                  <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
                  <span className="text-amber-300 hidden sm:inline">Syncing</span>
                </>
              )}
              {syncState === 'offline' && (
                <>
                  <HardDrive className="w-3 h-3 text-sky-400" />
                  <span className="text-sky-300 hidden sm:inline">Local Storage</span>
                </>
              )}
              {syncState === 'error' && (
                <>
                  <AlertCircle className="w-3 h-3 text-rose-400" />
                  <span className="text-rose-300 hidden sm:inline">Cloud Sync Error</span>
                </>
              )}
            </div>

            {/* Quick Create Project */}
            <button
              onClick={onNewProject}
              className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-zinc-950 bg-gradient-to-r from-amber-400 via-rose-400 to-rose-300 hover:from-amber-300 hover:to-rose-200 shadow-md shadow-rose-950/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4 text-zinc-950" />
              <span>New Website</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1.5 border-t border-zinc-800/60 no-scrollbar">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'projects' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400'
            }`}
          >
            <FolderHeart className="w-3.5 h-3.5 text-rose-400" />
            Projects ({projectCount})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'requests' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400'
            }`}
          >
            <Inbox className="w-3.5 h-3.5 text-amber-400" />
            Orders ({pendingRequestsCount})
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'builder' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400'
            }`}
          >
            <CodeXml className="w-3.5 h-3.5 text-violet-400" />
            Generator
          </button>
          <button
            onClick={() => setActiveTab('deployments')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'deployments' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400'
            }`}
          >
            <Rocket className="w-3.5 h-3.5 text-sky-400" />
            Deployments
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'backup' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400'
            }`}
          >
            <CloudCheck className="w-3.5 h-3.5 text-emerald-400" />
            Cloud & Backup
          </button>
        </div>

      </div>
    </header>
  );
};
