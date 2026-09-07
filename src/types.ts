export type ProjectStatus = 'draft' | 'in_progress' | 'ready' | 'live' | 'archived';

export type DeploymentPlatform = 'cloudflare' | 'netlify' | 'vercel' | 'github_pages' | 'other';

export type NavigationTab = 'dashboard' | 'projects' | 'inquiries' | 'deployments' | 'backup';

export type WebsiteOccasion =
  | 'birthday'
  | 'feel_special'
  | 'best_friend'
  | 'teachers_day'
  | 'propose'
  | 'marriage'
  | 'other';

export type SocialPlatform =
  | 'tiktok'
  | 'instagram'
  | 'youtube'
  | 'facebook'
  | 'pinterest'
  | 'x'
  | 'threads'
  | 'snapchat'
  | 'other';

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
  viewCount?: number | null;
  notes?: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  date?: string;
  description: string;
  imageUrl: string;
  tag?: string;
}

export interface WishItem {
  id: string;
  from: string;
  relationship?: string;
  message: string;
  avatarUrl?: string;
}

export interface GiftItem {
  id: string;
  title: string;
  hint: string;
  revealMessage: string;
  icon?: string;
  isOpened?: boolean;
}

export interface BirthdaySiteData {
  recipient: {
    name: string;
    nickname?: string;
    age?: number;
    birthDate: string; // YYYY-MM-DD
  };
  hero: {
    title: string;
    subtitle: string;
    badgeText: string;
    animationEffect?: 'confetti' | 'balloons' | 'stars' | 'hearts' | 'fireworks';
  };
  letter: {
    title: string;
    senderName: string;
    paragraphs: string[];
    signature: string;
    waxSealColor?: string;
  };
  countdown: {
    enabled: boolean;
    targetDate: string;
  };
  memories: MemoryItem[];
  wishes: WishItem[];
  gifts: GiftItem[];
  music: {
    enabled: boolean;
    title: string;
    artist: string;
    audioUrl?: string;
    url?: string;
    autoPlayPrompt?: boolean;
  };
  themeConfig: {
    presetName?: string;
    primaryColor: string; // Hex e.g. #f59e0b
    accentColor: string;  // Hex e.g. #ec4899
    fontPairing?: 'modern' | 'romantic' | 'playful' | 'editorial' | 'neon' | string;
    darkMode?: boolean;
    styleVariant?: 'luxe' | 'playful' | 'romantic' | 'minimal' | 'cyber' | string;
  };
}

export interface Project {
  id: string;
  name: string;
  recipientName: string;
  clientName?: string;
  clientContact?: string;
  status: ProjectStatus;
  theme: string;
  occasion?: WebsiteOccasion;
  price?: string; // e.g. "$35"
  description?: string;
  isPublicShowcase?: boolean; // Visible on client portal
  coverImageUrl?: string;
  githubRepoUrl?: string;
  liveWebsiteUrl?: string;
  deploymentPlatform: DeploymentPlatform;
  deploymentNotes?: string;
  lastDeployedAt?: string;
  notes?: string;
  isPinned: boolean;
  socialLinks: SocialLink[];
  builderData: BirthdaySiteData;
  orderId?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'new' | 'in_progress' | 'ready_for_preview' | 'delivered' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'deposit_paid' | 'fully_paid' | 'refunded';

export interface ClientRequest {
  id: string;
  clientName: string;
  clientContact: string; // WhatsApp or Phone
  clientGmail?: string; // Gmail or Email
  recipientName: string;
  websiteType: string;
  occasion?: WebsiteOccasion;
  requirements: string;
  budget: string;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  orderDate: string;
  dueDate?: string;
  notes?: string;
  connectedProjectId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  creatorName: string;
  studioName: string;
  adminUsername?: string; // Username to access private admin dashboard (default: "hamad")
  adminPasscode?: string; // Secret key / password to access the private admin dashboard
  adminRecoveryEmail?: string; // Recovery email for reset code (hamadkhadim474@gmail.com)
  creatorWhatsApp?: string;
  creatorGmail?: string;
  creatorTikTokUrl?: string;
  creatorInstagramUrl?: string;
  creatorYouTubeUrl?: string;
  defaultDeploymentPlatform: DeploymentPlatform;
  defaultTheme: string;
  defaultPlatform?: DeploymentPlatform;
  currencySymbol: string;
  studioTheme: 'dark' | 'midnight' | 'light';
  autoSaveCloud: boolean;
  updatedAt: string;
}

export type SyncState = 'connected' | 'syncing' | 'offline' | 'error' | 'synced' | 'local_only';

