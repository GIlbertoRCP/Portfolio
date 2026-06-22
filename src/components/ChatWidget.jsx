import { useState, useRef, useEffect } from 'react';

// Pre-seeded database of Q&A knowledge about Gilberto Romero-Cano
const PORTFOLIO_DATA = {
  greetings: {
    patterns: ['hi', 'hello', 'hey', 'greetings', 'hola', 'yo'],
    response: "Hi there! I'm Gilberto's AI assistant. Feel free to ask me about his primary ML project work (like the F1 Oracle, the Predictive Network Telemetry System, or the Humanoid Locomotion Project), his coursework projects (the EOD Robot, Trivia app, or E-Commerce Cart Simulation), his engineering skills, or his computer science studies at CU Denver!"
  },
  about: {
    patterns: ['who are you', 'about gilberto', 'who is gilberto', 'bio', 'background'],
    response: "Gilberto Romero-Cano is a Computer Science student at CU Denver. He specializes in software architecture, backend development, and machine learning. He has experience building end-to-end applications, from data modeling and predictive pipeline implementation in Python to engineering scalable backends using C# and FastAPI."
  },
  skills: {
    patterns: ['skills', 'tech stack', 'languages', 'frameworks', 'technologies', 'tools', 'code'],
    response: "Here is Gilberto's tech stack:\n\n• **Languages:** Python, C++, C, C#, JavaScript, TypeScript, SQL\n• **Frameworks & Libraries:** FastAPI, Pandas, NumPy, Scikit-learn, React Native, Tailwind CSS, Vercel\n• **Developer Tools:** Git (Version Control), GitHub, Docker, Postman, Linux Bash/Shell, VS Code, IntelliJ, PyCharm, Android Studio, Emacs, Mininet\n• **Specialties & Systems:** Machine Learning (PyTorch, XGBoost, Stable Baselines3), IoT/Hardware (ESP32, ESP-NOW, FreeRTOS, MPU6050)"
  },
  education: {
    patterns: ['education', 'university', 'college', 'cu denver', 'coursework', 'school', 'study'],
    response: "Gilberto is pursuing his Bachelor of Science in Computer Science at the University of Colorado Denver (Expected Graduation: May 2027). Relevant coursework includes Data Structures & Algorithms, Machine Learning, Software Engineering, Computer Networks, Operating Systems, and Databases."
  },
  contact: {
    patterns: ['contact', 'email', 'hire', 'resume', 'github', 'reach out', 'social'],
    response: "You can reach out to Gilberto or connect with him here:\n\n• **Location:** Denver, CO\n• **Phone:** (720) 693-6526\n• **Email:** gilbertorcp712@gmail.com\n• **LinkedIn:** [linkedin.com/in/gromerocano/](https://linkedin.com/in/gromerocano/)\n• **GitHub:** [github.com/GIlbertoRCP](https://github.com/GIlbertoRCP)\n\n*(Feel free to check out his interactive project case studies on this site!)*"
  },
  sdn: {
    patterns: ['sdn', 'telemetry', 'kafka', 'self-healing', 'mininet', 'congestion', 'lstm', 'dqn', 'networking', 'predictive network'],
    response: "Gilberto built a **Predictive Network Telemetry System** (Predictive SDN) for CSCI 4930 HL1 at CU Denver. Key highlights:\n\n• **Event-Driven Architecture:** Decouples network switches (Mininet + os-ken) from AI analysis using Apache Kafka.\n• **AI Predictive Self-Healing:** Uses an LSTM model in PyTorch to forecast congestion. When congestion risk exceeds 70%, a DQN reinforcement learning agent scales up polling, and installs flow rules to reroute traffic automatically.\n• **Edge Optimization:** Quantized the LSTM weights (INT8) using ONNX, reducing size by 73% and speeding up inference latency by 69%.\n\nRead the detailed [SDN Case Study](/portfolio/projects/predictive-sdn) to test the interactive telemetry simulation widget!"
  },
  f1: {
    patterns: ['f1', 'oracle', 'prediction', 'telemetry', 'fastf1', 'xgboost', 'monte carlo', 'race'],
    response: "The **F1 Oracle** is an end-to-end telemetry and prediction platform. Key features:\n\n• **Pairwise Ranker Model:** Trains an `XGBRanker` model on historical FastF1 telemetry to output driver finishing order probabilities.\n• **Telemetry Analytics:** Includes sector-by-sector aero setup profiles, head-to-head speed/throttle comparisons, and ERS efficiency proxies.\n• **Stochastic Simulator:** Runs a client-side Monte Carlo simulation (1,000 runs) taking into account driver crash risk, starting grids, and safety cars.\n\nRead the detailed [F1 Oracle Case Study](/portfolio/projects/f1-oracle) to run matchups on the interactive simulation widget!"
  },
  locomotion: {
    patterns: ['locomotion', 'mujoco', 'ppo', 'bipedal', 'humanoid', 'reinforcement learning', 'penguin slide', 'motor control', 'rl'],
    response: "The **Humanoid Locomotion** project is a 3D bipedal simulation trained in MuJoCo using Proximal Policy Optimization (PPO):\n\n• **Bionic Model:** Modified humanoid capsules and densities to enable natural acceleration and controlled falling.\n• **Vertical LiDAR:** Implemented a custom 5-point rangefinder array with a Python VisionObservationWrapper to concatenate depth readings into the observation space.\n• **Penguin Slide:** Emergent reward hacking behavior discovered by the agent to negotiate a steep ramp.\n\nRead the detailed [Locomotion Case Study](/portfolio/projects/motor-control-locomotion) to view the simulation video showcase!"
  },
  robot: {
    patterns: ['robot', 'bomb', 'embedded', 'esp32', 'esp-now', 'mecanum', 'rover', 'servo', 'hardware', 'eod'],
    response: "The **EOD Trainer Robot** is a wireless bomb disposal simulation system built on three distributed ESP32 nodes:\n\n• **ESP-NOW Link:** Custom low-latency packet delivery between the Controller remote, Rover robot, and Bomb target node.\n• **Rover Specs:** 4-DOF robotic arm, Mecanum wheels for holonomic movement, MPU6050 accelerometer to enforce tremor/shaking penalties.\n• **Interactive Topology:** Renders power distribution and logic pathways.\n\nRead the detailed [EOD Robot Case Study](/portfolio/projects/bomb-squad-robot) to interact with the draggable routing schematic!"
  },
  trivia: {
    patterns: ['trivia', 'tap', 'multiplayer', 'react native', 'agile', 'group', 'team'],
    response: "The **Tap-Tap Trivia** app is a responsive React Native multiplayer mobile trivia game built for a 5-person group semester project at CU Denver:\n\n• **Responsive Mobile UI:** Architected mobile layouts optimizing presentation across varying iOS/Android screen form factors.\n• **Team Coordination:** Managed collaborative team development using Git and Agile methodologies, resolving merge conflicts to maintain a stable master branch.\n• **Verification:** Syncs player states and captures precise buzzer click timings to prevent network exploitation.\n\nRead the detailed [Tap-Tap Trivia Case Study](/portfolio/projects/tap-tap-trivia) to try the playable demo!"
  },
  cart: {
    patterns: ['cart', 'ecommerce', 'e-commerce', 'c#', 'oop', 'inheritance', 'polymorphism', 'generic', 'collections'],
    response: "The **E-Commerce Cart Simulation** is a C#/.NET system that implements a modular product catalog:\n\n• **Object-Oriented Design:** Uses inheritance and polymorphism to integrate digital, physical, and subscription products.\n• **Polymorphic Shipping:** Subclasses override shipping methods (e.g. physical weight-based fees vs zero-cost digital downloads).\n• **Generic Collections:** Utilizes generic Lists to optimize data handling and run real-time cart calculations.\n\nRead the detailed [E-Commerce Case Study](/portfolio/projects/ecommerce-cart) to try the interactive object simulation!"
  },
  projects: {
    patterns: ['projects', 'portfolio', 'work', 'what did you make', 'applications', 'showcase'],
    response: "Gilberto has six featured projects on this portfolio. His primary engineering focuses are:\n\n1. **Predictive Network Telemetry System** — Event-driven telemetry using Kafka and LSTM/DQN models.\n2. **F1 Oracle** — Race outcome predictions using XGBRanker on FastF1 data.\n3. **Humanoid Locomotion** — 3D bipedal simulation using PPO RL in MuJoCo.\n\nHe has also built supporting projects:\n4. **E-Commerce Cart Simulation** — Modular product catalog in C# implementing OOP concepts.\n5. **Bomb Squad EOD Robot** — Distributed wireless nodes using ESP32 & ESP-NOW.\n6. **Tap-Tap Trivia** — A React Native mobile quiz app coordinated using Agile/Git.\n\nWhich one would you like to hear more about? I can link you to their case study pages!"
  }
};

// Simple intent classifier matching user query words with keywords
function getBotResponse(query) {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Find matching intents based on patterns
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

  // Fallback response if no keywords matched
  if (!bestMatch || maxMatches === 0) {
    bestMatch = "I'm not sure I have that exact detail, but I can tell you about Gilberto's projects (F1 Oracle, SDN System, Humanoid Locomotion, E-Commerce Cart, EOD Robot, or Trivia App), list his skills, or link you to his GitHub repository. What would you like to explore?";
  }

  return bestMatch;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hi! I'm Gilberto's AI assistant. Ask me about his machine learning projects, his tech stack, or his coursework at CU Denver!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    // Simulate realistic AI thinking/typing latency
    setTimeout(() => {
      const replyText = getBotResponse(currentInput);
      const aiResponse = { 
        role: 'ai', 
        content: replyText
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 700);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[28rem] backdrop-blur-md transition-all duration-300">
          {/* Header */}
          <div className="bg-slate-950/90 px-4 py-3.5 border-b border-slate-800 flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <h3 className="text-sm font-display font-semibold text-slate-100">GRC Portfolio Assistant</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition p-1 hover:bg-slate-800 rounded-lg"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-3 bg-slate-900/40">
            {messages.map((msg, idx) => {
              // Convert simple markdown links [text](url) to HTML for render
              const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
              const hasLinks = linkRegex.test(msg.content);
              
              let renderedContent = msg.content;
              if (hasLinks) {
                // Parse links safely since it's hardcoded portfolio data
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
                      className="text-blue-400 hover:underline font-semibold"
                      {...(match[2].startsWith('http') ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {match[1]}
                    </a>
                  );
                  lastIndex = linkRegex.lastIndex;
                }
                parts.push(msg.content.substring(lastIndex));
                renderedContent = parts;
              } else {
                // Render paragraphs/newlines
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
                  className={`max-w-[85%] p-3.5 rounded-xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white self-end rounded-br-none shadow-md shadow-blue-900/10' 
                      : 'bg-slate-800/90 text-slate-100 self-start rounded-bl-none border border-slate-700/50 shadow-sm'
                  }`}
                >
                  {renderedContent}
                </div>
              );
            })}
            {isLoading && (
              <div className="bg-slate-800/90 text-slate-400 text-xs px-4 py-3.5 rounded-xl self-start rounded-bl-none flex gap-1 items-center border border-slate-700/50">
                <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-slate-950/90 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about my projects..."
              className="flex-grow bg-slate-900 text-white text-sm rounded-xl px-4 py-2 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-900/20"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 shadow-blue-600/10 hover:shadow-blue-500/20 border border-blue-400/20"
          aria-label="Open chat assistant"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}
    </div>
  );
}