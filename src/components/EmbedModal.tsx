import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Copy, Check, Download, Code, Globe, Sparkles } from 'lucide-react';
import { toPng } from 'html-to-image';
import { CalendarConfig } from '../types';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  calendarRef: React.RefObject<HTMLDivElement | null>;
  config: CalendarConfig;
}

export const EmbedModal: React.FC<EmbedModalProps> = ({
  isOpen,
  onClose,
  calendarRef,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [embedWidth, setEmbedWidth] = useState('480');
  const [embedHeight, setEmbedHeight] = useState('650');

  // Compute public shared URL automatically (replacing dev container domain with public shared domain if needed)
  const defaultPublicUrl = typeof window !== 'undefined'
    ? window.location.href.replace('ais-dev-', 'ais-pre-')
    : 'https://ais-pre-encocdpzjututjtws3q4b2-668093467531.europe-west2.run.app';

  const [targetUrl, setTargetUrl] = useState(defaultPublicUrl);

  if (!isOpen) return null;

  const iframeCode = `<iframe 
  src="${targetUrl}" 
  width="${embedWidth}" 
  height="${embedHeight}" 
  style="border:none; overflow:hidden; border-radius:16px;" 
  title="Calendario Strappabile Interattivo"
></iframe>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(iframeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPNG = async () => {
    if (!calendarRef.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(calendarRef.current, {
        cacheBust: true,
        quality: 0.95,
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.download = `calendario-strappato-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-stone-900 text-stone-100 rounded-2xl shadow-2xl border border-stone-800 w-full max-w-xl p-6 relative overflow-hidden"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white bg-stone-800 rounded-full transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Integra nel tuo Sito Web</h3>
            <p className="text-xs text-stone-400">
              Copia il codice embed o scarica l'immagine HD della tua agenda
            </p>
          </div>
        </div>

        {/* DIMENSION PRESETS */}
        <div className="mb-4 bg-stone-800/60 p-3 rounded-xl border border-stone-700/50">
          <label className="text-xs font-bold uppercase text-stone-300 block mb-2">
            Dimensioni Widget:
          </label>
          <div className="flex gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setEmbedWidth('420');
                setEmbedHeight('600');
              }}
              className={`px-3 py-1.5 rounded-lg border font-medium transition ${
                embedWidth === '420'
                  ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold'
                  : 'bg-stone-800 border-stone-700 hover:bg-stone-700'
              }`}
            >
              Compatto (420x600)
            </button>
            <button
              type="button"
              onClick={() => {
                setEmbedWidth('520');
                setEmbedHeight('700');
              }}
              className={`px-3 py-1.5 rounded-lg border font-medium transition ${
                embedWidth === '520'
                  ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold'
                  : 'bg-stone-800 border-stone-700 hover:bg-stone-700'
              }`}
            >
              Standard (520x700)
            </button>
            <button
              type="button"
              onClick={() => {
                setEmbedWidth('100%');
                setEmbedHeight('680');
              }}
              className={`px-3 py-1.5 rounded-lg border font-medium transition ${
                embedWidth === '100%'
                  ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold'
                  : 'bg-stone-800 border-stone-700 hover:bg-stone-700'
              }`}
            >
              Responsive (100%)
            </button>
          </div>
        </div>

        {/* TARGET URL INPUT FIELD */}
        <div className="mb-4 bg-stone-800/60 p-3 rounded-xl border border-stone-700/50">
          <label className="text-xs font-bold uppercase text-stone-300 block mb-1">
            URL dell'Applicazione per l'iFrame:
          </label>
          <input
            type="text"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            className="w-full bg-stone-950 border border-stone-700 text-amber-300 text-xs p-2 rounded-lg outline-none focus:border-amber-500 font-mono"
            placeholder="Inserisci l'URL dell'app..."
          />
        </div>

        {/* 404 / 403 IFRAME ADVICE INFO BOX */}
        <div className="mb-4 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200/90 leading-relaxed space-y-2">
          <div className="font-bold flex items-center gap-1.5 text-amber-400 text-sm">
            <Globe className="w-4 h-4 shrink-0" />
            <span>Perché l'URL dell'editor dà 404/403 se messo in iframe su Netlify?</span>
          </div>
          <p>
            Gli URL di anteprima temporanea dell'editor (<code className="text-amber-300">ais-dev-...</code> e <code className="text-amber-300">ais-pre-...</code>) sono protetti dai server Google Cloud con restrizioni di sicurezza di sessione (CORS / X-Frame-Options) e scadono quando chiudi la sessione. Nessun sito esterno (Netlify, WordPress, Wix) può incorporare direttamente questi link di sandbox temporanei.
          </p>
          <div className="p-2.5 bg-stone-900/90 rounded-lg border border-stone-700 space-y-1">
            <span className="font-bold text-emerald-400 block">🚀 Come pubblicare l'app su Netlify in 2 minuti (Funzionante al 100%):</span>
            <ol className="list-decimal list-inside space-y-0.5 text-stone-300">
              <li>Usa il menu in alto dell'editor per esportare il progetto (scarica lo ZIP o esporta su GitHub).</li>
              <li>Trascina la cartella o connetti il repository su <strong>Netlify.com</strong>.</li>
              <li>Una volta pubblicata (es. <code className="text-emerald-300">https://tua-agenda.netlify.app</code>), potrai inserire QUEL link nell'iframe del tuo sito e funzionerà perfettamente!</li>
            </ol>
          </div>
        </div>

        {/* IFRAME EMBED CODE SNIPPET */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-stone-300 uppercase">
              Codice HTML (iFrame):
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 text-xs bg-amber-500 hover:bg-amber-400 text-stone-950 px-3 py-1.5 rounded-lg font-bold transition shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copiato!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copia Codice</span>
                </>
              )}
            </button>
          </div>
          <pre className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-amber-300 font-mono text-xs overflow-x-auto select-all">
            {iframeCode}
          </pre>
        </div>

        {/* IMAGE EXPORT OPTION */}
        <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Vuoi solo l'immagine PNG ad alta risoluzione?</span>
          </div>
          <button
            type="button"
            onClick={handleExportPNG}
            disabled={isExporting}
            className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 px-4 py-2 rounded-xl text-xs font-bold border border-stone-700 transition"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generazione PNG...' : 'Scarica Immagine PNG'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
