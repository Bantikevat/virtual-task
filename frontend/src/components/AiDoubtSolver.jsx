import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GEMINI_KEY_STORE = 'aura-gemini-key';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SUBJECTS = ['General', 'DBMS', 'Computer Networks', 'Operating Systems', 'Algorithms', 'React/JS', 'Node.js', 'MongoDB', 'AI/ML', 'Math', 'Other'];

function loadKey() { try { return localStorage.getItem(GEMINI_KEY_STORE) || ''; } catch { return ''; } }
function saveKey(k) { try { localStorage.setItem(GEMINI_KEY_STORE, k); } catch { /* ignore */ } }

function MessageBubble({ msg }) {
  return (
    <div className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
      <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm ${msg.role === 'user' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-violet-500/20 text-violet-400'}`}>
        {msg.role === 'user' ? '👤' : '🤖'}
      </div>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-cyan-500/15 text-cyan-100 rounded-tr-sm' : 'bg-violet-500/10 text-slate-200 rounded-tl-sm'}`}>
        {msg.role === 'assistant' ? (
          <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }} />
        ) : (
          <p className="whitespace-pre-wrap">{msg.content}</p>
        )}
      </div>
    </div>
  );
}

function formatMarkdown(text) {
  return text
    .replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre class="mt-2 mb-2 overflow-x-auto rounded-xl bg-black/50 p-3 font-mono text-xs text-emerald-300">$2</pre>')
    .replace(/`([^`]+)`/g, '<code class="rounded bg-black/40 px-1 py-0.5 font-mono text-xs text-emerald-300">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-slate-300">$1</em>')
    .replace(/^#{1,3}\s(.+)$/gm, '<p class="mt-3 font-bold text-violet-300">$1</p>')
    .replace(/^[-•]\s(.+)$/gm, '<li class="ml-4 list-disc text-slate-300">$1</li>')
    .replace(/\n\n/g, '<br/><br/>');
}

export default function AiDoubtSolver() {
  const [apiKey, setApiKey] = useState(loadKey);
  const [keyInput, setKeyInput] = useState('');
  const [showKeySetup, setShowKeySetup] = useState(!loadKey());
  const [subject, setSubject] = useState('General');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  function saveApiKey() {
    const k = keyInput.trim();
    if (!k.startsWith('AIza')) { setError('Gemini API key "AIza" se shuru hoti hai — dobara check karo'); return; }
    saveKey(k); setApiKey(k); setShowKeySetup(false); setKeyInput(''); setError('');
  }

  async function ask() {
    if (!question.trim() || loading) return;
    const userMsg = { role: 'user', content: question.trim() };
    const history = [...messages, userMsg];
    setMessages(history);
    setQuestion('');
    setLoading(true);
    setError('');

    const systemPrompt = `Tu AURA ka AI study assistant hai. Tu ${subject} subject ka expert hai. Students ke doubts solve karta hai — simple Hindi/English mix mein samjha, examples deta hai, code snippet deta hai jab zarurat ho. Kabhi bhi "I don't know" mat bol — koshish kar ke samjha.`;

    const contents = [
      { role: 'user', parts: [{ text: systemPrompt + '\n\nStudent ka sawal: ' + userMsg.content }] },
    ];

    // Add prior conversation for context (last 6 messages)
    if (messages.length > 0) {
      const recent = messages.slice(-6);
      contents[0].parts[0].text = systemPrompt;
      for (const m of recent) {
        contents.push({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] });
      }
      contents.push({ role: 'user', parts: [{ text: userMsg.content }] });
    }

    try {
      const res = await fetch(`${API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, generationConfig: { temperature: 0.7, maxOutputTokens: 2048 } }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (res.status === 400 && err?.error?.message?.includes('API_KEY')) throw new Error('API key galat hai — dobara set karo');
        if (res.status === 429) throw new Error('Bahut saare requests — thoda ruko phir try karo');
        throw new Error(err?.error?.message || `Error ${res.status}`);
      }
      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Koi response nahi aaya';
      setMessages([...history, { role: 'assistant', content: reply }]);
    } catch (e) {
      setError(e.message);
      setMessages(history); // remove the user msg on error
    } finally { setLoading(false); }
  }

  if (showKeySetup || !apiKey) {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="font-display text-lg font-black text-white">AI Doubt Solver</h2>
          <p className="text-xs text-slate-400">Gemini free API se koi bhi doubt solve karo</p>
        </div>
        <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-6 space-y-4 max-w-lg">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔑</span>
            <div>
              <p className="font-bold text-white text-sm">Gemini Free API Key chahiye</p>
              <p className="text-xs text-slate-400">Ek baar setup karo — phir unlimited free doubts</p>
            </div>
          </div>
          <div className="space-y-2 text-xs text-slate-300 bg-black/30 rounded-xl p-3">
            <p>1. <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-violet-400 underline">aistudio.google.com/app/apikey</a> kholein</p>
            <p>2. "Create API Key" click karein (free hai)</p>
            <p>3. Key copy karke neeche paste karein</p>
          </div>
          <input
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveApiKey()}
            placeholder="AIzaSy..."
            type="password"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 font-mono text-sm text-white placeholder:text-slate-600 outline-none focus:border-violet-400"
          />
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <button onClick={saveApiKey} className="w-full rounded-xl bg-violet-500 py-2.5 text-sm font-black text-white hover:bg-violet-400 transition">
            Save & Start
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="font-display text-lg font-black text-white">AI Doubt Solver</h2>
          <p className="text-xs text-slate-400">Gemini se poochho — koi bhi subject</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={subject} onChange={(e) => setSubject(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white outline-none focus:border-violet-400">
            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={() => { setMessages([]); setError(''); }}
            className="rounded-xl border border-white/10 px-3 py-1.5 text-xs text-slate-400 hover:text-rose-400 transition">
            Clear
          </button>
          <button onClick={() => { setShowKeySetup(true); setApiKey(''); saveKey(''); }}
            className="rounded-xl border border-white/10 px-2 py-1.5 text-xs text-slate-500 hover:text-slate-300 transition" title="Change API key">
            🔑
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-white/[0.07] bg-black/30 p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <span className="text-5xl">🧠</span>
            <p className="font-bold text-white">Koi bhi doubt poochho</p>
            <p className="text-xs text-slate-500 max-w-xs">DBMS ka normalization, React hooks, algorithms, math — sab kuch explain karega</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {['3NF kya hota hai?', 'Explain TCP/IP model', 'React useEffect kab use karein?', 'O(n log n) kya hai?'].map((q) => (
                <button key={q} onClick={() => setQuestion(q)}
                  className="rounded-xl border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-300 hover:bg-violet-500/20 transition">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
        {loading && (
          <div className="flex gap-3">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-sm">🤖</div>
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-violet-500/10 px-4 py-3">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
        {error && <p className="text-xs text-rose-400 text-center py-2">{error}</p>}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 flex-shrink-0">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(); } }}
          placeholder={`${subject} ka koi bhi doubt poochho... (Enter = send, Shift+Enter = naya line)`}
          rows={2}
          className="flex-1 resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-violet-400"
        />
        <button
          onClick={ask}
          disabled={!question.trim() || loading}
          className="rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 px-5 font-black text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-40 transition hover:scale-105 active:scale-95"
        >
          {loading ? '...' : '⇑'}
        </button>
      </div>
    </div>
  );
}
