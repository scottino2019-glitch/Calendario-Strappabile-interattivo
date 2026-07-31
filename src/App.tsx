import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Palette, 
  Code, 
  Scissors, 
  Sparkles, 
  Eye, 
  Settings, 
  Calendar as CalendarIcon,
  RefreshCcw,
  Check
} from 'lucide-react';
import { CalendarConfig } from './types';
import { CANVAS_THEMES } from './data/defaults';
import { loadConfigFromStorage, saveConfigToStorage, resetConfigStorage } from './utils/storage';
import { TornPaperCalendar } from './components/TornPaperCalendar';
import { SidebarDrawer } from './components/SidebarDrawer';
import { EmbedModal } from './components/EmbedModal';
import { TearOffAnimationOverlay, triggerTearConfetti } from './components/TearOffAnimation';

export default function App() {
  const [config, setConfig] = useState<CalendarConfig>(loadConfigFromStorage);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [isTearing, setIsTearing] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Auto-save configuration on changes
  useEffect(() => {
    saveConfigToStorage(config);
  }, [config]);

  // Handle Tear Off Page Animation
  const handleTearOffPage = () => {
    if (isTearing) return;
    setIsTearing(true);
    triggerTearConfetti();

    // Advance to next day after animation completes
    setTimeout(() => {
      const nextDay = new Date(currentDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setCurrentDate(nextDay);
      setIsTearing(false);
    }, 850);
  };

  const handleReset = () => {
    const reset = resetConfigStorage();
    setConfig(reset);
    setCurrentDate(new Date());
  };

  // Find canvas background class
  const canvasTheme = CANVAS_THEMES.find((c) => c.id === config.canvasThemeId) || CANVAS_THEMES[0];

  return (
    <div className={`min-h-screen w-full flex flex-col transition-colors duration-500 font-sans-clean select-none ${canvasTheme.bgClass}`}>
      {/* TOP FLOATING NAVIGATION / APP BAR */}
      <header className="sticky top-0 z-30 w-full bg-stone-900/80 backdrop-blur-md border-b border-stone-800 text-stone-100 py-3 px-4 sm:px-6 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* LOGO & TITLE */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-rose-500 text-stone-950 rounded-xl shadow-xs">
              <CalendarIcon className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base leading-tight tracking-tight text-white flex items-center gap-2">
                <span>Agenda Strappabile</span>
                <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 uppercase">
                  Mini App Widget
                </span>
              </h1>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                Calendario interattivo a foglio strappato personalizzabile
              </p>
            </div>
          </div>

          {/* QUICK ACTION BUTTONS */}
          <div className="flex items-center gap-2">
            {/* TOGGLE PREVIEW MODE */}
            <button
              type="button"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                isPreviewMode
                  ? 'bg-amber-500 text-stone-950 border-amber-400'
                  : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
              }`}
              title="Anteprima integrazione sito"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {isPreviewMode ? 'Modalità Modifica' : 'Anteprima Widget'}
              </span>
            </button>

            {/* OPEN EMBED CODE MODAL */}
            <button
              type="button"
              onClick={() => setIsEmbedModalOpen(true)}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Code className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Codice Embed</span>
            </button>

            {/* OPEN SIDEBAR MENU DRAWER */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-stone-950 font-extrabold rounded-xl text-xs shadow-md transition flex items-center gap-1.5 active:scale-95"
            >
              <Palette className="w-4 h-4" />
              <span>Personalizza Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN STAGE / CANVAS AREA */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
        {/* PREVIEW FRAME WRAPPER FOR SIMULATING EMBED ON A WEBSITE */}
        {isPreviewMode ? (
          <div className="w-full max-w-xl bg-white/80 dark:bg-stone-900/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 relative my-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-200 dark:border-stone-800 text-xs text-stone-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
                <span className="font-mono ml-2">anteprimasito.it/widget-agenda</span>
              </div>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                Live Embed Preview
              </span>
            </div>

            <div className="relative">
              <TornPaperCalendar
                config={config}
                onUpdateConfig={setConfig}
                onTearOffPage={handleTearOffPage}
                currentDate={currentDate}
                onDateChange={setCurrentDate}
                isEditMode={true}
                containerRef={calendarRef}
                onOpenMenu={() => setIsDrawerOpen(true)}
              />

              <AnimatePresence>
                {isTearing && (
                  <TearOffAnimationOverlay onComplete={() => setIsTearing(false)} />
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="relative w-full my-auto">
            <TornPaperCalendar
              config={config}
              onUpdateConfig={setConfig}
              onTearOffPage={handleTearOffPage}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              isEditMode={true}
              containerRef={calendarRef}
              onOpenMenu={() => setIsDrawerOpen(true)}
            />

            <AnimatePresence>
              {isTearing && (
                <TearOffAnimationOverlay onComplete={() => setIsTearing(false)} />
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* FLOATING ACTION HELPER FOR QUICK CUSTOMIZATION */}
      <div className="fixed bottom-5 right-5 z-20 flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="p-3.5 bg-stone-900 hover:bg-stone-800 text-amber-400 rounded-full shadow-2xl border border-stone-700 transition hover:scale-110 active:scale-95 group flex items-center gap-2"
          title="Apri Menu Personalizzazione"
        >
          <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-xs font-bold text-white pr-1 hidden group-hover:inline">
            Menu Tema & Sticker
          </span>
        </button>
      </div>

      {/* SIDEBAR DRAWER MENU */}
      <SidebarDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        config={config}
        onUpdateConfig={setConfig}
        onReset={handleReset}
        onOpenEmbed={() => setIsEmbedModalOpen(true)}
      />

      {/* EMBED CODE MODAL */}
      <EmbedModal
        isOpen={isEmbedModalOpen}
        onClose={() => setIsEmbedModalOpen(false)}
        calendarRef={calendarRef}
        config={config}
      />
    </div>
  );
}
