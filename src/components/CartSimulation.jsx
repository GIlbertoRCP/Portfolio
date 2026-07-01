import { useState } from 'react';

// Product Catalog Data definitions representing C# classes
const CATALOG = [
  { id: 'p1', type: 'digital', name: 'Software Development Guide (E-Book)', price: 19.99, detail: 'Download link sent instantly', license: 'DEV-GUIDE-392A' },
  { id: 'p2', type: 'digital', name: 'ONNX ML Model License', price: 149.99, detail: 'API Key activation', license: 'ONNX-PRO-9981' },
  { id: 'p3', type: 'physical', name: 'Tremor Sensing MCU Board', price: 45.00, detail: 'Weight: 0.25 kg', weight: 0.25 },
  { id: 'p4', type: 'physical', name: '4-DOF Holonomic Mecanum Base', price: 120.00, detail: 'Weight: 1.8 kg', weight: 1.8 },
  { id: 'p5', type: 'subscription', name: 'Pro Telemetry Streaming Service', price: 29.99, detail: 'Billed monthly', cycle: 'Monthly' },
  { id: 'p6', type: 'subscription', name: 'Edge Inference Cloud Node', price: 89.99, detail: 'Billed monthly', cycle: 'Monthly' },
];

export default function CartSimulation() {
  const [cart, setCart] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(CATALOG[0].id);
  const [consoleLogs, setConsoleLogs] = useState([
    'System initialized. Generic List<Product> created in C# Memory.',
    'Ready to receive catalog products.'
  ]);

  const addLog = (msg) => {
    setConsoleLogs((prev) => [msg, ...prev.slice(0, 15)]);
  };

  const addToCart = () => {
    const item = CATALOG.find((p) => p.id === selectedProductId);
    if (!item) return;

    const instanceId = Math.random().toString(36).substr(2, 9);
    const cartItem = { ...item, instanceId };
    
    setCart((prev) => [...prev, cartItem]);

    let oopLog = '';
    if (item.type === 'digital') {
      oopLog = `Instantiated DigitalProduct("${item.name}", $${item.price}, License: "${item.license}") -> Added to List<Product>`;
    } else if (item.type === 'physical') {
      oopLog = `Instantiated PhysicalProduct("${item.name}", $${item.price}, Weight: ${item.weight}kg) -> Added to List<Product>`;
    } else {
      oopLog = `Instantiated SubscriptionProduct("${item.name}", $${item.price}, Cycle: "${item.cycle}") -> Added to List<Product>`;
    }

    addLog(oopLog);
    addLog(`Cart List Count: ${cart.length + 1} | Subtotal: $${calculateSubtotal([...cart, cartItem]).toFixed(2)}`);
  };

  const removeFromCart = (instanceId, name) => {
    setCart((prev) => prev.filter((item) => item.instanceId !== instanceId));
    addLog(`Removed product item "${name}" from List<Product>.`);
  };

  const clearCart = () => {
    setCart([]);
    addLog('Cleared Generic List<Product>. Count set to 0.');
  };

  const calculateShippingForItem = (item) => {
    if (item.type === 'digital') return 0;
    if (item.type === 'physical') return item.weight * 5.00;
    if (item.type === 'subscription') return 0;
    return 0;
  };

  const calculateSubtotal = (customCart = cart) => {
    return customCart.reduce((sum, item) => sum + item.price, 0);
  };

  const calculateTotalShipping = () => {
    return cart.reduce((sum, item) => sum + calculateShippingForItem(item), 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = calculateTotalShipping();
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const totalWeight = cart
    .filter((i) => i.type === 'physical')
    .reduce((sum, i) => sum + i.weight, 0);

  return (
    <div className="w-full bg-[#0f1115] border border-slate-850 p-6 shadow-flat-slate space-y-6 font-mono text-xs select-none max-w-4xl mx-auto">
      
      {/* Catalog Header */}
      <div className="border-b border-slate-850 pb-3 flex justify-between items-center select-none">
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            [SYS_UNIT // C#_OOP_OBJECT_SIMULATION]
          </h4>
          <p className="text-[10px] text-slate-500 mt-1">Interactively simulates inheritance and polymorphism of subclass structures.</p>
        </div>
        <div className="text-[10px] text-slate-500 uppercase">
          REF: NET-OOP-CARTSIM
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Left Control Panel */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">// INPUT // PRODUCT CATALOG SELECT</h4>
            <div className="flex gap-3">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="flex-grow bg-[#0c0d12] text-slate-200 text-xs rounded-none px-3 py-2 border border-slate-800 focus:outline-none focus:border-blue-500 font-mono"
              >
                {CATALOG.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.type.toUpperCase()}] {p.name} - ${p.price.toFixed(2)}
                  </option>
                ))}
              </select>
              <button
                onClick={addToCart}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 border border-blue-500 text-white rounded-none font-bold transition shadow-flat-slate text-[10px] uppercase tracking-wider"
              >
                Add_Item
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">// MEMORY // List&lt;Product&gt; INSTANCES</h4>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-[10px] text-red-500 hover:text-red-400 font-bold uppercase tracking-wider transition"
                >
                  Clear_List
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="border border-dashed border-slate-850 p-8 text-center text-slate-500 text-[11px] bg-slate-950">
                GENERIC List&lt;Product&gt; COLLECTION IS EMPTY. SELECT A PRODUCT FROM THE DROP-DOWN TO INSTANTIATE THE OBJECT.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {cart.map((item) => {
                  let badgeColor = '';
                  let detailsStr = '';

                  if (item.type === 'digital') {
                    badgeColor = 'border-blue-500/30 text-blue-400 bg-blue-950/20';
                    detailsStr = `LICENSE: ${item.license}`;
                  } else if (item.type === 'physical') {
                    badgeColor = 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20';
                    detailsStr = `WEIGHT: ${item.weight} KG (SHIPPING: $${calculateShippingForItem(item).toFixed(2)})`;
                  } else {
                    badgeColor = 'border-purple-500/30 text-purple-400 bg-purple-950/20';
                    detailsStr = `CYCLE: ${item.cycle.toUpperCase()}`;
                  }

                  return (
                    <div
                      key={item.instanceId}
                      className="bg-slate-950 border border-slate-850 p-3 flex justify-between items-center"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 border text-[8px] font-bold uppercase tracking-wider ${badgeColor}`}>
                            {item.type}
                          </span>
                          <span className="text-xs font-bold text-white">{item.name}</span>
                        </div>
                        <p className="text-[9px] text-slate-500">{detailsStr}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-slate-300">${item.price.toFixed(2)}</span>
                        <button
                          onClick={() => removeFromCart(item.instanceId, item.name)}
                          className="text-slate-500 hover:text-red-400 p-1 transition"
                          aria-label="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Execution & Totals Panel */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-6">
          <div className="bg-slate-950 border border-slate-850 p-5 space-y-4 shadow-flat-slate-sm">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">// CALC // POLYMORPHIC EVALUATION</h4>
            
            <div className="space-y-2 text-[10px] text-slate-400 font-mono">
              <div className="flex justify-between">
                <span>SUBTOTAL:</span>
                <span className="text-slate-200">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>POLYMORPHIC_SHIPPING:</span>
                <span className="text-slate-200">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>SALES_TAX (8%):</span>
                <span className="text-slate-200">${tax.toFixed(2)}</span>
              </div>
              {totalWeight > 0 && (
                <div className="flex justify-between border-t border-slate-900 pt-2 text-[9px] text-slate-550 text-slate-500">
                  <span>TOTAL_CARGO_WEIGHT:</span>
                  <span>{totalWeight.toFixed(2)} KG</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-900 pt-3 text-xs font-bold">
                <span class="text-white">TOTAL_COST:</span>
                <span className="text-blue-400 font-bold">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex-grow bg-slate-950 border border-slate-850 p-4 flex flex-col h-40">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-2 font-mono">// OUT // C# CONSOLE TERMINAL LOG</span>
            <div className="flex-grow overflow-y-auto font-mono text-[9px] text-slate-400 space-y-1.5 scrollbar-thin">
              {consoleLogs.map((log, index) => (
                <div key={index} className="leading-relaxed border-l-2 border-slate-850 pl-2">
                  <span className="text-blue-500 font-bold">&gt;</span> {log}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
