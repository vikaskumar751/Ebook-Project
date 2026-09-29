export interface Tenet {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  coreRule: string;
  description: string;
  dailyDrill: string;
  quote: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  bpm: string;
  duration: string;
  frequency: string;
  purpose: string;
}

export interface ExcerptPage {
  pageNumber: number;
  chapterNumber: string;
  chapterTitle: string;
  subtitle: string;
  content: string[];
  callout?: string;
  ruleOfAction?: string;
}

export interface OrderItem {
  tierId: 'standard';
  title: string;
  price: number;
  customerEmail: string;
  paymentMethod: 'card' | 'apple_pay' | 'crypto';
  licenseKey: string;
  timestamp: string;
}
