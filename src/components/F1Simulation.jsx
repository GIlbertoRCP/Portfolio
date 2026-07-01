import { useState } from 'react';

// Sample Driver Data with simulated FastF1 features
const DRIVERS = [
  { id: 'VER', name: 'Max Verstappen', team: 'Red Bull', pu: 'Red Bull PT', speedTrap: 331.4, tyredeg: 0.075, ers: 0.88, pace: 0.00 },
  { id: 'NOR', name: 'Lando Norris', team: 'McLaren', pu: 'Mercedes', speedTrap: 333.8, tyredeg: 0.068, ers: 0.95, pace: 0.05 },
  { id: 'LEC', name: 'Charles Leclerc', team: 'Ferrari', pu: 'Ferrari', speedTrap: 332.1, tyredeg: 0.070, ers: 0.90, pace: 0.08 },
  { id: 'HAM', name: 'Lewis Hamilton', team: 'Ferrari', pu: 'Ferrari', speedTrap: 331.8, tyredeg: 0.072, ers: 0.89, pace: 0.12 },
  { id: 'PIA', name: 'Oscar Piastri', team: 'McLaren', pu: 'Mercedes', speedTrap: 333.5, tyredeg: 0.074, ers: 0.92, pace: 0.14 },
  { id: 'ALO', name: 'Fernando Alonso', team: 'Aston Martin', pu: 'Honda', speedTrap: 329.8, tyredeg: 0.082, ers: 0.78, pace: 0.28 },
];

export default function F1Simulation() {
  const [driverA, setDriverA] = useState(DRIVERS[0]);
  const [driverB, setDriverB] = useState(DRIVERS[1]);
  const [trackCondition, setTrackCondition] = useState('Dry'); // 'Dry', 'Damp', 'Wet'
  const [safetyCarRisk, setSafetyCarRisk] = useState('Medium'); // 'Low', 'Medium', 'High'
  
  const [simResults, setSimResults] = useState(null);
  const [simLogs, setSimLogs] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Bradley-Terry probability calculation
  const getWinProbability = (da, db) => {
    const ratingA = (10 - da.pace * 10) + (da.speedTrap - 325) * 0.4 - (da.tyredeg * 50) + (da.ers * 5);
    const ratingB = (10 - db.pace * 10) + (db.speedTrap - 325) * 0.4 - (db.tyredeg * 50) + (db.ers * 5);
    
    const probA = ratingA / (ratingA + ratingB);
    return Math.round(probA * 100);
  };

  const probA = getWinProbability(driverA, driverB);
  const probB = 100 - probA;

  // Monte Carlo simulation runner
  const runMonteCarlo = () => {
    setIsSimulating(true);
    setSimLogs(['[STOCHASTIC] INITIALIZING 1,000 TRIAL ITERATIONS...', '[STOCHASTIC] INJECTING COEF WEIGHTS FROM QUALITY GRID...']);
    
    setTimeout(() => {
      let crashRate = 0.02;
      let varianceFactor = 0.05;
      
      if (trackCondition === 'Damp') {
        crashRate = 0.06;
        varianceFactor = 0.12;
      } else if (trackCondition === 'Wet') {
        crashRate = 0.15;
        varianceFactor = 0.25;
      }

      const logs = [
        `[SETUP] TRACK STATE: ${trackCondition.toUpperCase()} // SAFETY CAR PROBABILITY: ${safetyCarRisk.toUpperCase()}`,
        '[SIMULATION] RESOLVING RADIAL MATCHUP Preferential Odds...',
        '[SIMULATION] COMPILING STOCHASTIC TYRE LIFE DEGRADATION DECAY...'
      ];

      const wins = DRIVERS.reduce((acc, curr) => ({ ...acc, [curr.id]: 0 }), {});
      const dnfs = DRIVERS.reduce((acc, curr) => ({ ...acc, [curr.id]: 0 }), {});

      for (let i = 0; i < 1000; i++) {
        const scores = DRIVERS.map(d => {
          const isDnf = Math.random() < (crashRate + (d.tyredeg * 0.2));
          if (isDnf) {
            dnfs[d.id]++;
            return { id: d.id, score: -999 };
          }
          
          const basePerf = d.pace;
          const randomFactor = (Math.random() - 0.5) * varianceFactor;
          const score = basePerf + randomFactor;
          return { id: d.id, score };
        });

        scores.sort((a, b) => a.score - b.score);
        const winnerId = scores[0].id;
        if (scores[0].score !== -999) {
          wins[winnerId]++;
        }
      }

      if (trackCondition === 'Wet') {
        logs.push('INCIDENT: DEBRIS/RAIN IN SECTOR 3 TRIGGERS PIT INTERMEDIATES.');
      } else if (safetyCarRisk === 'High' && Math.random() > 0.3) {
        logs.push('INCIDENT: SPECTATOR OR CLUTCH FAULT TRIGGERS FULL SAFETY CAR.');
      } else {
        logs.push('INCIDENT: GREEN FLAG CONTINUITY THROUGHOUT ENTIRE SECTOR.');
      }
      
      logs.push('[STOCHASTIC] GAUSSIAN RUN CONCLUDED SUCCESSFULLY.');

      const results = DRIVERS.map(d => ({
        ...d,
        winPercent: Math.round((wins[d.id] / 1000) * 100),
        dnfPercent: Math.round((dnfs[d.id] / 1000) * 100)
      })).sort((a, b) => b.winPercent - a.winPercent);

      setSimResults(results);
      setSimLogs(logs);
      setIsSimulating(false);
    }, 900);
  };

  return (
    <div className="w-full bg-[#0f1115] border border-slate-850 p-6 shadow-flat-slate space-y-8 select-none font-mono text-xs">
      
      {/* Simulation Header */}
      <div className="border-b border-slate-850 pb-3 flex justify-between items-center">
        <div>
          <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            [SYS_UNIT // F1_MONTE_CARLO_SIMULATOR]
          </h4>
          <p className="text-[10px] text-slate-500 mt-1">Evaluates pairwise preferences on telemetry data blocks.</p>
        </div>
        <div className="text-[10px] text-slate-500 uppercase">
          REF: F1-ORACLE-MC-04
        </div>
      </div>

      {/* Part 1: Bradley-Terry Matchup Matrix */}
      <div className="border border-slate-850 bg-slate-950 p-5 space-y-4">
        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">// STEP_01 // PAIRWISE COMPARATOR MATRIX</h5>
        
        <div className="flex flex-col sm:flex-row items-stretch gap-6">
          {/* Driver A Selection */}
          <div className="w-full sm:w-2/5 space-y-3">
            <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">DRIVER_A [REF]</label>
            <select 
              value={driverA.id} 
              onChange={(e) => setDriverA(DRIVERS.find(d => d.id === e.target.value))}
              className="w-full bg-[#0f1115] border border-slate-800 text-white rounded-none px-3 py-2 text-xs focus:outline-none focus:border-blue-500 font-mono"
            >
              {DRIVERS.map(d => (
                <option key={d.id} value={d.id} disabled={d.id === driverB.id}>{d.name.toUpperCase()} ({d.team.toUpperCase()})</option>
              ))}
            </select>
            {/* Specs */}
            <div className="text-[10px] text-slate-450 text-slate-400 space-y-1.5 bg-[#0f1115]/50 p-3 border border-slate-900">
              <div className="flex justify-between"><span>POWER_UNIT:</span> <span className="text-slate-200">{driverA.pu}</span></div>
              <div className="flex justify-between"><span>ERS_EFFICIENCY:</span> <span className="text-slate-200">{driverA.ers}</span></div>
              <div className="flex justify-between"><span>TYRE_DEG_COEF:</span> <span className="text-slate-200">+{driverA.tyredeg}s</span></div>
              <div className="flex justify-between"><span>PACE_DELTA:</span> <span className="text-slate-200">+{driverA.pace}s</span></div>
            </div>
          </div>

          {/* Probability Indicator */}
          <div className="flex flex-col items-center justify-center space-y-3 w-full sm:w-1/5 py-4 border-y sm:border-y-0 sm:border-x border-slate-900 px-4">
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">PROB_DISTRIBUTION</div>
            <div className="flex items-center gap-1.5 font-mono font-bold text-lg">
              <span className="text-blue-400">{probA}%</span>
              <span className="text-slate-600 text-xs font-normal">v</span>
              <span className="text-purple-400">{probB}%</span>
            </div>
            <div className="w-full bg-slate-900 h-3 border border-slate-850 flex">
              <div className="h-full bg-blue-600" style={{ width: `${probA}%` }}></div>
              <div className="h-full bg-purple-600" style={{ width: `${probB}%` }}></div>
            </div>
          </div>

          {/* Driver B Selection */}
          <div className="w-full sm:w-2/5 space-y-3">
            <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">DRIVER_B [COMP]</label>
            <select 
              value={driverB.id} 
              onChange={(e) => setDriverB(DRIVERS.find(d => d.id === e.target.value))}
              className="w-full bg-[#0f1115] border border-slate-800 text-white rounded-none px-3 py-2 text-xs focus:outline-none focus:border-blue-500 font-mono"
            >
              {DRIVERS.map(d => (
                <option key={d.id} value={d.id} disabled={d.id === driverA.id}>{d.name.toUpperCase()} ({d.team.toUpperCase()})</option>
              ))}
            </select>
            {/* Specs */}
            <div className="text-[10px] text-slate-400 space-y-1.5 bg-[#0f1115]/50 p-3 border border-slate-900">
              <div className="flex justify-between"><span>POWER_UNIT:</span> <span className="text-slate-200">{driverB.pu}</span></div>
              <div className="flex justify-between"><span>ERS_EFFICIENCY:</span> <span className="text-slate-200">{driverB.ers}</span></div>
              <div className="flex justify-between"><span>TYRE_DEG_COEF:</span> <span className="text-slate-200">+{driverB.tyredeg}s</span></div>
              <div className="flex justify-between"><span>PACE_DELTA:</span> <span className="text-slate-200">+{driverB.pace}s</span></div>
            </div>
          </div>
        </div>

      </div>

      {/* Part 2: Monte Carlo Simulator Controls */}
      <div className="space-y-4">
        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">// STEP_02 // STOCHASTIC PARAMETERS &amp; MONTE CARLO SETUP</h5>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-[9px] text-slate-550 text-slate-500 font-bold uppercase tracking-wider block mb-2">TRACK_STATE</label>
            <div className="flex border border-slate-850 p-0.5 bg-slate-950">
              {['Dry', 'Damp', 'Wet'].map((cond) => (
                <button
                  key={cond}
                  onClick={() => setTrackCondition(cond)}
                  className={`flex-1 text-center py-1 text-[9px] font-bold uppercase tracking-wider transition ${
                    trackCondition === cond 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-2">SAFETY_CAR_SCENARIO</label>
            <div className="flex border border-slate-850 p-0.5 bg-slate-950">
              {['Low', 'Medium', 'High'].map((risk) => (
                <button
                  key={risk}
                  onClick={() => setSafetyCarRisk(risk)}
                  className={`flex-1 text-center py-1 text-[9px] font-bold uppercase tracking-wider transition ${
                    safetyCarRisk === risk 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {risk}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={runMonteCarlo}
            disabled={isSimulating}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 font-bold transition shadow-flat-slate disabled:opacity-50 text-[10px] uppercase tracking-wider"
          >
            {isSimulating ? 'SIMULATION_RUNNING...' : 'EXECUTE 1,000 TRIALS'}
          </button>
        </div>
      </div>

      {/* Part 3: Simulation Output */}
      {(simResults || isSimulating) && (
        <div className="grid md:grid-cols-2 gap-6 bg-slate-950 border border-slate-850 p-5 shadow-inner">
          
          {/* Win Probability leaderboard */}
          <div className="space-y-4">
            <h6 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-900 pb-2">// OUT // FINISHING_ORDER_DISTR</h6>
            {isSimulating ? (
              <div className="space-y-3 py-8 flex flex-col items-center justify-center text-center">
                <div className="w-6 h-6 border-2 border-t-blue-500 border-slate-800 animate-spin"></div>
                <span className="text-[10px] text-slate-500 font-mono">SAMPLING COVARIANCE SCATTER...</span>
              </div>
            ) : (
              <div className="space-y-3">
                {simResults.map((res, index) => (
                  <div key={res.id} className="space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-600">[{index + 1}]</span>
                        <span className="font-bold text-slate-200">{res.name.toUpperCase()}</span>
                        <span className="text-[8px] text-slate-500 border border-slate-900 px-1">{res.team.toUpperCase()}</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-slate-550 text-slate-500">DNF: {res.dnfPercent}%</span>
                        <span className="font-bold text-blue-400">{res.winPercent}% WIN</span>
                      </div>
                    </div>
                    {/* Win Bar */}
                    <div className="w-full bg-[#0f1115] h-2 border border-slate-900 flex">
                      <div className="bg-blue-600 h-full" style={{ width: `${res.winPercent}%` }}></div>
                      <div className="bg-red-700/50 h-full" style={{ width: `${res.dnfPercent}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Incident logs */}
          <div className="space-y-4 border-t md:border-t-0 md:border-l border-slate-850 pt-4 md:pt-0 md:pl-6">
            <h6 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-900 pb-2">// OUT // TRIAL_LOG_STREAM</h6>
            <div className="space-y-1.5 h-[160px] overflow-y-auto font-mono text-[10px] text-slate-450 text-slate-500">
              {simLogs.map((log, i) => (
                <div key={i} className="flex gap-1.5 leading-tight">
                  <span className="text-slate-700">[{i + 1}]</span>
                  <span className={log.includes('INCIDENT:') ? 'text-amber-500 font-semibold' : log.includes('[STOCHASTIC]') ? 'text-emerald-500' : 'text-slate-400'}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
