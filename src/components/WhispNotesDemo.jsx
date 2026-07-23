import React, { useState, useEffect, useRef } from 'react';

const SAMPLE_NOTES = [
  {
    id: 'note-1',
    title: 'ML Architecture & On-Device Gemma 3 Notes',
    updatedAt: '10 mins ago',
    tag: 'MACHINE LEARNING',
    duration: '02:45',
    audioTranscript: [
      { time: '00:05', text: 'Deploying Gemma 3 on local Apple Silicon hardware requires INT4/INT8 quantization for low latency.' },
      { time: '00:32', text: 'Whisper.cpp leverages Metal performance shaders to achieve 6x real-time transcription speeds.' },
      { time: '01:15', text: 'By binding the local LLM context to active note markdown, Q&A queries execute with zero network roundtrips.' },
      { time: '02:05', text: 'Action Item: Benchmark Whisper latency across M-series unified memory architectures.' }
    ],
    markdownContent: `# ML Architecture & On-Device Gemma 3 Notes

## Key System Objectives
- **Zero Server Dependency**: 100% of speech processing and LLM inference stays local.
- **Metal Acceleration**: Utilize Apple Neural Engine & Metal Shaders via Whisper.cpp.
- **Context Injection**: Stream note buffers directly into local Gemma 3 window.

> **Note**: Speech transcripts are synchronized to exact timestamps in the raw audio stream.

### Action Items
- [x] Integrate Whisper.cpp CoreML model bindings into Swift runtime
- [ ] Benchmark Whisper latency across M-series unified memory architectures
- [ ] Optimize vector memory footprint for 100k+ note knowledge graphs`,
    aiSummaries: {
      summary: "Overview of executing on-device AI inference using local Gemma 3 models and Metal-accelerated Whisper.cpp on macOS without cloud infrastructure.",
      actionItems: ["Benchmark Whisper latency across M-series unified memory architectures", "Optimize vector memory footprint for 100k+ note knowledge graphs"],
      flashcards: [
        { q: "What hardware engine powers WhispNotes local transcription?", a: "Whisper.cpp with Metal Performance Shaders and CoreML acceleration." },
        { q: "What are the primary benefits of local Gemma 3 inference?", a: "Total data privacy, zero latency over network, offline usage, and zero API cost." }
      ]
    }
  },
  {
    id: 'note-2',
    title: 'Sprint Planning & Distributed Architecture',
    updatedAt: '2 hours ago',
    tag: 'SYSTEM DESIGN',
    duration: '01:30',
    audioTranscript: [
      { time: '00:10', text: 'Reviewing cross-process IPC and SQLite FTS5 full-text indexing performance.' },
      { time: '00:45', text: 'The force-directed graph canvas relies on Verlet integration to render 500+ interconnected note nodes smoothly.' },
      { time: '01:12', text: 'Action Item: Finalize DMG installer auto-updater payload.' }
    ],
    markdownContent: `# Sprint Planning & Distributed Architecture

## Infrastructure Roadmap
1. **SQLite FTS5 Search**: Instant search indexing across markdown notes and transcripts.
2. **Force-Directed Graph**: Physics-driven node graph for visualizing backlink connections.
3. **⌘K Command Palette**: Fast keyboard navigation system wide.

### Highlights
- Swift/SwiftUI 3-pane split-view layout.
- Non-blocking async background worker threads for local LLM inference.`,
    aiSummaries: {
      summary: "System design sprint focusing on full-text indexing, force-directed graph rendering algorithms, and swift AppKit integration.",
      actionItems: ["Finalize DMG installer auto-updater payload", "Benchmark FTS5 search queries across 10,000 notes"],
      flashcards: [
        { q: "Which algorithm powers the knowledge graph visualizer?", a: "Physics-driven Verlet integration for force-directed node dynamics." }
      ]
    }
  }
];

const GRAPH_NODES = [
  { id: 'n1', label: 'WhispNotes Core', x: 220, y: 140, type: 'core', color: '#3b82f6' },
  { id: 'n2', label: 'Gemma 3 (Local LLM)', x: 100, y: 80, type: 'ai', color: '#a855f7' },
  { id: 'n3', label: 'Whisper.cpp (Metal)', x: 110, y: 220, type: 'ml', color: '#10b981' },
  { id: 'n4', label: 'Force Graph Canvas', x: 340, y: 90, type: 'ui', color: '#f59e0b' },
  { id: 'n5', label: 'Markdown Storage', x: 350, y: 210, type: 'storage', color: '#06b6d4' },
  { id: 'n6', label: 'SQLite FTS5 Index', x: 450, y: 150, type: 'storage', color: '#6366f1' }
];

const GRAPH_LINKS = [
  { source: 'n1', target: 'n2' },
  { source: 'n1', target: 'n3' },
  { source: 'n1', target: 'n4' },
  { source: 'n1', target: 'n5' },
  { source: 'n5', target: 'n6' }
];

export default function WhispNotesDemo() {
  const [activeTab, setActiveTab] = useState('editor'); // 'editor', 'graph'
  const [selectedNoteId, setSelectedNoteId] = useState('note-1');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(15); // percentage
  const [activeTranscriptIdx, setActiveTranscriptIdx] = useState(0);
  const [aiMode, setAiMode] = useState('summary'); // 'summary', 'actions', 'flashcards'
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredNode, setHoveredNode] = useState(null);

  const activeNote = SAMPLE_NOTES.find(n => n.id === selectedNoteId) || SAMPLE_NOTES[0];
  const audioIntervalRef = useRef(null);

  // Keyboard shortcut listener for ⌘K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Audio Playback Simulation
  useEffect(() => {
    if (isPlayingAudio) {
      audioIntervalRef.current = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          const next = prev + 2;
          const transcriptLength = activeNote.audioTranscript.length;
          const currentLine = Math.min(
            Math.floor((next / 100) * transcriptLength),
            transcriptLength - 1
          );
          setActiveTranscriptIdx(currentLine);
          return next;
        });
      }, 300);
    } else {
      clearInterval(audioIntervalRef.current);
    }
    return () => clearInterval(audioIntervalRef.current);
  }, [isPlayingAudio, activeNote]);

  const handleAiAction = (mode) => {
    setIsAiLoading(true);
    setAiMode(mode);
    setTimeout(() => {
      setIsAiLoading(false);
    }, 400);
  };

  return (
    <div className="bg-[#0b0d11] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl font-sans text-slate-200">
      
      {/* macOS Titlebar & Window Controls */}
      <div className="bg-slate-950 border-b border-slate-850 px-4 py-3 flex items-center justify-between font-mono select-none">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-600/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-600/50"></div>
          <span className="ml-3 text-xs font-bold text-slate-400 tracking-wider">WhispNotes v1.0.0 — Native macOS App</span>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1 rounded-md transition font-medium flex items-center gap-1.5 ${
              activeTab === 'editor' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📝</span> 3-Pane Editor
          </button>
          <button
            onClick={() => setActiveTab('graph')}
            className={`px-3 py-1 rounded-md transition font-medium flex items-center gap-1.5 ${
              activeTab === 'graph' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🌐</span> Knowledge Graph
          </button>
        </div>

        {/* ⌘K Trigger */}
        <button
          onClick={() => setIsPaletteOpen(true)}
          className="text-xs bg-slate-900 hover:bg-slate-850 border border-slate-800 px-2.5 py-1 rounded text-slate-400 hover:text-white transition flex items-center gap-1.5"
        >
          <span className="text-[10px] bg-slate-800 px-1 py-0.5 rounded text-slate-300">⌘K</span> Command Palette
        </button>
      </div>

      {/* Main Workspace */}
      {activeTab === 'editor' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
          
          {/* Pane 1: Left Navigation Sidebar */}
          <div className="lg:col-span-3 bg-[#0d0f14] border-r border-slate-850 p-4 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono font-semibold uppercase tracking-wider">
              <span>// NOTES INDEX</span>
              <span className="text-blue-400 text-[10px] bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-800">2 LOCAL</span>
            </div>

            <div className="space-y-2">
              {SAMPLE_NOTES.map((note) => (
                <button
                  key={note.id}
                  onClick={() => {
                    setSelectedNoteId(note.id);
                    setAudioProgress(0);
                    setActiveTranscriptIdx(0);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedNoteId === note.id
                      ? 'bg-blue-950/40 border-blue-500/50 text-white shadow-md'
                      : 'bg-slate-950/50 border-slate-850 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mb-1">
                    <span className="text-blue-400 font-bold">{note.tag}</span>
                    <span>{note.updatedAt}</span>
                  </div>
                  <div className="font-semibold text-xs text-slate-200 line-clamp-1 mb-1">{note.title}</div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                    <span>🎙️ {note.duration}</span>
                    <span>• {note.audioTranscript.length} Segments</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Local Engine Status Box */}
            <div className="bg-slate-950 border border-slate-850 rounded-xl p-3 space-y-2 font-mono text-[10px]">
              <div className="text-slate-400 font-bold border-b border-slate-900 pb-1 flex justify-between items-center">
                <span>ON-DEVICE ENGINES</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Speech Model:</span>
                <span className="text-emerald-400 font-bold">Whisper (CoreML)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Local AI:</span>
                <span className="text-purple-400 font-bold">Gemma 3 (Offline)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Hardware:</span>
                <span className="text-slate-300">Apple Metal GPU</span>
              </div>
            </div>
          </div>

          {/* Pane 2: Markdown Editor & Waveform Seeker */}
          <div className="lg:col-span-5 bg-[#0f1117] p-5 border-r border-slate-850 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              
              {/* Note Header & Title */}
              <div className="border-b border-slate-850 pb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{activeNote.tag}</span>
                  <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/50">LOCAL ENCRYPTED</span>
                </div>
                <h2 className="text-lg font-bold text-white tracking-tight">{activeNote.title}</h2>
              </div>

              {/* Audio Waveform Seeker Component */}
              <div className="bg-slate-950 border border-slate-850 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center font-bold transition shadow-md"
                    >
                      {isPlayingAudio ? '⏸' : '▶'}
                    </button>
                    <div>
                      <div className="text-slate-200 font-bold text-[11px]">Audio Recording</div>
                      <div className="text-slate-500 text-[10px]">Whisper Time-Synced</div>
                    </div>
                  </div>
                  <span className="text-slate-400 text-[10px]">
                    {Math.floor((audioProgress / 100) * 165)}s / 165s
                  </span>
                </div>

                {/* Simulated Waveform Bars */}
                <div
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const pct = Math.round((clickX / rect.width) * 100);
                    setAudioProgress(pct);
                  }}
                  className="h-10 flex items-center gap-1 cursor-pointer bg-slate-900/80 px-2 rounded-lg border border-slate-850"
                >
                  {Array.from({ length: 38 }).map((_, i) => {
                    const heightPct = Math.sin(i * 0.4) * 35 + 45;
                    const isPassed = (i / 38) * 100 <= audioProgress;
                    return (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all duration-150 ${
                          isPassed ? 'bg-blue-500' : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      ></div>
                    );
                  })}
                </div>
              </div>

              {/* Live Markdown Render View */}
              <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-3 leading-relaxed max-h-[260px] overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans text-xs">{activeNote.markdownContent}</pre>
              </div>
            </div>

            {/* Quick Note Meta Footer */}
            <div className="text-[10px] text-slate-500 font-mono flex justify-between border-t border-slate-850 pt-3">
              <span>UTF-8 Markdown</span>
              <span>On-Device Vector Database Active</span>
            </div>
          </div>

          {/* Pane 3: Whisper Transcript & Gemma 3 AI Assistant */}
          <div className="lg:col-span-4 bg-[#0d0f14] p-5 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* On-Device Whisper Transcript Sync */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-mono font-bold text-slate-300 flex items-center gap-1.5">
                    <span className="text-emerald-400">🎙️</span> Whisper Speech-to-Text
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">[SYNCED]</span>
                </div>

                <div className="bg-slate-950 border border-slate-850 rounded-xl p-3 space-y-2 max-h-[140px] overflow-y-auto">
                  {activeNote.audioTranscript.map((t, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setActiveTranscriptIdx(idx);
                        setAudioProgress(Math.round(((idx + 0.5) / activeNote.audioTranscript.length) * 100));
                      }}
                      className={`p-2 rounded-lg text-[11px] font-mono cursor-pointer transition ${
                        activeTranscriptIdx === idx
                          ? 'bg-blue-950/60 border border-blue-500/40 text-blue-200'
                          : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-blue-400 font-bold mr-2 text-[10px]">{t.time}</span>
                      <span>{t.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local Gemma 3 AI Assistant */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-mono font-bold text-purple-300 flex items-center gap-1.5">
                    <span className="text-purple-400">✨</span> Gemma 3 Local Assistant
                  </span>
                  <span className="text-[9px] font-mono bg-purple-950 text-purple-400 px-1.5 py-0.5 rounded border border-purple-800">
                    OFFLINE LLM
                  </span>
                </div>

                {/* AI Task Selector Tabs */}
                <div className="grid grid-cols-3 gap-1 font-mono text-[10px]">
                  <button
                    onClick={() => handleAiAction('summary')}
                    className={`py-1.5 px-2 rounded-lg border transition ${
                      aiMode === 'summary'
                        ? 'bg-purple-950/70 border-purple-500 text-purple-200 font-bold'
                        : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'
                    }`}
                  >
                    Takeaways
                  </button>
                  <button
                    onClick={() => handleAiAction('actions')}
                    className={`py-1.5 px-2 rounded-lg border transition ${
                      aiMode === 'actions'
                        ? 'bg-purple-950/70 border-purple-500 text-purple-200 font-bold'
                        : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'
                    }`}
                  >
                    Action Items
                  </button>
                  <button
                    onClick={() => handleAiAction('flashcards')}
                    className={`py-1.5 px-2 rounded-lg border transition ${
                      aiMode === 'flashcards'
                        ? 'bg-purple-950/70 border-purple-500 text-purple-200 font-bold'
                        : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'
                    }`}
                  >
                    Flashcards
                  </button>
                </div>

                {/* AI Output Card */}
                <div className="bg-slate-950 border border-slate-850 rounded-xl p-3.5 space-y-2 min-h-[140px] flex flex-col justify-center">
                  {isAiLoading ? (
                    <div className="text-center space-y-2 py-4">
                      <div className="inline-block w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      <div className="text-[10px] font-mono text-purple-400">Executing Gemma 3 local inference...</div>
                    </div>
                  ) : (
                    <div>
                      {aiMode === 'summary' && (
                        <div className="space-y-1.5 text-xs text-slate-300">
                          <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">Executive Summary</span>
                          <p className="leading-relaxed text-[11px] text-slate-300">
                            {activeNote.aiSummaries.summary}
                          </p>
                        </div>
                      )}

                      {aiMode === 'actions' && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">Detected Tasks</span>
                          <ul className="space-y-1 text-[11px] text-slate-300 font-mono">
                            {activeNote.aiSummaries.actionItems.map((item, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-purple-400 font-bold">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {aiMode === 'flashcards' && (
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">Generated Study Deck</span>
                          {activeNote.aiSummaries.flashcards.map((card, i) => (
                            <div key={i} className="bg-slate-900 border border-slate-800 p-2 rounded-lg space-y-1">
                              <div className="text-[10px] font-bold text-slate-200">Q: {card.q}</div>
                              <div className="text-[10px] text-purple-300">A: {card.a}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>

            <div className="bg-purple-950/20 border border-purple-900/30 rounded-xl p-2.5 text-[10px] font-mono text-purple-300 flex items-center justify-between">
              <span>Privacy Verified: Zero outbound network packets</span>
              <span>🔒 100% Offline</span>
            </div>
          </div>

        </div>
      ) : (
        /* Knowledge Graph View Mode */
        <div className="p-6 bg-[#0c0e12] min-h-[540px] space-y-4">
          <div className="flex justify-between items-center border-b border-slate-850 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="text-blue-400">🌐</span> Knowledge Graph &amp; Backlink Canvas
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Interactive force-directed node physics visualization of connected notes.</p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Filter graph nodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-850 rounded-lg px-3 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          {/* SVG Interactive Canvas */}
          <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 relative overflow-hidden h-[420px] flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 500 300">
              
              {/* Background Grid Pattern */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Links */}
              {GRAPH_LINKS.map((link, idx) => {
                const srcNode = GRAPH_NODES.find(n => n.id === link.source);
                const tgtNode = GRAPH_NODES.find(n => n.id === link.target);
                if (!srcNode || !tgtNode) return null;
                return (
                  <line
                    key={idx}
                    x1={srcNode.x}
                    y1={srcNode.y}
                    x2={tgtNode.x}
                    y2={tgtNode.y}
                    stroke="#334155"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                );
              })}

              {/* Nodes */}
              {GRAPH_NODES.filter(n => n.label.toLowerCase().includes(searchQuery.toLowerCase())).map((node) => {
                const isHovered = hoveredNode === node.id;
                return (
                  <g
                    key={node.id}
                    className="cursor-pointer transition-transform duration-200"
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isHovered ? 16 : 12}
                      fill={node.color}
                      className="transition-all shadow-lg"
                      opacity={isHovered ? 1 : 0.85}
                    />
                    <text
                      x={node.x}
                      y={node.y + 24}
                      textAnchor="middle"
                      fill="#e2e8f0"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredNode && (
              <div className="absolute bottom-4 left-4 bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-[10px] shadow-xl">
                <span className="text-blue-400 font-bold">Node Selected:</span> {GRAPH_NODES.find(n => n.id === hoveredNode)?.label}
                <div className="text-slate-500 mt-0.5">Click to navigate note context in 3-pane view.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Spotlight Command Palette Modal */}
      {isPaletteOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-4 space-y-3 font-sans">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-blue-400">⌘K Spotlight Command Palette</span>
              <button
                onClick={() => setIsPaletteOpen(false)}
                className="text-slate-500 hover:text-white text-xs font-mono"
              >
                [ESC]
              </button>
            </div>
            <input
              type="text"
              autoFocus
              placeholder="Search notes, run Gemma 3 AI action, open graph..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
            />
            <div className="space-y-1 font-mono text-xs text-slate-300">
              <div className="p-2 hover:bg-slate-800 rounded-lg cursor-pointer flex justify-between">
                <span>📝 Open: ML Architecture &amp; Gemma 3 Notes</span>
                <span className="text-slate-500 text-[10px]">Enter</span>
              </div>
              <div className="p-2 hover:bg-slate-800 rounded-lg cursor-pointer flex justify-between">
                <span>✨ Run Gemma 3: Extract Key Takeaways</span>
                <span className="text-slate-500 text-[10px]">⌘E</span>
              </div>
              <div className="p-2 hover:bg-slate-800 rounded-lg cursor-pointer flex justify-between">
                <span>🌐 Switch to Interactive Knowledge Graph</span>
                <span className="text-slate-500 text-[10px]">⌘G</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
