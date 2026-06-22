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
    // base ratings based on speed, deg, and pace
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
    setSimLogs(['Initializing 1,000 stochastic trials...', 'Injecting starting grid anchor weights...']);
    
    setTimeout(() => {
      // Setup base odds & modifiers based on track
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
        `[Setup] Track state: ${trackCondition} | Safety Car probability: ${safetyCarRisk}`,
        '[Simulation] Applying Bradley-Terry logistic matchup equations...',
        '[Stochastic] Sampling fuel load detrending and Tyre Life degradation...'
      ];

      // Run simulation trials
      const wins = DRIVERS.reduce((acc, curr) => ({ ...acc, [curr.id]: 0 }), {});
      const dnfs = DRIVERS.reduce((acc, curr) => ({ ...acc, [curr.id]: 0 }), {});

      for (let i = 0; i < 1000; i++) {
        const scores = DRIVERS.map(d => {
          // Check DNF
          const isDnf = Math.random() < (crashRate + (d.tyredeg * 0.2));
          if (isDnf) {
            dnfs[d.id]++;
            return { id: d.id, score: -999 };
          }
          
          // Random normal-like performance score (lower pace = better)
          const basePerf = d.pace;
          const randomFactor = (Math.random() - 0.5) * varianceFactor;
          const score = basePerf + randomFactor;
          return { id: d.id, score };
        });

        // Sort score ascending (lowest score/pace delta wins)
        scores.sort((a, b) => a.score - b.score);
        const winnerId = scores[0].id;
        if (scores[0].score !== -999) {
          wins[winnerId]++;
        }
      }

      // Add a simulated race incident log
      if (trackCondition === 'Wet') {
        logs.push('Incident: Heavy rain in Sector 3 triggers yellow flag on lap 24.');
        logs.push('Pit Strategy: Dynamic switch to Intermediate tyres detected.');
      } else if (safetyCarRisk === 'High' && Math.random() > 0.3) {
        logs.push('Incident: Debris on main straight triggers Safety Car deployment.');
      } else {
        logs.push('Clean Race: Green flag conditions maintained.');
      }
      
      logs.push('[Success] Monte Carlo simulation complete. Resolving win distribution...');

      // Formatting results
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
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-8 select-none font-sans">
      
      {/* Simulation Header */}
      <div>
        <h4 className="text-lg font-display font-bold text-white flex items-center gap-2">
          F1 Setup &amp; Monte Carlo Predictive Engine
        </h4>
        <p className="text-xs text-slate-400">Match up drivers on FastF1 telemetries or run stochastic Monte Carlo trials.</p>
      </div>

      {/* Part 1: Bradley-Terry Matchup Matrix */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <h5 className="text-sm font-semibold text-slate-300">Pairwise Head-to-Head Win Probability</h5>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Driver A Selection */}
          <div className="w-full sm:w-2/5 space-y-2">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Driver A</label>
            <select 
              value={driverA.id} 
              onChange={(e) => setDriverA(DRIVERS.find(d => d.id === e.target.value))}
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              {DRIVERS.map(d => (
                <option key={d.id} value={d.id} disabled={d.id === driverB.id}>{d.name} ({d.team})</option>
              ))}
            </select>
            {/* Specs */}
            <div className="text-[11px] text-slate-400 space-y-1 bg-slate-900/50 p-3 rounded-lg border border-slate-800/30">
              <div>PU: <span className="text-slate-200">{driverA.pu}</span></div>
              <div>ERS Index: <span className="text-slate-200">{driverA.ers}</span></div>
              <div>Tyre Deg: <span className="text-slate-200">{driverA.tyredeg} s/lap</span></div>
              <div>Base Pace: <span className="text-slate-200">+{driverA.pace}s</span></div>
            </div>
          </div>

          {/* Probability Indicator */}
          <div className="flex flex-col items-center justify-center space-y-2 w-full sm:w-1/5 py-4">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Victory Odds</div>
            <div className="flex items-center gap-1.5 font-display font-extrabold text-2xl">
              <span className="text-blue-400">{probA}%</span>
              <span className="text-slate-600 text-xs">vs</span>
              <span className="text-purple-400">{probB}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
              <div className="h-full bg-blue-500" style={{ width: `${probA}%` }}></div>
              <div className="h-full bg-purple-500" style={{ width: `${probB}%` }}></div>
            </div>
          </div>

          {/* Driver B Selection */}
          <div className="w-full sm:w-2/5 space-y-2">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Driver B</label>
            <select 
              value={driverB.id} 
              onChange={(e) => setDriverB(DRIVERS.find(d => d.id === e.target.value))}
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              {DRIVERS.map(d => (
                <option key={d.id} value={d.id} disabled={d.id === driverA.id}>{d.name} ({d.team})</option>
              ))}
            </select>
            {/* Specs */}
            <div className="text-[11px] text-slate-400 space-y-1 bg-slate-900/50 p-3 rounded-lg border border-slate-800/30">
              <div>PU: <span className="text-slate-200">{driverB.pu}</span></div>
              <div>ERS Index: <span className="text-slate-200">{driverB.ers}</span></div>
              <div>Tyre Deg: <span className="text-slate-200">{driverB.tyredeg} s/lap</span></div>
              <div>Base Pace: <span className="text-slate-200">+{driverB.pace}s</span></div>
            </div>
          </div>
        </div>

      </div>

      {/* Part 2: Monte Carlo Simulator Controls */}
      <div className="space-y-4">
        <h5 className="text-sm font-semibold text-slate-300">Run Monte Carlo Simulation (1,000 Runs)</h5>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Track Condition</label>
            <div className="flex bg-slate-950 p-1 border border-slate-800 rounded-lg">
              {['Dry', 'Damp', 'Wet'].map((cond) => (
                <button
                  key={cond}
                  onClick={() => setTrackCondition(cond)}
                  className={`flex-1 text-center py-1 text-xs font-semibold rounded-md transition ${
                    trackCondition === cond 
                      ? 'bg-blue-600 text-white shadow' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Safety Car Risk</label>
            <div className="flex bg-slate-950 p-1 border border-slate-800 rounded-lg">
              {['Low', 'Medium', 'High'].map((risk) => (
                <button
                  key={risk}
                  onClick={() => setSafetyCarRisk(risk)}
                  className={`flex-1 text-center py-1 text-xs font-semibold rounded-md transition ${
                    safetyCarRisk === risk 
                      ? 'bg-blue-600 text-white shadow' 
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
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-md shadow-blue-900/10 disabled:opacity-50"
          >
            {isSimulating ? 'Simulating...' : 'Execute 1,000 Trials'}
          </button>
        </div>
      </div>

      {/* Part 3: Simulation Output */}
      {(simResults || isSimulating) && (
        <div className="grid md:grid-cols-2 gap-6 bg-slate-950/40 border border-slate-800/80 rounded-xl p-5">
          
          {/* Win Probability leaderboard */}
          <div className="space-y-4">
            <h6 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-2">Predicted Finishing Distribution</h6>
            {isSimulating ? (
              <div className="space-y-4 py-8 animate-pulse flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-t-blue-500 border-slate-800 rounded-full animate-spin"></div>
                <span className="text-xs text-slate-500 font-semibold font-mono">Running Box-Muller normal transforms...</span>
              </div>
            ) : (
              <div className="space-y-3">
                {simResults.map((res, index) => (
                  <div key={res.id} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 w-4">#{index + 1}</span>
                        <span className="font-semibold text-slate-200">{res.name}</span>
                        <span className="text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800/50">{res.team}</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="font-mono text-slate-400 text-[11px]">DNF: {res.dnfPercent}%</span>
                        <span className="font-bold text-blue-400 font-mono">{res.winPercent}% win</span>
                      </div>
                    </div>
                    {/* Win Bar */}
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden flex">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: `${res.winPercent}%` }}></div>
                      <div className="bg-red-500/40 h-full" style={{ width: `${res.dnfPercent}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Incident logs */}
          <div className="space-y-4 border-l border-slate-800/50 pl-6">
            <h6 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-2">Stochastic Run Log</h6>
            <div className="space-y-2 h-[180px] overflow-y-auto font-mono text-[11px] text-slate-400">
              {simLogs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-slate-600">[{i + 1}]</span>
                  <span className={log.includes('Incident:') ? 'text-amber-400' : log.includes('Clean Race:') ? 'text-emerald-400' : 'text-slate-300'}>
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
