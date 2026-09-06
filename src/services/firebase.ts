import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { Project, ClientRequest, AppSettings, SyncState } from '../types';
import { sampleProjects, sampleClientRequests, defaultAppSettings, defaultBirthdaySiteData } from '../data/initialData';

const STORAGE_KEYS = {
  PROJECTS: 'wishcraft_studio_projects_v2',
  REQUESTS: 'wishcraft_studio_requests_v2',
  SETTINGS: 'wishcraft_studio_settings_v2',
  MIGRATION_FLAG: 'wishcraft_migration_completed_v2',
  LEGACY_KEYS: ['wishcraft_projects', 'birthday_projects', 'birthdayWebsites', 'projects']
};

interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  databaseId?: string;
}

// Read Vite environment variables
const env = (import.meta as any).env || {};
const envConfig: FirebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  databaseId: env.VITE_FIREBASE_DATABASE_ID,
};

export const isFirebaseConfigured = Boolean(envConfig.apiKey && envConfig.projectId);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    const existingApps = getApps();
    app = existingApps.length > 0 ? existingApps[0] : initializeApp(envConfig as any);
    db = envConfig.databaseId ? getFirestore(app, envConfig.databaseId) : getFirestore(app);
  } catch (err) {
    console.warn('[WishCraft Firebase] Initialization error, running in local fallback mode:', err);
  }
}

export { app, db };

// LocalStorage Helpers
export function getLocalProjects(): Project[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (data !== null) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.map((p, idx) => normalizeProject(p, `local-${idx}`));
      }
    }
    // Check legacy migration
    const legacy = checkLegacyLocalStorage();
    if (legacy.projects && legacy.projects.length > 0) {
      saveLocalProjects(legacy.projects);
      return legacy.projects;
    }
    // Save sample default
    saveLocalProjects(sampleProjects);
    return sampleProjects;
  } catch (err) {
    console.error('Failed reading local projects:', err);
    return sampleProjects;
  }
}

export function saveLocalProjects(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed saving local projects:', err);
  }
}

export function getLocalRequests(): ClientRequest[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (data !== null) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
    saveLocalRequests(sampleClientRequests);
    return sampleClientRequests;
  } catch (err) {
    console.error('Failed reading local requests:', err);
    return sampleClientRequests;
  }
}

export function saveLocalRequests(requests: ClientRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  } catch (err) {
    console.error('Failed saving local requests:', err);
  }
}

export function getLocalSettings(): AppSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (data) return JSON.parse(data);
  } catch (e) {
    // ignore
  }
  return defaultAppSettings;
}

export function saveLocalSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed saving local settings:', err);
  }
}

/**
 * Strips undefined properties recursively so Firestore never throws
 * "Unsupported field value: undefined".
 */
export function sanitizeForFirestore<T>(data: T): any {
  if (data === null || data === undefined) return null;
  return JSON.parse(JSON.stringify(data));
}

/**
 * Normalizes any project data structure into the standard Project interface,
 * handling legacy or partial schemas seamlessly.
 */
export function normalizeProject(raw: any, fallbackId?: string): Project {
  const id = raw.id || fallbackId || `proj-${Date.now()}`;
  const recipient =
    raw.recipientName ||
    raw.recipient ||
    raw.config?.recipientName ||
    raw.config?.letterRecipient ||
    'Celebrant';
  const name =
    raw.name ||
    raw.title ||
    (recipient && recipient !== 'Celebrant' ? `Birthday Website — ${recipient}` : 'Birthday Celebration');

  return {
    id,
    name,
    recipientName: recipient,
    clientName: raw.clientName || raw.client || undefined,
    clientContact: raw.clientContact || undefined,
    status: raw.status || 'live',
    theme: raw.theme || raw.themeId || 'Romantic Rose & Gold',
    githubRepoUrl: raw.githubRepoUrl || raw.githubUrl || raw.repoUrl || undefined,
    liveWebsiteUrl: raw.liveWebsiteUrl || raw.liveUrl || raw.url || undefined,
    deploymentPlatform: raw.deploymentPlatform || raw.deployPlatform || raw.platform || 'cloudflare',
    deploymentNotes: raw.deploymentNotes || '',
    lastDeployedAt: raw.lastDeployedAt || raw.updatedAt,
    notes: raw.notes || raw.description || undefined,
    isPinned: Boolean(raw.isPinned || raw.pinned),
    socialLinks: Array.isArray(raw.socialLinks)
      ? raw.socialLinks
      : raw.socialUrl
      ? [{ id: `soc-${Date.now()}`, platform: 'tiktok', url: raw.socialUrl, viewCount: raw.views || raw.videoViews || null }]
      : [],
    builderData: raw.builderData || sampleProjects[0]?.builderData || defaultBirthdaySiteData,
    orderId: raw.orderId,
    createdAt: raw.createdAt || raw.updatedAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}

// Detect Legacy LocalStorage from older versions of the app
export function checkLegacyLocalStorage(): { hasLegacy: boolean; projects?: Project[] } {
  for (const key of STORAGE_KEYS.LEGACY_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize legacy structure into current Project schema
          const normalized: Project[] = parsed.map((p: any, idx: number) => ({
            id: p.id || `legacy-${idx}-${Date.now()}`,
            name: p.name || p.title || `Birthday Site #${idx + 1}`,
            recipientName: p.recipientName || p.recipient || 'Celebrant',
            clientName: p.clientName || p.client || '',
            clientContact: p.clientContact || '',
            status: p.status || 'live',
            theme: p.theme || 'Classic Celebration',
            githubRepoUrl: p.githubRepoUrl || p.repoUrl || '',
            liveWebsiteUrl: p.liveWebsiteUrl || p.liveUrl || p.url || '',
            deploymentPlatform: p.deploymentPlatform || p.platform || 'cloudflare',
            deploymentNotes: p.deploymentNotes || '',
            lastDeployedAt: p.lastDeployedAt || new Date().toISOString(),
            notes: p.notes || '',
            isPinned: Boolean(p.isPinned || p.pinned),
            socialLinks: Array.isArray(p.socialLinks)
              ? p.socialLinks
              : p.socialUrl
              ? [{ id: `soc-${Date.now()}`, platform: 'tiktok', url: p.socialUrl, viewCount: p.views || null }]
              : [],
            builderData: p.builderData || sampleProjects[0].builderData,
            orderId: p.orderId,
            createdAt: p.createdAt || new Date().toISOString(),
            updatedAt: p.updatedAt || new Date().toISOString(),
          }));
          return { hasLegacy: true, projects: normalized };
        }
      }
    } catch {
      // ignore
    }
  }
  return { hasLegacy: false };
}

// Firebase Cloud Sync Subscription for Projects
export function subscribeToProjects(
  onUpdate: (projects: Project[]) => void,
  onStatusChange: (status: SyncState, message?: string) => void
): () => void {
  // Start with local cache immediately
  const localProjects = getLocalProjects();
  onUpdate(localProjects);

  if (!db) {
    onStatusChange(
      'offline',
      isFirebaseConfigured
        ? 'Firebase connection offline (using local storage)'
        : 'Local storage mode (Firebase credentials not yet provided)'
    );
    return () => {};
  }

  onStatusChange('syncing', 'Connecting to Firestore cloud...');

  try {
    const projectsCol = collection(db, 'projects');
    const q = query(projectsCol, orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          // If Firestore is completely empty on first run, seed with local projects
          seedFirestoreIfEmpty(localProjects);
          onUpdate(localProjects);
        } else {
          const remoteItems: Project[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            remoteItems.push(normalizeProject(data, docSnap.id));
          });

          // Retain any locally-created or updated project that hasn't made it to the remote snapshot yet
          // to prevent race conditions from erasing recently added projects
          const currentLocal = getLocalProjects();
          const pendingLocal = currentLocal.filter((lp) => {
            const inRemote = remoteItems.some((rp) => rp.id === lp.id);
            if (inRemote) return false;
            const ageMs = Date.now() - new Date(lp.updatedAt || 0).getTime();
            return ageMs < 60000;
          });

          const merged = [...pendingLocal, ...remoteItems];
          saveLocalProjects(merged);
          onUpdate(merged);
        }
        onStatusChange('connected', 'Cloud synced via Firestore');
      },
      (error) => {
        console.warn('[Firestore Error Projects]:', error);
        onStatusChange('error', error.message || 'Firestore sync error');
        // Fallback to local
        onUpdate(getLocalProjects());
      }
    );

    return unsubscribe;
  } catch (err: any) {
    console.error('[Firestore subscribe error]:', err);
    onStatusChange('error', err?.message || 'Failed connecting to Firestore');
    return () => {};
  }
}

// Firebase Cloud Sync Subscription for Client Requests
export function subscribeToRequests(
  onUpdate: (requests: ClientRequest[]) => void,
  onStatusChange: (status: SyncState, message?: string) => void
): () => void {
  const localRequests = getLocalRequests();
  onUpdate(localRequests);

  if (!db) {
    return () => {};
  }

  try {
    const reqCol = collection(db, 'client_requests');
    const q = query(reqCol, orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteItems: ClientRequest[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as ClientRequest;
            remoteItems.push({ ...data, id: docSnap.id });
          });

          const currentLocal = getLocalRequests();
          const pendingLocal = currentLocal.filter((lr) => {
            const inRemote = remoteItems.some((rr) => rr.id === lr.id);
            if (inRemote) return false;
            const ageMs = Date.now() - new Date(lr.updatedAt || 0).getTime();
            return ageMs < 60000;
          });

          const merged = [...pendingLocal, ...remoteItems];
          saveLocalRequests(merged);
          onUpdate(merged);
        }
      },
      (error) => {
        console.warn('[Firestore Error Requests]:', error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.error('[Firestore requests subscribe error]:', err);
    return () => {};
  }
}

// Seed Firestore on initial connect
async function seedFirestoreIfEmpty(projects: Project[]) {
  if (!db) return;
  try {
    for (const p of projects) {
      const sanitized = sanitizeForFirestore(p);
      await setDoc(doc(db, 'projects', p.id), sanitized, { merge: true });
    }
  } catch (e) {
    console.warn('[Seeding Firestore]:', e);
  }
}

// Save or Update a Project
export async function saveProject(project: Project): Promise<void> {
  const updatedProject: Project = {
    ...project,
    updatedAt: new Date().toISOString(),
  };

  // 1. Update locally first
  const current = getLocalProjects();
  const index = current.findIndex((p) => p.id === updatedProject.id);
  let updatedList: Project[];
  if (index >= 0) {
    updatedList = [...current];
    updatedList[index] = updatedProject;
  } else {
    updatedList = [updatedProject, ...current];
  }
  saveLocalProjects(updatedList);

  // 2. Sync to Firestore if available with clean data (no undefined fields)
  if (db) {
    try {
      const sanitized = sanitizeForFirestore(updatedProject);
      await setDoc(doc(db, 'projects', updatedProject.id), sanitized, { merge: true });
    } catch (error) {
      console.error('[Save Project Firestore Error]:', error);
      throw error;
    }
  }
}

// Delete a Project
export async function deleteProject(projectId: string): Promise<void> {
  const current = getLocalProjects();
  const filtered = current.filter((p) => p.id !== projectId);
  saveLocalProjects(filtered);

  if (db) {
    try {
      await deleteDoc(doc(db, 'projects', projectId));
    } catch (error) {
      console.error('[Delete Project Firestore Error]:', error);
      throw error;
    }
  }
}

// Save or Update Client Request
export async function saveClientRequest(request: ClientRequest): Promise<void> {
  const updatedReq: ClientRequest = {
    ...request,
    updatedAt: new Date().toISOString(),
  };

  const current = getLocalRequests();
  const index = current.findIndex((r) => r.id === updatedReq.id);
  let updatedList: ClientRequest[];
  if (index >= 0) {
    updatedList = [...current];
    updatedList[index] = updatedReq;
  } else {
    updatedList = [updatedReq, ...current];
  }
  saveLocalRequests(updatedList);

  if (db) {
    try {
      const sanitized = sanitizeForFirestore(updatedReq);
      await setDoc(doc(db, 'client_requests', updatedReq.id), sanitized, { merge: true });
    } catch (error) {
      console.error('[Save Request Firestore Error]:', error);
      throw error;
    }
  }
}

// Delete Client Request
export async function deleteClientRequest(requestId: string): Promise<void> {
  const current = getLocalRequests();
  const filtered = current.filter((r) => r.id !== requestId);
  saveLocalRequests(filtered);

  if (db) {
    try {
      await deleteDoc(doc(db, 'client_requests', requestId));
    } catch (error) {
      console.error('[Delete Request Firestore Error]:', error);
      throw error;
    }
  }
}

// Test Connection Diagnostic
export async function testFirestoreConnection(): Promise<{ success: boolean; message: string }> {
  if (!isFirebaseConfigured) {
    return {
      success: false,
      message: 'VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID environment variables are not set.',
    };
  }
  if (!db) {
    return {
      success: false,
      message: 'Firebase initialized with errors. Check credentials and browser console.',
    };
  }
  try {
    const testDocRef = doc(db, 'settings', 'connection_test');
    await setDoc(testDocRef, { testedAt: new Date().toISOString() }, { merge: true });
    return {
      success: true,
      message: 'Connected to Firestore successfully! Read and write operations confirmed.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Failed connecting to Firestore.',
    };
  }
}

// Export Full JSON Backup
export function generateBackupData(): string {
  const payload = {
    version: '2.0.0',
    app: 'WishCraft Studio',
    exportedAt: new Date().toISOString(),
    projects: getLocalProjects(),
    clientRequests: getLocalRequests(),
    settings: getLocalSettings(),
  };
  return JSON.stringify(payload, null, 2);
}

export const exportAllDataAsJSON = generateBackupData;

// Validate & Parse JSON Backup File
export function validateAndParseBackupJSON(jsonString: string): {
  valid: boolean;
  error?: string;
  data?: { projects: Project[]; requests: ClientRequest[]; settings: AppSettings };
} {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { valid: false, error: 'File does not contain a valid JSON object.' };
    }
    if (!Array.isArray(parsed.projects)) {
      return { valid: false, error: 'Backup is missing required "projects" array.' };
    }
    const projects: Project[] = parsed.projects;
    const requests: ClientRequest[] = Array.isArray(parsed.clientRequests)
      ? parsed.clientRequests
      : Array.isArray(parsed.requests)
      ? parsed.requests
      : [];
    const settings: AppSettings = parsed.settings || getLocalSettings();

    return { valid: true, data: { projects, requests, settings } };
  } catch (e: any) {
    return { valid: false, error: `JSON Parse error: ${e.message}` };
  }
}

export function initializeLocalDataIfEmpty(): void {
  getLocalProjects();
  getLocalRequests();
  getLocalSettings();
}

export const syncService = {
  listenProjects: (
    onUpdate: (projects: Project[]) => void,
    onStatusChange?: (status: 'connected' | 'offline_local' | 'syncing') => void
  ) => {
    return subscribeToProjects(onUpdate, (status) => {
      if (onStatusChange) {
        const mapped = status === 'connected' ? 'connected' : status === 'syncing' ? 'syncing' : 'offline_local';
        onStatusChange(mapped);
      }
    });
  },
  listenRequests: (
    onUpdate: (requests: ClientRequest[]) => void,
    onStatusChange?: (status: 'connected' | 'offline_local' | 'syncing') => void
  ) => {
    return subscribeToRequests(onUpdate, (status) => {
      if (onStatusChange) {
        const mapped = status === 'connected' ? 'connected' : status === 'syncing' ? 'syncing' : 'offline_local';
        onStatusChange(mapped);
      }
    });
  },
  listenSettings: (onUpdate: (settings: AppSettings) => void) => {
    onUpdate(getLocalSettings());
    return () => {};
  },
  saveProject,
  deleteProject,
  saveRequest: saveClientRequest,
  deleteRequest: deleteClientRequest,
  saveSettings: (settings: AppSettings) => {
    saveLocalSettings(settings);
  },
};


// Validate & Restore Backup JSON
export async function restoreBackupData(
  jsonString: string
): Promise<{ success: boolean; message: string; projectCount?: number; requestCount?: number }> {
  try {
    const data = JSON.parse(jsonString);
    if (!data || typeof data !== 'object') {
      return { success: false, message: 'Invalid JSON format.' };
    }

    if (!Array.isArray(data.projects)) {
      return { success: false, message: 'Backup file is missing valid "projects" array.' };
    }

    // Save locally
    saveLocalProjects(data.projects);
    if (Array.isArray(data.clientRequests)) {
      saveLocalRequests(data.clientRequests);
    }
    if (data.settings) {
      saveLocalSettings(data.settings);
    }

    // Sync to Firestore if online
    if (db) {
      for (const p of data.projects) {
        const sanitized = sanitizeForFirestore(p);
        await setDoc(doc(db, 'projects', p.id), sanitized, { merge: true });
      }
      if (Array.isArray(data.clientRequests)) {
        for (const r of data.clientRequests) {
          const sanitized = sanitizeForFirestore(r);
          await setDoc(doc(db, 'client_requests', r.id), sanitized, { merge: true });
        }
      }
    }

    return {
      success: true,
      message: `Successfully restored ${data.projects.length} projects and ${data.clientRequests?.length || 0} client orders.`,
      projectCount: data.projects.length,
      requestCount: data.clientRequests?.length || 0,
    };
  } catch (err: any) {
    return { success: false, message: `Restore failed: ${err?.message || 'Unknown error'}` };
  }
}
