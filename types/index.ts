export interface Asset {
  id: string;
  type: 'original' | 'mask' | 'output';
  url: string;
  mime: string;
  width: number;
  height: number;
  checksum: string;
}

export interface Generation {
  id: string;
  prompt: string;
  parameters: {
    seed?: number;
    temperature?: number;
  };
  sourceAssets: Asset[];
  outputAssets: Asset[];
  modelVersion: string;
  timestamp: number;
  costEstimate?: number;
}

export interface Edit {
  id: string;
  parentGenerationId: string;
  maskAssetId?: string;
  maskReferenceAsset?: Asset;
  instruction: string;
  outputAssets: Asset[];
  timestamp: number;
}

export interface Project {
  id: string;
  title: string;
  generations: Generation[];
  edits: Edit[];
  createdAt: number;
  updatedAt: number;
}

export interface SegmentationMask {
  id: string;
  imageData: ImageData;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  feather: number;
}

export interface BrushStroke {
  id: string;
  points: number[];
  brushSize: number;
  color: string;
}

export interface PromptHint {
  category: 'subject' | 'scene' | 'action' | 'style' | 'camera';
  text: string;
  example: string;
}

// Hero Component Types
export interface VideoClip {
  imgsrc: string;
  clip: string;
}

export interface SocialLinkItem {
  icon: string;
  href?: string;
}

export interface HeroData {
  title: string;
  subtitle: string;
  btntext: string;
  btnHref?: string;
  img: string;
  videos?: VideoClip[];
  sociallinks?: SocialLinkItem[];
}

// Stories Component Types
export interface StoryItem {
  img: string;
  title: string;
  text: string;
  like: string | number;
  time: string;
  by: string;
  btn: string;
  url: string;
}

export interface StoriesData {
  title: string;
  subtitle?: string;
  news: StoryItem[];
}

// FAQ Component Types
export interface FAQData {
  title: string;
  subtitle: string;
  items: {
    question: string;
    answer: string;
  }[];
}