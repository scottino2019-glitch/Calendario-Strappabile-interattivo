import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Scissors, 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Droplet, 
  Sparkles,
  Quote,
  Palette,
  Code
} from 'lucide-react';
import { CalendarConfig, PaperTheme, Sticker } from '../types';
import { PAPER_THEMES } from '../data/defaults';
import { StickerLayer } from './StickerLayer';

interface TornPaperCalendarProps {
  config: CalendarConfig;
  onUpdateConfig: (newConfig: CalendarConfig) => void;
  onTearOffPage?: () => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  isEditMode?: boolean;
  isMenuOpen?: boolean;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  onOpenMenu?: () => void;
  onOpenEmbed?: () => void;
}

export const TornPaperCalendar: React.FC<TornPaperCalendarProps> = ({
  config,
  onUpdateConfig,
  onTearOffPage,
  currentDate,
  onDateChange,
  isEditMode = true,
  isMenuOpen = false,
  containerRef,
  onOpenMenu,
  onOpenEmbed,
}) => {
  const [newTodoText, setNewTodoText] = useState('');

  // Find current paper theme details
  const paperTheme = PAPER_THEMES.find((t) => t.id === config.themeId) || PAPER_THEMES[0];

  // Date formatting in Italian
  const dayName = currentDate.toLocaleDateString('it-IT', { weekday: 'long' }).toUpperCase();
  const dayNumber = currentDate.getDate();
  const monthName = currentDate.toLocaleDateString('it-IT', { month: 'long' }).toUpperCase();
  const yearNumber = currentDate.getFullYear();

  // Font family utility mapping
  const fontClass = {
    handwriting: 'font-handwriting',
    typewriter: 'font-typewriter',
    serif: 'font-serif-display',
    sans: 'font-sans-clean',
    playful: 'font-playful',
  }[config.fontStyle] || 'font-handwriting';

  // Pattern class mapping
  const patternClass = {
    lines: 'bg-pattern-lines',
    grid: 'bg-pattern-grid',
    dots: 'bg-pattern-dots',
    blank: '',
    linen: 'paper-texture',
  }[config.pattern] || 'bg-pattern-lines';

  // Sticker Handlers
  const handleUpdateSticker = (updated: Sticker) => {
    const updatedList = config.stickers.map((s) => (s.id === updated.id ? updated : s));
    onUpdateConfig({ ...config, stickers: updatedList });
  };

  const handleDeleteSticker = (id: string) => {
    onUpdateConfig({
      ...config,
      stickers: config.stickers.filter((s) => s.id !== id),
    });
  };

  const handleReorderSticker = (id: string, direction: 'front' | 'back') => {
    const currentStickers = config.stickers;
    if (currentStickers.length === 0) return;

    if (direction === 'front') {
      const maxZ = Math.max(0, ...currentStickers.map((s) => s.zIndex || 1));
      const updatedList = currentStickers.map((s) =>
        s.id === id ? { ...s, zIndex: maxZ + 1 } : s
      );
      onUpdateConfig({ ...config, stickers: updatedList });
    } else {
      const minZ = Math.min(...currentStickers.map((s) => s.zIndex || 1));
      const updatedList = currentStickers.map((s) => {
        if (s.id === id) {
          return { ...s, zIndex: Math.max(1, minZ - 1) };
        }
        return { ...s, zIndex: (s.zIndex || 1) + 1 };
      });
      onUpdateConfig({ ...config, stickers: updatedList });
    }
  };

  // Agenda Content Handlers
  const handleToggleTodo = (todoId: string) => {
    const newTodos = config.agendaContent.todos.map((t) =>
      t.id === todoId ? { ...t, completed: !t.completed } : t
    );
    onUpdateConfig({
      ...config,
      agendaContent: { ...config.agendaContent, todos: newTodos },
    });
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    const newTodo = {
      id: Date.now().toString(),
      text: newTodoText.trim(),
      completed: false,
    };
    onUpdateConfig({
      ...config,
      agendaContent: {
        ...config.agendaContent,
        todos: [...config.agendaContent.todos, newTodo],
      },
    });
    setNewTodoText('');
  };

  const handleDeleteTodo = (todoId: string) => {
    onUpdateConfig({
      ...config,
      agendaContent: {
        ...config.agendaContent,
        todos: config.agendaContent.todos.filter((t) => t.id !== todoId),
      },
    });
  };

  const handleSetWater = (glasses: number) => {
    onUpdateConfig({
      ...config,
      agendaContent: { ...config.agendaContent, waterGlasses: glasses },
    });
  };

  const handleSetMood = (moodEmoji: string) => {
    onUpdateConfig({
      ...config,
      agendaContent: { ...config.agendaContent, mood: moodEmoji },
    });
  };

  const handleSetWeather = (weatherEmoji: string) => {
    onUpdateConfig({
      ...config,
      agendaContent: { ...config.agendaContent, weather: weatherEmoji },
    });
  };

  const prevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    onDateChange(d);
  };

  const nextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    onDateChange(d);
  };

  const resetToday = () => {
    onDateChange(new Date());
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-2xl mx-auto py-1 sm:py-4 px-0.5 sm:px-2 transition-all"
    >
      {/* DATE NAVIGATION & QUICK CONTROLS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2 sm:mb-3 bg-stone-900/95 text-white backdrop-blur-md p-1.5 sm:p-2 rounded-2xl shadow-xl border border-stone-700/80 text-xs select-none">
        {/* DATE NAV: IERI, OGGI, DOMANI */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={prevDay}
            className="px-2 py-1 sm:py-1.5 hover:bg-stone-800 rounded-xl text-stone-200 hover:text-white transition flex items-center gap-0.5 font-bold cursor-pointer"
            title="Giorno Precedente"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="text-[11px] sm:text-xs">Ieri</span>
          </button>
          <button
            type="button"
            onClick={resetToday}
            className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-extrabold transition shadow-xs text-[11px] sm:text-xs cursor-pointer"
          >
            Oggi
          </button>
          <button
            type="button"
            onClick={nextDay}
            className="px-2 py-1 sm:py-1.5 hover:bg-stone-800 rounded-xl text-stone-200 hover:text-white transition flex items-center gap-0.5 font-bold cursor-pointer"
            title="Giorno Successivo"
          >
            <span className="text-[11px] sm:text-xs">Domani</span>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          </button>
        </div>

        {/* ACTIONS: STRAPPA, MENU & EMBED */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {onTearOffPage && (
            <button
              type="button"
              onClick={onTearOffPage}
              className="px-2 sm:px-3 py-1 sm:py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-xl shadow-md transition flex items-center gap-1 active:scale-95 text-[11px] sm:text-xs cursor-pointer"
              title="Strappa il foglio"
            >
              <Scissors className="w-3.5 h-3.5 shrink-0" />
              <span>Strappa</span>
            </button>
          )}

          {onOpenMenu && (
            <button
              type="button"
              onClick={onOpenMenu}
              className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-stone-950 font-extrabold rounded-xl shadow-md transition flex items-center gap-1 active:scale-95 text-[11px] sm:text-xs cursor-pointer"
              title="Apri Menu Personalizzazione"
            >
              <Palette className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
              <span>Menu</span>
            </button>
          )}

          {onOpenEmbed && (
            <button
              type="button"
              onClick={onOpenEmbed}
              className="p-1 sm:p-1.5 bg-stone-800 hover:bg-stone-700 text-amber-400 border border-stone-700 rounded-xl transition cursor-pointer"
              title="Codice Embed iFrame"
            >
              <Code className="w-3.5 h-3.5 shrink-0" />
            </button>
          )}
        </div>
      </div>

      {/* 3D PHYSICAL AGENDA ORGANIZER COVER BINDER CASING */}
      <div
        className="relative rounded-[16px] sm:rounded-[28px] p-1.5 sm:p-5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] border-2 border-stone-900/80 transition-all duration-300"
        style={{
          background: paperTheme.coverBg,
          boxShadow: `0 20px 50px -15px ${paperTheme.shadowColor}, inset 0 0 30px rgba(0,0,0,0.4)`,
        }}
      >
        {/* LEATHER STITCHED SEAM BORDER */}
        <div className="absolute inset-1 sm:inset-3 border-2 border-dashed border-white/20 rounded-[14px] sm:rounded-[22px] pointer-events-none z-0" />

        {/* METALLIC CORNER PROTECTORS */}
        <div className="absolute top-0.5 left-0.5 w-3.5 h-3.5 sm:w-6 sm:h-6 border-t-2 sm:border-t-4 border-l-2 sm:border-l-4 border-amber-400/80 rounded-tl-lg pointer-events-none z-10 opacity-90" />
        <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 sm:w-6 sm:h-6 border-t-2 sm:border-t-4 border-r-2 sm:border-r-4 border-amber-400/80 rounded-tr-lg pointer-events-none z-10 opacity-90" />
        <div className="absolute bottom-0.5 left-0.5 w-3.5 h-3.5 sm:w-6 sm:h-6 border-b-2 sm:border-b-4 border-l-2 sm:border-l-4 border-amber-400/80 rounded-bl-lg pointer-events-none z-10 opacity-90" />
        <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 sm:w-6 sm:h-6 border-b-2 sm:border-b-4 border-r-2 sm:border-r-4 border-amber-400/80 rounded-br-lg pointer-events-none z-10 opacity-90" />

        {/* SIDE INDEX BOOKMARK TABS (Hidden on mobile to prevent iframe clip) */}
        <div className="hidden md:flex absolute -right-2.5 top-10 bottom-10 flex-col justify-around pointer-events-auto z-40">
          {[
            { id: 'today', label: '📅 OGGI', color: '#D97706' },
            { id: 'focus', label: '🎯 OBIETTIVI', color: '#EF4444' },
            { id: 'todos', label: '✍️ CHECKS', color: '#10B981' },
            { id: 'notes', label: '📝 NOTE', color: '#3B82F6' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                const el = document.getElementById(`agenda-section-${tab.id}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="px-2 py-1 text-[10px] font-extrabold text-white rounded-r-lg shadow-lg border-l border-white/30 transform hover:translate-x-1 transition flex items-center gap-1 uppercase tracking-wider cursor-pointer"
              style={{ backgroundColor: tab.color }}
              title={`Vai a ${tab.label}`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* SATIN BOOKMARK RIBBON */}
        <div className="absolute left-1/2 -bottom-4 -translate-x-1/2 w-3 h-8 bg-gradient-to-b from-amber-600 via-rose-600 to-amber-700 shadow-md z-30 pointer-events-none rounded-b-sm border-x border-amber-900/40 flex items-end justify-center pb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-300 border border-amber-800 shadow-xs" />
        </div>

        {/* PHYSICAL BINDER RING MECHANISM (Top Metallic Rings) */}
        <div className="w-full flex justify-around items-center px-3 sm:px-8 -mb-3.5 sm:-mb-5 z-40 relative">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="flex flex-col items-center">
              {/* Ring metallic arc */}
              <div
                className={`w-3 sm:w-4 h-5 sm:h-8 rounded-t-full shadow-2xl border ${
                  paperTheme.ringColor === 'gold'
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-100 to-amber-600 border-amber-700'
                    : paperTheme.ringColor === 'rose-gold'
                    ? 'bg-gradient-to-r from-rose-300 via-pink-100 to-rose-500 border-rose-700'
                    : paperTheme.ringColor === 'bronze'
                    ? 'bg-gradient-to-r from-amber-700 via-amber-300 to-amber-900 border-stone-800'
                    : paperTheme.ringColor === 'black'
                    ? 'bg-gradient-to-r from-stone-800 via-stone-600 to-stone-900 border-black'
                    : 'bg-gradient-to-r from-stone-300 via-white to-stone-500 border-stone-600'
                }`}
              />
              <div className="w-3.5 sm:w-5 h-1.5 bg-black/40 rounded-full blur-xs -mt-1" />
            </div>
          ))}
        </div>

        {/* TORN PAPER LEAF MAIN CONTAINER WITH PHYSICAL STACK DEPTH */}
        <div className="relative group torn-paper-shadow my-1 sm:my-2">
          {/* UNDERLYING STACK PAGE 2 */}
          <div
            className="absolute inset-x-1 inset-y-1 rounded-t-sm transform rotate-1 translate-y-1 shadow-sm pointer-events-none opacity-90 transition-transform"
            style={{ backgroundColor: paperTheme.paperBg, filter: 'brightness(0.94)' }}
          >
            <div className="absolute bottom-0 left-0 right-0 h-3 overflow-hidden">
              <svg viewBox="0 0 1200 30" preserveAspectRatio="none" className="w-full h-full opacity-70" fill={paperTheme.paperBg}>
                <path d="M0,0 Q35,28 70,10 Q105,30 140,14 Q175,28 210,12 Q245,30 280,16 Q315,28 350,10 Q385,30 420,14 Q455,28 490,16 Q525,30 560,10 L1200,0 Z" />
              </svg>
            </div>
          </div>

          {/* UNDERLYING STACK PAGE 1 */}
          <div
            className="absolute inset-x-0.5 inset-y-0.5 rounded-t-sm transform -rotate-0.5 translate-y-0.5 shadow-xs pointer-events-none opacity-95 transition-transform"
            style={{ backgroundColor: paperTheme.paperBg, filter: 'brightness(0.97)' }}
          />

          {/* TORN PAPER LEAF INNER BODY */}
          <div
            className={`relative w-full transition-colors duration-300 rounded-lg overflow-hidden shadow-2xl ${fontClass} ${
              config.edgeStyle === 'polygon-torn' ? 'torn-paper-polygon pb-4 sm:pb-6' : ''
            }`}
            style={{
              backgroundColor: paperTheme.paperBg,
              color: paperTheme.textColor,
              ['--paper-lines-color' as any]: paperTheme.linesColor,
            }}
          >
            {/* PERFORATED BINDER RING HOLE PUNCHES ALONG TOP MARGIN */}
            <div className="w-full flex justify-around items-center px-3 sm:px-8 pt-2 pb-1 relative z-30 pointer-events-none">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div
                  key={idx}
                  className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-stone-900/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border border-stone-700/60"
                />
              ))}
            </div>

            {/* NOTEBOOK MARGIN GUIDES (Visible on desktop only) */}
            <div className="hidden sm:block absolute left-12 top-0 bottom-0 w-0.5 bg-rose-400/35 pointer-events-none z-10" />

            {/* CALENDAR HEADER (Month, Day Number, Day Name) */}
            <div
              id="agenda-section-today"
              className="w-full px-3 sm:px-6 pt-2 sm:pt-3 pb-3 sm:pb-5 text-center relative shadow-sm border-b border-black/5"
              style={{
                backgroundColor: paperTheme.headerBg,
                color: paperTheme.headerTextColor,
              }}
            >
              <div className="flex items-center justify-between text-[11px] sm:text-xs tracking-widest font-mono font-bold opacity-90 uppercase mb-0.5 sm:mb-1">
                <span>{monthName}</span>
                <span>{yearNumber}</span>
              </div>

              <div className="text-5xl sm:text-7xl font-extrabold tracking-tight my-0.5 leading-none font-serif-display drop-shadow-xs">
                {dayNumber}
              </div>

              <div className="text-xs sm:text-base tracking-widest uppercase font-bold mt-0.5 sm:mt-1 opacity-95">
                {dayName}
              </div>
            </div>

            {/* PAGE CONTENT CONTAINER WITH CUSTOM PATTERN & TEXTURE */}
            <div className={`p-3.5 sm:p-7 min-h-[280px] sm:min-h-[440px] relative ${patternClass}`}>
              {/* PAPER FIBERS & LIGHT NOISE OVERLAY */}
              <div className="absolute inset-0 paper-texture pointer-events-none opacity-40" />

              {/* INTERACTIVE STICKER LAYER */}
              <StickerLayer
                stickers={config.stickers}
                onUpdateSticker={handleUpdateSticker}
                onDeleteSticker={handleDeleteSticker}
                onReorderSticker={handleReorderSticker}
                isEditMode={isEditMode}
                isMenuOpen={isMenuOpen}
              />

              {/* CUSTOM TITLE / HEADER INSCRIPTION */}
              <div className="mb-3 sm:mb-5 border-b-2 border-dashed border-black/10 pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                {isEditMode ? (
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
                    className="text-lg sm:text-2xl font-bold bg-transparent border-none outline-none w-full focus:ring-0"
                    style={{ color: paperTheme.textColor }}
                    placeholder="Titolo Agenda..."
                  />
                ) : (
                  <h2 className="text-lg sm:text-2xl font-bold">{config.agendaContent.customTitle}</h2>
                )}

                {/* MOOD & WEATHER SELECTOR DISPLAYS */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-wrap">
                  {config.agendaContent.showWeather && (
                    <div className="flex items-center gap-1 bg-black/5 px-2 py-0.5 rounded-full text-xs sm:text-sm">
                      {['☀️', '🌤️', '🌧️', '☕', '⚡'].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => handleSetWeather(w)}
                          className={`hover:scale-125 transition cursor-pointer ${
                            config.agendaContent.weather === w ? 'scale-125 font-bold' : 'opacity-50'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  )}

                  {config.agendaContent.showMood && (
                    <div className="flex items-center gap-1 bg-black/5 px-2 py-0.5 rounded-full text-xs sm:text-sm">
                      {['😊', '🥰', '😌', '🤔', '😴'].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => handleSetMood(m)}
                          className={`hover:scale-125 transition cursor-pointer ${
                            config.agendaContent.mood === m ? 'scale-125 font-bold' : 'opacity-50'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* DAILY QUOTE SECTION */}
              {config.agendaContent.showQuote && (
                <div
                  className="mb-3 sm:mb-4 p-2.5 sm:p-3.5 rounded-xl bg-black/5 border-l-4 italic text-sm sm:text-base relative flex gap-2.5 items-start shadow-xs"
                  style={{ borderColor: paperTheme.accentColor }}
                >
                  <Quote className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 opacity-60 mt-0.5" />
                  {isEditMode ? (
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
                      rows={2}
                      className="w-full bg-transparent outline-none resize-none text-sm sm:text-base font-serif-display leading-relaxed"
                      placeholder="Pensiero del giorno..."
                    />
                  ) : (
                    <p className="font-serif-display text-sm sm:text-base leading-relaxed">{config.agendaContent.quote}</p>
                  )}
                </div>
              )}

              {/* RESPONSIVE 2-COLUMN CONTENT GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5 items-start">
                {/* LEFT COLUMN: MAIN FOCUS & NOTES */}
                <div className="space-y-3.5 sm:space-y-4">
                  {/* MAIN FOCUS / PRIORITY SECTION */}
                  {config.agendaContent.showFocus && (
                    <div id="agenda-section-focus">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] sm:text-xs font-black text-white bg-rose-600 px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                          Priorità #1
                        </span>
                        <div
                          className="text-xs sm:text-sm uppercase font-extrabold tracking-wider opacity-75 flex items-center gap-1"
                          style={{ color: paperTheme.accentColor }}
                        >
                          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>Obiettivo Principale</span>
                        </div>
                      </div>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={config.agendaContent.mainFocus}
                          onChange={(e) =>
                            onUpdateConfig({
                              ...config,
                              agendaContent: {
                                ...config.agendaContent,
                                mainFocus: e.target.value,
                              },
                            })
                          }
                          className="w-full text-lg sm:text-2xl font-bold bg-amber-100/40 p-2.5 sm:p-3 rounded-xl border-b-2 border-red-400 outline-none font-handwriting placeholder:text-stone-400"
                          placeholder="Cosa vuoi fare di importante oggi?"
                        />
                      ) : (
                        <div className="text-lg sm:text-2xl font-bold bg-amber-100/30 p-2.5 sm:p-3 rounded-xl border-b-2 border-red-300 font-handwriting">
                          {config.agendaContent.mainFocus}
                        </div>
                      )}
                    </div>
                  )}

                  {/* NOTES & SCRATCHPAD AREA (BLOC NOTE) */}
                  {config.agendaContent.showNotes && (
                    <div id="agenda-section-notes">
                      <div className="text-xs sm:text-sm uppercase font-extrabold tracking-wider opacity-75 mb-1.5 flex items-center gap-1.5">
                        <span>📝 Note & Appunti:</span>
                      </div>
                      {isEditMode ? (
                        <textarea
                          value={config.agendaContent.notes}
                          onChange={(e) =>
                            onUpdateConfig({
                              ...config,
                              agendaContent: {
                                ...config.agendaContent,
                                notes: e.target.value,
                              },
                            })
                          }
                          rows={4}
                          className="w-full text-base sm:text-xl font-semibold bg-amber-50/50 border border-black/10 p-2.5 sm:p-3.5 rounded-xl outline-none resize-none leading-relaxed font-handwriting placeholder:text-stone-400"
                          placeholder="Scrivi le tue note qui..."
                        />
                      ) : (
                        <div className="p-2.5 sm:p-3.5 bg-amber-50/40 rounded-xl border border-black/5 text-base sm:text-xl font-semibold leading-relaxed whitespace-pre-wrap font-handwriting min-h-[90px]">
                          {config.agendaContent.notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* RIGHT COLUMN: TODOS & WATER TRACKER */}
                <div className="space-y-3.5 sm:space-y-4">
                  {/* TO-DO CHECKLIST SECTION (LISTA) */}
                  {config.agendaContent.showTodos && (
                    <div id="agenda-section-todos">
                      <div className="text-xs sm:text-sm uppercase font-extrabold tracking-wider opacity-75 mb-2 flex items-center gap-1.5">
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                        <span>Cose da fare (Checklist):</span>
                      </div>
                      <div className="space-y-2">
                        {config.agendaContent.todos.map((todo) => (
                          <div
                            key={todo.id}
                            className="flex items-start justify-between gap-2.5 group/todo bg-black/5 hover:bg-black/10 p-2 sm:p-2.5 rounded-xl transition border border-black/5"
                          >
                            <button
                              type="button"
                              onClick={() => handleToggleTodo(todo.id)}
                              className="flex items-start gap-2.5 text-left text-sm sm:text-base font-semibold flex-1 cursor-pointer"
                            >
                              {todo.completed ? (
                                <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                              ) : (
                                <Square className="w-5 h-5 opacity-40 shrink-0 mt-0.5" />
                              )}
                              <span
                                className={
                                  todo.completed ? 'line-through opacity-50 font-medium' : 'opacity-95 font-semibold'
                                }
                              >
                                {todo.text}
                              </span>
                            </button>

                            {isEditMode && (
                              <button
                                type="button"
                                onClick={() => handleDeleteTodo(todo.id)}
                                className="opacity-0 group-hover/todo:opacity-100 p-1 text-red-500 hover:bg-black/10 rounded-lg transition shrink-0"
                                title="Elimina"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* ADD TODO FORM */}
                      {isEditMode && (
                        <form onSubmit={handleAddTodo} className="mt-2.5 flex items-center gap-2">
                          <input
                            type="text"
                            value={newTodoText}
                            onChange={(e) => setNewTodoText(e.target.value)}
                            placeholder="+ Aggiungi attività..."
                            className="text-sm sm:text-base bg-black/5 border border-black/10 px-3 py-2 rounded-xl outline-none flex-1 font-medium placeholder:opacity-50"
                          />
                          <button
                            type="submit"
                            className="p-2 bg-stone-900 text-white hover:bg-stone-800 rounded-xl text-sm font-bold transition shadow-xs cursor-pointer shrink-0"
                            title="Aggiungi"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {/* WATER INTAKE TRACKER */}
                  {config.agendaContent.showWater && (
                    <div className="pt-2 border-t border-black/10 flex flex-wrap items-center justify-between gap-2 bg-black/5 p-2.5 rounded-xl">
                      <span className="text-xs sm:text-sm font-extrabold uppercase opacity-80 flex items-center gap-1.5">
                        <Droplet className="w-3.5 h-3.5 text-sky-500" />
                        <span>Acqua:</span>
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((cup) => {
                          const isDrunk = cup <= config.agendaContent.waterGlasses;
                          return (
                            <button
                              key={cup}
                              type="button"
                              onClick={() => handleSetWater(isDrunk && cup === config.agendaContent.waterGlasses ? cup - 1 : cup)}
                              className="p-0.5 hover:scale-125 transition cursor-pointer"
                              title={`${cup} bicchieri`}
                            >
                              <Droplet
                                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                  isDrunk ? 'text-sky-500 fill-sky-500 drop-shadow-xs' : 'text-stone-300'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* BOTTOM TORN JAGGED PAPER SVG EDGE */}
            <div className="w-full h-6 relative leading-none -mt-1 z-10 pointer-events-none">
              <svg
                viewBox="0 0 1200 40"
                preserveAspectRatio="none"
                className="w-full h-full"
              >
                {/* Dark paper tear shadow */}
                <path
                  d="M0,0 Q30,34 60,10 Q90,38 120,15 Q150,35 180,10 Q210,38 240,16 Q270,35 300,10 Q330,38 360,14 Q390,38 420,12 Q450,35 480,18 Q510,38 540,10 Q570,38 600,15 Q630,35 660,12 Q690,38 720,18 Q750,35 780,12 Q810,38 840,15 Q870,35 900,12 Q930,38 960,18 Q990,35 1020,10 Q1050,38 1080,15 Q1110,35 1140,12 Q1170,38 1200,18 L1200,0 Z"
                  fill="rgba(0,0,0,0.18)"
                  transform="translate(0, 3)"
                />
                {/* Paper fill with fibrous edge stroke */}
                <path
                  d="M0,0 Q30,34 60,10 Q90,38 120,15 Q150,35 180,10 Q210,38 240,16 Q270,35 300,10 Q330,38 360,14 Q390,38 420,12 Q450,35 480,18 Q510,38 540,10 Q570,38 600,15 Q630,35 660,12 Q690,38 720,18 Q750,35 780,12 Q810,38 840,15 Q870,35 900,12 Q930,38 960,18 Q990,35 1020,10 Q1050,38 1080,15 Q1110,35 1140,12 Q1170,38 1200,18 L1200,0 Z"
                  fill={paperTheme.paperBg}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
