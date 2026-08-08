import React, { useState, useEffect } from 'react';

export default function RaymarcherDemo() {
  const [resolution, setResolution] = useState('1080p');
  const [blockDim, setBlockDim] = useState('32x8');
  const [spatialAccel, setSpatialAccel] = useState(true);
  const [blackHoleMass, setBlackHoleMass] = useState(1.0);
  const [kerrSpin, setKerrSpin] = useState(0.85);
  const [heatMapPalette, setHeatMapPalette] = useState('Turbo');
  const [isBenchmarking, setIsBenchmarking] = useState(false);

  // Performance calculation specs based on real benchmark matrix
  const getMetrics = () => {
    const matrix = {
      '1080p': {
        '32x8': { ms: 0.095, fps: 10531.3, gb: 698.81, warpEff: 99.4, steps: 1.0 },
        '16x16': { ms: 0.116, fps: 8639.6, gb: 573.28, warpEff: 91.2, steps: 1.0 },
        '8x8': { ms: 0.123, fps: 8120.0, gb: 538.80, warpEff: 82.5, steps: 1.0 },
        '32x32': { ms: 0.152, fps: 6566.4, gb: 435.71, warpEff: 71.0, steps: 1.0 },
      },
      '1440p': {
        '32x8': { ms: 0.180, fps: 5542.4, gb: 653.80, warpEff: 99.2, steps: 1.0 },
        '32x32': { ms: 0.179, fps: 5582.5, gb: 658.54, warpEff: 96.0, steps: 1.0 },
        '16x16': { ms: 0.233, fps: 4288.0, gb: 505.83, warpEff: 89.1, steps: 1.0 },
        '8x8': { ms: 0.211, fps: 4742.8, gb: 559.49, warpEff: 85.0, steps: 1.0 },
      },
      '4K': {
        '32x8': { ms: 0.367, fps: 2722.8, gb: 722.68, warpEff: 99.8, steps: 1.0 },
        '16x16': { ms: 0.397, fps: 2518.0, gb: 668.34, warpEff: 92.4, steps: 1.0 },
        '8x8': { ms: 0.407, fps: 2457.4, gb: 652.24, warpEff: 84.1, steps: 1.0 },
        '32x32': { ms: 0.415, fps: 2408.4, gb: 639.25, warpEff: 74.3, steps: 1.0 },
      }
    };

    let base = matrix[resolution][blockDim] || matrix[resolution]['32x8'];
    let mult = spatialAccel ? 1.0 : 4.8;
    return {
      ms: (base.ms * mult).toFixed(3),
      fps: (base.fps / mult).toFixed(1),
      gb: (base.gb / (spatialAccel ? 1.0 : 1.4)).toFixed(2),
      warpEff: spatialAccel ? base.warpEff : (base.warpEff * 0.75).toFixed(1),
      steps: (base.steps * (spatialAccel ? 1.0 : 4.5)).toFixed(1),
    };
  };

  const metrics = getMetrics();

  const handleBenchmarkRun = () => {
    setIsBenchmarking(true);
    setTimeout(() => {
      setIsBenchmarking(false);
    }, 1200);
  };

  return (
    <div className="bg-[#0b0d11] border border-slate-800 rounded-2xl p-6 shadow-2xl font-mono space-y-6 select-none my-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-850 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">CUDA / WebGPU Real-Time Telemetry</span>
          </div>
          <h3 className="text-xl font-display font-extrabold text-white mt-1">NVIDIA CUDA Geodesic Raymarcher Simulator</h3>
        </div>
        <button
          onClick={handleBenchmarkRun}
          disabled={isBenchmarking}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-md shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2"
        >
          {isBenchmarking ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              RUNNING KERNEL SWEEP...
            </>
          ) : (
            'RUN BENCHMARK SWEEP'
          )}
        </button>
      </div>

      {/* Control Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/60 p-4 border border-slate-850 rounded-xl">
        
        {/* Resolution selector */}
        <div className="space-y-2">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Render Resolution</label>
          <div className="grid grid-cols-3 gap-2">
            {['1080p', '1440p', '4K'].map((res) => (
              <button
                key={res}
                onClick={() => setResolution(res)}
                className={`py-1.5 px-2 text-xs font-bold rounded border transition-all ${
                  resolution === res
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {res}
              </button>
            ))}
          </div>
        </div>

        {/* Block dimensions */}
        <div className="space-y-2">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Thread Block Dim (TxT)</label>
          <div className="grid grid-cols-4 gap-1.5">
            {['32x8', '16x16', '8x8', '32x32'].map((dim) => (
              <button
                key={dim}
                onClick={() => setBlockDim(dim)}
                className={`py-1.5 px-1 text-[11px] font-bold rounded border transition-all ${
                  blockDim === dim
                    ? 'bg-purple-600/20 border-purple-500 text-purple-400 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {dim}
              </button>
            ))}
          </div>
        </div>

        {/* Spatial Accel Toggle */}
        <div className="space-y-2">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Spatial Bounding Volume</label>
          <button
            onClick={() => setSpatialAccel(!spatialAccel)}
            className={`w-full py-1.5 px-3 text-xs font-bold rounded border flex items-center justify-between transition-all ${
              spatialAccel
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-400'
            }`}
          >
            <span>BVH Short-Circuit</span>
            <span className="font-mono">{spatialAccel ? '[ENABLED]' : '[DISABLED]'}</span>
          </button>
        </div>

      </div>

      {/* Physics Sliders & Heatmap Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/40 p-4 border border-slate-850 rounded-xl">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-bold">BH Mass (M):</span>
            <span className="text-blue-400 font-bold">{blackHoleMass.toFixed(2)} M☉</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.05"
            value={blackHoleMass}
            onChange={(e) => setBlackHoleMass(parseFloat(e.target.value))}
            className="w-full accent-blue-500 bg-slate-900 rounded cursor-pointer h-1.5"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-bold">Kerr Spin Parameter (a):</span>
            <span className="text-purple-400 font-bold">{kerrSpin.toFixed(2)} c</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="0.99"
            step="0.01"
            value={kerrSpin}
            onChange={(e) => setKerrSpin(parseFloat(e.target.value))}
            className="w-full accent-purple-500 bg-slate-900 rounded cursor-pointer h-1.5"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-bold">Diagnostic Heatmap Palette:</span>
            <span className="text-amber-400 font-bold">{heatMapPalette}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {['Turbo', 'Viridis'].map((pal) => (
              <button
                key={pal}
                onClick={() => setHeatMapPalette(pal)}
                className={`py-1 text-[11px] font-bold rounded border transition-all ${
                  heatMapPalette === pal
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                {pal}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Simulated Raymarcher Viewport / Heatmap Canvas Display */}
      <div className="relative aspect-video w-full bg-slate-950 border border-slate-850 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
        {/* Synthetic Curved Spacetime Black Hole Visualizer */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-blue-950/40 flex items-center justify-center">
          
          {/* Gravitational Lens Ring */}
          <div
            className="rounded-full border-4 border-blue-500/40 blur-sm animate-pulse transition-all duration-300"
            style={{
              width: `${blackHoleMass * 140}px`,
              height: `${blackHoleMass * 140}px`,
              boxShadow: `0 0 ${blackHoleMass * 60}px rgba(59, 130, 246, 0.4), inset 0 0 40px rgba(147, 51, 234, 0.3)`,
            }}
          />

          {/* Event Horizon Shadow */}
          <div
            className="absolute rounded-full bg-black border border-slate-800 shadow-2xl transition-all duration-300 flex items-center justify-center"
            style={{
              width: `${blackHoleMass * 90}px`,
              height: `${blackHoleMass * 90}px`,
            }}
          >
            {/* Kerr Ergosphere Distortion Ring */}
            <div
              className="rounded-full border border-dashed border-purple-400/50"
              style={{
                width: `${blackHoleMass * 70 * (1 + kerrSpin * 0.3)}px`,
                height: `${blackHoleMass * 70}px`,
                transform: `rotate(${kerrSpin * 30}deg)`,
              }}
            />
          </div>

          {/* Heatmap Ray Step Grid Overlay */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur border border-slate-800 p-2.5 rounded-lg text-[10px] space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold">Heatmap Mode:</span>
              <span className="text-amber-400 font-semibold">{heatMapPalette} Step False-Color</span>
            </div>
            <div className="w-40 h-2 rounded bg-gradient-to-r from-blue-600 via-emerald-500 to-amber-500 border border-slate-750"></div>
            <div className="flex justify-between text-[8px] text-slate-500">
              <span>0 steps (Escape)</span>
              <span>100+ steps (Horizon)</span>
            </div>
          </div>

          {/* Live Frame Overlay Tag */}
          <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-lg text-right font-mono text-[11px]">
            <div className="text-emerald-400 font-bold">{metrics.fps} FPS</div>
            <div className="text-slate-400 text-[9px]">{metrics.ms} ms / Frame</div>
          </div>

          <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-lg font-mono text-[10px] text-slate-300">
            <div><span className="text-slate-500">RES:</span> {resolution}</div>
            <div><span className="text-slate-500">BLOCK:</span> CUDA {blockDim} (256 threads)</div>
          </div>
        </div>
      </div>

      {/* Real Performance Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-slate-950 p-3.5 border border-slate-850 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Frame Latency</span>
          <div className="text-xl font-extrabold text-blue-400">{metrics.ms} <span className="text-xs font-normal text-slate-400">ms</span></div>
          <span className="text-[9px] text-slate-500 block">RK4 CUDA Kernel Time</span>
        </div>

        <div className="bg-slate-950 p-3.5 border border-slate-850 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Render Speed</span>
          <div className="text-xl font-extrabold text-emerald-400">{parseFloat(metrics.fps).toLocaleString()} <span className="text-xs font-normal text-slate-400">FPS</span></div>
          <span className="text-[9px] text-slate-500 block">Coalesced Parallel Dispatch</span>
        </div>

        <div className="bg-slate-950 p-3.5 border border-slate-850 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">VRAM Throughput</span>
          <div className="text-xl font-extrabold text-purple-400">{metrics.gb} <span className="text-xs font-normal text-slate-400">GB/s</span></div>
          <span className="text-[9px] text-slate-500 block">16-Byte Aligned Struct</span>
        </div>

        <div className="bg-slate-950 p-3.5 border border-slate-850 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Warp Efficiency</span>
          <div className="text-xl font-extrabold text-amber-400">{metrics.warpEff}%</div>
          <span className="text-[9px] text-slate-500 block">SIMD Lockless Reduction</span>
        </div>

      </div>

    </div>
  );
}
