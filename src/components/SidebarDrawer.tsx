import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Palette, 
  Sticker as StickerIcon, 
  Type, 
  Share2, 
  Sparkles, 
  Trash2, 
  Plus, 
  Check, 
  RefreshCw, 
  Volume2, 
  VolumeX,
  LayoutGrid
} from 'lucide-react';
import { CalendarConfig, FontStyle, PaperPattern, PaperEdgeStyle, Sticker } from '../types';
import { PAPER_THEMES, CANVAS_THEMES, DEFAULT_STICKERS, ITALIAN_QUOTES } from '../data/defaults';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: CalendarConfig;
  onUpdateConfig: (newConfig: CalendarConfig) => void;
  onReset: () => void;
  onOpenEmbed: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  onReset,
  onOpenEmbed,
}) => {
  const [activeTab, setActiveTab] = useState<'theme' | 'stickers' | 'text' | 'export'>('theme');
  const [customTextSticker, setCustomTextSticker] = useState('');
  const [customBadgeColor, setCustomBadgeColor] = useState('#E63946');

  // Spawn new sticker onto page
  const handleAddSticker = (stickerTemplate: Partial<Sticker>) => {
    const newSticker: Sticker = {
      id: `sticker-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: stickerTemplate.type || 'emoji',
      content: stickerTemplate.content || '⭐',
      x: 20 + Math.random() * 45,
      y: 15 + Math.random() * 50,
      rotation: Math.floor(Math.random() * 30) - 15,
      scale: 1,
      zIndex: config.stickers.length + 10,
      bgColor: stickerTemplate.bgColor,
      color: stickerTemplate.color,
    };

    onUpdateConfig({
      ...config,
      stickers: [...config.stickers, newSticker],
    });
  };

  const handleAddCustomTextBadge = () => {
    if (!customTextSticker.trim()) return;
    handleAddSticker({
      type: 'badge',
      content: customTextSticker.trim(),
      bgColor: customBadgeColor,
      color: '#FFFFFF',
    });
    setCustomTextSticker('');
  };

  const handleRandomQuote = () => {
    const random = ITALIAN_QUOTES[Math.floor(Math.random() * ITALIAN_QUOTES.length)];
    onUpdateConfig({
      ...config,
      agendaContent: { ...config.agendaContent, quote: random },
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40"
          />

          {/* SLIDE-OUT DRAWER PANEL */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-stone-900 text-stone-100 z-50 shadow-2xl border-l border-stone-800 flex flex-col"
          >
            {/* DRAWER HEADER */}
            <div className="p-4 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-stone-100">Personalizza Agenda</h2>
                  <p className="text-xs text-stone-400">Temi, colori, sticker e frasi</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TAB NAVIGATION */}
            <div className="grid grid-cols-4 p-2 bg-stone-950 border-b border-stone-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('theme')}
                className={`py-2 px-1 rounded-lg flex flex-col items-center gap-1 transition ${
                  activeTab === 'theme'
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Tema</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('stickers')}
                className={`py-2 px-1 rounded-lg flex flex-col items-center gap-1 transition ${
                  activeTab === 'stickers'
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <StickerIcon className="w-4 h-4" />
                <span>Sticker</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('text')}
                className={`py-2 px-1 rounded-lg flex flex-col items-center gap-1 transition ${
                  activeTab === 'text'
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Type className="w-4 h-4" />
                <span>Testi</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('export')}
                className={`py-2 px-1 rounded-lg flex flex-col items-center gap-1 transition ${
                  activeTab === 'export'
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Share2 className="w-4 h-4" />
                <span>Embed</span>
              </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* TAB 1: THEME & COLORS */}
              {activeTab === 'theme' && (
                <div className="space-y-6 text-xs">
                  {/* PAPER COLOR THEMES */}
                  <div>
                    <label className="font-bold text-stone-300 uppercase tracking-wider block mb-3">
                      Stile & Copertina Agenda:
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {PAPER_THEMES.map((theme) => {
                        const isSelected = config.themeId === theme.id;
                        return (
                          <button
                            key={theme.id}
                            type="button"
                            onClick={() => onUpdateConfig({ ...config, themeId: theme.id })}
                            className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition relative overflow-hidden group ${
                              isSelected
                                ? 'border-amber-400 ring-2 ring-amber-400/40 bg-stone-800'
                                : 'border-stone-800 hover:border-stone-700 bg-stone-900/60'
                            }`}
                          >
                            {/* MINIATURE AGENDA BINDER PREVIEW ICON */}
                            <div
                              className="w-14 h-16 rounded-lg shadow-md border border-white/20 p-1 flex flex-col justify-between shrink-0 relative overflow-hidden"
                              style={{ background: theme.coverBg }}
                            >
                              {/* Ring dots */}
                              <div className="flex justify-around items-center">
                                {[1, 2, 3, 4].map((r) => (
                                  <div key={r} className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-xs border border-black/40" />
                                ))}
                              </div>
                              {/* Inner paper preview leaf */}
                              <div
                                className="w-full h-10 rounded-xs shadow-inner p-1 flex flex-col justify-between"
                                style={{ backgroundColor: theme.paperBg }}
                              >
                                <div className="h-2.5 rounded-xs w-full" style={{ backgroundColor: theme.headerBg }} />
                                <div className="h-0.5 rounded w-3/4 opacity-40" style={{ backgroundColor: theme.textColor }} />
                                <div className="h-0.5 rounded w-1/2 opacity-40" style={{ backgroundColor: theme.textColor }} />
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <span className="font-bold block text-sm text-white truncate">
                                {theme.name}
                              </span>
                              <span className="text-[11px] text-stone-400 block truncate">
                                Copertina: {theme.paperColorName}
                              </span>
                            </div>

                            {isSelected && (
                              <div className="p-1.5 bg-amber-500 text-stone-950 rounded-full font-bold">
                                <Check className="w-4 h-4 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* PAPER PATTERNS */}
                  <div>
                    <label className="font-bold text-stone-300 uppercase tracking-wider block mb-3">
                      Bordo del Foglio:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'polygon-torn', name: '✂️ Strappato Vivace' },
                        { id: 'torn-top-bottom', name: '📄 Strappo Classico' },
                        { id: 'spiral-top', name: '🌀 Spirale Vintage' },
                        { id: 'stamp-edge', name: '✉️ Bordo Zig-Zag' },
                      ].map((e) => (
                        <button
                          key={e.id}
                          type="button"
                          onClick={() =>
                            onUpdateConfig({ ...config, edgeStyle: e.id as PaperEdgeStyle })
                          }
                          className={`p-2.5 rounded-xl border font-bold transition text-center text-xs ${
                            config.edgeStyle === e.id
                              ? 'bg-amber-500 text-stone-950 border-amber-400'
                              : 'bg-stone-800/60 border-stone-700 text-stone-300 hover:bg-stone-700'
                          }`}
                        >
                          {e.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* PAPER PATTERNS */}
                  <div>
                    <label className="font-bold text-stone-300 uppercase tracking-wider block mb-3">
                      Trama della Carta:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'lines', name: 'Righe' },
                        { id: 'dots', name: 'Puntini' },
                        { id: 'grid', name: 'Quadretti' },
                        { id: 'blank', name: 'Liscio' },
                        { id: 'linen', name: 'Tessuto' },
                      ].map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() =>
                            onUpdateConfig({ ...config, pattern: p.id as PaperPattern })
                          }
                          className={`p-2.5 rounded-xl border font-bold transition text-center ${
                            config.pattern === p.id
                              ? 'bg-amber-500 text-stone-950 border-amber-400'
                              : 'bg-stone-800/60 border-stone-700 text-stone-300 hover:bg-stone-700'
                          }`}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* FONT STYLE */}
                  <div>
                    <label className="font-bold text-stone-300 uppercase tracking-wider block mb-3">
                      Stile Carattere (Font):
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'handwriting', name: 'A Mano (Scrittura)', font: 'font-handwriting text-base' },
                        { id: 'typewriter', name: 'Macchina da Scrivere', font: 'font-typewriter' },
                        { id: 'serif', name: 'Serif Elegante', font: 'font-serif-display' },
                        { id: 'sans', name: 'Moderno Pulito', font: 'font-sans-clean' },
                        { id: 'playful', name: 'Cicciotto e Carino', font: 'font-playful' },
                      ].map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() =>
                            onUpdateConfig({ ...config, fontStyle: f.id as FontStyle })
                          }
                          className={`p-3 rounded-xl border text-left font-medium transition ${f.font} ${
                            config.fontStyle === f.id
                              ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold'
                              : 'bg-stone-800/60 border-stone-700 text-stone-300 hover:bg-stone-700'
                          }`}
                        >
                          {f.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CANVAS DESK BACKGROUND */}
                  <div>
                    <label className="font-bold text-stone-300 uppercase tracking-wider block mb-3">
                      Sfondo dell'App (Scrivania):
                    </label>
                    <div className="space-y-2">
                      {CANVAS_THEMES.map((canvas) => (
                        <button
                          key={canvas.id}
                          type="button"
                          onClick={() =>
                            onUpdateConfig({ ...config, canvasThemeId: canvas.id })
                          }
                          className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                            config.canvasThemeId === canvas.id
                              ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold'
                              : 'bg-stone-800/60 border-stone-700 text-stone-300 hover:bg-stone-700'
                          }`}
                        >
                          <span>{canvas.name}</span>
                          {config.canvasThemeId === canvas.id && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: STICKERS & ACCESSORIES */}
              {activeTab === 'stickers' && (
                <div className="space-y-6 text-xs">
                  {/* CUSTOM TEXT STICKER CREATOR */}
                  <div className="p-3 bg-stone-800/80 rounded-2xl border border-stone-700 space-y-2">
                    <label className="font-bold text-amber-400 block uppercase">
                      Crea Scritta Personalizzata:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customTextSticker}
                        onChange={(e) => setCustomTextSticker(e.target.value)}
                        placeholder="Es: RICEVUTA, SHOPPING..."
                        className="flex-1 bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-700 text-white outline-none focus:border-amber-400"
                      />
                      <input
                        type="color"
                        value={customBadgeColor}
                        onChange={(e) => setCustomBadgeColor(e.target.value)}
                        className="w-8 h-8 rounded border border-stone-700 cursor-pointer bg-transparent"
                        title="Colore Sfondo"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomTextBadge}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* STICKER PACKS */}
                  <div>
                    <label className="font-bold text-stone-300 uppercase tracking-wider block mb-3">
                      Tocca per Aggiungere sul Foglio:
                    </label>
                    <div className="grid grid-cols-4 gap-2.5">
                      {DEFAULT_STICKERS.map((st, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleAddSticker(st)}
                          className="p-3 bg-stone-800/60 hover:bg-stone-700 border border-stone-700 rounded-xl flex items-center justify-center text-2xl transition hover:scale-105 active:scale-95"
                        >
                          {st.type === 'emoji' && st.content}
                          {st.type === 'pin' && st.content}
                          {st.type === 'badge' && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-black truncate max-w-full">
                              {st.content}
                            </span>
                          )}
                          {st.type === 'stamp' && (
                            <span className="text-[9px] font-bold border px-1 border-red-400 text-red-400 uppercase">
                              {st.content}
                            </span>
                          )}
                          {st.type === 'tape' && (
                            <div className="w-full h-3 bg-amber-200/80 rounded-xs" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CLEAR ALL STICKERS */}
                  {config.stickers.length > 0 && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => onUpdateConfig({ ...config, stickers: [] })}
                        className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-bold rounded-xl flex items-center justify-center gap-2 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Rimuovi Tutti gli Sticker ({config.stickers.length})</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: TEXT & CONTENT SECTIONS */}
              {activeTab === 'text' && (
                <div className="space-y-5 text-xs">
                  {/* TITLE INPUT */}
                  <div>
                    <label className="font-bold text-stone-300 uppercase tracking-wider block mb-2">
                      Intestazione Agenda:
                    </label>
                    <input
                      type="text"
                      value={config.agendaContent.customTitle}
                      onChange={(e) =>
                        onUpdateConfig({
                          ...config,
                          agendaContent: {
                            ...config.agendaContent,
                            customTitle: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-stone-800 p-3 rounded-xl border border-stone-700 text-white outline-none focus:border-amber-400 font-bold text-sm"
                    />
                  </div>

                  {/* QUOTE SECTION WITH RANDOMIZER */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-bold text-stone-300 uppercase tracking-wider">
                        Pensiero / Frase del Giorno:
                      </label>
                      <button
                        type="button"
                        onClick={handleRandomQuote}
                        className="text-amber-400 flex items-center gap-1 hover:underline font-bold"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Genera Casuale</span>
                      </button>
                    </div>
                    <textarea
                      value={config.agendaContent.quote}
                      onChange={(e) =>
                        onUpdateConfig({
                          ...config,
                          agendaContent: {
                            ...config.agendaContent,
                            quote: e.target.value,
                          },
                        })
                      }
                      rows={3}
                      className="w-full bg-stone-800 p-3 rounded-xl border border-stone-700 text-white outline-none focus:border-amber-400 font-serif"
                    />
                  </div>

                  {/* TOGGLE SECTION VISIBILITY */}
                  <div>
                    <label className="font-bold text-stone-300 uppercase tracking-wider block mb-3">
                      Mostra/Nascondi Sezioni:
                    </label>
                    <div className="space-y-2">
                      {[
                        { key: 'showQuote', label: 'Pensiero del Giorno' },
                        { key: 'showFocus', label: 'Obiettivo Principale' },
                        { key: 'showTodos', label: 'Lista Cose da Fare' },
                        { key: 'showNotes', label: 'Area Note e Appunti' },
                        { key: 'showWater', label: 'Bicchieri d\'Acqua' },
                        { key: 'showMood', label: 'Umore e Meteo' },
                      ].map(({ key, label }) => {
                        const isVisible = (config.agendaContent as any)[key];
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() =>
                              onUpdateConfig({
                                ...config,
                                agendaContent: {
                                  ...config.agendaContent,
                                  [key]: !isVisible,
                                },
                              })
                            }
                            className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between font-bold transition ${
                              isVisible
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-stone-800/40 text-stone-500 border-stone-800'
                            }`}
                          >
                            <span>{label}</span>
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center border ${
                                isVisible
                                  ? 'bg-amber-400 border-amber-400 text-black'
                                  : 'border-stone-600'
                              }`}
                            >
                              {isVisible && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: EXPORT & EMBED */}
              {activeTab === 'export' && (
                <div className="space-y-5 text-xs">
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-200 space-y-2">
                    <h4 className="font-bold text-sm flex items-center gap-1.5 text-amber-300">
                      <Sparkles className="w-4 h-4" />
                      <span>Integra nel tuo Sito</span>
                    </h4>
                    <p className="text-stone-300 leading-relaxed">
                      Usa il nostro generatore di codice HTML iFrame o scarica la grafica ad alta risoluzione da inserire nella tua pagina web o blog.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenEmbed();
                      }}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl transition shadow-md"
                    >
                      Apri Finestra Embed & Codice
                    </button>
                  </div>

                  {/* RESET BUTTON */}
                  <div className="pt-4 border-t border-stone-800">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Sei sicuro di voler ripristinare la configurazione iniziale?')) {
                          onReset();
                        }
                      }}
                      className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold rounded-xl border border-stone-700 transition flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Ripristina Configurazione Iniziale</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
