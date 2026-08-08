import React, { useState } from 'react';

export default function MovieMatcherDemo() {
  const initialDeck = [
    { id: 1, title: 'Blade Runner 2049', year: 2017, genre: 'Sci-Fi / Cyberpunk', score: 94, vector: [0.82, 0.45, -0.12, 0.95] },
    { id: 2, title: 'Dune: Part Two', year: 2024, genre: 'Sci-Fi / Epic', score: 91, vector: [0.78, 0.52, -0.08, 0.92] },
    { id: 3, title: 'Interstellar', year: 2014, genre: 'Sci-Fi / Drama', score: 88, vector: [0.85, 0.38, 0.15, 0.89] },
    { id: 4, title: 'Oppenheimer', year: 2023, genre: 'Biography / History', score: 85, vector: [0.35, 0.88, 0.42, 0.55] },
    { id: 5, title: 'The Dark Knight', year: 2008, genre: 'Action / Crime', score: 82, vector: [0.45, 0.65, -0.32, 0.72] },
  ];

  const [deck, setDeck] = useState(initialDeck);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userVector, setUserVector] = useState([0.5, 0.5, 0.0, 0.5]);
  const [swipedRight, setSwipedRight] = useState([]);
  const [socketConnected, setSocketConnected] = useState(true);
  const [matchNotification, setMatchNotification] = useState(null);
  const [onlineAdaptationCount, setOnlineAdaptationCount] = useState(0);

  const currentMovie = deck[currentIndex];

  const handleSwipe = (direction) => {
    if (!currentMovie) return;

    if (direction === 'right') {
      // Stochastic vector adaptation simulation: v_new = normalize(v_old + alpha * e_movie)
      const alpha = 0.25;
      const updatedVec = userVector.map((val, idx) => {
        const newVal = val + alpha * currentMovie.vector[idx];
        return Math.min(1.0, Math.max(-1.0, newVal));
      });
      setUserVector(updatedVec);
      setSwipedRight([...swipedRight, currentMovie]);
      setOnlineAdaptationCount((prev) => prev + 1);

      // Recalculate deck similarity scores using updated vector
      setDeck((prevDeck) =>
        prevDeck.map((item) => {
          const dot = item.vector.reduce((acc, v, i) => acc + v * updatedVec[i], 0);
          const newScore = Math.min(99, Math.max(40, Math.floor(dot * 60 + 40)));
          return { ...item, score: newScore };
        })
      );

      // Trigger instant match modal on certain movies to simulate room partner matching
      if (currentMovie.id === 1 || currentMovie.id === 3) {
        setMatchNotification({
          title: currentMovie.title,
          partner: 'Sarah (Guest)',
          matchPct: currentMovie.score,
        });
      }
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handleReset = () => {
    setDeck(initialDeck);
    setCurrentIndex(0);
    setUserVector([0.5, 0.5, 0.0, 0.5]);
    setSwipedRight([]);
    setMatchNotification(null);
    setOnlineAdaptationCount(0);
  };

  return (
    <div className="bg-[#0b0d11] border border-slate-800 rounded-2xl p-6 shadow-2xl font-mono space-y-6 select-none my-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-850 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${socketConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
              {socketConnected ? 'Socket.IO Room Session: Connected (Sub-ms Sync)' : 'Reconnecting Session...'}
            </span>
          </div>
          <h3 className="text-xl font-display font-extrabold text-white mt-1">Two-Tower Neural Online Learning &amp; Swipe Deck</h3>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSocketConnected(!socketConnected)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded hover:border-slate-700"
          >
            {socketConnected ? 'Simulate Network Drop' : 'Recover Socket State'}
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-bold rounded hover:bg-purple-600/40"
          >
            Reset Session
          </button>
        </div>
      </div>

      {/* Main Grid: Card Deck + Vector Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card Deck Viewport */}
        <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 flex flex-col justify-between relative min-h-[320px]">
          
          {/* Instant Match Notification Modal Overlay */}
          {matchNotification && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md rounded-xl z-20 p-6 flex flex-col items-center justify-center text-center space-y-4 border border-purple-500/50 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-purple-600/20 border border-purple-500 flex items-center justify-center text-purple-400 text-xl font-bold">
                🎉
              </div>
              <div>
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest block">INSTANT ROOM MATCH FOUND!</span>
                <h4 className="text-xl font-extrabold text-white">{matchNotification.title}</h4>
                <p className="text-xs text-slate-400 mt-1">You and {matchNotification.partner} both swiped right!</p>
              </div>
              <div className="px-3 py-1 bg-purple-950 border border-purple-500/40 rounded text-xs text-purple-300 font-bold">
                Neural Match Probability: {matchNotification.matchPct}%
              </div>
              <button
                onClick={() => setMatchNotification(null)}
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded transition"
              >
                CONTINUE SWIPING
              </button>
            </div>
          )}

          {currentMovie ? (
            <>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-950 border border-blue-800/60 rounded">
                    {currentMovie.genre}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    {currentMovie.score}% Neural Match
                  </span>
                </div>

                <div>
                  <h4 className="text-2xl font-extrabold text-white">{currentMovie.title}</h4>
                  <span className="text-xs text-slate-400 font-mono">Release Year: {currentMovie.year}</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Candidate tower vector encoded from 64D metadata embedding space. Real-time online MLP tower prediction score calculated over active session vector.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <button
                  onClick={() => handleSwipe('left')}
                  className="py-2.5 bg-rose-950/40 border border-rose-800/50 hover:bg-rose-900/50 text-rose-300 font-bold text-xs rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  ✕ PASS (DISLIKE)
                </button>
                <button
                  onClick={() => handleSwipe('right')}
                  className="py-2.5 bg-emerald-950/40 border border-emerald-800/50 hover:bg-emerald-900/50 text-emerald-300 font-bold text-xs rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  ♥ MATCH (LIKE)
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3 py-12">
              <span className="text-3xl">🎬</span>
              <h4 className="text-lg font-bold text-white">Deck Fully Processed</h4>
              <p className="text-xs text-slate-400">All candidate vectors evaluated against your preference vector.</p>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded hover:bg-blue-500 transition"
              >
                RESTART DEMO DECK
              </button>
            </div>
          )}

        </div>

        {/* Neural Vector Telemetry & Online Learning State */}
        <div className="space-y-4">
          
          <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-bold">Online User Vector Adaptation (64D Unit Sphere):</span>
              <span className="text-purple-400 font-bold">{onlineAdaptationCount} Updates Applied</span>
            </div>

            <div className="space-y-2">
              {['Sci-Fi Latent Dim', 'Drama/Bio Dim', 'Action/Thriller Dim', 'Pacing/Decade Dim'].map((dimLabel, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{dimLabel}</span>
                    <span className="font-mono font-bold text-blue-400">{userVector[i].toFixed(3)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${Math.max(5, (userVector[i] + 1) * 50)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Session Swiped Right History</span>
            {swipedRight.length === 0 ? (
              <span className="text-xs text-slate-500 italic block">No movies swiped right yet.</span>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {swipedRight.map((m) => (
                  <span key={m.id} className="px-2 py-1 bg-purple-950/80 border border-purple-800/60 rounded text-[10px] text-purple-300 font-bold">
                    ♥ {m.title}
                  </span>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
