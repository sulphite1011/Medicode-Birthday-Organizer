import React, { useState, useRef } from 'react';
import { Project, ClientRequest, AppSettings } from '../../types';
import { exportAllDataAsJSON, validateAndParseBackupJSON } from '../../services/firebase';
import {
  X,
  Settings,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Database,
  Cloud,
  Shield,
  RotateCcw,
  Sparkles,
  Save
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  projects: Project[];
  requests: ClientRequest[];
  onSaveSettings: (newSettings: AppSettings) => void;
  onRestoreData: (projects: Project[], requests: ClientRequest[], settings: AppSettings) => void;
  onResetToSampleData: () => void;
  firebaseStatus: 'connected' | 'offline_local' | 'syncing';
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  projects,
  requests,
  onSaveSettings,
  onRestoreData,
  onResetToSampleData,
  firebaseStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'backup' | 'cloud'>('general');
  const [creatorName, setCreatorName] = useState(settings.creatorName);
  const [studioName, setStudioName] = useState(settings.studioName);
  const [adminPasscode, setAdminPasscode] = useState(settings.adminPasscode || '7788');
  const [creatorWhatsApp, setCreatorWhatsApp] = useState(settings.creatorWhatsApp || '+92 300 1234567');
  const [creatorGmail, setCreatorGmail] = useState(settings.creatorGmail || 'hamadkhan11h22@gmail.com');
  const [creatorTikTokUrl, setCreatorTikTokUrl] = useState(settings.creatorTikTokUrl || '');
  const [creatorInstagramUrl, setCreatorInstagramUrl] = useState(settings.creatorInstagramUrl || '');
  const [defaultPlatform, setDefaultPlatform] = useState(settings.defaultDeploymentPlatform);
  const [defaultTheme, setDefaultTheme] = useState(settings.defaultTheme);
  
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [restoreSuccess, setRestoreSuccess] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AppSettings = {
      ...settings,
      creatorName: creatorName.trim() || 'Creator',
      studioName: studioName.trim() || 'WishCraft Studio',
      adminPasscode: adminPasscode.trim() || '7788',
      creatorWhatsApp: creatorWhatsApp.trim() || '+92 300 1234567',
      creatorGmail: creatorGmail.trim() || 'hamadkhan11h22@gmail.com',
      creatorTikTokUrl: creatorTikTokUrl.trim() || undefined,
      creatorInstagramUrl: creatorInstagramUrl.trim() || undefined,
      defaultDeploymentPlatform: defaultPlatform,
      defaultTheme: defaultTheme.trim() || 'Romantic Rose & Gold',
    };
    onSaveSettings(updated);
    onClose();
  };

  // Export JSON Backup (Requirement #10)
  const handleExportBackup = () => {
    const jsonString = exportAllDataAsJSON();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split('T')[0];
    const a = document.createElement('a');
    a.href = url;
    a.download = `wishcraft-studio-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup with preflight check
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRestoreError(null);
    setRestoreSuccess(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = validateAndParseBackupJSON(content);

        if (!parsed.valid || !parsed.data) {
          setRestoreError(parsed.error || 'Invalid backup file structure.');
          return;
        }

        const { projects: importedProjects, requests: importedRequests, settings: importedSettings } = parsed.data;

        onRestoreData(importedProjects, importedRequests, importedSettings);
        setRestoreSuccess(
          `Successfully restored ${importedProjects.length} projects and ${importedRequests.length} client requests!`
        );
      } catch (err: any) {
        setRestoreError(`Failed to parse file: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-700/80 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100 font-['Outfit']">
                Studio Settings & Backup
              </h2>
              <p className="text-xs text-zinc-400">
                Workspace defaults, cloud sync status, and data safety.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 sm:px-6 pt-3 border-b border-zinc-800 flex gap-2">
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-2.5 px-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'general'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            General & Studio
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`pb-2.5 px-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'backup'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Backup & Restore
          </button>
          <button
            onClick={() => setActiveTab('cloud')}
            className={`pb-2.5 px-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'cloud'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Cloud Storage
          </button>
        </div>

        {/* Tab 1: General Preferences */}
        {activeTab === 'general' && (
          <form onSubmit={handleSaveGeneral} className="p-5 sm:p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Studio / Brand Name
              </label>
              <input
                type="text"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Creator / Your Name
              </label>
              <input
                type="text"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Personal Security Passcode (PIN)
                </span>
                <span className="text-[10px] text-amber-200/70 font-mono">Restricted Access</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                This passcode locks your personal command center so no one else can access your projects, deployments, or settings.
              </p>
              <input
                type="text"
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                placeholder="e.g. 7788"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm font-mono text-amber-300 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Creator Contact for Client Inquiries */}
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-3">
              <span className="text-xs font-bold text-zinc-200">
                Creator Contact Details (For Client Orders &amp; DMs)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">
                    Your WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={creatorWhatsApp}
                    onChange={(e) => setCreatorWhatsApp(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">
                    Your Gmail / Email
                  </label>
                  <input
                    type="email"
                    value={creatorGmail}
                    onChange={(e) => setCreatorGmail(e.target.value)}
                    placeholder="hamadkhan11h22@gmail.com"
                    className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">
                    TikTok Profile URL (Demo Videos)
                  </label>
                  <input
                    type="url"
                    value={creatorTikTokUrl}
                    onChange={(e) => setCreatorTikTokUrl(e.target.value)}
                    placeholder="https://www.tiktok.com/@youraccount"
                    className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">
                    Instagram Profile URL (Reels)
                  </label>
                  <input
                    type="url"
                    value={creatorInstagramUrl}
                    onChange={(e) => setCreatorInstagramUrl(e.target.value)}
                    placeholder="https://www.instagram.com/youraccount"
                    className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Default Deployment
                </label>
                <select
                  value={defaultPlatform}
                  onChange={(e) => setDefaultPlatform(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none cursor-pointer"
                >
                  <option value="cloudflare">Cloudflare Pages</option>
                  <option value="netlify">Netlify</option>
                  <option value="vercel">Vercel</option>
                  <option value="github_pages">GitHub Pages</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Default Theme Preset
                </label>
                <input
                  type="text"
                  value={defaultTheme}
                  onChange={(e) => setDefaultTheme(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-zinc-950 bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 shadow-md shadow-rose-950/20 active:scale-95 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Backup & Restore */}
        {activeTab === 'backup' && (
          <div className="p-5 sm:p-6 space-y-5">
            {/* Export */}
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Export Entire Database</span>
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Download timestamped JSON backup ({projects.length} websites, {requests.length} orders).
                </p>
              </div>
              <button
                onClick={handleExportBackup}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 transition-colors cursor-pointer shrink-0"
              >
                Download JSON
              </button>
            </div>

            {/* Import */}
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>Restore from JSON File</span>
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Upload a previously exported backup file to restore your projects.
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors cursor-pointer shrink-0"
                >
                  Select File
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".json"
                  className="hidden"
                />
              </div>

              {restoreError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{restoreError}</span>
                </div>
              )}

              {restoreSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{restoreSuccess}</span>
                </div>
              )}
            </div>

            {/* Danger Zone: Reset to sample demo data */}
            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-rose-300">Reset Demo Data</h4>
                  <p className="text-[11px] text-zinc-400">
                    Reset projects and orders back to initial sample records.
                  </p>
                </div>
                {confirmReset ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setConfirmReset(false)}
                      className="text-xs text-zinc-400 hover:text-zinc-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        onResetToSampleData();
                        setConfirmReset(false);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white cursor-pointer"
                    >
                      Confirm Reset
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmReset(true)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 border border-rose-800 hover:bg-rose-900/30 cursor-pointer"
                  >
                    Reset Data
                  </button>
                )}
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: Cloud & Firestore Status */}
        {activeTab === 'cloud' && (
          <div className="p-5 sm:p-6 space-y-4">
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span>Architecture</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Local-First + Firestore Cloud
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                WishCraft Studio utilizes an offline-first architecture with instantaneous local persistence and seamless cloud synchronization to Firebase Firestore when credentials are provisioned.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Current Cloud Status:</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {firebaseStatus === 'connected' ? 'Connected to Firestore' : 'Active (Local Sync Ready)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Collections synced:</span>
                <span className="font-mono text-zinc-300">projects, client_requests, app_settings</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
