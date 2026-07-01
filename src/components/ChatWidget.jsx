import { useState, useRef, useEffect } from 'react';

// Pre-seeded database of Q&A knowledge about Gilberto Romero-Cano
const PORTFOLIO_DATA = {
  greetings: {
    patterns: ['hi', 'hello', 'hey', 'greetings', 'hola', 'yo'],
    response: "HI THERE! I'M GILBERTO'S DIAGNOSTIC ASSISTANT. YOU CAN ASK ME ABOUT HIS PRIMARY ML SYSTEMS (F1 ORACLE, PREDICTIVE NETWORK TELEMETRY, OR HUMANOID LOCOMOTION), HIS EMBEDDED EOD ROBOT, TRIVIA QUIZ APP, OR E-COMMERCE SIMULATOR. YOU CAN ALSO ASK FOR HIS TECH STACK OR HIS COMPUTER SCIENCE STUDIES AT CU DENVER!"
  },
  about: {
    patterns: ['who are you', 'about gilberto', 'who is gilberto', 'bio', 'background'],
    response: "GILBERTO ROMERO-CANO IS A COMPUTER SCIENCE STUDENT AT CU DENVER SPECIALIZING IN SOFTWARE ARCHITECTURE, BACKEND ENGINEERING, AND MACHINE LEARNING PIPELINES. HE DEPLOYS SCALABLE DATA PLATFORMS FROM FASTAPI BACKENDS IN PYTHON TO OBJECT-ORIENTED STRUCTURES IN C#."
  },
  skills: {
    patterns: ['skills', 'tech stack', 'languages', 'frameworks', 'technologies', 'tools', 'code'],
    response: "GILBERTO'S TECHNICAL PROFILE SPECIFICATIONS:\n\n• LANGUAGES: Python, C++, C, C#, JavaScript, TypeScript, SQL\n• FRAMEWORKS/LIBS: FastAPI, Pandas, NumPy, Scikit-learn, React Native, Tailwind CSS, Vercel\n• DEV TOOLING: Git, GitHub, Docker, Postman, Linux Bash/Shell, VS Code, Emacs, Mininet\n• SPECIALTIES: Machine Learning (PyTorch, XGBoost, Stable Baselines3), IoT/Embedded (ESP32, ESP-NOW, FreeRTOS, MPU6050)"
  },
  education: {
    patterns: ['education', 'university', 'college', 'cu denver', 'coursework', 'school', 'study'],
    response: "GILBERTO IS PURSUING A BACHELOR OF SCIENCE IN COMPUTER SCIENCE AT THE UNIVERSITY OF COLORADO DENVER (GRADUATION: MAY 2027). RELEVANT COURSEWORK INCLUDES DATA STRUCTURES & ALGORITHMS, MACHINE LEARNING, SOFTWARE ENGINEERING, NETWORKING, AND OPERATING SYSTEMS."
  },
  contact: {
    patterns: ['contact', 'email', 'hire', 'resume', 'github', 'reach out', 'social'],
    response: "CONNECTION CHANNELS FOR G. ROMERO-CANO:\n\n• LOCATION: Denver, CO\n• PHONE: (720) 693-6526\n• MAIL: gilbertorcp712@gmail.com\n• LINKEDIN: [linkedin.com/in/gromerocano/](https://linkedin.com/in/gromerocano/)\n• GITHUB: [github.com/GIlbertoRCP](https://github.com/GIlbertoRCP)\n\n(FEEL FREE TO INITIATE INTERACTIVE WORKFLOW DEMOS ON THIS PORTFOLIO FOR MORE DETAILS.)"
  },
  sdn: {
    patterns: ['sdn', 'telemetry', 'kafka', 'self-healing', 'mininet', 'congestion', 'lstm', 'dqn', 'networking', 'predictive network'],
    response: "PREDICTIVE NETWORK TELEMETRY SYSTEM CORE HIGHLIGHTS:\n\n• EVENT-DRIVEN BUS: Decouples network switches (Mininet + os-ken) from AI analysis using Apache Kafka.\n• SELF-HEALING ENGINE: Uses a PyTorch LSTM model to forecast congestion. When risk exceeds 70%, a DQN RL agent scales up polling frequency and installs flow rules to reroute traffic.\n• EDGE COMPILING: Quantized the LSTM weights (INT8) using ONNX, reducing size by 73% and inference latency by 69%.\n\nREAD DETAILS: [SDN Case Study](/Portfolio/projects/predictive-sdn) TO TEST THE TELEMETRY SIMULATOR PANEL!"
  },
  f1: {
    patterns: ['f1', 'oracle', 'prediction', 'telemetry', 'fastf1', 'xgboost', 'monte carlo', 'race'],
    response: "F1 ORACLE PREDICTION PLATFORM CORE HIGHLIGHTS:\n\n• PREFERENCE RANKER: Trains an XGBRanker model on FastF1 historical telemetries to predict driver placement probabilities.\n• TELEMETRY ENGINEERING: Subtracts fuel burning weights and estimates linear tyre-degradation rates across stints.\n• STOCHASTIC SIMULATION: Runs a client-side Monte Carlo simulator (1,000 runs) factoring in safety cars and track wetness parameters.\n\nREAD DETAILS: [F1 Oracle Case Study](/Portfolio/projects/f1-oracle) TO RUN match-ups!"
  },
  locomotion: {
    patterns: ['locomotion', 'mujoco', 'ppo', 'bipedal', 'humanoid', 'reinforcement learning', 'penguin slide', 'motor control', 'rl'],
    response: "HUMANOID LOCOMOTION PROJECT CORE HIGHLIGHTS:\n\n• BIONIC MODEL: Modified humanoid density parameters to enable controlled acceleration in MuJoCo physics engine.\n• DEPTH SENSING: Configured a 5-point vertical rangefinder (LiDAR) array, concatenating spatial readings via a VisionObservationWrapper.\n• EMERGENT REWARD HACKING: Agent discovered a 'penguin slide' maneuver to navigate steep descents.\n\nREAD DETAILS: [Locomotion Case Study](/Portfolio/projects/motor-control-locomotion) TO VIEW SIMULATION DEMO SCATTER!"
  },
  robot: {
    patterns: ['robot', 'bomb', 'embedded', 'esp32', 'esp-now', 'mecanum', 'rover', 'servo', 'hardware', 'eod'],
    response: "EOD TRAINER ROBOT CORE HIGHLIGHTS:\n\n• ESP-NOW DIRECT: Connectionless packet delivery between Controller remote, Rover robot, and Bomb target node under 20ms.\n• PHYSICAL SPECS: 4-DOF robotic claw servos, holonomic Mecanum driving, MPU6050 accelerometer to enforce tremor/shaking penalties.\n\nREAD DETAILS: [EOD Robot Case Study](/Portfolio/projects/bomb-squad-robot) TO DRAG SCHEMATICS!"
  },
  trivia: {
    patterns: ['trivia', 'tap', 'multiplayer', 'react native', 'agile', 'group', 'team'],
    response: "TAP-TAP TRIVIA MOBILE CORE HIGHLIGHTS:\n\n• MULTIPLAYER: Responsive React Native quiz app built for a group project at CU Denver.\n• COLLABORATIVE GIT: Coordinated branch merges and resolved conflicts to maintain stable version controls.\n• TIMING VERIFICATION: Captures precise buzzer ticks to prevent network exploit latency.\n\nREAD DETAILS: [Trivia Case Study](/Portfolio/projects/tap-tap-trivia) TO BUZZ DEMO!"
  },
  cart: {
    patterns: ['cart', 'ecommerce', 'e-commerce', 'c#', 'oop', 'inheritance', 'polymorphism', 'generic', 'collections'],
    response: "E-COMMERCE CART CORE HIGHLIGHTS:\n\n• OBJECT-ORIENTED: Implements product subclasses (digital, physical, subscription) in C#/.NET.\n• POLYMORPHISM: Overrides shipping charges (e.g. zero digital download fees vs physical weight coefficients).\n• GENERIC LISTS: Implements generic Collections to manage memory objects and calculate cart parameters.\n\nREAD DETAILS: [E-Commerce Case Study](/Portfolio/projects/ecommerce-cart) TO INSTANTIATE PRODUCT INSTANCES!"
  },
  projects: {
    patterns: ['projects', 'portfolio', 'work', 'what did you make', 'applications', 'showcase'],
    response: "GILBERTO'S PORTFOLIO CONTAINS SIX COMPLETED SYSTEMS:\n\n1. PREDICTIVE SDN TELEMETRY - Event-driven Mininet monitoring using Kafka and LSTM/DQN.\n2. F1 ORACLE - Pairwise driver finishing XGBRanker platform.\n3. HUMANOID LOCOMOTION - 3D bipedal PPO training in MuJoCo.\n4. WIRELESS EOD ROBOT - ESP-NOW direct mesh remote and mecanum rover.\n5. TAP-TAP TRIVIA - React Native multiplayer quiz client.\n6. C# OOP CATALOG - Polymorphic e-commerce cart simulation.\n\nSELECT ANY OPTION FOR DETAILED FILE SPECIFICATIONS."
  }
};

function getBotResponse(query) {
  const normalizedQuery = query.toLowerCase().trim();
  let bestMatch = null;
  let maxMatches = 0;

  for (const [_, data] of Object.entries(PORTFOLIO_DATA)) {
    let matchCount = 0;
    for (const pattern of data.patterns) {
      if (normalizedQuery.includes(pattern)) {
        matchCount++;
      }
    }
    if (matchCount > maxMatches) {
      maxMatches = matchCount;
      bestMatch = data.response;
    }
  }

  if (!bestMatch || maxMatches === 0) {
    bestMatch = "QUERY LOGGED. COMMAND UNRECOGNIZED. CHOOSE SUB-SYSTEM METRICS: F1 ORACLE, PREDICTIVE SDN, HUMANOID LOCOMOTION, EOD ROBOT, TRIVIA GAME, C# OOP CATALOG, SKILLS OR GITHUB CONTROLLER.";
  }

  return bestMatch;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: "CONSOLE PORT: DIAGNOSTICS READY. ASK ME ABOUT GILBERTO'S MACHINE LEARNING MODELS, EMBEDDED ROBOTICS, OR TECH MATRIX SPECIFICATIONS." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input.toUpperCase() };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const replyText = getBotResponse(currentInput);
      const aiResponse = { 
        role: 'ai', 
        content: replyText
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-mono text-xs">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-[#0f1115] border border-slate-850 rounded-none shadow-flat-slate flex flex-col h-[28rem] overflow-hidden select-none transition-all duration-200">
          
          {/* Header */}
          <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-850 flex justify-between items-center text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-none"></span>
              <h3 className="font-bold text-slate-200 uppercase tracking-wider">GRC // DIAGNOSTIC_ASSISTANT</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-white transition-colors"
              aria-label="Close diagnostic logs"
            >
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-3.5 bg-slate-950/20">
            {messages.map((msg, idx) => {
              const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
              const hasLinks = linkRegex.test(msg.content);
              
              let renderedContent = msg.content;
              if (hasLinks) {
                const parts = [];
                let lastIndex = 0;
                linkRegex.lastIndex = 0;
                let match;
                
                while ((match = linkRegex.exec(msg.content)) !== null) {
                  parts.push(msg.content.substring(lastIndex, match.index));
                  parts.push(
                    <a 
                      key={match.index} 
                      href={match[2]} 
                      className="text-blue-400 hover:underline font-bold"
                      {...(match[2].startsWith('http') ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {match[1].toUpperCase()}
                    </a>
                  );
                  lastIndex = linkRegex.lastIndex;
                }
                parts.push(msg.content.substring(lastIndex));
                renderedContent = parts;
              } else {
                renderedContent = msg.content.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < msg.content.split('\n').length - 1 && <br />}
                  </span>
                ));
              }

              return (
                <div 
                  key={idx} 
                  className={`p-3 max-w-[85%] border leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-blue-950/40 border-blue-500/30 text-blue-400 self-end rounded-none shadow-flat-slate-sm' 
                      : 'bg-slate-950 border-slate-850 text-slate-300 self-start rounded-none'
                  }`}
                >
                  {renderedContent}
                </div>
              );
            })}
            
            {isLoading && (
              <div className="bg-slate-950 text-slate-500 px-3 py-2 border border-slate-850 self-start rounded-none flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-slate-500 animate-pulse"></span>
                <span>FETCHING_LOGS...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-2.5 bg-slate-950 border-t border-slate-850 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ENTER SYSTEM QUERY..."
              className="flex-grow bg-[#0c0d12] text-white text-xs rounded-none px-3 py-2 border border-slate-800 focus:outline-none focus:border-blue-500 font-mono"
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 border border-blue-500 text-white px-3 py-2 rounded-none font-bold transition shadow-flat-slate-sm disabled:opacity-50 text-[10px] uppercase tracking-wider"
            >
              QUERY
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#0f1115] border border-slate-850 hover:bg-slate-900 text-white font-mono rounded-none px-4 py-2 text-[10px] font-bold shadow-flat-slate flex items-center gap-2 select-none"
          aria-label="Open diagnostics assistant"
        >
          <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse"></span>
          [SYS_DIAGNOSTICS]
        </button>
      )}
    </div>
  );
}