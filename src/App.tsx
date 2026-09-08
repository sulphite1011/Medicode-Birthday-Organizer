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

import { Sidebar } from './components/Sidebar';
import { HeroBanner } from './components/HeroBanner';
import { CloudBackupCenter } from './components/Backup/CloudBackupCenter';
import { Header } from './components/Header';
import { MetricsOverview } from './components/Analytics/MetricsOverview';
import { ProjectList } from './components/ProjectHub/ProjectList';
import { ProjectModal } from './components/ProjectHub/ProjectModal';
import { DeleteConfirmModal } from './components/ProjectHub/DeleteConfirmModal';
import { SocialLinksModal } from './components/SocialShowcase/SocialLinksModal';
import { DeploymentCenter } from './components/Deployment/DeploymentCenter';
import { SettingsModal } from './components/Settings/SettingsModal';
import { ClientPortal } from './components/ClientPortal/ClientPortal';
import { AdminLockModal } from './components/Admin/AdminLockModal';
import { RequestBoard } from './components/ClientRequests/RequestBoard';
import { RequestModal } from './components/ClientRequests/RequestModal';
import { Lock, Sparkles } from 'lucide-react';

export default function App() {
  // App State
  const [activeTab, setActiveTab] = useState<NavigationTab>('projects');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [firebaseStatus, setFirebaseStatus] = useState<'connected' | 'offline_local' | 'syncing'>('offline_local');

  // Security & Portal View Routing
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('hamad_admin_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  // Strict URL routing: ONLY '#admin' enters admin mode. Removing #client or visiting / always renders client!
  const [viewMode, setViewMode] = useState<'admin' | 'client'>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#admin') {
      return 'admin';
    }
    return 'client';
  });

  const [isAdminLockModalOpen, setIsAdminLockModalOpen] = useState(false);

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
    const unsubProjects = syncService.listenProjects(
      (remoteProjects) => {
        setProjects(remoteProjects);
        if (!builderSelectedProject && remoteProjects.length > 0) {
          setBuilderSelectedProject(remoteProjects[0]);
        }
      },
      (status) => {
        setFirebaseStatus(status);
      }
    );

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

  // Hash change listener: strictly routes '#admin' to admin gate, and everything else to client
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setViewMode('admin');
        if (!isAdminAuthenticated) {
          setIsAdminLockModalOpen(true);
        }
      } else {
        // Any hash other than '#admin' (e.g. '', '#client', etc.) strictly displays Client Portal
        setViewMode('client');
        setIsAdminLockModalOpen(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [isAdminAuthenticated]);

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

  // Unlock Admin Command Center
  const handleUnlockAdmin = () => {
    setIsAdminAuthenticated(true);
    try {
      sessionStorage.setItem('hamad_admin_authenticated', 'true');
    } catch {}
    setIsAdminLockModalOpen(false);
    setViewMode('admin');
    window.location.hash = 'admin';
    showToast(`Welcome back, ${settings.creatorName || 'Hamad'}! Command Center unlocked.`);
  };

  // Lock Admin Command Center
  const handleLockAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('hamad_admin_authenticated');
    } catch {}
    setViewMode('client');
    window.location.hash = 'client';
    showToast('Personal Command Center locked.');
  };

  // Switch to Client View
  const handleSwitchToClient = () => {
    setViewMode('client');
    window.location.hash = 'client';
  };

  // Client Order Submission from Client Portal
  const handleClientSubmitOrder = async (orderData: Partial<ClientRequest>) => {
    const newRequest: ClientRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      clientName: orderData.clientName || 'Client Visitor',
      clientContact: orderData.clientContact || '',
      clientGmail: orderData.clientGmail || '',
      recipientName: orderData.recipientName || 'Loved One',
      websiteType: orderData.websiteType || 'Custom Celebration Website',
      occasion: orderData.occasion || 'birthday',
      requirements: orderData.requirements || '',
      budget: orderData.budget || 'PKR 1,500',
      paymentStatus: 'unpaid',
      status: 'new',
      orderDate: new Date().toISOString(),
      dueDate: orderData.dueDate || '',
      notes: orderData.notes || '',
      connectedProjectId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRequests((prev) => [newRequest, ...prev]);
    saveLocalRequests([newRequest, ...requests]);
    try {
      await syncService.saveRequest(newRequest);
    } catch (e) {
      console.error('Failed to sync new order:', e);
    }
    showToast('Order inquiry received! Hamad will review and contact you.');
  };

  // Handle Updating Admin Passcode from Reset Flow
  const handleUpdatePasscode = async (newPasscode: string) => {
    const updatedSettings: AppSettings = {
      ...settings,
      adminPasscode: newPasscode,
      updatedAt: new Date().toISOString(),
    };
    setSettings(updatedSettings);
    saveLocalSettings(updatedSettings);
    await syncService.saveSettings(updatedSettings);
    showToast('Secret key updated successfully!');
  };

  // Project CRUD Handlers
  const handleSaveProject = async (project: Project) => {
    // 1. Optimistic UI update so the user sees the project IMMEDIATELY
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === project.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = project;
        return next;
      }
      return [project, ...prev];
    });

    try {
      await syncService.saveProject(project);
      showToast(`Website "${project.name}" saved!`);
    } catch (err: any) {
      console.error('Save project error:', err);
      showToast(`Saved locally (${err?.message || 'cloud sync failed'})`);
    }
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
    const targetId = deleteConfirm.id;
    if (deleteConfirm.type === 'project') {
      setProjects((prev) => prev.filter((p) => p.id !== targetId));
      try {
        await syncService.deleteProject(targetId);
        showToast('Website project deleted.');
      } catch (err: any) {
        console.error('Delete project error:', err);
      }
    } else {
      setRequests((prev) => prev.filter((r) => r.id !== targetId));
      try {
        await syncService.deleteRequest(targetId);
        showToast('Client order deleted.');
      } catch (err: any) {
        console.error('Delete request error:', err);
      }
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
    setProjects((prev) => [duplicated, ...prev]);
    try {
      await syncService.saveProject(duplicated);
      showToast(`Duplicated into "${duplicated.name}"!`);
    } catch (err) {
      console.error('Duplicate project error:', err);
    }
  };

  const handleTogglePin = async (project: Project) => {
    const updated: Project = {
      ...project,
      isPinned: !project.isPinned,
      updatedAt: new Date().toISOString(),
    };
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    await syncService.saveProject(updated);
  };

  const handleOpenBuilder = (project: Project) => {
    setBuilderSelectedProject(project);
    setActiveTab('builder');
  };

  // Client Request Handlers
  const handleSaveRequest = async (req: ClientRequest) => {
    setRequests((prev) => {
      const idx = prev.findIndex((r) => r.id === req.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = req;
        return next;
      }
      return [req, ...prev];
    });
    try {
      await syncService.saveRequest(req);
      showToast(`Order for ${req.recipientName} updated!`);
    } catch (err) {
      console.error('Save request error:', err);
    }
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
      setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
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

  const pendingRequestsCount = requests.filter(
    (r) => r.status === 'new' || r.status === 'in_progress'
  ).length;

  // 1. If at #admin but NOT authenticated, render dedicated Admin Login Security Screen
  if (viewMode === 'admin' && !isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-['Outfit'] flex flex-col items-center justify-center p-4 selection:bg-amber-500/30">
        <AdminLockModal
          isOpen={true}
          onClose={() => {
            setViewMode('client');
            window.location.hash = 'client';
          }}
          onUnlock={handleUnlockAdmin}
          settings={settings}
          onUpdatePasscode={handleUpdatePasscode}
        />
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-zinc-900 border border-amber-500/40 text-amber-200 text-xs font-semibold shadow-2xl shadow-black/80 animate-in fade-in slide-in-from-bottom-3">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  // 2. If at #client (or any default URL /), render Public Client Portal
  if (viewMode === 'client') {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-['Outfit'] selection:bg-amber-500/30 selection:text-white">
        
        {/* If Creator is logged in and viewing Client Portal, show Creator Top Bar */}
        {isAdminAuthenticated && (
          <div className="sticky top-0 z-50 bg-amber-500/10 border-b border-amber-500/30 backdrop-blur-md px-4 py-2 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>👑 Creator Mode Active (Previewing as Client)</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setViewMode('admin');
                  window.location.hash = 'admin';
                }}
                className="px-3 py-1 rounded-lg bg-amber-500 text-zinc-950 font-bold hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Return to Admin Command Center →
              </button>
              <button
                onClick={handleLockAdmin}
                className="p-1 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
                title="Lock Command Center"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Public Client Portal */}
        <ClientPortal
          projects={projects}
          settings={settings}
          onOpenAdminLogin={() => {
            setViewMode('admin');
            window.location.hash = 'admin';
          }}
          onSubmitOrder={handleClientSubmitOrder}
        />

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-zinc-900 border border-amber-500/40 text-amber-200 text-xs font-semibold shadow-2xl shadow-black/80 animate-in fade-in slide-in-from-bottom-3">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  // Otherwise render Private Admin Command Center (Hamad Only)
  return (
    <div className="min-h-screen bg-[#070911] text-zinc-100 flex font-['Inter',sans-serif] selection:bg-purple-500/30 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#0e1322] border border-purple-500/40 text-purple-200 text-xs font-semibold shadow-2xl shadow-black/80 animate-in fade-in slide-in-from-bottom-3">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projectCount={projects.length}
        requestCount={pendingRequestsCount}
        onNewProject={() => {
          setProjectToEdit(null);
          setInitialFromRequest(null);
          setIsProjectModalOpen(true);
        }}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onSwitchToClient={handleSwitchToClient}
        onLockAdmin={handleLockAdmin}
      />

      {/* Main Command Center Stage */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <Header
          creatorName={settings.creatorName || 'Hamad'}
          syncState={firebaseStatus === 'connected' ? 'synced' : 'local_only'}
          syncMessage={firebaseStatus === 'connected' ? 'Connected to Firestore' : 'Synced with Local Storage'}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onSwitchToClient={handleSwitchToClient}
          onLockAdmin={handleLockAdmin}
        />

        {/* Content View */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
          
          {/* Dashboard & Projects Hub */}
          {(activeTab === 'dashboard' || activeTab === 'projects') && (
            <div id="dashboard-top" className="space-y-6">
              {/* Hero Banner: Greeting & Celestial Badge */}
              <HeroBanner creatorName={settings.creatorName || 'Hamad'} />

              {/* 6 Metrics Overview Cards */}
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
              />
            </div>
          )}

          {/* Inquiries & Client Requests Tab */}
          {activeTab === 'inquiries' && (
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

          {/* Deployments Hub */}
          {activeTab === 'deployments' && (
            <DeploymentCenter
              projects={projects}
              onUpdateProject={handleSaveProject}
            />
          )}

          {/* Tab 5: Cloud & Backup Hub */}
          {activeTab === 'backup' && (
            <CloudBackupCenter
              projects={projects}
              requests={requests}
              settings={settings}
              syncState={firebaseStatus === 'connected' ? 'synced' : 'local_only'}
              syncMessage={firebaseStatus === 'connected' ? 'Connected to Firestore' : 'Synced with Local Storage'}
              onRefreshSync={() => {
                const lp = getLocalProjects();
                const lr = getLocalRequests();
                setProjects(lp);
                setRequests(lr);
                showToast('Synced with cloud database!');
              }}
              onImportData={async (data) => {
                if (data.projects && Array.isArray(data.projects)) {
                  for (const p of data.projects) {
                    await syncService.saveProject(p);
                  }
                  setProjects(data.projects);
                  saveLocalProjects(data.projects);
                }
                if (data.requests && Array.isArray(data.requests)) {
                  for (const r of data.requests) {
                    await syncService.saveRequest(r);
                  }
                  setRequests(data.requests);
                  saveLocalRequests(data.requests);
                }
                if (data.settings) {
                  await syncService.saveSettings(data.settings);
                  setSettings(data.settings);
                  saveLocalSettings(data.settings);
                }
                showToast('Cloud database restored from backup!');
              }}
            />
          )}

        </main>

        {/* Footer */}
        <footer className="py-6 border-t border-[#141a29] bg-[#080b13] text-center text-xs text-zinc-400">
          <div className="flex items-center justify-center gap-2">
            <span className="font-semibold text-zinc-300 font-['Outfit']">{settings.studioName}</span>
            <span>•</span>
            <span>Private Personal Command Center</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">Creator: {settings.creatorName || 'Hamad'}</span>
          </div>
        </footer>
      </div>

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

      {/* 2. Social Links Modal */}
      <SocialLinksModal
        isOpen={isSocialModalOpen}
        onClose={() => {
          setIsSocialModalOpen(false);
          setProjectForSocials(null);
        }}
        project={projectForSocials}
        onSave={handleSaveProject}
      />

      {/* 3. Client Request / Order Modal */}
      <RequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSave={handleSaveRequest}
        requestToEdit={requestToEdit}
        projects={projects}
      />

      {/* 4. Settings & Security Modal */}
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

      {/* 5. Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        title={deleteConfirm.title}
        description={deleteConfirm.description}
      />

      {/* 6. Admin Lock Modal */}
      <AdminLockModal
        isOpen={isAdminLockModalOpen}
        onClose={() => setIsAdminLockModalOpen(false)}
        onUnlock={handleUnlockAdmin}
        settings={settings}
      />

    </div>
  );
}
