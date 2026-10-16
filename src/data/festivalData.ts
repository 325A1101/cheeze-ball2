import { MenuItem, RoulettePrize, LyricLine } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'pack-3',
    name: 'おてがる3個パック',
    shortName: '3個入り',
    ballsCount: 3,
    price: 300,
    badge: '大人気・定番！',
    badgeColor: 'bg-emerald-500 text-white',
    description: '外はカリッ＆サクッ！中はとろ〜り濃厚モッツァレラ。食べ歩きにぴったりのジャストサイズ！',
    features: ['揚げたてアツアツ', 'モッツァレラ100%', '選べる無料パウダー付き'],
    hasRoulette: false,
    imageIcon: '🧀'
  },
  {
    id: 'pack-5-roulette',
    name: '大満足5個パック ＋ おまけルーレット付き！',
    shortName: '5個入り(ルーレット付)',
    ballsCount: 5,
    price: 500,
    badge: '超おすすめ！★特典付き',
    badgeColor: 'bg-rose-500 text-white animate-pulse',
    description: 'みんなでシェアしても良し！超お得な5個入り。さらにその場で豪華賞品が当たる特製おまけルーレット挑戦権つき！',
    features: ['★豪華おまけルーレット挑戦権！', 'ハズレなし！何かが必ず当たる', 'シェアにも最適なボリューム', '増量最大＋2個チャンス！'],
    hasRoulette: true,
    imageIcon: '👑'
  }
];

export const TOPPINGS = [
  { id: 'top-honey', name: '特製ハニーバターソース', price: 50, icon: '🍯', note: '甘じょっぱい中毒性No.1' },
  { id: 'top-chili', name: '激ウマスパイシーチリ', price: 50, icon: '🌶️', note: 'ピリッとホットな刺激' },
  { id: 'top-cheddar', name: '追いがけチェダーパウダー', price: 50, icon: '🧀', note: 'ダブルチーズの極み' },
  { id: 'top-sugar', name: '魔法のシュガーパウダー', price: 0, icon: '✨', note: '韓国屋台直伝の甘塩テイスト' }
];

export const DRINKS = [
  { id: 'drk-cola', name: '爽快クラフトコーラ', price: 150, icon: '🥤' },
  { id: 'drk-melon', name: 'メロンソーダフロート風', price: 150, icon: '🍈' },
  { id: 'drk-tea', name: 'すっきりアイス烏龍茶', price: 100, icon: '🧋' }
];

export const ROULETTE_PRIZES: RoulettePrize[] = [
  {
    id: 1,
    name: '特賞！チーズボール＋2個大増量！',
    subText: '合計7個にパワーアップ！大満足MAX！',
    color: '#ef4444',
    textColor: '#ffffff',
    icon: '👑',
    probability: 0.15,
    winMessage: '奇跡の大当たり！チーズボールが＋2個（合計7個）に超増量！アツアツを独り占めしよう！'
  },
  {
    id: 2,
    name: '特製ハニーバターソース無料！',
    subText: '甘じょっぱさがクセになる極上ソース',
    color: '#f59e0b',
    textColor: '#ffffff',
    icon: '🍯',
    probability: 0.20,
    winMessage: '甘じょっぱさ炸裂！「特製ハニーバターソース」をその場で無料トッピング！'
  },
  {
    id: 3,
    name: 'チーズボール＋1個増量！',
    subText: '合計6個で大ボリューム！',
    color: '#10b981',
    textColor: '#ffffff',
    icon: '🧀',
    probability: 0.20,
    winMessage: 'ラッキー！チーズボールが＋1個（合計6個）に増量！とろ〜り伸びる幸せがもう1個！'
  },
  {
    id: 4,
    name: '激ウマスパイシーチリ無料！',
    subText: 'やみつき旨辛パウダー無料プレゼント',
    color: '#ec4899',
    textColor: '#ffffff',
    icon: '🌶️',
    probability: 0.20,
    winMessage: '刺激的！「激ウマスパイシーチリ」無料トッピング！チーズの甘みと旨辛のハーモニー！'
  },
  {
    id: 5,
    name: 'AI専攻謹製『合格・神バグ除け』ステッカー',
    subText: '情報システム学科AIプログラミング専攻限定！',
    color: '#8b5cf6',
    textColor: '#ffffff',
    icon: '💻',
    probability: 0.15,
    winMessage: 'エンジニア必携！AI専攻2年が祈願した「エラー撲滅＆神バグ除け」ホログラムステッカー！'
  },
  {
    id: 6,
    name: '感謝のBIGスマイル＆追いがけチーズ',
    subText: 'スタッフの元気100%とおまけパウダー！',
    color: '#06b6d4',
    textColor: '#ffffff',
    icon: '💖',
    probability: 0.10,
    winMessage: 'AIプログラミング専攻一同からの全力ビッグスマイル＆追いチーズパウダー無料サービス！'
  }
];

export const SONG_LYRICS: LyricLine[] = [
  { timeSec: 0, text: '♪（アゲアゲなイントロ！手拍子いくよー！）', subText: 'Clap your hands!', accent: false },
  { timeSec: 10, text: 'Hey! Hey! Ho! Let\'s go! 1, 2, 3, Go!', subText: '掛け声全開！', accent: true },
  { timeSec: 25, text: '1, 2, 3, Ha!', subText: 'Ready?', accent: true },
  { timeSec: 26, text: 'お腹が空いたら集まろう（フゥ！）', subText: 'みんなで屋台へGO！', accent: false },
  { timeSec: 29, text: 'みんなの笑顔がはじけちゃう', subText: '熱々サクサク！', accent: false },
  { timeSec: 32, text: '熱々の魔法をかけるから', subText: '黄金色のチーズボール', accent: false },
  { timeSec: 35, text: '準備はいいかい？ 手を叩け！', subText: 'パパン！パン！', accent: true },
  { timeSec: 38, text: '文化祭の主役はこれ！', subText: '学園祭No.1屋台！', accent: true },
  { timeSec: 42, text: 'サクサク食感止まらない', subText: '一口かじれば至福の音', accent: false },
  { timeSec: 45, text: '熱々のままで召し上がれ！', subText: '揚げたて最高！', accent: false },
  { timeSec: 48, text: 'チーズが伸びる チーズボール！', subText: 'どこまでも伸び〜る！🧀✨', accent: true },
  { timeSec: 51, text: 'とろける美味しさ止まらない', subText: 'モッツァレラがトロトロ', accent: false },
  { timeSec: 54, text: 'みんなでハッピー チーズボール！', subText: '笑顔が広がる！', accent: true },
  { timeSec: 59, text: 'Go Go チーズボール！', subText: '盛り上がっていこう！🔥', accent: true },
  { timeSec: 62, text: 'Go Go チーズボール！', subText: 'おかわりも大歓迎！⚡', accent: true },
  { timeSec: 65, text: 'Go Go チーズボール！', subText: 'ルーレットも回しちゃお！🎉', accent: true },
  { timeSec: 68, text: '最後の一口まで笑顔で', subText: '最高の思い出を！', accent: false },
  { timeSec: 73, text: 'サクサク 伸びる チーズボール！ Yeah!', subText: 'ごちそうさまでした！大歓声！🙌', accent: true },
  { timeSec: 80, text: '♪（最高潮のアウトロ！アンコール大歓迎！）', subText: 'Thank you for coming!', accent: false }
];
