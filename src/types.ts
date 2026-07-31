export type PaperPattern = 'lines' | 'grid' | 'dots' | 'blank' | 'linen';

export type PaperEdgeStyle = 'torn-bottom' | 'torn-top-bottom' | 'spiral-top' | 'stamp-edge' | 'polygon-torn';

export type FontStyle = 'handwriting' | 'typewriter' | 'serif' | 'sans' | 'playful';

export interface PaperTheme {
  id: string;
  name: string;
  coverBg: string; // Gradient/color for outer binder cover
  coverBorder: string; // Stitched or metallic edge color
  ringColor: 'gold' | 'silver' | 'bronze' | 'rose-gold' | 'black';
  paperBg: string;
  paperColorName: string;
  linesColor: string;
  textColor: string;
  accentColor: string;
  shadowColor: string;
  headerBg: string;
  headerTextColor: string;
}

export interface CanvasTheme {
  id: string;
  name: string;
  bgClass: string;
  textureOverlay?: string;
  isTransparent?: boolean;
}

export interface Sticker {
  id: string;
  type: 'emoji' | 'tape' | 'badge' | 'text' | 'stamp' | 'pin';
  content: string; // Emoji char, text string, or preset SVG key
  x: number; // percentage or px position relative to page
  y: number;
  rotation: number; // in degrees
  scale: number;
  zIndex: number;
  color?: string;
  bgColor?: string;
  fontFamily?: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface AgendaContent {
  customTitle: string;
  quote: string;
  mainFocus: string;
  todos: TodoItem[];
  notes: string;
  mood: string; // emoji or code
  weather: string;
  waterGlasses: number; // 0 to 8
  showQuote: boolean;
  showFocus: boolean;
  showTodos: boolean;
  showNotes: boolean;
  showMood: boolean;
  showWater: boolean;
}

export interface CalendarConfig {
  themeId: string;
  canvasThemeId: string;
  fontStyle: FontStyle;
  edgeStyle: PaperEdgeStyle;
  pattern: PaperPattern;
  agendaContent: AgendaContent;
  stickers: Sticker[];
  soundEffects: boolean;
}
