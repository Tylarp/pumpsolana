export type RiskLevel = 'early' | 'developing' | 'extended' | 'high-risk';

export interface Token {
  id: string;
  address: string;
  symbol: string;
  name: string;
  logoUrl: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  price: number;
  priceChange1m: number;
  priceChange5m: number;
  priceChange15m: number;
  priceChange1h: number;
  priceChange24h: number;
  volume1h: number;
  volume24h: number;
  liquidity: number;
  marketCap: number;
  fdv: number;
  holders: number;
  holderGrowth1h: number;
  holderGrowth24h: number;
  ageMinutes: number;
  graduated: boolean;
  platform: string;
  aiScore: number;
  riskLevel: RiskLevel;
  riskScore: number;
  riskFlags: RiskFlag[];
  socialMentions: number;
  socialMentionsChange: number;
  socialSentiment: number;
  txns1m: number;
  txns5m: number;
  txns1h: number;
  buyers1h: number;
  sellers1h: number;
  priceHistory: number[];
  volumeHistory: number[];
  holderHistory: number[];
  topHolders: TopHolder[];
  recentTxns: Transaction[];
  walletActivity: WalletActivity[];
  socialPosts: SocialPost[];
  createdAt: number;
}

export interface RiskFlag {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface TopHolder {
  address: string;
  balance: number;
  percentage: number;
  isInsider: boolean;
  isContract: boolean;
}

export interface Transaction {
  hash: string;
  type: 'buy' | 'sell';
  amountUsd: number;
  tokenAmount: number;
  price: number;
  timestamp: number;
  wallet: string;
}

export interface WalletActivity {
  address: string;
  label: string;
  type: 'smart' | 'whale' | 'sniper' | 'dump';
  pnlPercent: number;
  buyAmount: number;
  sellAmount: number;
  lastActive: number;
  txns: number;
}

export interface SocialPost {
  id: string;
  author: string;
  authorHandle: string;
  avatar: string;
  content: string;
  likes: number;
  retweets: number;
  replies: number;
  timestamp: number;
  verified: boolean;
  influenceScore: number;
}

export interface Tweet {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  profileUrl: string;
  postUrl: string;
  content: string;
  likes: number;
  retweets: number;
  replies: number;
  views: number;
  timestamp: number;
  verified: boolean;
  influenceScore: number;
  tokensMentioned: string[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
  sentimentScore: number;
}

export interface TwitterTrend {
  id: string;
  term: string;
  tokenSymbol: string;
  mentions: number;
  mentionsChange: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  sentimentScore: number;
  uniqueAccounts: number;
  topPost: Tweet;
}

export interface NotableAccount {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  profileUrl: string;
  followers: number;
  verified: boolean;
  category: 'alpha-caller' | 'whale' | 'influencer' | 'dev';
  recentCall: string;
  callAccuracy: number;
  avgEngagement: number;
  bio: string;
}

export interface AIInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'trend' | 'summary';
  title: string;
  description: string;
  tokens: string[];
  confidence: number;
  timestamp: number;
}

export interface AlertRule {
  id: string;
  token_address: string;
  token_symbol: string;
  token_name: string;
  alert_type: 'volume' | 'holders' | 'liquidity' | 'social';
  threshold: string;
  triggered: boolean;
  message: string | null;
  created_at: string;
  triggered_at: string | null;
}
