import { useState, useRef, useEffect } from 'react';

// Pre-seeded database of Q&A knowledge about Gilberto Romero-Cano
const PORTFOLIO_DATA = {
  greetings: {
    patterns: ['hi', 'hello', 'hey', 'greetings', 'hola', 'yo'],
    response: "Hi! I can answer questions about Gilberto's projects: the Raymarcher, predictive-audit, F1 Winner Oracle, the spatial pipeline, WhispNotes, Movie Match and more. You can also ask about his skills, education or how to get in touch."
  },
  about: {
    patterns: ['who are you', 'about gilberto', 'who is gilberto', 'bio', 'background'],
    response: "Gilberto Romero-Cano is a Computer Science student at CU Denver (graduating May 2027). He builds GPU and data-heavy systems and checks whether they actually work: validating against published results, scoring against baselines, and reporting what didn't work."
  },
  skills: {
    patterns: ['skills', 'tech stack', 'languages', 'frameworks', 'technologies', 'tools', 'code'],
    response: "Skills by area:\n\n• GPU: CUDA C++, NVRTC, WebGPU/WGSL, Nsight Compute, RAPIDS\n• ML & evaluation: PyTorch, XGBoost, scikit-learn, Stable-Baselines3, ONNX Runtime\n• Data: Python, pandas, NumPy, Dask, Zarr, PyArrow, AnnData, Kafka, SQL\n• Apps: TypeScript, React, Node.js, FastAPI, Socket.IO, Swift/SwiftUI, Tauri\n• Embedded: C/C++, ESP32, ESP-NOW"
  },
  education: {
    patterns: ['education', 'university', 'college', 'cu denver', 'coursework', 'school', 'study'],
    response: "B.S. in Computer Science at the University of Colorado Denver, expected May 2027. Relevant coursework includes data structures & algorithms, machine learning, software engineering, computer networks, operating systems and databases. He also holds two NVIDIA DLI certificates (diffusion models, transformer NLP)."
  },
  contact: {
    patterns: ['contact', 'email', 'hire', 'resume', 'github', 'reach out', 'social', 'linkedin'],
    response: "Ways to reach Gilberto:\n\n• Email: gilbertorcp712@gmail.com\n• LinkedIn: [linkedin.com/in/gromerocano](https://linkedin.com/in/gromerocano/)\n• GitHub: [github.com/GIlbertoRCP](https://github.com/GIlbertoRCP)"
  },
  raymarcher: {
    patterns: ['raymarcher', 'black hole', 'cuda', 'webgpu', 'gpu', 'relativity', 'kerr', 'schwarzschild', 'geodesic', 'spacetime'],
    response: "Raymarcher compiles a spacetime metric into CUDA and WebGPU ray tracers and renders black holes in real time. Its physics is checked against published results (e.g. Bardeen 1973), and the two backends agree on all 14 million test pixels. The Kerr kernel reaches 10.4 TFLOP/s on an RTX 3070.\n\nDetails: [Raymarcher case study](/Portfolio/projects/raymarcher)"
  },
  audit: {
    patterns: ['audit', 'baseline', 'persistence', 'leakage', 'forecast'],
    response: "predictive-audit checks forecasting results against trivial baselines (persistence, moving average, seasonal-naive) and common evaluation leaks. Gilberto built it after finding his own team's F1 ≈ 0.99 congestion model was matched by \"next step = this step\". Of 5 published results audited, 4 don't clearly beat trivial baselines.\n\nDetails: [predictive-audit case study](/Portfolio/projects/predictive-audit)"
  },
  sdn: {
    patterns: ['sdn', 'telemetry', 'kafka', 'self-healing', 'mininet', 'congestion', 'lstm', 'dqn', 'networking'],
    response: "Predictive SDN was a 4-person course project: Mininet switches publish telemetry to Kafka, an LSTM forecasts congestion, and a DQN agent adjusts polling. ONNX export made inference about 3× faster. A later audit showed the forecaster didn't beat a simple baseline under a chronological split.\n\nDetails: [Predictive SDN case study](/Portfolio/projects/predictive-sdn)"
  },
  f1: {
    patterns: ['f1', 'oracle', 'formula', 'race', 'fastf1', 'xgboost', 'monte carlo'],
    response: "F1 Winner Oracle publishes calibrated race-winner odds, frozen before each race in a hash-chained log and scored in public. Over 174 walk-forward races its log loss is 1.24 vs 1.53 for \"the pole sitter wins\". As a single pick it's no better than the pole sitter, and the site says so.\n\nDetails: [F1 Oracle case study](/Portfolio/projects/f1-oracle)"
  },
  spatial: {
    patterns: ['spatial', 'transcriptomics', 'anndata', 'xenium', 'rapids', 'dask', 'zarr', 'graph', 'cells'],
    response: "The spatial pipeline turns spatial transcriptomics data into cell graphs for AnnData and PyTorch Geometric. It builds a k-NN graph for 250k cells in 180 ms on GPU (20× faster than 16 CPU cores) and streams data out-of-core under a 512 MB memory cap.\n\nDetails: [Spatial pipeline case study](/Portfolio/projects/spatial-pipeline)"
  },
  whispnotes: {
    patterns: ['whispnotes', 'whisp', 'notes', 'whisper', 'gemma', 'macos', 'swift', 'swiftui', 'transcription', 'speech'],
    response: "WhispNotes is a native macOS note app with on-device Whisper transcription, a local Gemma 3 assistant and a knowledge graph view. It ships as a DMG through GitHub Releases.\n\nDetails: [WhispNotes case study](/Portfolio/projects/whisp-notes)"
  },
  movies: {
    patterns: ['movie', 'match', 'recommend', 'two-tower', 'socket'],
    response: "Movie Match lets two people swipe on movies together in real time over Socket.IO, with a two-tower recommender that adapts to both of them.\n\nDetails: [Movie Match case study](/Portfolio/projects/movie-matcher)"
  },
  rag: {
    patterns: ['rag', 'literature', 'papers', 'chromadb', 'tauri', 'flashcard', 'bm25'],
    response: "The Literature Companion is a local desktop RAG app for papers and codebases. It fuses BM25 and dense retrieval with Reciprocal Rank Fusion and schedules flashcards with SM-2.\n\nDetails: [Literature Companion case study](/Portfolio/projects/literature-companion)"
  },
  locomotion: {
    patterns: ['locomotion', 'mujoco', 'ppo', 'bipedal', 'humanoid', 'reinforcement learning', 'rl'],
    response: "A PPO agent trained in MuJoCo to walk over uneven terrain, using a 5-point vertical rangefinder and iterative reward shaping. It discovered a \"penguin slide\" to get down steep slopes.\n\nDetails: [Locomotion case study](/Portfolio/projects/motor-control-locomotion)"
  },
  robot: {
    patterns: ['robot', 'bomb', 'embedded', 'esp32', 'esp-now', 'mecanum', 'rover', 'hardware', 'eod'],
    response: "The EOD rover is three ESP32 nodes talking over ESP-NOW: a controller, a Mecanum rover with a 4-DOF claw, and a target node that uses an MPU6050 to penalize shaking.\n\nDetails: [EOD rover case study](/Portfolio/projects/bomb-squad-robot)"
  },
  projects: {
    patterns: ['projects', 'portfolio', 'work', 'what did you make', 'applications', 'showcase'],
    response: "Featured projects:\n\n1. Raymarcher: CUDA/WebGPU black-hole ray tracer\n2. predictive-audit: forecasting results vs trivial baselines\n3. F1 Winner Oracle: calibrated race odds, scored in public\n4. Spatial pipeline: out-of-core cell graphs\n5. WhispNotes: native macOS AI note app\n6. Movie Match: real-time paired recommendations\n\nAsk about any of them for details."
  }
};

function getBotResponse(query) {
  const normalizedQuery = query.toLowerCase().trim();
  let bestMatch = null;
  let maxMatches = 0;

  for (const [_, data] of Object.entries(PORTFOLIO_DATA)) {
    let matchCount = 0;
    for (const pattern of data.patterns) {
      if (normalizedQuery.includes(pattern)) {
        matchCount++;
      }
    }
    if (matchCount > maxMatches) {
      maxMatches = matchCount;
      bestMatch = data.response;
    }
  }

  if (!bestMatch || maxMatches === 0) {
    bestMatch = "I don't have an answer for that. Try asking about a project (Raymarcher, predictive-audit, F1 Oracle, spatial pipeline, WhispNotes, Movie Match), or about skills, education or contact.";
  }

  return bestMatch;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hi! Ask me about Gilberto's projects, skills or how to get in touch. This assistant matches keywords in your browser; it isn't an LLM." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const replyText = getBotResponse(currentInput);
      const aiResponse = { 
        role: 'ai', 
        content: replyText
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-mono text-xs">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-[#0f1115] border border-slate-850 rounded-none shadow-flat-slate flex flex-col h-[28rem] overflow-hidden select-none transition-all duration-200">
          
          {/* Header */}
          <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-850 flex justify-between items-center text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-none"></span>
              <h3 className="font-bold text-slate-200 uppercase tracking-wider">Portfolio assistant</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-white transition-colors"
              aria-label="Close diagnostic logs"
            >
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-3.5 bg-slate-950/20">
            {messages.map((msg, idx) => {
              const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
              const hasLinks = linkRegex.test(msg.content);
              
              let renderedContent = msg.content;
              if (hasLinks) {
                const parts = [];
                let lastIndex = 0;
                linkRegex.lastIndex = 0;
                let match;
                
                while ((match = linkRegex.exec(msg.content)) !== null) {
                  parts.push(msg.content.substring(lastIndex, match.index));
                  parts.push(
                    <a 
                      key={match.index} 
                      href={match[2]} 
                      className="text-blue-400 hover:underline font-bold"
                      {...(match[2].startsWith('http') ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {match[1]}
                    </a>
                  );
                  lastIndex = linkRegex.lastIndex;
                }
                parts.push(msg.content.substring(lastIndex));
                renderedContent = parts;
              } else {
                renderedContent = msg.content.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < msg.content.split('\n').length - 1 && <br />}
                  </span>
                ));
              }

              return (
                <div 
                  key={idx} 
                  className={`p-3 max-w-[85%] border leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-blue-950/40 border-blue-500/30 text-blue-400 self-end rounded-none shadow-flat-slate-sm' 
                      : 'bg-slate-950 border-slate-850 text-slate-300 self-start rounded-none'
                  }`}
                >
                  {renderedContent}
                </div>
              );
            })}
            
            {isLoading && (
              <div className="bg-slate-950 text-slate-500 px-3 py-2 border border-slate-850 self-start rounded-none flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-slate-500 animate-pulse"></span>
                <span>FETCHING_LOGS...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-2.5 bg-slate-950 border-t border-slate-850 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a project..."
              className="flex-grow bg-[#0c0d12] text-white text-xs rounded-none px-3 py-2 border border-slate-800 focus:outline-none focus:border-blue-500 font-mono"
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 border border-blue-500 text-white px-3 py-2 rounded-none font-bold transition shadow-flat-slate-sm disabled:opacity-50 text-xs uppercase tracking-wider"
            >
              QUERY
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#0f1115] border border-slate-850 hover:bg-slate-900 text-white font-mono rounded-none px-4 py-2 text-xs font-bold shadow-flat-slate flex items-center gap-2 select-none"
          aria-label="Open diagnostics assistant"
        >
          <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse"></span>
          Ask about my work
        </button>
      )}
    </div>
  );
}