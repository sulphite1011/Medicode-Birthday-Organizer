import React, { useState } from 'react';
import { Project, DeploymentPlatform, ProjectStatus } from '../../types';
import {
  Cloud,
  Globe,
  Github,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Edit,
  Save,
  Terminal,
  ShieldCheck,
  Server,
  Zap,
  Sparkles
} from 'lucide-react';

interface DeploymentCenterProps {
  projects: Project[];
  onUpdateProject: (updatedProject: Project) => void;
  onOpenProjectBuilder: (project: Project) => void;
}

export const DeploymentCenter: React.FC<DeploymentCenterProps> = ({
  projects,
  onUpdateProject,
  onOpenProjectBuilder,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(id);
    setTimeout(() => setCopiedUrl(null), 1800);
  };

  const handleQuickStatusChange = (project: Project, newStatus: ProjectStatus) => {
    const updated: Project = {
      ...project,
      status: newStatus,
      lastDeployedAt: newStatus === 'live' ? new Date().toISOString() : project.lastDeployedAt,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(updated);
  };

  const handleSaveNotes = (project: Project) => {
    const updated: Project = {
      ...project,
      deploymentNotes: tempNotes,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(updated);
    setEditingNotesId(null);
  };

  // Platform Counts
  const cloudflareCount = projects.filter((p) => p.deploymentPlatform === 'cloudflare').length;
  const netlifyCount = projects.filter((p) => p.deploymentPlatform === 'netlify').length;
  const vercelCount = projects.filter((p) => p.deploymentPlatform === 'vercel').length;
  const githubPagesCount = projects.filter((p) => p.deploymentPlatform === 'github_pages').length;

  const filteredProjects = projects.filter((p) => {
    if (selectedPlatform === 'all') return true;
    return p.deploymentPlatform === selectedPlatform;
  });

  return (
    <div className="space-y-6">
      
      {/* Platform Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        
        {/* Cloudflare Pages */}
        <div
          onClick={() => setSelectedPlatform(selectedPlatform === 'cloudflare' ? 'all' : 'cloudflare')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
            selectedPlatform === 'cloudflare'
              ? 'bg-amber-500/10 border-amber-500/50 ring-1 ring-amber-500/30'
              : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-xs font-semibold">Cloudflare Pages</span>
            <span className="text-lg">⚡</span>
          </div>
          <div className="text-2xl font-bold text-amber-400 font-['Outfit']">{cloudflareCount}</div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Primary CDN host</div>
        </div>

        {/* Netlify */}
        <div
          onClick={() => setSelectedPlatform(selectedPlatform === 'netlify' ? 'all' : 'netlify')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
            selectedPlatform === 'netlify'
              ? 'bg-cyan-500/10 border-cyan-500/50 ring-1 ring-cyan-500/30'
              : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-xs font-semibold">Netlify</span>
            <span className="text-lg">🌐</span>
          </div>
          <div className="text-2xl font-bold text-cyan-400 font-['Outfit']">{netlifyCount}</div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Instant branch deploys</div>
        </div>

        {/* Vercel */}
        <div
          onClick={() => setSelectedPlatform(selectedPlatform === 'vercel' ? 'all' : 'vercel')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
            selectedPlatform === 'vercel'
              ? 'bg-purple-500/10 border-purple-500/50 ring-1 ring-purple-500/30'
              : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-xs font-semibold">Vercel</span>
            <span className="text-lg">▲</span>
          </div>
          <div className="text-2xl font-bold text-purple-400 font-['Outfit']">{vercelCount}</div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Edge network</div>
        </div>

        {/* GitHub Pages */}
        <div
          onClick={() => setSelectedPlatform(selectedPlatform === 'github_pages' ? 'all' : 'github_pages')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
            selectedPlatform === 'github_pages'
              ? 'bg-zinc-800 border-zinc-500'
              : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-xs font-semibold">GitHub Pages</span>
            <Github className="w-4 h-4 text-zinc-300" />
          </div>
          <div className="text-2xl font-bold text-zinc-200 font-['Outfit']">{githubPagesCount}</div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Static git hosting</div>
        </div>

      </div>

      {/* Cloudflare Pages Quick Guide Tip */}
      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5 sm:mt-0 shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-zinc-200">Cloudflare Pages Recommended Settings:</span>
            <div className="text-zinc-400 text-[11px] mt-0.5 flex flex-wrap gap-x-4 gap-y-1">
              <span>Framework preset: <strong className="text-amber-300 font-mono">Vite</strong></span>
              <span>Build command: <strong className="text-amber-300 font-mono">npm run build</strong></span>
              <span>Output directory: <strong className="text-amber-300 font-mono">dist</strong></span>
              <span>Package Manager: <strong className="text-emerald-400 font-mono">npm (Node.js)</strong></span>
            </div>
          </div>
        </div>
        <div className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 shrink-0 font-medium">
          CI Direct Install (.npmrc) Active
        </div>
      </div>

      {/* Deployment Table / Card Grid */}
      <div className="p-5 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-zinc-100 font-['Outfit'] flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Hosting Deployments & DNS Notes</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Manage live production domains, build commands, and deployment records.
            </p>
          </div>

          <div className="text-xs text-zinc-400 font-medium">
            Showing {filteredProjects.length} of {projects.length} deployments
          </div>
        </div>

        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="p-4 sm:p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-4"
            >
              {/* Row 1: Project Title, Status Pill, Quick Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-zinc-100 font-['Outfit']">
                      {project.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[11px] text-zinc-300 border border-zinc-700 font-semibold uppercase">
                      {project.deploymentPlatform}
                    </span>
                    {project.status === 'live' ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Live
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold">
                        {project.status}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    Recipient: <span className="text-zinc-200 font-semibold">{project.recipientName}</span>
                    {project.lastDeployedAt && (
                      <span className="ml-3 text-zinc-500">
                        Last Deployed: {new Date(project.lastDeployedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Status Setter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">Status:</span>
                  <select
                    value={project.status}
                    onChange={(e) => handleQuickStatusChange(project, e.target.value as ProjectStatus)}
                    className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="draft">Draft</option>
                    <option value="in_progress">In Production</option>
                    <option value="ready">Ready for Preview</option>
                    <option value="live">Live Website</option>
                    <option value="archived">Archived</option>
                  </select>

                  {project.status !== 'live' && (
                    <button
                      onClick={() => handleQuickStatusChange(project, 'live')}
                      className="px-3 py-1 rounded-lg text-xs font-bold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors cursor-pointer"
                    >
                      Mark as Live
                    </button>
                  )}
                </div>
              </div>

              {/* Row 2: Live URL & GitHub URL fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-zinc-900">
                {/* Live Website */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <div className="flex items-center gap-2 overflow-hidden mr-2">
                    <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="truncate text-xs">
                      {project.liveWebsiteUrl ? (
                        <a
                          href={project.liveWebsiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:underline truncate block"
                        >
                          {project.liveWebsiteUrl}
                        </a>
                      ) : (
                        <span className="text-zinc-600 italic">No live URL set</span>
                      )}
                    </div>
                  </div>
                  {project.liveWebsiteUrl && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleCopy(project.liveWebsiteUrl!, `live-${project.id}`)}
                        className="p-1 text-zinc-400 hover:text-zinc-200"
                        title="Copy Live URL"
                      >
                        {copiedUrl === `live-${project.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <a
                        href={project.liveWebsiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-zinc-400 hover:text-zinc-200"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>

                {/* GitHub Repo */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <div className="flex items-center gap-2 overflow-hidden mr-2">
                    <Github className="w-4 h-4 text-zinc-300 shrink-0" />
                    <div className="truncate text-xs">
                      {project.githubRepoUrl ? (
                        <a
                          href={project.githubRepoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-300 hover:underline truncate block"
                        >
                          {project.githubRepoUrl}
                        </a>
                      ) : (
                        <span className="text-zinc-600 italic">No repo connected</span>
                      )}
                    </div>
                  </div>
                  {project.githubRepoUrl && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleCopy(project.githubRepoUrl!, `git-${project.id}`)}
                        className="p-1 text-zinc-400 hover:text-zinc-200"
                        title="Copy GitHub URL"
                      >
                        {copiedUrl === `git-${project.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <a
                        href={project.githubRepoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-zinc-400 hover:text-zinc-200"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 3: Deployment Notes & Build Command Instructions */}
              <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-zinc-400 font-semibold flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5 text-amber-400" />
                    Deployment & DNS Notes
                  </span>
                  {editingNotesId === project.id ? (
                    <button
                      onClick={() => handleSaveNotes(project)}
                      className="flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 cursor-pointer"
                    >
                      <Save className="w-3 h-3" /> Save Notes
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingNotesId(project.id);
                        setTempNotes(project.deploymentNotes || '');
                      }}
                      className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3 h-3" /> Edit Notes
                    </button>
                  )}
                </div>

                {editingNotesId === project.id ? (
                  <textarea
                    rows={2}
                    value={tempNotes}
                    onChange={(e) => setTempNotes(e.target.value)}
                    placeholder="e.g. Build command: npm run build, Output dir: dist. Custom domain: ayesha.gift"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                  />
                ) : (
                  <p className="text-zinc-400 font-mono text-[11px] leading-relaxed">
                    {project.deploymentNotes || 'No specific build/DNS notes. Standard: `npm run build` -> `dist`'}
                  </p>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
