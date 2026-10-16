export interface MenuItem {
  id: string;
  name: string;
  shortName: string;
  ballsCount: number;
  price: number;
  badge: string;
  badgeColor: string;
  description: string;
  features: string[];
  hasRoulette: boolean;
  imageIcon: string;
}

export interface RoulettePrize {
  id: number;
  name: string;
  subText: string;
  color: string;
  textColor: string;
  icon: string;
  probability: number;
  winMessage: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  details?: string;
}

export interface LyricLine {
  timeSec: number;
  text: string;
  subText?: string;
  accent?: boolean;
}
