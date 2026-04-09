import { useState, useRef, useEffect } from 'react';
import { X, Terminal } from 'lucide-react';

// Enterprise Knowledge Base about Laila
const knowledgeBase = {
  personal: {
    name: "Laila Mohamed",
    title: "Software Engineer & Backend Architect",
    location: "Cairo, Egypt",
    languages: ["Arabic (Native)", "English (Professional Working Proficiency)", "German (Beginner)"],
    personality: {
      keywords: ["analytical", "detail-oriented", "scalable", "systematic", "performance-driven"],
      tone: "professional, concise, and technical",
    }
  },
  careerSummary: "Laila Mohamed is a specialized Software Engineer focusing on scalable backend architectures and robust full-stack systems. With expertise honed at the ALX Africa & Holberton School Software Engineering program, she designs resilient systems utilizing Python, Node.js, and modern JavaScript frameworks. She emphasizes clean architectures, PEP 8 compliance, and modular implementations.",
  
  education: [
    "ALX Africa & Holberton School – Advanced Software Engineering Program",
  ],
  
  skills: {
    programmingLanguages: ["Python", "C/C++", "JavaScript", "TypeScript", "SQL"],
    frameworksAndLibraries: ["React.js", "Node.js", "Express.js", "Tailwind CSS"],
    databases: ["MySQL", "MongoDB", "PostgreSQL"],
    tools: ["Git/GitHub", "Docker", "RESTful APIs", "Linux/Bash", "System Design"],
    capabilities: ["Software Architecture", "Database Optimization", "Secure Authentication", "Scalability Planning"]
  },
  
  projects: {
    techhub: {
      name: "TechHub Electronics Platform",
      description: "A production-grade e-commerce system built with PHP and MySQL, featuring secure session management, optimized product indexing, and a robust cart architecture."
    },
    messaging: {
      name: "Encrypted Messaging System",
      description: "A real-time communication platform built with Python, featuring AES-256 encryption, secure socket layering, and a multi-threaded server architecture."
    },
    techroad: {
      name: "TechRoad - Career Infrastructure",
      description: "An AI-powered pipeline tool for career coaching, delivering personalized data-driven recommendations."
    }
  },
  
  focus: "Currently researching distributed systems, microservices architectures, and deep backend optimization.",
  
  funFacts: {
    favoriteColor: "Purple, which heavily influences her vibrant UI designs.",
    hobbies: ["Programming and problem solving", "UI/UX aesthetics", "Drawing realistic portraits", "Interior design rendering"]
  },
  
  contact: {
    email: "laila.mohamed.fikry@gmail.com",
    linkedin: "https://linkedin.com/in/laila-mohamed23/",
    github: "https://github.com/laila2005",
    status: "Open to challenging enterprise roles and backend engineering positions."
  }
};

const responses = {
  greetings: [
    "Terminal connected. I am L.M. Assistant, an automated AI designed to provide technical specifications on Laila's engineering portfolio. How may I assist you?",
    "System online. I can provide detailed insights into Laila's software architecture, projects, and technical stack. What would you like to query?",
    "Hello. I represent Laila Mohamed's digital portfolio. You may ask me about her backend capabilities, deployment history, or contact metrics."
  ],
  thanks: [
    "Acknowledgment received. I am here if you require further technical details.",
    "You are welcome. Standing by for additional queries."
  ],
  goodbye: [
    "Session terminated. Thank you for visiting Laila's portfolio.",
    "Goodbye. Feel free to initiate contact directly via email or LinkedIn for formal inquiries."
  ],
  default: "Unrecognized query parameters. I am optimized to discuss Laila's Tech Stack, Project Architecture (e.g., TechHub, Encrypted Messaging), and Engineering Background. Please refine your input."
};

function getRandomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)];
}

function getBotResponse(input: string): string {
  const text = input.toLowerCase();
  
  if (text.match(/\b(hello|hi|hey|greetings|start|init)\b/)) {
    return getRandomResponse(responses.greetings);
  }
  
  if (text.match(/\b(name|who is|who are you|laila|owner)\b/)) {
    return `I am querying data for ${knowledgeBase.personal.name}, a ${knowledgeBase.personal.title}. She builds high-performance digital systems.`;
  }
  
  if (text.match(/\b(education|university|school|degree|alx|holberton)\b/)) {
    return `Laila holds an engineering certification from ${knowledgeBase.education[0]}, focusing on rigorous low-level programming and high-level system design.`;
  }
  
  if (text.match(/\b(career|background|experience|summary|about)\b/)) {
    return knowledgeBase.careerSummary;
  }
  
  if (text.match(/\b(languages|code|python|javascript|c\+\+|sql|typescript)\b/)) {
    return `Core Technical Languages: ${knowledgeBase.skills.programmingLanguages.join(', ')}. Engineered for type safety, performance, and scalability.`;
  }
  
  if (text.match(/\b(frameworks|libraries|react|node|express|tailwind)\b/)) {
    return `Framework Infrastructure: ${knowledgeBase.skills.frameworksAndLibraries.join(', ')}. Deployed on strict modern standards.`;
  }
  
  if (text.match(/\b(database|databases|mongodb|mysql|postgres|data)\b/)) {
    return `Database Architecture: ${knowledgeBase.skills.databases.join(', ')}. Optimized for ACID compliance and read/write scaling.`;
  }
  
  if (text.match(/\b(tools|git|github|docker|linux|bash)\b/)) {
    return `DevOps & Systems Tooling: ${knowledgeBase.skills.tools.join(', ')}.`;
  }
  
  if (text.match(/\b(skills|technologies|tech stack|technical|stack)\b/)) {
    return `Laila operates a comprehensive stack: ${knowledgeBase.skills.programmingLanguages.join(', ')} backed by ${knowledgeBase.skills.databases.join(', ')}. Specialized capabilities include: ${knowledgeBase.skills.capabilities.join(', ')}.`;
  }
  
  if (text.match(/\b(techhub|electronics|ecommerce|e-commerce|store)\b/)) {
    return `[PROJECT]: ${knowledgeBase.projects.techhub.name} - ${knowledgeBase.projects.techhub.description}`;
  }
  
  if (text.match(/\b(messaging|chat|encrypted|security|aes)\b/)) {
    return `[PROJECT]: ${knowledgeBase.projects.messaging.name} - ${knowledgeBase.projects.messaging.description}`;
  }
  
  if (text.match(/\b(techroad|ai|coach)\b/)) {
    return `[PROJECT]: ${knowledgeBase.projects.techroad.name} - ${knowledgeBase.projects.techroad.description}`;
  }
  
  if (text.match(/\b(color|favourite color|favorite color|purple|pink)\b/)) {
    return `Laila's signature color is purple! It reflects her blend of technical precision and creative design exactly like this portfolio.`;
  }
  
  if (text.match(/\b(like|likes|love|loves|hobby|hobbies|interests|passion|fun|facts|fact|draw|drawing|art|artist|sketch)\b/)) {
    return `Beyond scalable backends, Laila deeply loves programming, UI/UX design, and blending creative aesthetics with robust code. Fun fact: she is an artist and has a massive talent for drawing realistic portraits!`;
  }
  
  if (text.match(/\b(projects|portfolio|work|built|created|systems)\b/)) {
    return `Notable engineering systems include the ${knowledgeBase.projects.techhub.name} and the ${knowledgeBase.projects.messaging.name}. You may ask for specifics on "messaging" or "ecommerce".`;
  }
  
  if (text.match(/\b(goals|future|focus|learning)\b/)) {
    return `Current Engineering Focus: ${knowledgeBase.focus}`;
  }
  
  if (text.match(/\b(contact|email|reach|hire|available|work|linkedin|github)\b/)) {
    return `Status: ${knowledgeBase.contact.status} | Email: ${knowledgeBase.contact.email} | LinkedIn: ${knowledgeBase.contact.linkedin}`;
  }
  
  if (text.match(/\b(thank|thanks|acknowledged)\b/)) {
    return getRandomResponse(responses.thanks);
  }
  
  if (text.match(/\b(bye|goodbye|exit|quit|close)\b/)) {
    return getRandomResponse(responses.goodbye);
  }
  
  return responses.default;
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: getRandomResponse(responses.greetings) }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const isMobile = typeof window !== 'undefined' && 'ontouchstart' in window;

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { from: 'user', text: input }]);
    setTimeout(() => {
      setMessages(msgs => [...msgs, { from: 'bot', text: getBotResponse(input) }]);
    }, 600);
    setInput('');
  }

  return (
    <div>
      {/* Floating button */}
      <button
        className={`fixed z-50 bg-[#1e143c] text-white rounded-full shadow-2xl transition-all border border-purple-500/30 ${
          isMobile 
            ? 'bottom-4 right-4 p-3' 
            : 'bottom-8 right-8 p-4 hover:scale-110 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]'
        }`}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close terminal' : 'Open terminal'}
      >
        {open ? <X size={isMobile ? 24 : 28} className="text-pink-300" /> : <Terminal size={isMobile ? 24 : 28} className="text-purple-300" />}
      </button>

      {/* Chatbot window */}
      {open && (
        <div className={`fixed z-50 bg-[#0f0a1c]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden animate-fade-in ${
          isMobile 
            ? 'bottom-20 right-4 left-4 w-auto' 
            : 'bottom-24 right-8 w-[350px]'
        }`}>
          <div className="bg-gradient-to-r from-[#1e143c] to-[#2d1b4e] text-white px-4 py-3 font-mono font-bold text-sm flex items-center gap-2 border-b border-white/10 shadow-lg">
            <Terminal size={14} className="text-purple-400" /> 
            <span className="tracking-widest uppercase">L.M. Assistant Terminal</span>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar" style={{ minHeight: 250, maxHeight: 350 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm font-inter leading-relaxed ${
                  msg.from === 'user' 
                  ? 'bg-purple-600/80 text-white rounded-br-sm shadow-md' 
                  : 'bg-white/10 text-gray-200 rounded-bl-sm border border-white/5 backdrop-blur-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={sendMessage} className="flex items-center gap-2 p-3 border-t border-white/10 bg-[#0a0614]/80">
            <input
              className="flex-1 rounded-xl px-4 py-2.5 bg-white/5 border border-white/10 focus:outline-none focus:border-purple-400 text-sm text-white placeholder-gray-500 font-mono"
              placeholder="Enter query..."
              value={input}
              onChange={e => setInput(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:hover:bg-purple-600 font-mono text-sm tracking-wide"
              disabled={!input.trim()}
            >
              EXEC
            </button>
          </form>
        </div>
      )}
    </div>
  );
}