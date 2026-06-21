import { useState, useCallback } from 'react';
import ReactFlow, { Background, Controls, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import 'reactflow/dist/style.css';

// Sleek styling for ReactFlow nodes to match our modern dark portfolio
const batteryStyle = {
  background: 'rgba(239, 68, 68, 0.1)',
  color: '#fca5a5',
  border: '2px solid #ef4444',
  boxShadow: '0 0 15px rgba(239, 68, 68, 0.25)',
  borderRadius: '12px',
  fontWeight: '600',
  padding: '10px 14px',
  fontSize: '12px',
  fontFamily: 'Outfit, sans-serif'
};

const highPowerStyle = {
  background: 'rgba(249, 115, 22, 0.1)',
  color: '#fed7aa',
  border: '2px solid #f97316',
  boxShadow: '0 0 15px rgba(249, 115, 22, 0.2)',
  borderRadius: '12px',
  fontWeight: '600',
  padding: '10px 14px',
  fontSize: '12px',
  fontFamily: 'Outfit, sans-serif'
};

const logicPowerStyle = {
  background: 'rgba(6, 182, 212, 0.1)',
  color: '#cffafe',
  border: '2px solid #06b6d4',
  boxShadow: '0 0 15px rgba(6, 182, 212, 0.2)',
  borderRadius: '12px',
  fontWeight: '600',
  padding: '10px 14px',
  fontSize: '12px',
  fontFamily: 'Outfit, sans-serif'
};

const esp32Style = {
  background: 'rgba(168, 85, 247, 0.15)',
  color: '#f3e8ff',
  border: '2px solid #a855f7',
  boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)',
  borderRadius: '12px',
  fontWeight: '700',
  padding: '12px 16px',
  fontSize: '13px',
  fontFamily: 'Outfit, sans-serif'
};

const sensorStyle = {
  background: 'rgba(16, 185, 129, 0.1)',
  color: '#d1fae5',
  border: '2px solid #10b981',
  boxShadow: '0 0 15px rgba(16, 185, 129, 0.15)',
  borderRadius: '12px',
  fontWeight: '500',
  padding: '10px 14px',
  fontSize: '12px',
  fontFamily: 'Outfit, sans-serif'
};

const initialNodes = [
  { id: 'battery', data: { label: '🔋 12V LiPo Battery' }, position: { x: 300, y: 0 }, style: batteryStyle },
  
  // Power Management
  { id: 'buck', data: { label: '⚡ LM2596 Buck Converter (5V)' }, position: { x: 100, y: 140 }, style: logicPowerStyle },
  
  // Controller
  { id: 'esp32', data: { label: '🧠 ESP32 Controller Node\n(Handheld Remote / Game State)' }, position: { x: 80, y: 300 }, style: esp32Style },
  { id: 'lvlshift', data: { label: '🔌 Level Shifter (3.3V <-> 5V)' }, position: { x: -160, y: 310 }, style: logicPowerStyle },
  
  // Mobility System
  { id: 'driver', data: { label: '⚙️ L298N Motor Driver' }, position: { x: 520, y: 140 }, style: highPowerStyle },
  { id: 'motors', data: { label: '🚗 4x Mecanum DC Motors' }, position: { x: 520, y: 290 }, style: highPowerStyle },

  // Peripherals
  { id: 'servos', data: { label: '🦾 4-DOF Robotic Arm Servos' }, position: { x: 100, y: 460 }, style: logicPowerStyle },
  { id: 'mpu', data: { label: '📳 MPU6050 Tremor Accelerometer' }, position: { x: 380, y: 460 }, style: sensorStyle },
];

const initialEdges = [
  { id: 'e-batt-buck', source: 'battery', target: 'buck', label: '12V Output', animated: true, style: { stroke: '#ef4444' } },
  { id: 'e-batt-driver', source: 'battery', target: 'driver', label: '12V High Current', animated: true, style: { stroke: '#ef4444' } },
  { id: 'e-buck-esp32', source: 'buck', target: 'esp32', label: '5V Regulated', style: { stroke: '#06b6d4' } },
  { id: 'e-buck-servos', source: 'buck', target: 'servos', label: '5V High Current', style: { stroke: '#06b6d4' } },
  { id: 'e-buck-lvlshift', source: 'buck', target: 'lvlshift', label: '5V Ref', style: { stroke: '#06b6d4' } },
  { id: 'e-esp32-driver', source: 'esp32', target: 'driver', label: 'GPIO Signals', style: { stroke: '#a855f7' } },
  { id: 'e-esp32-servos', source: 'esp32', target: 'servos', label: 'PWM Control', style: { stroke: '#a855f7' } },
  { id: 'e-esp32-lvlshift', source: 'esp32', target: 'lvlshift', label: '3.3V I2C', type: 'step', style: { stroke: '#a855f7' } },
  { id: 'e-driver-motors', source: 'driver', target: 'motors', label: 'Drives Wheels', style: { stroke: '#f97316' } },
  { id: 'e-mpu-esp32', source: 'mpu', target: 'esp32', label: 'I2C Acceleration Feedback', type: 'step', style: { stroke: '#10b981', strokeDasharray: '5,5' } },
];

export default function RobotDiagram() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  return (
    <div className="w-full h-[500px] border border-slate-800/80 bg-slate-950/40 rounded-2xl overflow-hidden relative shadow-inner">
      <div className="absolute top-4 left-4 z-10 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-400 font-medium">
        ℹ️ Nodes are draggable! Hover or drag components to inspect paths.
      </div>
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        onNodesChange={onNodesChange} 
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background color="#1e293b" gap={20} size={1} />
        <Controls className="bg-slate-900 border border-slate-800 text-white rounded fill-white [&_button]:bg-slate-900 [&_button]:border-slate-800 [&_button]:text-slate-400 [&_button:hover]:text-white" />
      </ReactFlow>
    </div>
  );
}