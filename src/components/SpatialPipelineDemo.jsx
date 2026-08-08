import React, { useState } from 'react';

export default function SpatialPipelineDemo() {
  const [moleculeCount, setMoleculeCount] = useState(200000);
  const [binningMethod, setBinningMethod] = useState('Voronoi');
  const [ingestionEngine, setIngestionEngine] = useState('PyArrow');
  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'anndata' | 'pyg'

  const getBenchmarkStats = () => {
    // Benchmark table values from real benchmark scaling
    const stats = {
      10000: { ingPyArrow: 13.7, ingPandas: 48.2, bin: 2.2, graph: 6.11, ram: 1.55 },
      50000: { ingPyArrow: 15.7, ingPandas: 112.5, bin: 3.8, graph: 6.49, ram: 2.79 },
      200000: { ingPyArrow: 69.2, ingPandas: 410.8, bin: 16.3, graph: 6.40, ram: 11.08 },
      500000: { ingPyArrow: 148.6, ingPandas: 980.4, bin: 40.4, graph: 6.55, ram: 27.68 },
    };

    const current = stats[moleculeCount] || stats[200000];
    const ingTime = ingestionEngine === 'PyArrow' ? current.ingPyArrow : current.ingPandas;
    const binMultiplier = binningMethod === 'Voronoi' ? 1.2 : binningMethod === 'Quadtree' ? 1.4 : 1.0;
    const finalBinTime = (current.bin * binMultiplier).toFixed(1);
    const totalTimeSec = ((ingTime + parseFloat(finalBinTime)) / 1000 + current.graph).toFixed(2);

    return {
      ingestionMs: ingTime.toFixed(1),
      binningMs: finalBinTime,
      graphSec: current.graph.toFixed(2),
      totalSec: totalTimeSec,
      peakRamMb: (current.ram * (ingestionEngine === 'PyArrow' ? 1.0 : 2.4)).toFixed(2),
    };
  };

  const metrics = getBenchmarkStats();

  return (
    <div className="bg-[#0b0d11] border border-slate-800 rounded-2xl p-6 shadow-2xl font-mono space-y-6 select-none my-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-850 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
            <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">Spatial Transcriptomics Benchmark Simulator</span>
          </div>
          <h3 className="text-xl font-display font-extrabold text-white mt-1">Memory-Constrained Spatial Graph &amp; AnnData Engine</h3>
        </div>

        {/* View mode tabs */}
        <div className="flex bg-slate-950 p-1 border border-slate-850 rounded-lg text-xs font-bold">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1 rounded transition-all ${
              activeTab === 'pipeline' ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
            }`}
          >
            Pipeline Benchmarks
          </button>
          <button
            onClick={() => setActiveTab('anndata')}
            className={`px-3 py-1 rounded transition-all ${
              activeTab === 'anndata' ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' : 'text-slate-400'
            }`}
          >
            AnnData (.h5ad)
          </button>
          <button
            onClick={() => setActiveTab('pyg')}
            className={`px-3 py-1 rounded transition-all ${
              activeTab === 'pyg' ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40' : 'text-slate-400'
            }`}
          >
            PyG GNN Export
          </button>
        </div>
      </div>

      {activeTab === 'pipeline' && (
        <>
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/60 p-4 border border-slate-850 rounded-xl">
            
            {/* Molecule dataset size */}
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Molecule Dataset Size (N)</label>
              <div className="grid grid-cols-2 gap-2">
                {[10000, 50000, 200000, 500000].map((count) => (
                  <button
                    key={count}
                    onClick={() => setMoleculeCount(count)}
                    className={`py-1.5 px-2 text-xs font-bold rounded border transition-all ${
                      moleculeCount === count
                        ? 'bg-cyan-600/20 border-cyan-500 text-cyan-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {count.toLocaleString()} mols
                  </button>
                ))}
              </div>
            </div>

            {/* Spatial Binning Algorithm */}
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Spatial Binning Algorithm</label>
              <div className="grid grid-cols-2 gap-2">
                {['Voronoi', 'Spatial Hashing', 'KD-Tree', 'Quadtree'].map((algo) => (
                  <button
                    key={algo}
                    onClick={() => setBinningMethod(algo)}
                    className={`py-1.5 px-2 text-[11px] font-bold rounded border transition-all ${
                      binningMethod === algo
                        ? 'bg-purple-600/20 border-purple-500 text-purple-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {algo}
                  </button>
                ))}
              </div>
            </div>

            {/* Data Ingestion Engine */}
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Ingestion Transfer Layer</label>
              <div className="grid grid-cols-2 gap-2">
                {['PyArrow', 'Pandas'].map((eng) => (
                  <button
                    key={eng}
                    onClick={() => setIngestionEngine(eng)}
                    className={`py-1.5 px-2 text-xs font-bold rounded border transition-all ${
                      ingestionEngine === eng
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {eng} {eng === 'PyArrow' ? '(Zero-Copy)' : '(Baseline)'}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Interactive Tile Partition & Out-of-Core Visualization */}
          <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-bold">Out-of-Core Spatial Tile Mesh &amp; Halo Boundary Stitching:</span>
              <span className="text-cyan-400 font-mono text-[10px]">Tile Bounds: [0,0] &rarr; [1000, 1000] µm</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              {[1, 2, 3, 4].map((tileId) => (
                <div key={tileId} className="bg-slate-950 border border-slate-800 rounded p-2.5 space-y-2 relative overflow-hidden group hover:border-cyan-500/50 transition">
                  <div className="flex justify-between text-[9px] text-slate-500 font-bold">
                    <span>TILE_{tileId}</span>
                    <span className="text-cyan-400">{(moleculeCount / 4).toLocaleString()} Mols</span>
                  </div>

                  {/* Synthetic binning points graphic */}
                  <div className="h-16 bg-black/50 rounded border border-slate-900 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:8px_8px]"></div>
                    <div className="text-[9px] text-slate-400 text-center font-mono z-10">
                      {binningMethod === 'Voronoi' ? 'Voronoi Seeds' : 'Uniform Grid'}
                    </div>
                  </div>

                  <div className="text-[8px] text-slate-400 flex justify-between font-mono">
                    <span>Halo Buffer: +50µm</span>
                    <span className="text-emerald-400">Clean Stitch</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="bg-slate-950 p-3.5 border border-slate-850 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Ingestion Latency</span>
              <div className="text-xl font-extrabold text-emerald-400">{metrics.ingestionMs} <span className="text-xs font-normal text-slate-400">ms</span></div>
              <span className="text-[9px] text-slate-500 block">{ingestionEngine} Arrow Ingestion</span>
            </div>

            <div className="bg-slate-950 p-3.5 border border-slate-850 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Binning Latency</span>
              <div className="text-xl font-extrabold text-purple-400">{metrics.binningMs} <span className="text-xs font-normal text-slate-400">ms</span></div>
              <span className="text-[9px] text-slate-500 block">{binningMethod} Partition</span>
            </div>

            <div className="bg-slate-950 p-3.5 border border-slate-850 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Pipeline Time</span>
              <div className="text-xl font-extrabold text-cyan-400">{metrics.totalSec} <span className="text-xs font-normal text-slate-400">sec</span></div>
              <span className="text-[9px] text-slate-500 block">End-to-End Execution</span>
            </div>

            <div className="bg-slate-950 p-3.5 border border-slate-850 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Peak Memory RAM</span>
              <div className="text-xl font-extrabold text-amber-400">{metrics.peakRamMb} <span className="text-xs font-normal text-slate-400">MB</span></div>
              <span className="text-[9px] text-slate-500 block">Out-of-Core Bound</span>
            </div>

          </div>
        </>
      )}

      {activeTab === 'anndata' && (
        <div className="bg-slate-950 border border-slate-850 p-5 rounded-xl space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">// Scanpy &amp; Squidpy AnnData (.h5ad) Export Schema</h4>
            <span className="text-xs text-purple-400 font-bold">adata = spatial_pipeline.io.to_anndata()</span>
          </div>
          
          <pre className="bg-black p-4 rounded-lg text-xs text-slate-300 overflow-x-auto leading-relaxed border border-slate-900 font-mono">
{`AnnData object with n_obs × n_vars = 12450 × 240
    obs: 'x_center', 'y_center', 'total_counts', 'n_genes'
    var: 'gene_ids', 'highly_variable'
    obsm:
        'spatial': matrix of shape (12450, 2) [Cell Coordinates (µm)]
    obsp:
        'spatial_connectivities': sparse CSR matrix of shape (12450, 12450) [k-NN Adjacency]
        'spatial_laplacian': sparse CSR matrix of shape (12450, 12450) [Graph Laplacian L = D - A]
    uns:
        'spatial_pipeline_params': {'bin_size': 20.0, 'binning_mode': '${binningMethod}', 'halo_microns': 50.0}`}
          </pre>
        </div>
      )}

      {activeTab === 'pyg' && (
        <div className="bg-slate-950 border border-slate-850 p-5 rounded-xl space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">// PyTorch Geometric (PyG) GNN Data Object</h4>
            <span className="text-xs text-emerald-400 font-bold">data = spatial_pipeline.io.to_pyg_data()</span>
          </div>

          <pre className="bg-black p-4 rounded-lg text-xs text-slate-300 overflow-x-auto leading-relaxed border border-slate-900 font-mono">
{`Data(
    x=[12450, 240],              # Node Feature Matrix (Gene Counts per Cell Bin)
    edge_index=[2, 74700],        # Graph Connectivity Edges (COO Sparse Format)
    edge_weight=[74700],          # Gaussian Spatial Distance Edge Weights
    pos=[12450, 2],               # 2D Spatial Cell Coordinates (x, y)
    laplacian_eigenvalues=[12450] # Spectral Graph Eigenvalue Embedding
)`}
          </pre>
        </div>
      )}

    </div>
  );
}
