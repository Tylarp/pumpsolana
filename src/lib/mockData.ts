import type { Token, Tweet, TwitterTrend, NotableAccount, AIInsight, RiskFlag, TopHolder, Transaction, WalletActivity, SocialPost, RiskLevel } from './types';

const TOKEN_NAMES: { symbol: string; name: string; website?: string; twitter?: string; telegram?: string }[] = [
  { symbol: 'BONK', name: 'Bonk', website: 'https://bonkcoin.com', twitter: 'https://twitter.com/bonk_in_sol', telegram: 'https://t.me/bonkportal' },
  { symbol: 'WIF', name: 'dogwifhat', website: 'https://dogwifcoin.com', twitter: 'https://twitter.com/dogwifcoin', telegram: 'https://t.me/dogwifhat' },
  { symbol: 'BOME', name: 'Book of Meme', website: 'https://bookofmeme.com', twitter: 'https://twitter.com/bookofmeme', telegram: 'https://t.me/bookofmeme' },
  { symbol: 'MEW', name: 'cat in a dogs world', website: 'https://mewcoin.com', twitter: 'https://twitter.com/mewonsol', telegram: 'https://t.me/mewonsol' },
  { symbol: 'POPCAT', name: 'Popcat', twitter: 'https://twitter.com/popcatsolana', telegram: 'https://t.me/popcatonsol' },
  { symbol: 'MOODENG', name: 'Moo Deng', website: 'https://moodengmeme.com', twitter: 'https://twitter.com/moodengsol', telegram: 'https://t.me/moodengcoin' },
  { symbol: 'GOAT', name: 'Goatseus Maximus', website: 'https://goatseusmaximus.com', twitter: 'https://twitter.com/goatseusmax', telegram: 'https://t.me/goatseusmax' },
  { symbol: 'PNUT', name: 'Peanut the Squirrel', twitter: 'https://twitter.com/pnutonsolana', telegram: 'https://t.me/pnutcoin' },
  { symbol: 'CHILLGUY', name: 'Chill Guy', website: 'https://chillguy.io', twitter: 'https://twitter.com/chillguycoin', telegram: 'https://t.me/chillguycoin' },
  { symbol: 'FARTCOIN', name: 'Fartcoin', twitter: 'https://twitter.com/fartcoinonsol', telegram: 'https://t.me/fartcoin' },
  { symbol: 'AI16Z', name: 'AI16Z', website: 'https://ai16z.io', twitter: 'https://twitter.com/ai16zdao', telegram: 'https://t.me/ai16z' },
  { symbol: 'RAY', name: 'Raydium', website: 'https://raydium.io', twitter: 'https://twitter.com/RaydiumProtocol', telegram: 'https://t.me/raydiumprotocol' },
  { symbol: 'SLERF', name: 'Slerf', website: 'https://slerf.xyz', twitter: 'https://twitter.com/Slerfsol', telegram: 'https://t.me/slerfportal' },
  { symbol: 'DEAN', name: 'Dean Token', twitter: 'https://twitter.com/deantokensol', telegram: 'https://t.me/deantoken' },
  { symbol: 'MUMU', name: 'Mumu the Bull', website: 'https://mumuthebull.com', twitter: 'https://twitter.com/mumuthebull', telegram: 'https://t.me/mumuthebull' },
  { symbol: 'BATCAT', name: 'Bat Cat', twitter: 'https://twitter.com/batcat_sol', telegram: 'https://t.me/batcat_sol' },
  { symbol: 'HOOD', name: 'Robin Hood', website: 'https://robinhoodsol.com', twitter: 'https://twitter.com/robinhood_sol', telegram: 'https://t.me/robinhoodsol' },
  { symbol: 'GIGA', name: 'GigaChad', website: 'https://gigachad.com', twitter: 'https://twitter.com/gigachadth', telegram: 'https://t.me/gigachad_sol' },
  { symbol: 'CWAR', name: 'Cyber War', twitter: 'https://twitter.com/cyberwarsol', telegram: 'https://t.me/cyberwarsol' },
  { symbol: 'FWOG', name: 'Fwog', twitter: 'https://twitter.com/fwogcoin', telegram: 'https://t.me/fwogcoin' },
  { symbol: 'MOCA', name: 'Moca Meme', website: 'https://mocameme.com', twitter: 'https://twitter.com/mocameme', telegram: 'https://t.me/mocameme' },
  { symbol: 'TURBO', name: 'Turbo Sol', twitter: 'https://twitter.com/turbosolana', telegram: 'https://t.me/turbosol' },
  { symbol: 'RETARDIO', name: 'Retardio', website: 'https://retardio.com', twitter: 'https://twitter.com/RETARDIOSOL', telegram: 'https://t.me/retardio' },
  { symbol: 'DOGGO', name: 'Doggo Sol', twitter: 'https://twitter.com/doggosol', telegram: 'https://t.me/doggosol' },
  { symbol: 'YOZI', name: 'Yozi', twitter: 'https://twitter.com/yozi_sol', telegram: 'https://t.me/yozi_sol' },
  { symbol: 'PEPE', name: 'Pepe Sol', twitter: 'https://twitter.com/pepe_solana', telegram: 'https://t.me/pepesol' },
  { symbol: 'SHRIMP', name: 'Shrimp Coin', twitter: 'https://twitter.com/shrimpsonsol', telegram: 'https://t.me/shrimpsonsol' },
  { symbol: 'GLITCH', name: 'Glitch Cat', twitter: 'https://twitter.com/glitchcat_sol', telegram: 'https://t.me/glitchcat_sol' },
  { symbol: 'NOS', name: 'Nosferatu', twitter: 'https://twitter.com/nosferatu_sol', telegram: 'https://t.me/nosferatu_sol' },
  { symbol: 'CULT', name: 'Cult of Sol', twitter: 'https://twitter.com/cult_sol', telegram: 'https://t.me/cult_sol' },
];

const PLATFORMS = ['pump.fun', 'Raydium', 'Meteora', 'Orca', 'Bonk.fun'];
const WALLET_LABELS = ['Smart Money', 'Whale Wallet', 'Sniper Bot', 'Diamond Hands', 'Degen Trader', 'MEV Bot', 'Early Buyer', 'Paper Hands'];

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randInt(min: number, max: number): number {
  return Math.floor(rand(min, max + 1));
}

function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

function genAddress(): string {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let addr = '';
  for (let i = 0; i < 44; i++) addr += chars[randInt(0, chars.length - 1)];
  return addr;
}

function genPriceHistory(current: number, points: number, volatility: number): number[] {
  const history: number[] = [];
  let price = current / (1 + rand(-0.3, 0.8));
  for (let i = 0; i < points; i++) {
    price *= (1 + rand(-volatility, volatility));
    history.push(price);
  }
  history[history.length - 1] = current;
  return history;
}

function genVolumeHistory(base: number, points: number): number[] {
  const history: number[] = [];
  for (let i = 0; i < points; i++) {
    history.push(base * rand(0.3, 1.8));
  }
  return history;
}

function genHolderHistory(current: number, points: number, growth: number): number[] {
  const history: number[] = [];
  let h = current;
  for (let i = points - 1; i >= 0; i--) {
    history[i] = Math.max(1, Math.floor(h));
    h /= (1 + growth / 100 / points);
  }
  return history;
}

function genTopHolders(totalSupply: number, count: number): TopHolder[] {
  const holders: TopHolder[] = [];
  let remaining = 100;
  for (let i = 0; i < count; i++) {
    const pct = remaining * rand(0.05, 0.25);
    remaining -= pct;
    holders.push({
      address: genAddress(),
      balance: totalSupply * pct / 100,
      percentage: pct,
      isInsider: i < 2 && Math.random() < 0.4,
      isContract: i === 0 && Math.random() < 0.3,
    });
  }
  return holders.sort((a, b) => b.percentage - a.percentage);
}

function genTxns(price: number, count: number, ageMinutes: number): Transaction[] {
  const txns: Transaction[] = [];
  for (let i = 0; i < count; i++) {
    const isBuy = Math.random() > 0.45;
    const amountUsd = rand(10, 5000);
    txns.push({
      hash: genAddress(),
      type: isBuy ? 'buy' : 'sell',
      amountUsd,
      tokenAmount: amountUsd / price,
      price,
      timestamp: Date.now() - randInt(0, ageMinutes * 60 * 1000),
      wallet: genAddress(),
    });
  }
  return txns.sort((a, b) => b.timestamp - a.timestamp);
}

function genWalletActivity(count: number, price: number): WalletActivity[] {
  const activities: WalletActivity[] = [];
  const types: WalletActivity['type'][] = ['smart', 'whale', 'sniper', 'dump'];
  for (let i = 0; i < count; i++) {
    const type = pick(types);
    const buyAmount = rand(500, 50000);
    const sellAmount = type === 'dump' ? rand(1000, 80000) : rand(0, buyAmount * 0.6);
    activities.push({
      address: genAddress(),
      label: pick(WALLET_LABELS),
      type,
      pnlPercent: type === 'dump' ? rand(-60, -5) : rand(-20, 400),
      buyAmount,
      sellAmount,
      lastActive: Date.now() - randInt(0, 3600 * 1000),
      txns: randInt(2, 30),
    });
  }
  return activities.sort((a, b) => b.buyAmount - a.buyAmount);
}

function genSocialPosts(symbol: string, count: number): SocialPost[] {
  const templates = [
    `${symbol} is about to send! Look at that volume 🚀`,
    `Just aped into ${symbol}, the chart looks insane`,
    `${symbol} holders growing fast, this could be the next 10x`,
    `Be careful with ${symbol}, dev wallet looks sketchy`,
    `${symbol} just graduated from pump.fun! Moon incoming`,
    `Smart money is loading ${symbol}, I'm following`,
    `${symbol} volume is drying up, might be time to exit`,
    `Never selling my ${symbol} bag, diamond hands 💎`,
  ];
  const posts: SocialPost[] = [];
  for (let i = 0; i < count; i++) {
    posts.push({
      id: `post_${i}_${Math.random()}`,
      author: `Degen${randInt(100, 999)}`,
      authorHandle: `degen${randInt(100, 999)}`,
      avatar: '',
      content: pick(templates),
      likes: randInt(5, 2000),
      retweets: randInt(1, 500),
      replies: randInt(0, 200),
      timestamp: Date.now() - randInt(0, 3600 * 1000),
      verified: Math.random() < 0.15,
      influenceScore: randInt(10, 95),
    });
  }
  return posts.sort((a, b) => b.likes - a.likes);
}

function genRiskFlags(token: Partial<Token>): RiskFlag[] {
  const flags: RiskFlag[] = [];
  const topHolderPct = token.topHolders?.[0]?.percentage ?? 0;

  if (topHolderPct > 15) {
    flags.push({
      type: 'holder_concentration',
      severity: topHolderPct > 25 ? 'critical' : 'high',
      description: `Top holder owns ${topHolderPct.toFixed(1)}% of supply — high dump risk`,
    });
  }

  if (token.liquidity && token.marketCap && token.liquidity / token.marketCap < 0.05) {
    flags.push({
      type: 'low_liquidity',
      severity: 'medium',
      description: `Liquidity is only ${(token.liquidity / token.marketCap * 100).toFixed(1)}% of market cap — high slippage risk`,
    });
  }

  if (token.holders && token.holders < 50) {
    flags.push({
      type: 'low_holders',
      severity: 'medium',
      description: `Only ${token.holders} holders — very early, high risk`,
    });
  }

  if (token.ageMinutes && token.ageMinutes < 10) {
    flags.push({
      type: 'very_new',
      severity: 'low',
      description: 'Token launched less than 10 minutes ago — extremely speculative',
    });
  }

  if (Math.random() < 0.15) {
    flags.push({
      type: 'mint_authority',
      severity: 'high',
      description: 'Mint authority not revoked — dev can mint more tokens',
    });
  }

  if (Math.random() < 0.1) {
    flags.push({
      type: 'freeze_authority',
      severity: 'critical',
      description: 'Freeze authority active — dev can freeze your wallet',
    });
  }

  if (token.volume1h && token.volume24h && token.volume1h / token.volume24h > 0.6) {
    flags.push({
      type: 'volume_spike',
      severity: 'low',
      description: 'Volume spiking — 1h volume is over 60% of 24h volume',
    });
  }

  return flags;
}

function calcRiskLevel(riskScore: number, ageMinutes: number): RiskLevel {
  if (riskScore >= 70) return 'high-risk';
  if (ageMinutes < 60) return 'early';
  if (riskScore < 30 && ageMinutes > 120) return 'developing';
  if (riskScore < 50) return 'developing';
  return 'extended';
}

function calcAiScore(token: Partial<Token>): number {
  const momentumScore = Math.min(100, Math.max(0, 50 + (token.priceChange1h ?? 0) * 2));
  const volumeScore = Math.min(100, Math.max(0, ((token.volume1h ?? 0) / (token.marketCap ?? 1)) * 100));
  const liquidityScore = Math.min(100, Math.max(0, ((token.liquidity ?? 0) / (token.marketCap ?? 1)) * 200));
  const holderScore = Math.min(100, Math.max(0, (token.holderGrowth1h ?? 0) * 3 + 40));
  const socialScore = Math.min(100, Math.max(0, (token.socialMentions ?? 0) / 5));
  const riskPenalty = (token.riskScore ?? 50) * 0.5;

  const raw = momentumScore * 0.25 + volumeScore * 0.2 + liquidityScore * 0.15 + holderScore * 0.15 + socialScore * 0.15 + (100 - riskPenalty) * 0.1;
  return Math.round(Math.min(100, Math.max(0, raw)));
}

function genToken(idx: number, forceNew = false): Token {
  const nameData = TOKEN_NAMES[idx % TOKEN_NAMES.length];
  const ageMinutes = forceNew ? randInt(1, 30) : randInt(2, 7200);
  const price = rand(0.0000001, 0.5);
  const marketCap = price * randInt(100_000_000, 10_000_000_000);
  const liquidity = marketCap * rand(0.02, 0.3);
  const volume24h = marketCap * rand(0.1, 2);
  const volume1h = volume24h * rand(0.02, 0.15);
  const holders = randInt(20, 50000);
  const holderGrowth1h = rand(-5, 30);
  const holderGrowth24h = rand(-10, 200);
  const priceChange1m = rand(-8, 12);
  const priceChange5m = rand(-15, 20);
  const priceChange15m = rand(-25, 35);
  const priceChange1h = rand(-40, 60);
  const priceChange24h = rand(-80, 500);
  const socialMentions = randInt(0, 800);
  const socialMentionsChange = rand(-50, 300);
  const socialSentiment = rand(-1, 1);
  const totalSupply = randInt(100_000_000, 10_000_000_000);
  const txns1m = randInt(1, 50);
  const txns5m = randInt(5, 200);
  const txns1h = randInt(20, 2000);
  const buyers1h = randInt(10, 1000);
  const sellers1h = randInt(5, 800);
  const topHolders = genTopHolders(totalSupply, 10);
  const recentTxns = genTxns(price, 15, ageMinutes);
  const walletActivity = genWalletActivity(8, price);
  const socialPosts = genSocialPosts(nameData.symbol, 5);

  const partial: Partial<Token> = {
    holders,
    liquidity,
    marketCap,
    volume1h,
    volume24h,
    ageMinutes,
    priceChange1h,
    holderGrowth1h,
    socialMentions,
  };

  const riskScore = Math.min(100, Math.max(0,
    (topHolders[0].percentage > 15 ? 25 : 0) +
    (liquidity / marketCap < 0.05 ? 20 : 0) +
    (holders < 50 ? 15 : 0) +
    (ageMinutes < 10 ? 10 : 0) +
    rand(0, 30)
  ));

  partial.riskScore = riskScore;
  partial.topHolders = topHolders;
  const riskFlags = genRiskFlags({ ...partial, volume1h, volume24h, liquidity, marketCap, holders, ageMinutes });
  partial.riskFlags = riskFlags;

  const aiScore = calcAiScore({
    ...partial,
    priceChange1h,
    volume1h,
    marketCap,
    liquidity,
    holderGrowth1h,
    socialMentions,
    riskScore,
  });

  return {
    id: `token_${idx}`,
    address: genAddress(),
    symbol: nameData.symbol,
    name: nameData.name,
    logoUrl: '',
    website: nameData.website,
    twitter: nameData.twitter,
    telegram: nameData.telegram,
    price,
    priceChange1m,
    priceChange5m,
    priceChange15m,
    priceChange1h,
    priceChange24h,
    volume1h,
    volume24h,
    liquidity,
    marketCap,
    fdv: marketCap * rand(1.1, 2),
    holders,
    holderGrowth1h,
    holderGrowth24h,
    ageMinutes,
    graduated: ageMinutes > 120 && Math.random() > 0.3,
    platform: pick(PLATFORMS),
    aiScore,
    riskLevel: calcRiskLevel(riskScore, ageMinutes),
    riskScore,
    riskFlags,
    socialMentions,
    socialMentionsChange,
    socialSentiment,
    txns1m,
    txns5m,
    txns1h,
    buyers1h,
    sellers1h,
    priceHistory: genPriceHistory(price, 60, 0.05),
    volumeHistory: genVolumeHistory(volume1h, 60),
    holderHistory: genHolderHistory(holders, 60, holderGrowth1h),
    topHolders,
    recentTxns,
    walletActivity,
    socialPosts,
    createdAt: Date.now() - ageMinutes * 60 * 1000,
  };
}

let tokens: Token[] = [];

export function getTokens(): Token[] {
  if (tokens.length === 0) {
    for (let i = 0; i < 30; i++) {
      tokens.push(genToken(i));
    }
  }
  return tokens;
}

export function getTokenByAddress(address: string): Token | undefined {
  return getTokens().find(t => t.address === address || t.id === address);
}

export function refreshTokens(): Token[] {
  tokens = tokens.map(t => {
    const priceDrift = rand(-0.08, 0.08);
    const newPrice = Math.max(0.00000001, t.price * (1 + priceDrift));
    const volumeChange = rand(0.8, 1.3);
    const newHolders = Math.max(1, t.holders + randInt(-3, 8));
    const newSocialMentions = Math.max(0, t.socialMentions + randInt(-20, 30));
    const priceHistory = [...t.priceHistory.slice(1), newPrice];
    const volumeHistory = [...t.volumeHistory.slice(1), t.volume1h * volumeChange];
    const holderHistory = [...t.holderHistory.slice(1), newHolders];

    const newPriceChange1m = (newPrice / t.price - 1) * 100;
    const newPriceChange1h = t.priceChange1h + priceDrift * 100;
    const newRiskScore = Math.min(100, Math.max(0, t.riskScore + rand(-3, 3)));

    const newToken: Token = {
      ...t,
      price: newPrice,
      holders: newHolders,
      holderGrowth1h: t.holderGrowth1h + rand(-2, 3),
      socialMentions: newSocialMentions,
      socialMentionsChange: t.socialMentionsChange + rand(-10, 15),
      volume1h: t.volume1h * volumeChange,
      volume24h: t.volume24h * volumeChange * 0.95,
      liquidity: t.liquidity * (1 + rand(-0.02, 0.02)),
      marketCap: newPrice * (t.marketCap / t.price),
      fdv: newPrice * (t.fdv / t.price),
      priceChange1m: newPriceChange1m,
      priceChange5m: t.priceChange5m * 0.95 + newPriceChange1m * 0.05,
      priceChange15m: t.priceChange15m * 0.97 + newPriceChange1m * 0.03,
      priceChange1h: newPriceChange1h,
      priceChange24h: t.priceChange24h * 0.99 + priceDrift * 100 * 0.01,
      txns1m: randInt(1, 50),
      txns5m: t.txns5m + randInt(-5, 10),
      txns1h: t.txns1h + randInt(-20, 40),
      buyers1h: t.buyers1h + randInt(-5, 15),
      sellers1h: t.sellers1h + randInt(-5, 12),
      ageMinutes: t.ageMinutes + 0.05,
      priceHistory,
      volumeHistory,
      holderHistory,
      riskScore: newRiskScore,
      riskLevel: calcRiskLevel(newRiskScore, t.ageMinutes + 0.05),
      recentTxns: genTxns(newPrice, 15, t.ageMinutes),
    };

    newToken.aiScore = calcAiScore(newToken);
    return newToken;
  });

  // Occasionally add a new token
  if (Math.random() < 0.3 && tokens.length < 50) {
    const newToken = genToken(tokens.length, true);
    tokens.unshift(newToken);
  }

  return tokens;
}

// Twitter data — real accounts from the Solana memecoin ecosystem
const REAL_ACCOUNTS: {
  name: string;
  handle: string;
  followers: number;
  verified: boolean;
  category: NotableAccount['category'];
  bio: string;
}[] = [
  { name: 'Solana Legend', handle: 'SolanaLegend', followers: 142000, verified: true, category: 'alpha-caller', bio: 'On-chain alpha hunter. Finding gems before they pump. Not financial advice.' },
  { name: 'Moonshot', handle: 'moonshot', followers: 89000, verified: true, category: 'influencer', bio: 'Tracking the best Solana memecoins. DYOR. I ape first, think later.' },
  { name: 'DegenSpartan', handle: 'DegenSpartan', followers: 67000, verified: false, category: 'whale', bio: 'Whale wallet watcher. I move markets. Sometimes I tell you before.' },
  { name: 'Ansem', handle: 'blknoiz06', followers: 215000, verified: true, category: 'alpha-caller', bio: 'Wrote the book on memecoin trading. Literally. Early to everything.' },
  { name: 'PumpFun Live', handle: 'pumpdotfun', followers: 178000, verified: true, category: 'dev', bio: 'The fair launch platform on Solana. New tokens every minute.' },
  { name: 'Frank Degods', handle: 'frankdegods', followers: 54000, verified: true, category: 'influencer', bio: 'NFTs turned memecoin degen. Building on Solana. YOLO.' },
  { name: 'Slime', handle: 'slime_777', followers: 41000, verified: false, category: 'alpha-caller', bio: 'Sniping pump.fun graduations since 2024. 60% hit rate. No chat.' },
  { name: 'Tree News', handle: 'TreeOfAlpha', followers: 312000, verified: true, category: 'influencer', bio: 'Breaking news and alerts. First to report everything crypto.' },
  { name: 'Bourbon', handle: 'BourbonBnb', followers: 78000, verified: true, category: 'alpha-caller', bio: 'Multi-chain degen. Solana, Base, Sui. I find the narratives early.' },
  { name: '0xMert', handle: '0xMert', followers: 95000, verified: true, category: 'influencer', bio: 'Solana maxi. Memecoin enthusiast. I read charts so you do not have to.' },
];

function genTweet(symbol?: string): Tweet {
  const sym = symbol ?? pick(TOKEN_NAMES).symbol;
  const bullishTemplates = [
    `${sym} is about to absolutely send 🚀 chart looks incredible, volume just doubled`,
    `Just swapped into ${sym}, this is the next 100x for sure. DYOR but look at that chart`,
    `Smart money just aped ${sym}, I'm following the whales on this one`,
    `${sym} holder count is exploding, +200 in the last hour alone. Don't miss this`,
    `The narrative on ${sym} is too strong, this goes to 9 figures. Early af`,
    `${sym} just graduated from pump.fun and the chart is parabolic. Not selling`,
    `Everyone sleeping on ${sym} but the on-chain data says otherwise. Loading more`,
    `${sym} liquidity just doubled and volume is insane. This is the one`,
  ];
  const bearishTemplates = [
    `${sym} dev just sold a big bag 🚨 rug incoming, get out while you can`,
    `Be careful with ${sym}, liquidity is getting pulled. Seen this pattern before`,
    `${sym} chart is broken, I'm out. Take profits while you still can`,
    `Top holders of ${sym} are dumping on retail. Classic exit liquidity setup`,
    `${sym} mint authority not revoked — this is a ticking time bomb`,
    `Just got rug pulled on ${sym}. Dev dumped 30% of supply in one tx. Be careful out there`,
  ];
  const neutralTemplates = [
    `Watching ${sym} closely, volume is picking up but need to see more holders`,
    `${sym} just graduated from pump.fun, interesting setup but waiting for confirmation`,
    `Anyone in ${sym}? What's the consensus? Chart looks decent but risk is high`,
    `${sym} is consolidating nicely, waiting for a breakout above resistance`,
    `New pair alert: ${sym} just launched on pump.fun. Watching the first 10 minutes`,
  ];

  const sentiment: Tweet['sentiment'] = Math.random() < 0.55 ? 'bullish' : Math.random() < 0.7 ? 'bearish' : 'neutral';
  const templates = sentiment === 'bullish' ? bullishTemplates : sentiment === 'bearish' ? bearishTemplates : neutralTemplates;
  const content = pick(templates);
  const account = pick(REAL_ACCOUNTS);

  return {
    id: `tweet_${Math.random()}_${Date.now()}`,
    author: account.name,
    handle: account.handle,
    avatar: '',
    profileUrl: `https://x.com/${account.handle}`,
    postUrl: `https://x.com/${account.handle}/status/${randInt(1700000000000000000, 1850000000000000000)}`,
    content,
    likes: randInt(5, account.followers / 50),
    retweets: randInt(1, account.followers / 100),
    replies: randInt(0, account.followers / 200),
    views: randInt(100, account.followers * 2),
    timestamp: Date.now() - randInt(0, 3600 * 1000),
    verified: account.verified,
    influenceScore: Math.min(98, Math.floor(account.followers / 3000)),
    tokensMentioned: [sym],
    sentiment,
    sentimentScore: sentiment === 'bullish' ? rand(0.2, 1) : sentiment === 'bearish' ? rand(-1, -0.2) : rand(-0.2, 0.2),
  };
}

export function getTweets(count = 20): Tweet[] {
  const tweets: Tweet[] = [];
  for (let i = 0; i < count; i++) {
    tweets.push(genTweet());
  }
  return tweets.sort((a, b) => b.timestamp - a.timestamp);
}

export function getTwitterTrends(): TwitterTrend[] {
  const trends: TwitterTrend[] = [];
  const shuffled = [...TOKEN_NAMES].sort(() => Math.random() - 0.5).slice(0, 12);
  for (const t of shuffled) {
    const mentions = randInt(50, 5000);
    const sentiment: TwitterTrend['sentiment'] = Math.random() < 0.6 ? 'bullish' : Math.random() < 0.75 ? 'bearish' : 'neutral';
    trends.push({
      id: `trend_${t.symbol}`,
      term: `${t.symbol}`,
      tokenSymbol: t.symbol,
      mentions,
      mentionsChange: rand(-30, 500),
      sentiment,
      sentimentScore: sentiment === 'bullish' ? rand(0.3, 1) : sentiment === 'bearish' ? rand(-1, -0.3) : rand(-0.3, 0.3),
      uniqueAccounts: randInt(20, 800),
      topPost: genTweet(t.symbol),
    });
  }
  return trends.sort((a, b) => b.mentions - a.mentions);
}

export function getNotableAccounts(): NotableAccount[] {
  const calls = [
    'Called the bottom on $BONK at $0.000002',
    'Spotted $WIF early at $0.03',
    'Warned of $SLERF rug before the dump',
    'Called $MOODENG 10x from launch',
    'Identified $GOAT accumulation pattern',
    'Flagged $FARTCOIN dev wallet sell-off',
    'Called $PNUT top within 5% accuracy',
    'Early on $POPCAT before 50x run',
    'Warned about $BOME liquidity pull',
    'Called $AI16Z bottom and rode it 8x',
  ];

  return REAL_ACCOUNTS.map((acc, i) => ({
    id: `account_${i}`,
    name: acc.name,
    handle: acc.handle,
    avatar: '',
    profileUrl: `https://x.com/${acc.handle}`,
    followers: acc.followers,
    verified: acc.verified,
    category: acc.category,
    bio: acc.bio,
    recentCall: calls[i] ?? `Called ${pick(TOKEN_NAMES).symbol} early`,
    callAccuracy: rand(45, 92),
    avgEngagement: Math.floor(acc.followers * rand(0.002, 0.05)),
  })).sort((a, b) => b.callAccuracy - a.callAccuracy);
}

export function getAIInsights(tokens: Token[]): AIInsight[] {
  const insights: AIInsight[] = [];
  const topOpportunities = [...tokens]
    .filter(t => t.riskLevel !== 'high-risk')
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, 3);

  for (const token of topOpportunities) {
    insights.push({
      id: `insight_opp_${token.id}`,
      type: 'opportunity',
      title: `${token.symbol} showing strong momentum signals`,
      description: `${token.symbol} has an AI Signal Score of ${token.aiScore} driven by ${token.priceChange1h > 0 ? 'positive price momentum' : 'accumulation patterns'}, ${formatInsightMetric(token.volume1h, 'volume')}, and ${token.holderGrowth1h > 0 ? 'growing' : 'stable'} holder count. Social mentions ${token.socialMentionsChange > 0 ? 'are increasing' : 'remain steady'} with ${token.socialSentiment > 0 ? 'bullish' : 'mixed'} sentiment. Risk level: ${token.riskLevel}.`,
      tokens: [token.symbol],
      confidence: token.aiScore,
      timestamp: Date.now() - randInt(0, 3600 * 1000),
    });
  }

  const riskyTokens = tokens.filter(t => t.riskLevel === 'high-risk').slice(0, 2);
  for (const token of riskyTokens) {
    insights.push({
      id: `insight_risk_${token.id}`,
      type: 'risk',
      title: `${token.symbol} flagged for elevated risk`,
      description: `${token.symbol} has a risk score of ${token.riskScore}. ${token.riskFlags[0]?.description ?? 'Multiple risk indicators detected.'} Proceed with extreme caution.`,
      tokens: [token.symbol],
      confidence: token.riskScore,
      timestamp: Date.now() - randInt(0, 3600 * 1000),
    });
  }

  insights.push({
    id: 'insight_summary_1',
    type: 'summary',
    title: 'Market Overview',
    description: `${tokens.filter(t => t.riskLevel === 'early').length} early-stage tokens detected with developing momentum. ${tokens.filter(t => t.graduated).length} tokens have graduated from launch platforms. Social sentiment is ${tokens.reduce((acc, t) => acc + t.socialSentiment, 0) > 0 ? 'net bullish' : 'mixed'} across tracked memecoins. Volume concentration is shifting toward newer launches on pump.fun.`,
    tokens: [],
    confidence: 78,
    timestamp: Date.now(),
  });

  return insights;
}

function formatInsightMetric(value: number, type: string): string {
  if (type === 'volume') {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M in 1h volume`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K in 1h volume`;
    return `${value.toFixed(0)} in 1h volume`;
  }
  return `${value}`;
}
