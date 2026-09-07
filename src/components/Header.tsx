import React, { useState } from 'react';
import {
  Bell,
  Menu,
  ChevronDown,
  CloudCheck,
  RefreshCw,
  AlertCircle,
  HardDrive,
  Settings,
  Sparkles,
  Globe,
  Lock,
  ExternalLink
} from 'lucide-react';
import { SyncState, AppSettings } from '../types';

interface HeaderProps {
  creatorName: string;
  syncState: SyncState;
  syncMessage?: string;
  onOpenMobileMenu: () => void;
  onOpenSettings: () => void;
  onSwitchToClient?: () => void;
  onLockAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  creatorName,
  syncState,
  syncMessage,
  onOpenMobileMenu,
  onOpenSettings,
  onSwitchToClient,
  onLockAdmin,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-[#080b13]/90 backdrop-blur-xl border-b border-[#141a2b] px-4 sm:px-8 py-3.5">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Mobile Menu & Title */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white bg-[#111625] border border-[#1d253b] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight font-['Outfit']">
              Birthday Websites Command Center
            </h1>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Create • Manage • Share • Grow
            </p>
          </div>
        </div>

        {/* Right: Firebase Badge, Bell, User Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Cloud Connection Status Pill */}
          <div className="hidden sm:flex items-center">
            {syncState === 'synced' && (
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0e1d24] text-emerald-400 border border-emerald-500/30 text-xs font-semibold shadow-sm shadow-emerald-950/20"
                title={syncMessage || 'Connected to Firestore'}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Firebase Connected</span>
                <span>🔥</span>
              </div>
            )}

            {syncState === 'syncing' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-950/40 text-indigo-400 border border-indigo-500/30 text-xs font-semibold">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Syncing Cloud...</span>
              </div>
            )}

            {syncState === 'local_only' && (
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181a29] text-purple-300 border border-purple-500/30 text-xs font-semibold"
                title="Active in local storage cache & sync"
              >
                <HardDrive className="w-3.5 h-3.5 text-purple-400" />
                <span>Firebase Connected</span>
                <span>🔥</span>
              </div>
            )}

            {syncState === 'error' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-950/40 text-rose-400 border border-rose-500/30 text-xs font-semibold">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Cloud Offline</span>
              </div>
            )}
          </div>

          {/* View Client Website Button */}
          {onSwitchToClient && (
            <button
              onClick={onSwitchToClient}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-sm transition-all cursor-pointer"
              title="Open the client-facing website catalog"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Client Website</span>
              <span className="sm:hidden">Website</span>
            </button>
          )}

          {/* Lock Command Center Button */}
          {onLockAdmin && (
            <button
              onClick={onLockAdmin}
              className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 border border-zinc-800 transition-colors cursor-pointer"
              title="Lock Command Center (Requires Passcode to re-enter)"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}

          {/* Notifications Bell */}
          <button
            onClick={onOpenSettings}
            className="relative p-2 rounded-xl bg-[#0f1422] hover:bg-[#171f33] text-zinc-300 hover:text-white border border-[#1d253b] transition-all cursor-pointer"
            title="Notifications & Settings"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 ring-2 ring-[#0f1422]" />
          </button>

          {/* User Profile Chip */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-[#0f1422] hover:bg-[#171f33] border border-[#1d253b] transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                {creatorName ? creatorName[0].toUpperCase() : 'H'}
              </div>
              <span className="text-xs font-semibold text-zinc-200 hidden sm:inline">
                {creatorName || 'Hamad'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowProfileMenu(false)} />
                <div className="absolute right-0 top-11 z-40 w-52 rounded-2xl bg-[#0f1424] border border-[#232c48] shadow-2xl p-2 text-xs">
                  <div className="px-3 py-2 border-b border-[#1b233a] mb-1">
                    <p className="font-semibold text-white">{creatorName}</p>
                    <p className="text-[11px] text-zinc-400">Creator &amp; Admin</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenSettings();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-200 hover:bg-[#1a2238] transition-colors text-left"
                  >
                    <Settings className="w-3.5 h-3.5 text-purple-400" />
                    Studio Settings
                  </button>
                  {onSwitchToClient && (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onSwitchToClient();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-amber-300 hover:bg-[#1a2238] transition-colors text-left"
                    >
                      <Globe className="w-3.5 h-3.5 text-amber-400" />
                      View Client Website
                    </button>
                  )}
                  {onLockAdmin && (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLockAdmin();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-300 hover:bg-rose-950/30 transition-colors text-left"
                    >
                      <Lock className="w-3.5 h-3.5 text-rose-400" />
                      Lock Command Center
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
