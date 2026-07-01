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
          const lastVal = prev[prev.length - 1];
          nextVal = Math.min(100, Math.floor(lastVal + Math.random() * 15 + 5));
        } else if (activePath === 's2') {
          nextVal = Math.max(5, Math.floor(10 + Math.random() * 10));
        } else {
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
    
    let risk = Math.floor((latestQueue / 100) * 60 + (latestLatency / 250) * 40);
    risk = Math.max(5, Math.min(99, risk));
    setCongestionRisk(risk);

    // Self-healing rules
    if (risk >= 70 && activePath === 's1' && !isSpiking) {
      setStatus('Congested');
    } else if (risk >= 70 && activePath === 's1' && isSpiking) {
      setStatus('Self-Healing');
      
      setTimeout(() => {
        setActivePath('s2');
        setPollingRate(1); // Scale up polling frequency (Intensive Mode)
        setIsSpiking(false);
        setStatus('Rerouted & Recovered');
      }, 1000);
    } else if (activePath === 's2' && risk < 30) {
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
    <div className="w-full bg-[#0f1115] border border-slate-850 p-6 shadow-flat-slate space-y-6 select-none font-mono text-xs">
      
      {/* Simulation Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-850 pb-4">
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            [SYS_UNIT // SDN_SELF_HEALING_CONSOLE]
          </h4>
          <p className="text-[10px] text-slate-500 mt-1">Simulates event-driven Kafka queuing & predictive traffic rerouting.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={triggerSpike}
            disabled={isSpiking || activePath === 's2'}
            className="px-3 py-1.5 bg-red-650 bg-red-700 hover:bg-red-600 text-white border border-red-500 hover:border-red-400 font-bold transition shadow-flat-slate disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-[10px]"
          >
            Inject Traffic Spike
          </button>
          <button 
            onClick={resetSim}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 font-bold transition shadow-flat-slate uppercase tracking-wider text-[10px]"
          >
            Reset Simulation
          </button>
        </div>
      </div>

      {/* Grid of charts & metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Metric panels */}
        <div className="space-y-4">
          
          <div className="bg-slate-950 border border-slate-850 p-4 flex flex-col justify-between shadow-flat-slate-sm">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">[SYS_STATUS]</span>
            <div className="flex justify-between items-end mt-3">
              <span className={`text-base font-bold uppercase tracking-wide ${
                status.includes('Healthy') ? 'text-emerald-500' :
                status.includes('Spike') || status.includes('Congested') ? 'text-amber-500' :
                status.includes('Healing') ? 'text-red-500 animate-pulse' : 'text-blue-500'
              }`}>
                {status}
              </span>
              <span className="text-[8px] text-slate-600">KAFKA_BUS</span>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-850 p-4 flex flex-col justify-between shadow-flat-slate-sm">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">[LSTM_CONGESTION_RISK]</span>
            <div className="flex justify-between items-end mt-3">
              <span className={`text-xl font-bold ${
                congestionRisk > 70 ? 'text-red-500 animate-pulse' :
                congestionRisk > 40 ? 'text-amber-500' : 'text-emerald-500'
              }`}>
                {congestionRisk}%
              </span>
              <span className="text-[9px] text-slate-600">LIMIT: 70%</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-[#0f1115] h-2 border border-slate-900 mt-3 flex">
              <div 
                className={`h-full transition-all duration-300 ${
                  congestionRisk > 70 ? 'bg-red-500' :
                  congestionRisk > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${congestionRisk}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-850 p-4 flex flex-col justify-between shadow-flat-slate-sm">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">[DQN_POLL_RATE]</span>
            <div className="flex justify-between items-end mt-3">
              <span className="text-xl font-bold text-blue-500">
                {pollingRate}S
              </span>
              <span className="text-[9px] text-slate-650 text-slate-500 uppercase">
                {pollingRate === 1 ? 'INTENSIVE' : 'STANDBY'}
              </span>
            </div>
          </div>

        </div>

        {/* Charts area */}
        <div className="md:col-span-2 space-y-4">
          
          {/* Chart 1: Queue Depth */}
          <div className="bg-slate-950 border border-slate-850 p-4">
            <div className="flex justify-between items-center mb-2 text-[10px]">
              <span className="font-bold text-slate-400">OPENFLOW_QUEUE_DEPTH</span>
              <span className="text-slate-600">LATEST: {dataPoints[dataPoints.length - 1]} PKTS</span>
            </div>
            <div className="h-[90px] w-full relative border border-slate-900 bg-[#0c0d12]">
              {/* Subtle background reference lines */}
              <div className="absolute top-[30px] left-0 right-0 border-t border-slate-950 border-dashed"></div>
              <div className="absolute top-[60px] left-0 right-0 border-t border-slate-950 border-dashed"></div>
              <svg className="w-full h-full" preserveAspectRatio="none">
                <path 
                  d={getSvgPath(dataPoints, 100)} 
                  fill="none" 
                  stroke={isSpiking ? '#ef4444' : '#3b82f6'} 
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
              </svg>
            </div>
          </div>

          {/* Chart 2: Latency */}
          <div className="bg-slate-950 border border-slate-850 p-4">
            <div className="flex justify-between items-center mb-2 text-[10px]">
              <span className="font-bold text-slate-400">FLOW_LATENCY_RTT</span>
              <span className="text-slate-600">LATEST: {latencyPoints[latencyPoints.length - 1]} MS</span>
            </div>
            <div className="h-[90px] w-full relative border border-slate-900 bg-[#0c0d12]">
              {/* Subtle background reference lines */}
              <div className="absolute top-[30px] left-0 right-0 border-t border-slate-950 border-dashed"></div>
              <div className="absolute top-[60px] left-0 right-0 border-t border-slate-950 border-dashed"></div>
              <svg className="w-full h-full" preserveAspectRatio="none">
                <path 
                  d={getSvgPath(latencyPoints, 250)} 
                  fill="none" 
                  stroke={isSpiking ? '#f59e0b' : '#10b981'} 
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
              </svg>
            </div>
          </div>

        </div>

      </div>

      {/* Visual Network Path Map */}
      <div className="bg-slate-950 border border-slate-850 p-4 flex flex-col items-center justify-center space-y-4">
        <span className="text-[10px] font-bold text-slate-400 self-start uppercase">// ACTIVE CONTROLLER PATH TOPOLOGY</span>
        
        <div className="flex items-center justify-between w-full max-w-lg relative py-6">
          
          {/* Node 1: Ingress */}
          <div className="flex flex-col items-center z-10">
            <div className="w-12 h-10 bg-[#0f1115] border border-slate-850 flex items-center justify-center font-bold text-slate-300 shadow">
              s3
            </div>
            <span className="text-[9px] text-slate-655 text-slate-500 font-mono mt-1 uppercase">INGRESS</span>
          </div>

          {/* Connections Grid */}
          <div className="flex-grow flex flex-col justify-around h-24 relative">
            
            {/* Primary Path line (s1) */}
            <div className="absolute top-2.5 left-6 right-6 h-0.5 pointer-events-none">
              <div className={`h-full w-full transition-all duration-500 ${
                activePath === 's1' 
                  ? 'bg-blue-500' 
                  : 'bg-slate-900'
              }`}></div>
            </div>

            {/* Backup Path line (s2) */}
            <div className="absolute bottom-2.5 left-6 right-6 h-0.5 pointer-events-none">
              <div className={`h-full w-full transition-all duration-500 ${
                activePath === 's2' 
                  ? 'bg-emerald-500' 
                  : 'bg-slate-900'
              }`}></div>
            </div>

            {/* Path Nodes */}
            <div className="flex justify-center gap-12 w-full">
              {/* Primary Switch */}
              <div className={`w-12 h-10 border flex items-center justify-center text-xs font-bold transition-all duration-300 z-10 rounded-none ${
                activePath === 's1' 
                  ? 'bg-blue-950/80 border-blue-500 text-blue-300' 
                  : 'bg-[#0f1115] border-slate-850 text-slate-600'
              }`}>
                s1
              </div>

              {/* Backup Switch */}
              <div className={`w-12 h-10 border flex items-center justify-center text-xs font-bold transition-all duration-300 z-10 rounded-none ${
                activePath === 's2' 
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' 
                  : 'bg-[#0f1115] border-slate-850 text-slate-600'
              }`}>
                s2
              </div>
            </div>

          </div>

          {/* Node 4: Egress */}
          <div className="flex flex-col items-center z-10">
            <div className="w-12 h-10 bg-[#0f1115] border border-slate-850 flex items-center justify-center font-bold text-slate-300 shadow">
              s4
            </div>
            <span className="text-[9px] text-slate-500 font-mono mt-1 uppercase">EGRESS</span>
          </div>

        </div>

        <div className="text-center font-bold py-1 px-3.5 bg-slate-900 border border-slate-850 text-[10px] uppercase select-none">
          {activePath === 's1' ? (
            <span className="text-blue-400">FLOW_PATH: VIA_CORE_PRIMARY (s1)</span>
          ) : (
            <span className="text-emerald-400 font-bold">FLOW_PATH: SELF_HEALED_VIA_BACKUP (s2)</span>
          )}
        </div>
      </div>

    </div>
  );
}
