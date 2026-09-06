import React, { useState } from 'react';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  HardDrive,
  ShieldCheck,
  Flame,
  FileJson
} from 'lucide-react';
import { Project, ClientRequest, AppSettings, SyncState } from '../../types';

interface CloudBackupCenterProps {
  projects: Project[];
  requests: ClientRequest[];
  settings: AppSettings;
  syncState: SyncState;
  syncMessage?: string;
  onRefreshSync: () => void;
  onImportData: (data: { projects?: Project[]; requests?: ClientRequest[]; settings?: AppSettings }) => void;
}

export const CloudBackupCenter: React.FC<CloudBackupCenterProps> = ({
  projects,
  requests,
  settings,
  syncState,
  syncMessage,
  onRefreshSync,
  onImportData,
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExportJSON = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      studioName: settings.studioName,
      creatorName: settings.creatorName,
      projects,
      requests,
      settings,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wishcraft-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json && (Array.isArray(json.projects) || Array.isArray(json.requests))) {
          onImportData(json);
          setImportStatus('Backup successfully imported!');
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus('Invalid JSON backup format.');
          setTimeout(() => setImportStatus(null), 3000);
        }
      } catch (err) {
        setImportStatus('Failed to parse backup file.');
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#14122e] via-[#0f1426] to-[#1a122e] border border-purple-500/25 relative overflow-hidden shadow-xl shadow-purple-950/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-['Outfit']">
                Cloud &amp; Database Backup
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Real-time Firestore synchronization, manual exports, and disaster recovery.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0d2a20] text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5" />
              <span>Firebase Active</span>
            </div>
            <button
              onClick={onRefreshSync}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#141928] hover:bg-[#1c2338] text-zinc-200 border border-[#202942] text-xs font-semibold transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Sync</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Backup Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Cloud Firestore Sync Status */}
        <div className="p-5 rounded-2xl bg-[#0b0e18] border border-[#161c2d] flex flex-col justify-between shadow-lg shadow-black/20">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-purple-950/50 border border-purple-800/40 flex items-center justify-center text-purple-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white font-['Outfit']">
                Firestore Database
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              All website projects and client orders are securely persisted and synchronized with your Firebase Cloud database.
            </p>
            <div className="mt-4 p-3 rounded-xl bg-[#101524] border border-[#1d263f] text-xs text-zinc-300 space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-400">Stored Projects:</span>
                <span className="font-semibold text-white">{projects.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Client Orders:</span>
                <span className="font-semibold text-white">{requests.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Sync Status:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Connected
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Export JSON Backup */}
        <div className="p-5 rounded-2xl bg-[#0b0e18] border border-[#161c2d] flex flex-col justify-between shadow-lg shadow-black/20">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-950/50 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
                <Download className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white font-['Outfit']">
                Export JSON Archive
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Download a complete standalone JSON archive containing all projects, code settings, themes, and client requests for offline storage.
            </p>
          </div>

          <button
            onClick={handleExportJSON}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:brightness-110 text-white text-xs font-bold shadow-md shadow-purple-900/30 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Backup (.json)</span>
          </button>
        </div>

        {/* Card 3: Restore / Import Backup */}
        <div className="p-5 rounded-2xl bg-[#0b0e18] border border-[#161c2d] flex flex-col justify-between shadow-lg shadow-black/20">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-pink-950/50 border border-pink-800/40 flex items-center justify-center text-pink-400">
                <Upload className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white font-['Outfit']">
                Restore Database
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Upload a previously exported WishCraft Studio backup file to restore projects and configurations.
            </p>
          </div>

          <div>
            <label className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#121626] hover:bg-[#181f33] text-zinc-200 border border-[#202842] text-xs font-semibold transition-all cursor-pointer">
              <FileJson className="w-4 h-4 text-purple-400" />
              <span>Select File to Restore</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>
            {importStatus && (
              <p className="text-[11px] text-center mt-2 text-emerald-400 font-medium">
                {importStatus}
              </p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
