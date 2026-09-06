import { Project, ClientRequest, BirthdaySiteData, AppSettings } from '../types';

export const defaultBirthdaySiteData: BirthdaySiteData = {
  recipient: {
    name: 'Ayesha',
    nickname: 'Aysh',
    age: 24,
    birthDate: '2026-09-18',
  },
  hero: {
    title: 'Happy Birthday, Ayesha!',
    subtitle: 'Celebrating another year of your radiant light, laughter, and joy.',
    badgeText: '✨ It\'s Your Special Day ✨',
    animationEffect: 'confetti',
  },
  letter: {
    title: 'A Special Note For You',
    senderName: 'Your Favorite People',
    paragraphs: [
      'To someone who brings endless sunshine into every room she enters — today is all about celebrating you!',
      'May this 24th chapter be filled with wild adventures, peaceful moments, unforgettable laughter, and all the dreams your heart has been whispering.',
      'Thank you for being such an extraordinary friend, sister, and inspiration to all of us. Here is to making memories that last forever!'
    ],
    signature: 'With all our love & hugs 💕',
    waxSealColor: '#e11d48',
  },
  countdown: {
    enabled: true,
    targetDate: '2026-09-18T00:00:00',
  },
  memories: [
    {
      id: 'm-1',
      title: 'Sunset at the Coast',
      date: 'Summer 2025',
      description: 'That spontaneous drive where we laughed till our stomachs hurt.',
      imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
      tag: 'Adventure',
    },
    {
      id: 'm-2',
      title: 'Coffee & Endless Talks',
      date: 'Autumn 2025',
      description: 'Cozy evenings sharing dreams and drinking warm matcha.',
      imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
      tag: 'Cozy',
    },
    {
      id: 'm-3',
      title: 'Starlight Picnic',
      date: 'Spring 2026',
      description: 'Under the open sky listening to acoustic music.',
      imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
      tag: 'Memories',
    }
  ],
  wishes: [
    {
      id: 'w-1',
      from: 'Maya & Zayd',
      relationship: 'Best Friends',
      message: 'You deserve all the stars in the galaxy today! Happy 24th birthday queen!',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'w-2',
      from: 'Liam K.',
      relationship: 'College Squad',
      message: 'Never stop smiling and lighting up the room. Hope this year brings huge wins!',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'w-3',
      from: 'Mom & Dad',
      relationship: 'Family',
      message: 'So endlessly proud of the wonderful woman you are. Happy birthday sweetheart!',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    }
  ],
  gifts: [
    {
      id: 'g-1',
      title: 'Secret Envelope #1',
      hint: 'Tap to unwrap a surprise!',
      revealMessage: '🎟️ VIP Weekend Concert Tickets for your favorite band!',
      icon: 'gift',
      isOpened: false,
    },
    {
      id: 'g-2',
      title: 'Mystery Box #2',
      hint: 'Something sweet & unforgettable',
      revealMessage: '✈️ Flight booking voucher for our upcoming road trip getaway!',
      icon: 'sparkles',
      isOpened: false,
    }
  ],
  music: {
    enabled: true,
    title: 'Golden Birthday Chords',
    artist: 'Acoustic Melody',
    audioUrl: 'https://cdn.freesound.org/previews/518/518888_11565147-lq.mp3',
    autoPlayPrompt: true,
  },
  themeConfig: {
    primaryColor: '#f43f5e',
    accentColor: '#fbbf24',
    fontPairing: 'romantic',
    darkMode: true,
    styleVariant: 'romantic',
  },
};

export const sampleProjects: Project[] = [
  {
    id: 'proj-ayesha',
    name: "Ayesha's Birthday",
    recipientName: 'Ayesha',
    clientName: 'TikTok User',
    clientContact: '@ayesha_fan / +1-555-0192',
    status: 'live',
    theme: 'Rose Quartz & Gold',
    coverImageUrl: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&auto=format&fit=crop&q=80',
    githubRepoUrl: 'https://github.com/wishcraft-studio/birthday-ayesha',
    liveWebsiteUrl: 'https://ayesha-birthday.pages.dev',
    deploymentPlatform: 'cloudflare',
    deploymentNotes: 'Deployed to Cloudflare Pages edge network. Custom domain mapped. SSL active.',
    lastDeployedAt: '2025-08-12T14:30:00Z',
    notes: 'Client wanted an emotional video background + parchment letter with digital wax seal. Showcase video went viral on TikTok!',
    isPinned: true,
    socialLinks: [
      {
        id: 'soc-1',
        platform: 'tiktok',
        url: 'https://tiktok.com/@wishcraft.sites/video/7391829102',
        viewCount: 450000,
        notes: 'Went viral on FYP, pinned comment generated 14 new client leads'
      },
      {
        id: 'soc-2',
        platform: 'instagram',
        url: 'https://instagram.com/reel/C8x71v2Lp',
        viewCount: 210000,
        notes: 'Trending audio used'
      },
      {
        id: 'soc-3',
        platform: 'youtube',
        url: 'https://youtube.com/shorts/qP8a9s102',
        viewCount: 85000,
        notes: 'High conversion rate on description link'
      },
      {
        id: 'soc-4',
        platform: 'facebook',
        url: 'https://facebook.com/watch/?v=9812471',
        viewCount: 30000,
        notes: 'Shared in birthday gift recommendation groups'
      },
      {
        id: 'soc-5',
        platform: 'pinterest',
        url: 'https://pinterest.com/pin/102938472918',
        viewCount: 12500,
        notes: 'Top pin for creative birthday gift ideas'
      }
    ],
    builderData: defaultBirthdaySiteData,
    orderId: 'req-101',
    createdAt: '2025-08-12T10:00:00Z',
    updatedAt: '2025-08-12T16:00:00Z',
  },
  {
    id: 'proj-sophia',
    name: "Sophia's Special Day",
    recipientName: 'Sophia',
    clientName: 'Instagram User',
    clientContact: '@sophia_memories (IG)',
    status: 'in_progress',
    theme: 'Midnight Celestial',
    coverImageUrl: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=800&auto=format&fit=crop&q=80',
    githubRepoUrl: 'https://github.com/wishcraft-studio/sophia-celestial',
    liveWebsiteUrl: 'https://sophia-special.netlify.app',
    deploymentPlatform: 'netlify',
    deploymentNotes: 'Netlify production build ready. Interactive starlight countdown configured.',
    lastDeployedAt: '2026-05-30T11:20:00Z',
    notes: 'Celestial starry sky with glowing constellations, photo memories gallery, and cosmic birthday card.',
    isPinned: true,
    socialLinks: [
      {
        id: 'soc-sophia-1',
        platform: 'tiktok',
        url: 'https://tiktok.com/@wishcraft.sites/video/740281928',
        viewCount: 120000,
        notes: 'Starry night preview went viral'
      },
      {
        id: 'soc-sophia-2',
        platform: 'instagram',
        url: 'https://instagram.com/reel/D9y82m1Kp',
        viewCount: 98000,
        notes: 'Shared with audio track'
      },
      {
        id: 'soc-sophia-3',
        platform: 'youtube',
        url: 'https://youtube.com/shorts/qP8a9s103',
        viewCount: 45000,
      },
      {
        id: 'soc-sophia-4',
        platform: 'facebook',
        url: 'https://facebook.com/watch/?v=9812472',
        viewCount: 12000,
      }
    ],
    builderData: {
      ...defaultBirthdaySiteData,
      recipient: {
        name: 'Sophia',
        nickname: 'Soph',
        age: 22,
        birthDate: '2026-06-15',
      },
      hero: {
        title: 'Happy Birthday, Sophia!',
        subtitle: 'Written in the stars, celebrated across the cosmos.',
        badgeText: '✨ Celestial Celebration ✨',
        animationEffect: 'stars',
      },
      themeConfig: {
        primaryColor: '#6366f1',
        accentColor: '#ec4899',
        fontPairing: 'editorial',
        darkMode: true,
        styleVariant: 'luxe',
      }
    },
    orderId: 'req-102',
    createdAt: '2026-05-30T14:20:00Z',
    updatedAt: '2026-05-30T17:00:00Z',
  },
  {
    id: 'proj-ryan',
    name: "Ryan's Birthday",
    recipientName: 'Ryan',
    clientName: 'Friends',
    clientContact: '@ryan_squad (Discord)',
    status: 'ready',
    theme: 'Sunset Amber Glow',
    coverImageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80',
    githubRepoUrl: 'https://github.com/wishcraft-studio/ryan-birthday',
    liveWebsiteUrl: 'https://ryan-birthday.vercel.app',
    deploymentPlatform: 'vercel',
    deploymentNotes: 'Vercel preview active. Custom background audio uploaded.',
    lastDeployedAt: '2026-05-10T08:00:00Z',
    notes: 'Warm amber sunset aesthetic with retro scrapbook letters and Polaroid memories.',
    isPinned: false,
    socialLinks: [
      {
        id: 'soc-ryan-1',
        platform: 'tiktok',
        url: 'https://tiktok.com/@wishcraft.sites/video/741928371',
        viewCount: 75000,
        notes: 'Scrapbook flip animation showcase'
      },
      {
        id: 'soc-ryan-2',
        platform: 'instagram',
        url: 'https://instagram.com/reel/E0z91n2Kp',
        viewCount: 60000,
      },
      {
        id: 'soc-ryan-3',
        platform: 'youtube',
        url: 'https://youtube.com/shorts/qP8a9s104',
        viewCount: 28000,
      },
      {
        id: 'soc-ryan-4',
        platform: 'facebook',
        url: 'https://facebook.com/watch/?v=9812473',
        viewCount: 15000,
      }
    ],
    builderData: {
      ...defaultBirthdaySiteData,
      recipient: {
        name: 'Ryan',
        nickname: 'Ry',
        age: 26,
        birthDate: '2026-05-18',
      },
      hero: {
        title: "Happy Birthday Ryan!",
        subtitle: 'Warm golden moments, lifelong laughs, and good times.',
        badgeText: '🌅 Golden Hour Celebration 🌅',
        animationEffect: 'confetti',
      },
      themeConfig: {
        primaryColor: '#f59e0b',
        accentColor: '#ef4444',
        fontPairing: 'romantic',
        darkMode: true,
        styleVariant: 'romantic',
      }
    },
    orderId: 'req-103',
    createdAt: '2026-05-10T11:15:00Z',
    updatedAt: '2026-05-10T15:30:00Z',
  }
];

export const sampleClientRequests: ClientRequest[] = [
  {
    id: 'req-101',
    clientName: 'Hamza Malik',
    clientContact: '@hamza_m (IG) / +1-555-0192',
    recipientName: 'Ayesha',
    websiteType: 'Romantic Love Story',
    requirements: 'Needs digital wax seal letter, photo gallery with 3 pictures, romantic rose theme, sound effect on letter open, Cloudflare Pages hosting.',
    budget: '$150',
    paymentStatus: 'fully_paid',
    status: 'delivered',
    orderDate: '2026-08-27',
    dueDate: '2026-09-02',
    notes: 'Client was thrilled with TikTok showcase results! Tipped $30 extra.',
    connectedProjectId: 'proj-ayesha-2026',
    createdAt: '2026-08-27T10:00:00Z',
    updatedAt: '2026-09-02T16:00:00Z',
  },
  {
    id: 'req-102',
    clientName: 'Elena Rostova',
    clientContact: 'elena.rostova@gmail.com',
    recipientName: 'David Chen',
    websiteType: 'Milestone 30th Birthday',
    requirements: 'Gold and black champagne theme, fireworks animation, video message embed, 30 wishes wall from friends.',
    budget: '$180',
    paymentStatus: 'fully_paid',
    status: 'ready_for_preview',
    orderDate: '2026-08-29',
    dueDate: '2026-09-06',
    notes: 'Sent preview link to client, waiting on final approval before deployment to custom domain.',
    connectedProjectId: 'proj-david-30th',
    createdAt: '2026-08-29T14:20:00Z',
    updatedAt: '2026-09-04T12:00:00Z',
  },
  {
    id: 'req-103',
    clientName: 'Marcus Vance',
    clientContact: '@marcus_vance (TikTok) / marcus@gmail.com',
    recipientName: 'Jessica',
    websiteType: 'Surprise Interactive Puzzle',
    requirements: 'Needs mystery gift box unwrapping, cute Polaroid style photo reel, background lofi music, pink & cream aesthetic.',
    budget: '$160',
    paymentStatus: 'deposit_paid',
    status: 'in_progress',
    orderDate: '2026-09-03',
    dueDate: '2026-09-12',
    notes: 'Received photos via Google Drive link. Working on custom sound triggers.',
    connectedProjectId: null,
    createdAt: '2026-09-03T16:45:00Z',
    updatedAt: '2026-09-04T09:10:00Z',
  },
  {
    id: 'req-104',
    clientName: 'Zoe Sterling',
    clientContact: 'zoe.sterling@icloud.com / +1-555-0348',
    recipientName: 'Oliver',
    websiteType: 'Retro Gaming Birthday',
    requirements: 'Pixel art / 90s aesthetic, 8-bit birthday theme, interactive arcade high-score style wish board.',
    budget: '$200',
    paymentStatus: 'unpaid',
    status: 'new',
    orderDate: '2026-09-05',
    dueDate: '2026-09-20',
    notes: 'Inquiry received via TikTok DM. Needs confirmation on audio copyright permissions.',
    connectedProjectId: null,
    createdAt: '2026-09-05T08:30:00Z',
    updatedAt: '2026-09-05T08:30:00Z',
  }
];

export const defaultAppSettings: AppSettings = {
  creatorName: 'Amara (Creator)',
  studioName: 'WishCraft Studio',
  defaultDeploymentPlatform: 'cloudflare',
  defaultTheme: 'Romantic Rose & Gold',
  defaultPlatform: 'cloudflare',
  currencySymbol: '$',
  studioTheme: 'dark',
  autoSaveCloud: true,
  updatedAt: new Date().toISOString(),
};

export const initialProjects = sampleProjects;
export const initialRequests = sampleClientRequests;
export const initialSettings = defaultAppSettings;

