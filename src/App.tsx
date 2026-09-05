import React, { useState, useEffect } from 'react';
import { Project, ClientRequest, AppSettings, OrderStatus, NavigationTab } from './types';
import {
  syncService,
  initializeLocalDataIfEmpty,
  saveLocalProjects,
  saveLocalRequests,
  saveLocalSettings,
  getLocalProjects,
  getLocalRequests,
  getLocalSettings,
} from './services/firebase';
import { initialProjects, initialRequests, initialSettings } from './data/initialData';

import { Header } from './components/Header';
import { MetricsOverview } from './components/Analytics/MetricsOverview';
import { ProjectList } from './components/ProjectHub/ProjectList';
import { ProjectModal } from './components/ProjectHub/ProjectModal';
import { DeleteConfirmModal } from './components/ProjectHub/DeleteConfirmModal';
import { SocialLinksModal } from './components/SocialShowcase/SocialLinksModal';
import { RequestBoard } from './components/ClientRequests/RequestBoard';
import { RequestModal } from './components/ClientRequests/RequestModal';
import { BuilderWorkspace } from './components/Builder/BuilderWorkspace';
import { DeploymentCenter } from './components/Deployment/DeploymentCenter';
import { SettingsModal } from './components/Settings/SettingsModal';

export default function App() {
  // App State
  const [activeTab, setActiveTab] = useState<NavigationTab>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [firebaseStatus, setFirebaseStatus] = useState<'connected' | 'offline_local' | 'syncing'>('offline_local');

  // Modals State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [initialFromRequest, setInitialFromRequest] = useState<{
    recipientName: string;
    clientName: string;
    clientContact: string;
    notes: string;
    orderId: string;
  } | null>(null);

  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [projectForSocials, setProjectForSocials] = useState<Project | null>(null);

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestToEdit, setRequestToEdit] = useState<ClientRequest | null>(null);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Selected project for Builder
  const [builderSelectedProject, setBuilderSelectedProject] = useState<Project | null>(null);

  // Delete Confirmation State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: 'project' | 'request';
    id: string;
    title: string;
    description: string;
  }>({
    isOpen: false,
    type: 'project',
    id: '',
    title: '',
    description: '',
  });

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Initialization
  useEffect(() => {
    // 1. Initialize local cache from sample data if empty
    initializeLocalDataIfEmpty();

    // 2. Load immediate local state for zero-latency startup
    const localProjects = getLocalProjects();
    const localRequests = getLocalRequests();
    const localSettings = getLocalSettings();

    setProjects(localProjects);
    setRequests(localRequests);
    setSettings(localSettings);
    if (localProjects.length > 0) {
      setBuilderSelectedProject(localProjects[0]);
    }

    // 3. Connect real-time synchronization with Firebase/Local storage
    const unsubProjects = syncService.listenProjects((remoteProjects) => {
      setProjects(remoteProjects);
      if (!builderSelectedProject && remoteProjects.length > 0) {
        setBuilderSelectedProject(remoteProjects[0]);
      }
    });

    const unsubRequests = syncService.listenRequests((remoteRequests) => {
      setRequests(remoteRequests);
    });

    const unsubSettings = syncService.listenSettings((remoteSettings) => {
      setSettings(remoteSettings);
    });

    return () => {
      unsubProjects();
      unsubRequests();
      unsubSettings();
    };
  }, []);

  // Sync builderSelectedProject when projects update
  useEffect(() => {
    if (builderSelectedProject) {
      const refreshed = projects.find((p) => p.id === builderSelectedProject.id);
      if (refreshed) {
        setBuilderSelectedProject(refreshed);
      }
    } else if (projects.length > 0) {
      setBuilderSelectedProject(projects[0]);
    }
  }, [projects]);

  // Project CRUD Handlers
  const handleSaveProject = async (project: Project) => {
    await syncService.saveProject(project);
    showToast(`Website "${project.name}" saved!`);
  };

  const handleDeleteProject = (projectId: string) => {
    const proj = projects.find((p) => p.id === projectId);
    setDeleteConfirm({
      isOpen: true,
      type: 'project',
      id: projectId,
      title: `Delete "${proj?.name || 'Project'}"?`,
      description:
        'This will permanently remove this birthday website project, its deployment logs, and attached social showcase links.',
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirm.type === 'project') {
      await syncService.deleteProject(deleteConfirm.id);
      showToast('Website project deleted.');
    } else {
      await syncService.deleteRequest(deleteConfirm.id);
      showToast('Client order deleted.');
    }
    setDeleteConfirm((prev) => ({ ...prev, isOpen: false }));
  };

  const handleDuplicateProject = async (original: Project) => {
    const duplicated: Project = {
      ...original,
      id: `proj-${Date.now()}`,
      name: `${original.name} (Copy)`,
      status: 'draft',
      liveWebsiteUrl: undefined,
      githubRepoUrl: undefined,
      isPinned: false,
      socialLinks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await syncService.saveProject(duplicated);
    showToast(`Duplicated into "${duplicated.name}"!`);
  };

  const handleTogglePin = async (project: Project) => {
    const updated: Project = {
      ...project,
      isPinned: !project.isPinned,
      updatedAt: new Date().toISOString(),
    };
    await syncService.saveProject(updated);
  };

  const handleOpenBuilder = (project: Project) => {
    setBuilderSelectedProject(project);
    setActiveTab('builder');
  };

  // Client Request Handlers
  const handleSaveRequest = async (req: ClientRequest) => {
    await syncService.saveRequest(req);
    showToast(`Order for ${req.recipientName} updated!`);
  };

  const handleDeleteRequest = (requestId: string) => {
    const req = requests.find((r) => r.id === requestId);
    setDeleteConfirm({
      isOpen: true,
      type: 'request',
      id: requestId,
      title: `Delete Order from ${req?.clientName || 'Client'}?`,
      description: 'This will remove this client order inquiry from your pipeline.',
    });
  };

  const handleUpdateOrderStatus = async (requestId: string, newStatus: OrderStatus) => {
    const req = requests.find((r) => r.id === requestId);
    if (req) {
      const updated: ClientRequest = {
        ...req,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };
      await syncService.saveRequest(updated);
    }
  };

  // Convert Request to Project (Requirement #9)
  const handleConvertToProject = (req: ClientRequest) => {
    setInitialFromRequest({
      recipientName: req.recipientName,
      clientName: req.clientName,
      clientContact: req.clientContact || '',
      notes: req.requirements || '',
      orderId: req.id,
    });
    setProjectToEdit(null);
    setIsProjectModalOpen(true);
  };

  // Save Settings
  const handleSaveSettings = async (newSettings: AppSettings) => {
    await syncService.saveSettings(newSettings);
    showToast('Studio settings saved.');
  };

  // Restore Entire Data (Requirement #10)
  const handleRestoreData = (
    importedProjects: Project[],
    importedRequests: ClientRequest[],
    importedSettings: AppSettings
  ) => {
    saveLocalProjects(importedProjects);
    saveLocalRequests(importedRequests);
    saveLocalSettings(importedSettings);
    setProjects(importedProjects);
    setRequests(importedRequests);
    setSettings(importedSettings);
    if (importedProjects.length > 0) {
      setBuilderSelectedProject(importedProjects[0]);
    }
    showToast('Database successfully restored from JSON backup!');
  };

  // Reset to Sample Demo Data
  const handleResetToSample = () => {
    saveLocalProjects(initialProjects);
    saveLocalRequests(initialRequests);
    saveLocalSettings(initialSettings);
    setProjects(initialProjects);
    setRequests(initialRequests);
    setSettings(initialSettings);
    setBuilderSelectedProject(initialProjects[0]);
    showToast('Reset to default demo projects.');
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-['Inter',sans-serif] selection:bg-amber-400 selection:text-zinc-950">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-zinc-900 border border-amber-500/40 text-amber-200 text-xs font-semibold shadow-2xl shadow-black/80 animate-in fade-in slide-in-from-bottom-3">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingRequestsCount={requests.filter((r) => r.status === 'new').length}
        onNewProject={() => {
          setProjectToEdit(null);
          setInitialFromRequest(null);
          setIsProjectModalOpen(true);
        }}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        firebaseStatus={firebaseStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Tab 1: Dashboard / Projects Hub */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Live Aggregate Analytics (Requirement #16) */}
            <MetricsOverview projects={projects} requests={requests} />

            {/* Search, Filter & Project Cards Grid */}
            <ProjectList
              projects={projects}
              onNewProject={() => {
                setProjectToEdit(null);
                setInitialFromRequest(null);
                setIsProjectModalOpen(true);
              }}
              onEditProject={(proj) => {
                setProjectToEdit(proj);
                setInitialFromRequest(null);
                setIsProjectModalOpen(true);
              }}
              onDeleteProject={handleDeleteProject}
              onDuplicateProject={handleDuplicateProject}
              onTogglePin={handleTogglePin}
              onManageSocials={(proj) => {
                setProjectForSocials(proj);
                setIsSocialModalOpen(true);
              }}
              onOpenBuilder={handleOpenBuilder}
            />
          </div>
        )}

        {/* Tab 2: Orders / Client Requests Pipeline */}
        {activeTab === 'requests' && (
          <RequestBoard
            requests={requests}
            projects={projects}
            onNewRequest={() => {
              setRequestToEdit(null);
              setIsRequestModalOpen(true);
            }}
            onEditRequest={(req) => {
              setRequestToEdit(req);
              setIsRequestModalOpen(true);
            }}
            onDeleteRequest={handleDeleteRequest}
            onConvertToProject={handleConvertToProject}
            onUpdateStatus={handleUpdateOrderStatus}
          />
        )}

        {/* Tab 3: Website Builder & Device Simulator */}
        {activeTab === 'builder' && (
          <div>
            {builderSelectedProject ? (
              <BuilderWorkspace
                projects={projects}
                selectedProject={builderSelectedProject}
                onSelectProject={(p) => setBuilderSelectedProject(p)}
                onSaveProject={handleSaveProject}
                onBackToDashboard={() => setActiveTab('projects')}
              />
            ) : (
              <div className="py-20 text-center text-zinc-500">
                No project selected. Go to Dashboard and click &ldquo;Builder&rdquo; on any website.
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Deployments Hub */}
        {activeTab === 'deployments' && (
          <DeploymentCenter
            projects={projects}
            onUpdateProject={handleSaveProject}
            onOpenProjectBuilder={handleOpenBuilder}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-zinc-900 bg-zinc-950 text-center text-xs text-zinc-500">
        <div className="flex items-center justify-center gap-2">
          <span className="font-semibold text-zinc-400 font-['Outfit']">{settings.studioName}</span>
          <span>•</span>
          <span>Private Creator &amp; Deployment Workspace</span>
          <span>•</span>
          <span className="text-amber-400/80">Creator: {settings.creatorName}</span>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Project Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          setInitialFromRequest(null);
        }}
        onSave={handleSaveProject}
        projectToEdit={projectToEdit}
        initialFromRequest={initialFromRequest}
      />

      {/* 2. Social Links Modal (Requirement #4) */}
      <SocialLinksModal
        isOpen={isSocialModalOpen}
        onClose={() => {
          setIsSocialModalOpen(false);
          setProjectForSocials(null);
        }}
        project={projectForSocials}
        onSave={handleSaveProject}
      />

      {/* 3. Client Request Modal */}
      <RequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSave={handleSaveRequest}
        requestToEdit={requestToEdit}
        projects={projects}
      />

      {/* 4. Settings & Backup/Restore Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        projects={projects}
        requests={requests}
        onSaveSettings={handleSaveSettings}
        onRestoreData={handleRestoreData}
        onResetToSampleData={handleResetToSample}
        firebaseStatus={firebaseStatus}
      />

      {/* 5. Delete Confirmation Modal (Requirement #23) */}
      <DeleteConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        title={deleteConfirm.title}
        description={deleteConfirm.description}
      />

    </div>
  );
}
