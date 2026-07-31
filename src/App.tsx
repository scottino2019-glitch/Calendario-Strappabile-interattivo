import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
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
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-1 sm:p-4 overflow-x-hidden transition-colors duration-500 font-sans-clean select-none ${canvasTheme.bgClass}`}>
      {/* PURE AGENDA WIDGET CONTAINER */}
      <main className="w-full max-w-2xl mx-auto my-auto relative px-1 sm:px-2">
        <TornPaperCalendar
          config={config}
          onUpdateConfig={setConfig}
          onTearOffPage={handleTearOffPage}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          isEditMode={true}
          containerRef={calendarRef}
          onOpenMenu={() => setIsDrawerOpen(true)}
          onOpenEmbed={() => setIsEmbedModalOpen(true)}
        />

        <AnimatePresence>
          {isTearing && (
            <TearOffAnimationOverlay onComplete={() => setIsTearing(false)} />
          )}
        </AnimatePresence>
      </main>

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
