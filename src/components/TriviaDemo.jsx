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
      { id: 3, text: 'Pruning 99% of the neural layers' },
      { id: 4, text: 'Rewriting PyTorch in raw assembly' },
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
  
  // Countdown Timer
  const [timeLeftMs, setTimeLeftMs] = useState(15000); // 15 seconds per question
  const [timerStartTs, setTimerStartTs] = useState(null);
  const timerRef = useRef(null);

  const activeQuestion = QUESTIONS[currentIdx];

  // Start question timer
  useEffect(() => {
    if (gameState === 'playing') {
      setTimerStartTs(Date.now());
      setTimeLeftMs(15000);

      timerRef.current = setInterval(() => {
        setTimeLeftMs((prev) => {
          if (prev <= 100) {
            clearInterval(timerRef.current);
            handleAnswerSelect(null); // Time out
            return 0;
          }
          return Math.max(0, 15000 - (Date.now() - timerStartTs));
        });
      }, 50);
    }

    return () => clearInterval(timerRef.current);
  }, [gameState, currentIdx, timerStartTs]);

  // Keyboard shortcut listener (1..4)
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
    if (selectedOptId !== null) return; // Answered already
    
    clearInterval(timerRef.current);
    setSelectedOptId(optionId);
    setGameState('feedback');

    const isCorrect = optionId === activeQuestion.correctId;
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      // Response-time based scoring (max 1000, drops on elapsed time)
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
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 select-none font-sans max-w-2xl mx-auto">
      
      {/* Start screen */}
      {gameState === 'start' && (
        <div className="text-center py-8 space-y-6">
          <div className="w-16 h-16 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto text-3xl font-bold animate-bounce">
            ⚡
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-display font-bold text-white">Tap-Tap Trivia Mini Quiz</h4>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">Test your knowledge on the core systems Gilberto engineered. Dynamic scores count down on your buzzer response time!</p>
          </div>
          <button 
            onClick={startGame}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-900/15 transition-all hover:scale-105"
          >
            🕹️ Start Quiz Demo
          </button>
        </div>
      )}

      {/* Play screen */}
      {(gameState === 'playing' || gameState === 'feedback') && (
        <div className="space-y-6">
          {/* Header Progress */}
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Question {currentIdx + 1} of {QUESTIONS.length}</span>
            <span className="font-mono text-blue-400">Score: {score}</span>
          </div>

          {/* Time Limit Indicator */}
          {gameState === 'playing' && (
            <div className="flex items-center gap-3">
              <div className="flex-grow bg-slate-950 h-2 border border-slate-800/80 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-75 ${
                    timePct < 0.3 ? 'bg-red-500' : timePct < 0.6 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${timePct * 100}%` }}
                ></div>
              </div>
              <span className="text-xs font-mono text-slate-400 min-w-10 text-right">{(timeLeftMs / 1000).toFixed(1)}s</span>
            </div>
          )}

          {/* Question stem */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4 min-h-[80px] flex items-center justify-center">
            <p className="text-slate-100 font-medium text-center text-[15px] leading-relaxed">{activeQuestion.stem}</p>
          </div>

          {/* Option list */}
          <div className="grid sm:grid-cols-2 gap-3">
            {activeQuestion.options.map((opt, i) => {
              const isSelected = selectedOptId === opt.id;
              const isCorrect = opt.id === activeQuestion.correctId;
              const answered = selectedOptId !== null;

              let btnStyle = "bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-900/60 hover:text-white";
              if (answered) {
                if (isCorrect) {
                  btnStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]";
                } else if (isSelected) {
                  btnStyle = "bg-red-950/80 border-red-500 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.2)]";
                } else {
                  btnStyle = "bg-slate-950/20 border-slate-900 text-slate-600 opacity-60";
                }
              }

              return (
                <button
                  key={opt.id}
                  disabled={answered}
                  onClick={() => handleAnswerSelect(opt.id)}
                  className={`border rounded-xl px-4 py-3 text-left text-sm font-medium transition duration-200 flex items-start gap-2 ${btnStyle}`}
                  title={`Press keyboard key ${i + 1}`}
                >
                  <span className="opacity-50 font-mono text-xs mt-0.5">{i + 1}.</span>
                  <span>{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Explanations & Next Button */}
          {gameState === 'feedback' && (
            <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-4 space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  selectedOptId === activeQuestion.correctId ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {selectedOptId === activeQuestion.correctId ? '✨ Correct Answer!' : '❌ Incorrect Answer'}
                </span>
                <button 
                  onClick={nextQuestion}
                  className="px-4 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow transition"
                >
                  {currentIdx === QUESTIONS.length - 1 ? 'Finish Quiz 🏁' : 'Next Question ➡️'}
                </button>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                {activeQuestion.explanation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* End Screen */}
      {gameState === 'end' && (
        <div className="text-center py-6 space-y-6">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto text-3xl font-bold animate-pulse">
            🏆
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-display font-bold text-white">Quiz Finished!</h4>
            <p className="text-sm text-slate-400">
              You scored <span className="text-blue-400 font-bold font-mono">{score}</span> points.
            </p>
            <p className="text-xs text-slate-500 font-mono">
              Accuracy: {correctAnswers} / {QUESTIONS.length} correct.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button 
              onClick={startGame}
              className="px-5 py-2 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition"
            >
              🔄 Play Again
            </button>
            <a 
              href="/projects/tap-tap-trivia"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1"
            >
              🎮 Go to Trivia Case Study
            </a>
          </div>
        </div>
      )}

    </div>
  );
}
