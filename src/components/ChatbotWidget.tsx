import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

// Comprehensive Knowledge Base about Laila
const knowledgeBase = {
  personal: {
    name: "Laila Mohamed Fikry",
    title: "Computer Science Student & Full-Stack Developer",
    location: "Cairo, Egypt",
    languages: "Arabic (Native), English (Fluent), Turkish & Russian (Conversational)",
    personality: "Passionate about creating beautiful, efficient solutions that bridge technology and user experience. Blends logic with creativity."
  },
  education: {
    current: "El Sewedy University of Technology (Polytechnic of Egypt) - Bachelor of Computer Science (2025-2028)",
    previous: "Transferred from Egyptian Russian University",
    program: "ALX Africa Software Engineering Program Graduate (2023-2025)",
    focus: "Systems programming, algorithms, and full-stack development"
  },
  experience: {
    freelance: "Full-stack developer on Mostaqel platform - developed Bagi Job Platform (bagijob.com)",
    ieee: "IEEE Technical Team Member (2024-Present) - Contributing to technical initiatives and projects",
    community: "HR Team at Computality Community (2024) - Worked for one year as community leader"
  },
  skills: {
    frontend: ["React.js", "JavaScript (ES6+)", "HTML5 & CSS3", "Next.js", "Bootstrap", "Responsive Design", "TailwindCSS"],
    backend: ["Node.js", "NestJS", "Python", "Java", "MySQL", "PostgreSQL", "MongoDB", "RESTful APIs"],
    systems: ["C Programming", "C++", "Data Structures", "Algorithms", "Operating Systems", "Memory Management"],
    tools: ["Git & GitHub", "Linux/Ubuntu", "VSCode", "MATLAB", "SDL2", "Docker", "Postman"]
  },
  projects: {
    featured: {
      dishcraft: "ALX Africa portfolio project featuring comprehensive UI/UX design, user authentication, and seamless database integration for a culinary platform using React.js, Node.js, and databases.",
      mazegame: "3D Raycasting Maze Game built in C using SDL2 with collision detection, player movement, enemy AI, and dynamic maze generation with textures.",
      bagijob: "Professional freelance project - Complete job portal with modern React frontend and robust backend architecture, developed through Mostaqel platform."
    },
    other: {
      rskyorb: "Comprehensive front-end dashboard for monitoring and controlling high-altitude balloon systems with real-time telemetry visualization.",
      qayedny: "Modern and responsive landing page designed and developed as a front-end developer, featuring clean UI/UX design.",
      audio: "Real-time MATLAB tool for pitch modification and waveform visualization with advanced signal processing capabilities.",
      projectmgmt: "Comprehensive task manager built in Java with SQL Server backend, featuring user authentication and progress visualization.",
      shell: "Unix-like shell implementation in C with built-in commands, process control, memory handling, and comprehensive error feedback."
    }
  },
  contact: {
    email: "laila.mohamed.fikry@gmail.com",
    linkedin: "https://www.linkedin.com/in/laila-mohamed23/",
    github: "https://github.com/laila2005",
    availability: "Currently available for work and open to new opportunities"
  },
  journey: "I'm a passionate Computer Science student at El Sewedy University (Polytechnic of Egypt), deeply exploring systems programming, algorithms, and full-stack development. My growth accelerated through the ALX Africa Software Engineering Program, where I built everything from low-level C programs to dynamic web applications—bridging the gap between core fundamentals and modern technologies. What sets me apart is how I blend logic with creativity. Whether I'm developing a 3D raycasting game in C, crafting engaging user interfaces with React and Next.js, or sketching illustrations by hand, I strive to build solutions that are both functional and visually appealing. As both a developer and an artist, I'm constantly exploring ways to make technology more human, expressive, and inspiring."
};

const responses = {
  greetings: [
    "Hi! I'm Laila's portfolio assistant. I can tell you all about her skills, projects, education, and experience. What would you like to know?",
    "Hello! I'm here to help you learn about Laila Mohamed Fikry. Feel free to ask about her background, projects, or technical skills!",
    "Hey there! I'm Laila's AI assistant. I'd love to share information about her journey as a developer and her amazing projects!"
  ],
  thanks: ["You're very welcome! Feel free to ask anything else about Laila.", "My pleasure! I'm here to help with any other questions."],
  goodbye: ["Goodbye! Thanks for your interest in Laila's work!", "Have a great day! Don't hesitate to reach out to Laila directly."],
  default: "I can help you learn about Laila's education, skills, projects, experience, or how to contact her. What interests you most?"
};

function getRandomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)];
}

function getBotResponse(input: string): string {
  const text = input.toLowerCase();
  
  // Greetings
  if (text.match(/\b(hello|hi|hey|greetings)\b/)) {
    return getRandomResponse(responses.greetings);
  }
  
  // Name and personal info
  if (text.match(/\b(name|who is|who are you)\b/)) {
    return `I'm ${knowledgeBase.personal.name}, a ${knowledgeBase.personal.title} based in ${knowledgeBase.personal.location}. ${knowledgeBase.personal.personality}`;
  }
  
  // Education
  if (text.match(/\b(education|university|school|study|student|degree|alx)\b/)) {
    return `Laila is currently studying at ${knowledgeBase.education.current}. She transferred from Egyptian Russian University and is also an ${knowledgeBase.education.program}. Her focus is on ${knowledgeBase.education.focus}.`;
  }
  
  // Experience and work
  if (text.match(/\b(experience|work|job|freelance|ieee|community)\b/)) {
    return `Laila has great experience! She works as a ${knowledgeBase.experience.freelance}. She's also an ${knowledgeBase.experience.ieee}. Previously, she was part of the ${knowledgeBase.experience.community}.`;
  }
  
  // Skills - specific categories
  if (text.match(/\b(frontend|front-end|react|javascript|html|css)\b/)) {
    return `Laila's frontend skills include: ${knowledgeBase.skills.frontend.join(', ')}. She's particularly strong with React.js and modern JavaScript frameworks!`;
  }
  
  if (text.match(/\b(backend|back-end|server|database|node|python|java)\b/)) {
    return `For backend development, Laila works with: ${knowledgeBase.skills.backend.join(', ')}. She has experience with both SQL and NoSQL databases!`;
  }
  
  if (text.match(/\b(systems|programming|algorithms|data structures)\b/)) {
    return `Laila has strong systems programming skills: ${knowledgeBase.skills.systems.join(', ')}. She's built everything from low-level C programs to complex algorithms!`;
  }
  
  // General skills
  if (text.match(/\b(skills|technologies|tech stack|programming)\b/)) {
    return `Laila has a comprehensive skill set spanning frontend (${knowledgeBase.skills.frontend.slice(0,3).join(', ')}), backend (${knowledgeBase.skills.backend.slice(0,3).join(', ')}), and systems programming (${knowledgeBase.skills.systems.slice(0,3).join(', ')}). Check out her Skills section for the complete list!`;
  }
  
  // Specific projects
  if (text.match(/\b(dishcraft|dish craft)\b/)) {
    return `DishCraft is one of Laila's featured projects! ${knowledgeBase.projects.featured.dishcraft}`;
  }
  
  if (text.match(/\b(maze game|raycasting|3d game)\b/)) {
    return `The 3D Raycasting Maze Game is impressive! ${knowledgeBase.projects.featured.mazegame}`;
  }
  
  if (text.match(/\b(bagi job|bagijob|freelance project)\b/)) {
    return `Bagi Job is Laila's professional freelance work! ${knowledgeBase.projects.featured.bagijob} You can visit it at bagijob.com.`;
  }
  
  if (text.match(/\b(qayedny|landing page)\b/)) {
    return `Qayedny is a beautiful landing page project! ${knowledgeBase.projects.other.qayedny}`;
  }
  
  // General projects
  if (text.match(/\b(projects|portfolio|work|built|created)\b/)) {
    return `Laila has built amazing projects! Her featured ones include DishCraft (culinary platform), a 3D Raycasting Maze Game in C, and Bagi Job Platform (professional freelance work). She also has projects in MATLAB, Java, and more. Check out her Projects section!`;
  }
  
  // Journey and story
  if (text.match(/\b(journey|story|background|about|tell me about)\b/)) {
    return knowledgeBase.journey;
  }
  
  // Contact and availability
  if (text.match(/\b(contact|email|reach|hire|available|work)\b/)) {
    return `${knowledgeBase.contact.availability}! You can contact Laila at ${knowledgeBase.contact.email} or connect on LinkedIn: ${knowledgeBase.contact.linkedin}. Her GitHub is ${knowledgeBase.contact.github}.`;
  }
  
  // Languages
  if (text.match(/\b(languages|speak|arabic|english|turkish|russian)\b/)) {
    return `Laila speaks multiple languages: ${knowledgeBase.personal.languages}. This helps her work with international teams!`;
  }
  
  // Location
  if (text.match(/\b(location|where|cairo|egypt)\b/)) {
    return `Laila is based in ${knowledgeBase.personal.location}. She's open to both local and remote opportunities!`;
  }
  
  // Thanks
  if (text.match(/\b(thank|thanks)\b/)) {
    return getRandomResponse(responses.thanks);
  }
  
  // Goodbye
  if (text.match(/\b(bye|goodbye|see you|farewell)\b/)) {
    return getRandomResponse(responses.goodbye);
  }
  
  // Default response with suggestions
  return `${responses.default} You can ask about:\n• Her education at El Sewedy University\n• Technical skills (frontend, backend, systems)\n• Projects like DishCraft or Bagi Job\n• Her experience and availability\n• How to contact her`;
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: getRandomResponse(responses.greetings) }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Check if it's a mobile device
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
        className={`fixed z-50 bg-gradient-to-r from-[#a78bfa] to-[#f472b6] text-white rounded-full shadow-xl transition-all ${
          isMobile 
            ? 'bottom-4 right-4 p-3' 
            : 'bottom-8 right-8 p-4 hover:scale-110'
        }`}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chatbot' : 'Open chatbot'}
      >
        {open ? <X size={isMobile ? 24 : 28} /> : <MessageCircle size={isMobile ? 24 : 28} />}
      </button>
      {/* Chatbot window */}
      {open && (
        <div className={`fixed z-50 bg-white rounded-2xl shadow-2xl border border-purple-100 flex flex-col overflow-hidden animate-fade-in ${
          isMobile 
            ? 'bottom-20 right-4 left-4 w-auto' 
            : 'bottom-24 right-8 w-80 max-w-[90vw]'
        }`}>
          <div className="bg-gradient-to-r from-[#a78bfa] to-[#f472b6] text-white px-4 py-3 font-bold text-lg flex items-center gap-2">
            <MessageCircle size={20} /> Talk to Laila
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-white" style={{ minHeight: 220, maxHeight: 320 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${msg.from === 'user' ? 'bg-purple-100 text-gray-900' : 'bg-gradient-to-r from-[#a78bfa] to-[#f472b6] text-white'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={sendMessage} className="flex items-center gap-2 p-3 border-t bg-gray-50">
            <input
              className="flex-1 rounded-xl px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
              placeholder="Ask me anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-[#a78bfa] to-[#f472b6] text-white px-3 py-2 rounded-xl font-bold hover:scale-105 transition-all"
              disabled={!input.trim()}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
} 