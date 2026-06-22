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

    // Create a new instance representing the C# instantiation
    const instanceId = Math.random().toString(36).substr(2, 9);
    const cartItem = { ...item, instanceId };
    
    setCart((prev) => [...prev, cartItem]);

    // Format logs showing OOP instantiation and polymorphism
    let oopLog = '';
    if (item.type === 'digital') {
      oopLog = `Instantiated DigitalProduct("${item.name}", $${item.price}, License: "${item.license}") -> Added to List<Product>`;
    } else if (item.type === 'physical') {
      oopLog = `Instantiated PhysicalProduct("${item.name}", $${item.price}, Weight: ${item.weight}kg) -> Added to List<Product>`;
    } else {
      oopLog = `Instantiated SubscriptionProduct("${item.name}", $${item.price}, Cycle: "${item.cycle}") -> Added to List<Product>`;
    }

    addLog(oopLog);
    addLog(`Cart List Count: ${cart.length + 1} | Subtotal: $${calculateSubtotal(prev => [...prev, cartItem]).toFixed(2)}`);
  };

  const removeFromCart = (instanceId, name) => {
    setCart((prev) => prev.filter((item) => item.instanceId !== instanceId));
    addLog(`Removed product item "${name}" from List<Product>.`);
  };

  const clearCart = () => {
    setCart([]);
    addLog('Cleared Generic List<Product>. Count set to 0.');
  };

  // Polymorphic calculation simulated in JS
  const calculateShippingForItem = (item) => {
    if (item.type === 'digital') return 0; // Digital has zero shipping cost
    if (item.type === 'physical') return item.weight * 5.00; // Physical is $5.00 per kg
    if (item.type === 'subscription') return 0; // Subscriptions do not ship
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
  const tax = subtotal * 0.08; // 8% sales tax
  const total = subtotal + shipping + tax;

  const totalWeight = cart
    .filter((i) => i.type === 'physical')
    .reduce((sum, i) => sum + i.weight, 0);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 font-sans select-none max-w-4xl mx-auto">
      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Left Control Panel: Selector & Cart Items */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">C# Object Catalog</h4>
            <div className="flex gap-3">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="flex-grow bg-slate-950 text-slate-200 text-sm rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              >
                {CATALOG.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.type.toUpperCase()}: {p.name} - ${p.price.toFixed(2)}
                  </option>
                ))}
              </select>
              <button
                onClick={addToCart}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-900/20 transition-all hover:scale-[1.02]"
              >
                Add Item
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Generic List&lt;Product&gt; Cart</h4>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-red-400 hover:text-red-300 font-semibold transition"
                >
                  Clear List
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="border border-dashed border-slate-850 rounded-xl p-8 text-center text-slate-500 text-xs">
                Your C# generic collection is empty. Select a product above to instantiate it and add it.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {cart.map((item) => {
                  let badgeColor = '';
                  let detailsStr = '';

                  if (item.type === 'digital') {
                    badgeColor = 'bg-blue-950/80 border-blue-500/20 text-blue-400';
                    detailsStr = `License Key: ${item.license}`;
                  } else if (item.type === 'physical') {
                    badgeColor = 'bg-emerald-950/80 border-emerald-500/20 text-emerald-400';
                    detailsStr = `Weight: ${item.weight} kg (Ship: $${calculateShippingForItem(item).toFixed(2)})`;
                  } else {
                    badgeColor = 'bg-purple-950/80 border-purple-500/20 text-purple-400';
                    detailsStr = `Billing Cycle: ${item.cycle}`;
                  }

                  return (
                    <div
                      key={item.instanceId}
                      className="bg-slate-950/60 border border-slate-850 hover:border-slate-800 rounded-xl p-3 flex justify-between items-center transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 border rounded text-[9px] font-bold uppercase tracking-wider ${badgeColor}`}>
                            {item.type}
                          </span>
                          <span className="text-xs font-semibold text-white">{item.name}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono">{detailsStr}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-slate-300">${item.price.toFixed(2)}</span>
                        <button
                          onClick={() => removeFromCart(item.instanceId, item.name)}
                          className="text-slate-500 hover:text-red-400 p-1 transition"
                          aria-label="Remove item"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
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
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Polymorphic Calculations</h4>
            
            <div className="space-y-2 text-xs font-medium text-slate-400">
              <div className="flex justify-between">
                <span>Catalog Subtotal:</span>
                <span className="text-slate-200">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Polymorphic Shipping:</span>
                <span className="text-slate-200">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Tax (8%):</span>
                <span className="text-slate-200">${tax.toFixed(2)}</span>
              </div>
              {totalWeight > 0 && (
                <div className="flex justify-between border-t border-slate-900 pt-2 text-[10px] font-mono text-slate-500">
                  <span>Physical Cargo Weight:</span>
                  <span>{totalWeight.toFixed(2)} kg</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-900 pt-3 text-sm font-bold">
                <span class="text-white">Cart Total:</span>
                <span className="text-blue-400 font-mono">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex-grow bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col h-40">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2 font-mono">C# Console Terminal Log</span>
            <div className="flex-grow overflow-y-auto font-mono text-[9px] text-slate-400 space-y-1.5 scrollbar-thin">
              {consoleLogs.map((log, index) => (
                <div key={index} className="leading-relaxed border-l-2 border-slate-800 pl-2">
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
