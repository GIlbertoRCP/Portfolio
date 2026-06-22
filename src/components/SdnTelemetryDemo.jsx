import { useState, useEffect, useRef } from 'react';

export default function SdnTelemetryDemo() {
  const [dataPoints, setDataPoints] = useState([12, 18, 15, 22, 19, 14, 18, 16, 21, 24]);
  const [latencyPoints, setLatencyPoints] = useState([15, 22, 18, 25, 20, 16, 24, 21, 28, 30]);
  const [congestionRisk, setCongestionRisk] = useState(15); // Percentage
  const [pollingRate, setPollingRate] = useState(5); // Seconds
  const [activePath, setActivePath] = useState('s1'); // 's1' = Primary, 's2' = Backup
  const [status, setStatus] = useState('Healthy'); // 'Healthy', 'Congested', 'Self-Healing', 'Rerouted'
  const [isSpiking, setIsSpiking] = useState(false);
  const timerRef = useRef(null);

  // Simulation step
  useEffect(() => {
    // Polling interval is speeded up in the UI for animation purposes (pollingRate * 300ms)
    const intervalMs = pollingRate * 300;
    
    timerRef.current = setInterval(() => {
      setDataPoints((prev) => {
        let nextVal;
        if (isSpiking) {
          // Increase queue depth
          const lastVal = prev[prev.length - 1];
          nextVal = Math.min(100, Math.floor(lastVal + Math.random() * 15 + 5));
        } else if (activePath === 's2') {
          // Recovering/flat on backup path
          nextVal = Math.max(5, Math.floor(10 + Math.random() * 10));
        } else {
          // Normal background traffic
          nextVal = Math.max(5, Math.floor(15 + (Math.random() - 0.5) * 8));
        }
        return [...prev.slice(1), nextVal];
      });

      setLatencyPoints((prev) => {
        let nextVal;
        if (isSpiking) {
          const lastVal = prev[prev.length - 1];
          nextVal = Math.min(250, Math.floor(lastVal + Math.random() * 35 + 10));
        } else if (activePath === 's2') {
          nextVal = Math.max(10, Math.floor(15 + Math.random() * 15));
        } else {
          nextVal = Math.max(10, Math.floor(25 + (Math.random() - 0.5) * 15));
        }
        return [...prev.slice(1), nextVal];
      });
    }, intervalMs);

    return () => clearInterval(timerRef.current);
  }, [pollingRate, isSpiking, activePath]);

  // LSTM predictor simulation
  useEffect(() => {
    const latestQueue = dataPoints[dataPoints.length - 1];
    const latestLatency = latencyPoints[latencyPoints.length - 1];
    
    // Simple heuristic simulating the LSTM predictions
    let risk = Math.floor((latestQueue / 100) * 60 + (latestLatency / 250) * 40);
    risk = Math.max(5, Math.min(99, risk));
    setCongestionRisk(risk);

    // Self-healing rules
    if (risk >= 70 && activePath === 's1' && !isSpiking) {
      // Transition state
      setStatus('Congested');
    } else if (risk >= 70 && activePath === 's1' && isSpiking) {
      // Self-healing triggers!
      setStatus('Self-Healing');
      
      // After a brief pause, complete the healing
      setTimeout(() => {
        setActivePath('s2');
        setPollingRate(1); // Scale up polling frequency (Intensive Mode)
        setIsSpiking(false);
        setStatus('Rerouted & Recovered');
      }, 1000);
    } else if (activePath === 's2' && risk < 30) {
      // Allow fallback to normal state after some time
      setStatus('Rerouted (Stable)');
    }
  }, [dataPoints, latencyPoints]);

  const triggerSpike = () => {
    setIsSpiking(true);
    setStatus('Spike Injected');
  };

  const resetSim = () => {
    setIsSpiking(false);
    setActivePath('s1');
    setPollingRate(5);
    setStatus('Healthy');
    setDataPoints([12, 18, 15, 22, 19, 14, 18, 16, 21, 24]);
    setLatencyPoints([15, 22, 18, 25, 20, 16, 24, 21, 28, 30]);
  };

  // Helper to generate SVG path from values
  const getSvgPath = (points, maxVal) => {
    const width = 340;
    const height = 90;
    const step = width / (points.length - 1);
    
    return points
      .map((p, idx) => {
        const x = idx * step;
        const y = height - (p / maxVal) * height;
        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 select-none font-sans">
      
      {/* Simulation Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h4 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping"></span>
            Real-Time SDN Self-Healing Simulator
          </h4>
          <p className="text-xs text-slate-400">Interact with the controllers to simulate congestion forecasting & traffic rerouting.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={triggerSpike}
            disabled={isSpiking || activePath === 's2'}
            className="px-3.5 py-1.5 bg-red-600/90 hover:bg-red-500 text-white rounded-lg text-xs font-semibold shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Inject Traffic Spike
          </button>
          <button 
            onClick={resetSim}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
          >
            Reset Simulation
          </button>
        </div>
      </div>

      {/* Grid of charts & metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Metric panels */}
        <div className="space-y-4">
          
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">System Status</span>
            <div className="flex justify-between items-end mt-2">
              <span className={`text-lg font-bold font-display ${
                status.includes('Healthy') ? 'text-emerald-400' :
                status.includes('Spike') || status.includes('Congested') ? 'text-amber-500' :
                status.includes('Healing') ? 'text-red-400 animate-pulse' : 'text-blue-400'
              }`}>
                {status}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Kafka-ready</span>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">LSTM Congestion Risk</span>
            <div className="flex justify-between items-end mt-2">
              <span className={`text-2xl font-display font-extrabold ${
                congestionRisk > 70 ? 'text-red-400 animate-pulse' :
                congestionRisk > 40 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {congestionRisk}%
              </span>
              <span className="text-xs text-slate-400 font-mono">Limit: 70%</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  congestionRisk > 70 ? 'bg-red-500' :
                  congestionRisk > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${congestionRisk}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">DQN Polling Frequency</span>
            <div className="flex justify-between items-end mt-2">
              <span className="text-2xl font-display font-extrabold text-blue-400">
                {pollingRate}s
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {pollingRate === 1 ? 'Intensive Mode' : 'Standby Mode'}
              </span>
            </div>
          </div>

        </div>

        {/* Charts area */}
        <div className="md:col-span-2 space-y-4">
          
          {/* Chart 1: Queue Depth */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-300">OpenFlow Switch Queue Depth</span>
              <span className="text-[10px] text-slate-500 font-mono">Latest: {dataPoints[dataPoints.length - 1]} packets</span>
            </div>
            <div className="h-[90px] w-full relative">
              <svg className="w-full h-full" preserveAspectRatio="none">
                <path 
                  d={getSvgPath(dataPoints, 100)} 
                  fill="none" 
                  stroke={isSpiking ? '#ef4444' : '#3b82f6'} 
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />
              </svg>
            </div>
          </div>

          {/* Chart 2: Latency */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-300">Flow Transmission Latency (RTT)</span>
              <span className="text-[10px] text-slate-500 font-mono">Latest: {latencyPoints[latencyPoints.length - 1]} ms</span>
            </div>
            <div className="h-[90px] w-full relative">
              <svg className="w-full h-full" preserveAspectRatio="none">
                <path 
                  d={getSvgPath(latencyPoints, 250)} 
                  fill="none" 
                  stroke={isSpiking ? '#f59e0b' : '#10b981'} 
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />
              </svg>
            </div>
          </div>

        </div>

      </div>

      {/* Visual Network Path Map */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col items-center justify-center space-y-4">
        <span className="text-xs font-semibold text-slate-400 self-start">Active Controller Path</span>
        
        <div className="flex items-center justify-between w-full max-w-lg relative py-6">
          
          {/* Node 1: Ingress */}
          <div className="flex flex-col items-center z-10">
            <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center font-bold text-slate-300 shadow">
              s3
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-1">Ingress</span>
          </div>

          {/* Connections Grid */}
          <div className="flex-grow flex flex-col justify-around h-24 relative">
            
            {/* Primary Path line (s1) */}
            <div className="absolute top-2.5 left-6 right-6 h-0.5 pointer-events-none">
              <div className={`h-full w-full transition-all duration-500 ${
                activePath === 's1' 
                  ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6] animate-pulse' 
                  : 'bg-slate-800'
              }`}></div>
            </div>

            {/* Backup Path line (s2) */}
            <div className="absolute bottom-2.5 left-6 right-6 h-0.5 pointer-events-none">
              <div className={`h-full w-full transition-all duration-500 ${
                activePath === 's2' 
                  ? 'bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse' 
                  : 'bg-slate-800'
              }`}></div>
            </div>

            {/* Path Nodes */}
            <div className="flex justify-center gap-12 w-full">
              {/* Primary Switch */}
              <div className={`w-12 h-10 border rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 z-10 ${
                activePath === 's1' 
                  ? 'bg-blue-950/80 border-blue-500 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}>
                s1
              </div>

              {/* Backup Switch */}
              <div className={`w-12 h-10 border rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 z-10 ${
                activePath === 's2' 
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}>
                s2
              </div>
            </div>

          </div>

          {/* Node 4: Egress */}
          <div className="flex flex-col items-center z-10">
            <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center font-bold text-slate-300 shadow">
              s4
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-1">Egress</span>
          </div>

        </div>

        <div className="text-center text-xs font-semibold py-1 px-3.5 bg-slate-900 border border-slate-800 rounded-full">
          {activePath === 's1' ? (
            <span className="text-blue-400">Flow Routed via Core Primary (s1)</span>
          ) : (
            <span className="text-emerald-400">Self-Healed: Flow Rerouted to Backup Core (s2)</span>
          )}
        </div>
      </div>

    </div>
  );
}
