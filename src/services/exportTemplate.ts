import { BirthdaySiteData } from '../types';

export function generateBirthdayCodeTS(data: BirthdaySiteData): string {
  const formattedJson = JSON.stringify(data, null, 2);

  return `/**
 * WishCraft Studio — Birthday Website Data Module
 * File: src/data/birthdayData.ts
 * Generated for: ${data.recipient.name}
 * Generated on: ${new Date().toISOString()}
 *
 * This file is ready to drop directly into your birthday website project (Vite/React/Next.js).
 */

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
  icon: string;
  isOpened?: boolean;
}

export interface BirthdayData {
  recipient: {
    name: string;
    nickname?: string;
    age?: number;
    birthDate: string;
  };
  hero: {
    title: string;
    subtitle: string;
    badgeText: string;
    animationEffect: 'confetti' | 'balloons' | 'stars' | 'hearts' | 'fireworks';
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
    autoPlayPrompt: boolean;
  };
  themeConfig: {
    primaryColor: string;
    accentColor: string;
    fontPairing: 'modern' | 'romantic' | 'playful' | 'editorial' | 'neon';
    darkMode: boolean;
    styleVariant: 'luxe' | 'playful' | 'romantic' | 'minimal' | 'cyber';
  };
}

export const birthdayData: BirthdayData = ${formattedJson};

export default birthdayData;
`;
}

export const exportBirthdayDataCode = generateBirthdayCodeTS;

export function downloadFile(
  arg1: string,
  arg2?: string,
  contentType: string = 'text/plain'
) {
  let filename = 'birthdayData.ts';
  let content = '';

  if (arg2) {
    if (arg1.endsWith('.ts') || arg1.endsWith('.json') || arg1.endsWith('.txt')) {
      filename = arg1;
      content = arg2;
    } else {
      content = arg1;
      filename = arg2;
    }
  } else {
    content = arg1;
  }

  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

