import { useState, useCallback } from 'react';
import ReactFlow, { Background, Controls, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import 'reactflow/dist/style.css';

// Technical drafting style for schematic nodes
const batteryStyle = {
  background: '#0f1115',
  color: '#ef4444',
  border: '1px solid #ef4444',
  boxShadow: '2px 2px 0px 0px #ef4444',
  borderRadius: '0px',
  fontWeight: '600',
  padding: '10px 14px',
  fontSize: '11px',
  fontFamily: 'JetBrains Mono, monospace'
};

const highPowerStyle = {
  background: '#0f1115',
  color: '#f97316',
  border: '1px solid #f97316',
  boxShadow: '2px 2px 0px 0px #f97316',
  borderRadius: '0px',
  fontWeight: '600',
  padding: '10px 14px',
  fontSize: '11px',
  fontFamily: 'JetBrains Mono, monospace'
};

const logicPowerStyle = {
  background: '#0f1115',
  color: '#06b6d4',
  border: '1px solid #06b6d4',
  boxShadow: '2px 2px 0px 0px #06b6d4',
  borderRadius: '0px',
  fontWeight: '600',
  padding: '10px 14px',
  fontSize: '11px',
  fontFamily: 'JetBrains Mono, monospace'
};

const esp32Style = {
  background: '#131118',
  color: '#c084fc',
  border: '2px solid #a855f7',
  boxShadow: '3px 3px 0px 0px #a855f7',
  borderRadius: '0px',
  fontWeight: '700',
  padding: '12px 16px',
  fontSize: '12px',
  fontFamily: 'JetBrains Mono, monospace'
};

const sensorStyle = {
  background: '#0f1115',
  color: '#10b981',
  border: '1px solid #10b981',
  boxShadow: '2px 2px 0px 0px #10b981',
  borderRadius: '0px',
  fontWeight: '600',
  padding: '10px 14px',
  fontSize: '11px',
  fontFamily: 'JetBrains Mono, monospace'
};

const initialNodes = [
  { id: 'battery', data: { label: '12V LiPo Battery' }, position: { x: 300, y: 0 }, style: batteryStyle },
  
  // Power Management
  { id: 'buck', data: { label: 'LM2596 Buck Converter (5V)' }, position: { x: 100, y: 140 }, style: logicPowerStyle },
  
  // Controller
  { id: 'esp32', data: { label: 'ESP32 Controller Node\n(Handheld Remote / Game State)' }, position: { x: 80, y: 300 }, style: esp32Style },
  { id: 'lvlshift', data: { label: 'Level Shifter (3.3V <-> 5V)' }, position: { x: -160, y: 310 }, style: logicPowerStyle },
  
  // Mobility System
  { id: 'driver', data: { label: 'L298N Motor Driver' }, position: { x: 520, y: 140 }, style: highPowerStyle },
  { id: 'motors', data: { label: '4x Mecanum DC Motors' }, position: { x: 520, y: 290 }, style: highPowerStyle },

  // Peripherals
  { id: 'servos', data: { label: '4-DOF Robotic Arm Servos' }, position: { x: 100, y: 460 }, style: logicPowerStyle },
  { id: 'mpu', data: { label: 'MPU6050 Tremor Accelerometer' }, position: { x: 380, y: 460 }, style: sensorStyle },
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
    <div className="w-full h-[500px] border border-slate-850 bg-slate-950/20 rounded-none overflow-hidden relative shadow-flat-slate font-mono">
      <div className="absolute top-4 left-4 z-10 bg-slate-950 border border-slate-850 px-3 py-1.5 rounded-none text-[10px] text-slate-400 font-bold tracking-wider uppercase select-none">
        [SYS_MAP // NODES_DRAGGABLE]
      </div>
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        onNodesChange={onNodesChange} 
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background color="#1e293b" gap={20} size={1} />
        <Controls className="bg-slate-900 border border-slate-855 border-slate-850 text-white rounded-none fill-white [&_button]:bg-slate-900 [&_button]:border-slate-850 [&_button]:text-slate-400 [&_button:hover]:text-white" />
      </ReactFlow>
    </div>
  );
}