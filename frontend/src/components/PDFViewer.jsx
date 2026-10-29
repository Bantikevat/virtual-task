import { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).href;

export default function PDFViewer() {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.4);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);

  const renderPage = useCallback(async (doc, pageNum, zoom) => {
    if (!doc || !canvasRef.current) return;
    // Cancel any in-progress render
    if (renderTaskRef.current) {
      try { renderTaskRef.current.cancel(); } catch { /* ignore */ }
    }
    const pdfPage = await doc.getPage(pageNum);
    const viewport = pdfPage.getViewport({ scale: zoom });
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const task = pdfPage.render({ canvasContext: ctx, viewport });
    renderTaskRef.current = task;
    try { await task.promise; } catch (e) { if (e?.name !== 'RenderingCancelledException') console.error(e); }
  }, []);

  useEffect(() => {
    if (pdfDoc) renderPage(pdfDoc, page, scale);
  }, [pdfDoc, page, scale, renderPage]);

  async function loadFile(file) {
    if (!file || file.type !== 'application/pdf') {
      setError('Sirf PDF files upload karein (.pdf)');
      return;
    }
    setError('');
    setLoading(true);
    setFileName(file.name);
    try {
      const buffer = await file.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: buffer }).promise;
      setPdfDoc(doc);
      setTotalPages(doc.numPages);
      setPage(1);
    } catch {
      setError('PDF load nahi hua — file corrupt ho sakti hai');
    } finally {
      setLoading(false);
    }
  }

  function onFileInput(e) { if (e.target.files[0]) loadFile(e.target.files[0]); }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  }

  function changePage(delta) {
    setPage((p) => Math.min(Math.max(p + delta, 1), totalPages));
  }

  function changeZoom(delta) {
    setScale((z) => Math.min(Math.max(+(z + delta).toFixed(1), 0.5), 3.0));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-black text-white">PDF Notes Viewer</h2>
          <p className="text-xs text-slate-400">Research papers, books, study materials — sab yahan</p>
        </div>
      </div>

      {/* Drop zone */}
      {!pdfDoc && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 transition-all cursor-pointer ${
            dragging ? 'border-violet-400 bg-violet-500/10' : 'border-white/20 bg-white/[0.02] hover:border-violet-400/60 hover:bg-violet-500/5'
          }`}
          onClick={() => document.getElementById('pdf-file-input').click()}
        >
          <span className="text-5xl">📄</span>
          <div className="text-center">
            <p className="font-bold text-white">PDF yahan drag karein ya click karein</p>
            <p className="mt-1 text-xs text-slate-400">M.Tech notes, research papers, books — sab support</p>
          </div>
          <input id="pdf-file-input" type="file" accept=".pdf" className="hidden" onChange={onFileInput} />
          {error && <p className="text-xs text-rose-400">{error}</p>}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-black/40 p-8">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
          <p className="text-sm text-slate-400">PDF load ho raha hai...</p>
        </div>
      )}

      {/* Controls toolbar */}
      {pdfDoc && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/40 px-4 py-3">
          <span className="flex-1 truncate text-xs font-medium text-slate-300 max-w-[220px]">{fileName}</span>

          {/* Page nav */}
          <div className="flex items-center gap-2">
            <button onClick={() => changePage(-1)} disabled={page <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/10 disabled:opacity-30 transition">‹</button>
            <span className="font-mono text-xs text-white min-w-[72px] text-center">{page} / {totalPages}</span>
            <button onClick={() => changePage(1)} disabled={page >= totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/10 disabled:opacity-30 transition">›</button>
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-2">
            <button onClick={() => changeZoom(-0.2)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/10 transition">−</button>
            <span className="font-mono text-xs text-white w-12 text-center">{Math.round(scale * 100)}%</span>
            <button onClick={() => changeZoom(0.2)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/10 transition">+</button>
          </div>

          {/* New file */}
          <button
            onClick={() => { setPdfDoc(null); setFileName(''); setError(''); }}
            className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-500/20 transition"
          >
            Close
          </button>
        </div>
      )}

      {/* Canvas */}
      {pdfDoc && (
        <div className="overflow-auto rounded-2xl border border-white/[0.08] bg-[#1a1a1a] p-4">
          <canvas
            ref={canvasRef}
            className="mx-auto block rounded shadow-2xl"
            style={{ maxWidth: '100%' }}
          />
        </div>
      )}
    </div>
  );
}
