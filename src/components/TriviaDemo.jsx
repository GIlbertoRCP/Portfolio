import { useState, useEffect, useRef } from 'react';

const QUESTIONS = [
  {
    id: 1,
    stem: "Which communication protocol does Gilberto's Bomb Disposal EOD Robot use for zero-latency, peer-to-peer node connection?",
    options: [
      { id: 1, text: 'Bluetooth Classic' },
      { id: 2, text: 'ESP-NOW wireless protocol' },
      { id: 3, text: 'Standard HTTP WebSockets' },
      { id: 4, text: 'LoRaWAN Long Range' },
    ],
    correctId: 2,
    explanation: "Gilberto used ESP-NOW, a low-overhead, connectionless 2.4GHz protocol designed by Espressif, mapping 3 node modules without networking infrastructure."
  },
  {
    id: 2,
    stem: "Which machine learning objective model is used in the F1 Oracle to rank drivers based on FastF1 historical telemetry?",
    options: [
      { id: 1, text: 'XGBRanker (pairwise ranking)' },
      { id: 2, text: 'K-Means Clustering' },
      { id: 3, text: 'Linear Regression' },
      { id: 4, text: 'Random Forest Regressor' },
    ],
    correctId: 1,
    explanation: "Pairwise preference ranking (using XGBRanker with a rank:pairwise objective) represents driver placements much better than simple linear regressions."
  },
  {
    id: 3,
    stem: "To run the LSTM network on edge switches in the SDN system, what optimization steps did Gilberto apply?",
    options: [
      { id: 1, text: 'Running on a cluster of GPUs' },
      { id: 2, text: 'Dynamic INT8 Quantization & ONNX Compile' },
      { id: 3, text: 'Pruning 99% of the layers' },
      { id: 4, text: 'Rewriting PyTorch in assembly' },
    ],
    correctId: 2,
    explanation: "By quantizing parameters to 8-bit integers (INT8) and compiling to ONNX Runtime, Gilberto achieved a 73% size reduction and a 69% latency speedup!"
  }
];

export default function TriviaDemo() {
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'feedback', 'end'
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptId, setSelectedOptId] = useState(null);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  
  const [timeLeftMs, setTimeLeftMs] = useState(15000);
  const [timerStartTs, setTimerStartTs] = useState(null);
  const timerRef = useRef(null);

  const activeQuestion = QUESTIONS[currentIdx];

  useEffect(() => {
    if (gameState === 'playing') {
      setTimerStartTs(Date.now());
      setTimeLeftMs(15000);

      timerRef.current = setInterval(() => {
        setTimeLeftMs((prev) => {
          if (prev <= 100) {
            clearInterval(timerRef.current);
            handleAnswerSelect(null);
            return 0;
          }
          return Math.max(0, 15000 - (Date.now() - timerStartTs));
        });
      }, 50);
    }

    return () => clearInterval(timerRef.current);
  }, [gameState, currentIdx, timerStartTs]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing' || selectedOptId !== null) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 4) {
        handleAnswerSelect(activeQuestion.options[num - 1].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, selectedOptId, currentIdx]);

  const startGame = () => {
    setScore(0);
    setCorrectAnswers(0);
    setCurrentIdx(0);
    setSelectedOptId(null);
    setGameState('playing');
  };

  const handleAnswerSelect = (optionId) => {
    if (selectedOptId !== null) return;
    
    clearInterval(timerRef.current);
    setSelectedOptId(optionId);
    setGameState('feedback');

    const isCorrect = optionId === activeQuestion.correctId;
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      const elapsedMs = 15000 - timeLeftMs;
      const earned = Math.max(200, Math.round(1000 - (elapsedMs / 15000) * 800));
      setScore((prev) => prev + earned);
    }
  };

  const nextQuestion = () => {
    setSelectedOptId(null);
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setGameState('playing');
    } else {
      setGameState('end');
    }
  };

  const timePct = timeLeftMs / 15000;

  return (
    <div className="w-full bg-[#0f1115] border border-slate-850 p-6 shadow-flat-slate space-y-6 select-none font-mono text-xs max-w-2xl mx-auto">
      
      {/* Start screen */}
      {gameState === 'start' && (
        <div className="text-center py-8 space-y-6">
          <div className="w-12 h-12 bg-slate-900 text-blue-400 border border-slate-800 flex items-center justify-center mx-auto text-lg font-bold shadow-flat-slate-sm font-mono select-none">
            [?]
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">[SYS_UNIT // TAP_TAP_TRIVIA_QUIZ]</h4>
            <p className="text-[11px] text-slate-450 text-slate-500 max-w-md mx-auto leading-relaxed">
              Test your knowledge on the core systems Gilberto engineered. Scores decrement dynamically relative to your response latency.
            </p>
          </div>
          <button 
            onClick={startGame}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 border border-blue-500 text-white font-bold transition shadow-flat-slate uppercase tracking-wider text-[10px]"
          >
            Start Quiz Demo
          </button>
        </div>
      )}

      {/* Play screen */}
      {(gameState === 'playing' || gameState === 'feedback') && (
        <div className="space-y-6">
          {/* Header Progress */}
          <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            <span>QUESTION {currentIdx + 1} OF {QUESTIONS.length}</span>
            <span className="text-blue-400">SCORE: {score}</span>
          </div>

          {/* Time Limit Indicator */}
          {gameState === 'playing' && (
            <div className="flex items-center gap-3">
              <div className="flex-grow bg-[#0c0d12] h-3 border border-slate-850 overflow-hidden flex">
                <div 
                  className={`h-full transition-all duration-75 ${
                    timePct < 0.3 ? 'bg-red-650 bg-red-600' : timePct < 0.6 ? 'bg-amber-600 bg-amber-500' : 'bg-emerald-600 bg-emerald-500'
                  }`}
                  style={{ width: `${timePct * 100}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 min-w-10 text-right">{(timeLeftMs / 1000).toFixed(1)}S</span>
            </div>
          )}

          {/* Question stem */}
          <div className="bg-slate-950 border border-slate-850 p-4 min-h-[80px] flex items-center justify-center">
            <p className="text-slate-200 font-bold text-center text-xs leading-relaxed">{activeQuestion.stem.toUpperCase()}</p>
          </div>

          {/* Option list */}
          <div className="grid sm:grid-cols-2 gap-3">
            {activeQuestion.options.map((opt, i) => {
              const isSelected = selectedOptId === opt.id;
              const isCorrect = opt.id === activeQuestion.correctId;
              const answered = selectedOptId !== null;

              let btnStyle = "bg-slate-950 border-slate-850 text-slate-300 hover:bg-slate-900 hover:text-white shadow-flat-slate-sm";
              if (answered) {
                if (isCorrect) {
                  btnStyle = "bg-emerald-950 border-emerald-500 text-emerald-300";
                } else if (isSelected) {
                  btnStyle = "bg-red-950 border-red-500 text-red-300";
                } else {
                  btnStyle = "bg-[#0c0d12]/40 border-slate-900 text-slate-600 opacity-40";
                }
              }

              return (
                <button
                  key={opt.id}
                  disabled={answered}
                  onClick={() => handleAnswerSelect(opt.id)}
                  className={`border px-4 py-3 text-left text-xs font-bold transition duration-150 flex items-start gap-2 rounded-none ${btnStyle}`}
                  title={`Press keyboard key ${i + 1}`}
                >
                  <span className="opacity-45 text-[9px] mt-0.5">[{i + 1}]</span>
                  <span>{opt.text.toUpperCase()}</span>
                </button>
              );
            })}
          </div>

          {/* Explanations & Next Button */}
          {gameState === 'feedback' && (
            <div className="bg-slate-950 border border-slate-850 p-4 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  selectedOptId === activeQuestion.correctId ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {selectedOptId === activeQuestion.correctId ? '// ANSWER_MATCH // VERIFIED' : '// ANSWER_MISMATCH // FAULT'}
                </span>
                <button 
                  onClick={nextQuestion}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 border border-blue-500 text-white font-bold transition shadow-flat-slate-sm text-[9px] uppercase tracking-wider"
                >
                  {currentIdx === QUESTIONS.length - 1 ? 'FINISH' : 'NEXT'}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
                {activeQuestion.explanation.toUpperCase()}
              </p>
            </div>
          )}
        </div>
      )}

      {/* End Screen */}
      {gameState === 'end' && (
        <div className="text-center py-6 space-y-6">
          <div className="w-12 h-12 bg-slate-900 text-emerald-400 border border-slate-850 flex items-center justify-center mx-auto text-lg font-bold shadow-flat-slate-sm font-mono select-none">
            [OK]
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">QUIZ EVALUATION COMPLETE</h4>
            <p className="text-[11px] text-slate-450 text-slate-500">
              TOTAL SCORE EARNED: <span className="text-blue-400 font-bold">{score} POINTS</span>
            </p>
            <p className="text-[9px] text-slate-600 uppercase font-mono">
              ACCURACY RATIO: {correctAnswers} OF {QUESTIONS.length} CORRECT SESSIONS.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button 
              onClick={startGame}
              className="px-4 py-2 border border-slate-800 hover:bg-slate-850 text-slate-300 font-bold transition shadow-flat-slate-sm text-[9px] uppercase tracking-wider"
            >
              Play Again
            </button>
            <a 
              href="/Portfolio/projects/tap-tap-trivia"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 border border-blue-500 text-white font-bold transition shadow-flat-slate-sm text-[9px] uppercase tracking-wider flex items-center justify-center"
            >
              Go to Trivia Case Study
            </a>
          </div>
        </div>
      )}

    </div>
  );
}
