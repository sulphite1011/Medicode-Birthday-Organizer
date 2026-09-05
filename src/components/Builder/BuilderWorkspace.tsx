import React, { useState, useEffect } from 'react';
import { Project, BirthdaySiteData } from '../../types';
import { BuilderEditor } from './BuilderEditor';
import { LiveDevicePreview } from './LiveDevicePreview';
import { exportBirthdayDataCode, downloadFile } from '../../services/exportTemplate';
import {
  CodeXml,
  ArrowLeft,
  Save,
  Copy,
  Check,
  Download,
  Eye,
  Settings2,
  Sparkles,
  Layers,
  FolderHeart
} from 'lucide-react';

interface BuilderWorkspaceProps {
  projects: Project[];
  selectedProject: Project;
  onSelectProject: (p: Project) => void;
  onSaveProject: (updated: Project) => void;
  onBackToDashboard: () => void;
}

export const BuilderWorkspace: React.FC<BuilderWorkspaceProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  onSaveProject,
  onBackToDashboard,
}) => {
  const [siteData, setSiteData] = useState<BirthdaySiteData>(selectedProject.builderData);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('mobile');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setSiteData(selectedProject.builderData);
  }, [selectedProject]);

  const handleSave = () => {
    const updatedProject: Project = {
      ...selectedProject,
      builderData: siteData,
      theme: siteData.themeConfig.presetName,
      recipientName: siteData.recipient.name,
      updatedAt: new Date().toISOString(),
    };
    onSaveProject(updatedProject);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2200);
  };

  const handleCopyGeneratedCode = () => {
    const code = exportBirthdayDataCode(siteData);
    navigator.clipboard.writeText(code);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const handleDownloadCodeFile = () => {
    const code = exportBirthdayDataCode(siteData);
    downloadFile(code, 'birthdayData.ts');
  };

  return (
    <div className="space-y-4">
      
      {/* Top Controls Banner */}
      <div className="p-4 sm:px-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-lg">
        
        {/* Left: Back & Project Selection */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <div className="h-4 w-px bg-zinc-700 hidden sm:block" />

          {/* Project Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-medium hidden sm:inline">Editing:</span>
            <select
              value={selectedProject.id}
              onChange={(e) => {
                const found = projects.find((p) => p.id === e.target.value);
                if (found) onSelectProject(found);
              }}
              className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-700 text-xs font-semibold text-zinc-100 focus:outline-none focus:border-amber-500 cursor-pointer max-w-[200px] sm:max-w-xs truncate"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.recipientName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Code inspection & Save feedback */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 animate-pulse">
              <Check className="w-3.5 h-3.5" />
              Saved to Project!
            </span>
          )}

          <button
            onClick={() => setShowCodeModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold transition-colors cursor-pointer"
            title="Inspect generated birthdayData.ts code"
          >
            <CodeXml className="w-3.5 h-3.5 text-violet-400" />
            <span>Inspect Code</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-zinc-950 bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 shadow-md shadow-rose-950/20 active:scale-95 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Website</span>
          </button>
        </div>

      </div>

      {/* Main Split-Screen Workspace: Left Editor, Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Builder Editor (5 cols on lg) */}
        <div className="lg:col-span-5 h-[800px]">
          <BuilderEditor
            project={selectedProject}
            siteData={siteData}
            onChange={setSiteData}
            onSaveToProject={handleSave}
          />
        </div>

        {/* Right Column: Live Interactive Device Simulator (7 cols on lg) */}
        <div className="lg:col-span-7 h-[800px]">
          <LiveDevicePreview
            data={siteData}
            deviceMode={deviceMode}
            setDeviceMode={setDeviceMode}
          />
        </div>

      </div>

      {/* Code Export Inspection Modal (Requirement #8) */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-zinc-100 font-['Outfit'] flex items-center gap-2">
                  <CodeXml className="w-5 h-5 text-violet-400" />
                  <span>Generated Code: src/data/birthdayData.ts</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Ready to paste or download into your external birthday website repository.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyGeneratedCode}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
                >
                  {copiedNotification ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedNotification ? 'Copied!' : 'Copy Code'}</span>
                </button>
                <button
                  onClick={handleDownloadCodeFile}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-xs font-semibold text-amber-300 border border-amber-500/30 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .ts</span>
                </button>
                <button
                  onClick={() => setShowCodeModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="mt-4 flex-1 overflow-auto rounded-2xl bg-zinc-950 p-4 border border-zinc-800 font-mono text-xs text-emerald-300 leading-relaxed">
              <pre>{exportBirthdayDataCode(siteData)}</pre>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
