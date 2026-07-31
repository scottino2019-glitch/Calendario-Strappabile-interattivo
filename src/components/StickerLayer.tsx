import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trash2, RotateCw, ArrowUp, ArrowDown, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Sticker } from '../types';

interface StickerLayerProps {
  stickers: Sticker[];
  onUpdateSticker: (updated: Sticker) => void;
  onDeleteSticker: (id: string) => void;
  onReorderSticker: (id: string, direction: 'front' | 'back') => void;
  isEditMode?: boolean;
}

export const StickerLayer: React.FC<StickerLayerProps> = ({
  stickers,
  onUpdateSticker,
  onDeleteSticker,
  onReorderSticker,
  isEditMode = true,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const layerRef = React.useRef<HTMLDivElement>(null);

  const nudgeSticker = (sticker: Sticker, dx: number, dy: number) => {
    const newX = Math.max(0, Math.min(88, +(sticker.x + dx).toFixed(1)));
    const newY = Math.max(0, Math.min(88, +(sticker.y + dy).toFixed(1)));
    onUpdateSticker({ ...sticker, x: newX, y: newY });
  };

  return (
    <div
      ref={layerRef}
      className="absolute inset-0 pointer-events-none overflow-visible z-20"
      onClick={() => setSelectedId(null)}
    >
      {stickers.map((sticker) => {
        const isSelected = selectedId === sticker.id;

        return (
          <motion.div
            key={sticker.id}
            drag={isEditMode}
            dragConstraints={layerRef}
            dragSnapToOrigin={true}
            dragMomentum={false}
            dragElastic={0}
            onDragStart={() => {
              if (isEditMode) setSelectedId(sticker.id);
            }}
            onDragEnd={(_, info) => {
              if (!layerRef.current) return;
              const rect = layerRef.current.getBoundingClientRect();
              if (!rect.width || !rect.height) return;

              const deltaXPercent = (info.offset.x / rect.width) * 100;
              const deltaYPercent = (info.offset.y / rect.height) * 100;

              const newX = Math.max(1, Math.min(85, +(sticker.x + deltaXPercent).toFixed(1)));
              const newY = Math.max(1, Math.min(85, +(sticker.y + deltaYPercent).toFixed(1)));

              onUpdateSticker({
                ...sticker,
                x: newX,
                y: newY,
              });
            }}
            style={{
              position: 'absolute',
              left: `${sticker.x}%`,
              top: `${sticker.y}%`,
              zIndex: sticker.zIndex || 1,
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (isEditMode) setSelectedId(sticker.id);
            }}
            className="pointer-events-auto cursor-grab active:cursor-grabbing select-none"
          >
            {/* INNER STICKER CONTAINER WITH ROTATE & SCALE */}
            <div
              style={{
                transform: `rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
                transformOrigin: 'center center',
              }}
              className={`transition-transform duration-150 origin-center ${
                isSelected ? 'ring-2 ring-amber-500 ring-offset-2 rounded-xl p-1 bg-white/40 shadow-lg' : ''
              }`}
            >
              {/* STICKER RENDER LOGIC BY TYPE */}
              {sticker.type === 'emoji' && (
                <div className="text-4xl filter drop-shadow-md hover:scale-110 transition-transform">
                  {sticker.content}
                </div>
              )}

              {sticker.type === 'tape' && (
                <div
                  className="px-6 py-1.5 shadow-sm text-xs font-mono font-bold tracking-wider rounded-xs backdrop-blur-xs border-y border-white/40 opacity-90 transition-opacity"
                  style={{
                    backgroundColor: sticker.bgColor || 'rgba(255, 230, 150, 0.85)',
                    color: sticker.color || '#333333',
                    clipPath: 'polygon(0% 10%, 5% 0%, 95% 0%, 100% 10%, 98% 90%, 100% 100%, 0% 100%, 2% 85%)',
                  }}
                >
                  {sticker.content === 'washi-floral' ? '🌸 🌿 🌸 🌿' : sticker.content === 'washi-dots' ? '••••••••••' : ''}
                </div>
              )}

              {sticker.type === 'badge' && (
                <div
                  className="px-3.5 py-1 text-xs font-bold rounded-full shadow-md border border-black/10 tracking-wide uppercase flex items-center gap-1.5"
                  style={{
                    backgroundColor: sticker.bgColor || '#E63946',
                    color: sticker.color || '#FFFFFF',
                  }}
                >
                  <span>{sticker.content}</span>
                </div>
              )}

              {sticker.type === 'stamp' && (
                <div
                  className="px-3 py-1 text-xs font-extrabold uppercase border-2 tracking-widest rounded-sm shadow-xs font-typewriter uppercase"
                  style={{
                    borderColor: sticker.color || '#D90429',
                    color: sticker.color || '#D90429',
                    backgroundColor: 'rgba(255,255,255,0.85)',
                  }}
                >
                  {sticker.content}
                </div>
              )}

              {sticker.type === 'pin' && (
                <div className="text-3xl filter drop-shadow-lg -mt-3">
                  {sticker.content}
                </div>
              )}

              {sticker.type === 'text' && (
                <div
                  className="px-3 py-1.5 text-sm font-handwriting font-bold rounded shadow-sm border border-amber-200/60"
                  style={{
                    backgroundColor: sticker.bgColor || '#FEF9DA',
                    color: sticker.color || '#2D2825',
                  }}
                >
                  {sticker.content}
                </div>
              )}
            </div>

            {/* QUICK FLOATING CONTROL MENU FOR SELECTED STICKER */}
            {isSelected && isEditMode && (
              <div
                className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-stone-900/95 text-white p-1.5 rounded-2xl shadow-2xl border border-stone-700 backdrop-blur-md pointer-events-auto z-50 text-xs whitespace-nowrap cursor-default"
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                {/* NUDGE POSITION ARROWS */}
                <div className="flex items-center bg-stone-800 rounded-lg p-0.5">
                  <button
                    type="button"
                    title="Sposta a Sinistra"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      nudgeSticker(sticker, -3, 0);
                    }}
                    className="p-1 hover:bg-stone-700 rounded transition text-stone-200 hover:text-white"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex flex-col">
                    <button
                      type="button"
                      title="Sposta in Alto"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        nudgeSticker(sticker, 0, -3);
                      }}
                      className="p-0.5 hover:bg-stone-700 rounded transition text-stone-200 hover:text-white"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      title="Sposta in Basso"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        nudgeSticker(sticker, 0, 3);
                      }}
                      className="p-0.5 hover:bg-stone-700 rounded transition text-stone-200 hover:text-white"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    type="button"
                    title="Sposta a Destra"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      nudgeSticker(sticker, 3, 0);
                    }}
                    className="p-1 hover:bg-stone-700 rounded transition text-stone-200 hover:text-white"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-px h-4 bg-stone-700 my-auto mx-0.5" />

                <button
                  type="button"
                  title="Ruota"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onUpdateSticker({
                      ...sticker,
                      rotation: (sticker.rotation + 15) % 360,
                    });
                  }}
                  className="p-1.5 hover:bg-stone-700 rounded-lg transition text-amber-300 hover:text-amber-200"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  title="Ingrandisci"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onUpdateSticker({
                      ...sticker,
                      scale: Math.min(3.0, +(sticker.scale + 0.2).toFixed(2)),
                    });
                  }}
                  className="px-2 py-0.5 hover:bg-stone-700 rounded-lg font-bold text-emerald-400 hover:text-emerald-300 text-sm"
                >
                  +
                </button>

                <button
                  type="button"
                  title="Riduci"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onUpdateSticker({
                      ...sticker,
                      scale: Math.max(0.4, +(sticker.scale - 0.2).toFixed(2)),
                    });
                  }}
                  className="px-2 py-0.5 hover:bg-stone-700 rounded-lg font-bold text-amber-400 hover:text-amber-300 text-sm"
                >
                  -
                </button>

                <button
                  type="button"
                  title="Porta Avanti"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onReorderSticker(sticker.id, 'front');
                  }}
                  className="p-1.5 hover:bg-stone-700 rounded-lg transition text-sky-300 hover:text-sky-200"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  title="Manda Dietro"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onReorderSticker(sticker.id, 'back');
                  }}
                  className="p-1.5 hover:bg-stone-700 rounded-lg transition text-sky-300 hover:text-sky-200"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                <div className="w-px h-4 bg-stone-700 my-auto mx-0.5" />

                <button
                  type="button"
                  title="Rimuovi"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onDeleteSticker(sticker.id);
                  }}
                  className="p-1.5 bg-red-500/20 hover:bg-red-600 rounded-lg text-red-300 hover:text-white transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
