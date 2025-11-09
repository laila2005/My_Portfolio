import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

// Comprehensive Knowledge Base about Laila
const knowledgeBase = {
  personal: {
    name: "Laila Mohamed Fikry",
    nickname: "Lulu",
    title: "Software Engineer / Full Stack Developer",
    location: "Cairo, Egypt",
    dateOfBirth: "September 28, 2005",
    languages: ["Arabic (native)", "English (fluent)", "German (beginner)"],
    personality: {
      keywords: ["passionate", "detail-oriented", "curious", "empathetic", "growth-driven"],
      tone: "friendly, professional, and inspiring",
      values: ["honesty", "kindness", "continuous learning", "balance between career and life"]
    }
  },
  careerSummary: "Laila Mohamed Fikry is a passionate Software Engineer from Cairo, Egypt. She specializes in full-stack development using Python, JavaScript, React.js, Node.js, and MongoDB. A graduate of the ALX Africa & Holberton School Software Engineering program, she combines clean code, logical thinking, and creativity to build impactful digital experiences. Laila is known for her PEP 8–compliant, readable, and modular code style.",
  
  education: [
    "ALX Africa & Holberton School – Software Engineering Program (Foundations + Advanced Certificates)",
    "Sololearn – Introduction to SQL"
  ],
  
  skills: {
    programmingLanguages: ["Python", "C++", "JavaScript", "SQL"],
    frameworksAndLibraries: ["React.js", "Node.js", "Express.js", "Bootstrap", "Tailwind CSS"],
    databases: ["MongoDB", "MySQL"],
    tools: ["Git", "GitHub", "VS Code", "Figma", "Notion", "Postman"],
    other: ["REST APIs", "Authentication", "Data Structures & Algorithms", "OOP", "SDLC"],
    softSkills: ["Problem-solving", "Collaboration", "Adaptability", "Leadership", "Emotional intelligence"]
  },
  
  projects: {
    dishcraft: {
      name: "DishCraft - Smart Recipe Generator & Meal Planner (AI-Assisted)",
      description: "A 3-week MVP web app that generates personalized recipes using user ingredients and preferences. Built with React.js, Node.js, and MongoDB."
    },
    mazegame3D: {
      name: "3D Maze Game (Raycasting with SDL2)",
      description: "A C-based 3D game engine featuring jungle-themed textures, player movement, lighting, and collision detection."
    },
    moviesApp: {
      name: "Movies App (Bootstrap Rebuild)",
      description: "A responsive and animated movie catalog built with HTML, CSS, and Bootstrap."
    },
    techroad: {
      name: "TechRoad - AI Career Coach",
      description: "An AI-powered career coach competition project helping students improve skills and job readiness through personalized recommendations."
    }
  },
  
  volunteering: [
    {
      role: "HR Volunteer",
      organization: "Computality Community",
      description: "Streamlined data management and improved internal processes."
    },
    {
      role: "Participant",
      organization: "Value and Technology Ambassadors Initiatives",
      description: "Trained in Emotional Intelligence, Freelancing, Leadership, and CV enhancement with the Hayah Karima Foundation."
    }
  ],
  
  learningFocus: {
    currentlyLearning: ["React.js advanced concepts", "Backend optimization", "German language"],
    learningStyle: "self-paced and project-based through Notion plans and free online resources"
  },
  
  goals: {
    shortTerm: "Enhance full-stack development skills and contribute to impactful open-source projects.",
    longTerm: "Become a senior software engineer or AI-focused developer and mentor others in tech."
  },
  
  personalInterests: [
    "AI and creative technology",
    "UI/UX design and visualization", 
    "Interior design rendering using Blender, SketchUp, and Lumion",
    "Writing technical blogs and learning new languages"
  ],
  
  funFacts: [
    "Friends call her 'Lulu' 🌸",
    "She loves Python and React — they're her comfort zone.",
    "She enjoys building clean UIs as much as solving backend challenges.",
    "She's an artist too and can draw realistic portraits! 🎨",
    "She believes every bug teaches something valuable."
  ],
  
  contact: {
    email: "laila.mohamed.fikry@gmail.com",
    linkedin: "https://www.linkedin.com/in/laila-mohamed23/",
    github: "https://github.com/laila2005",
    availability: "Currently available for work and open to new opportunities"
  }
};

const responses = {
  greetings: [
    "Hi! I'm Lulu's AI assistant 👩‍💻. I can tell you all about her work, skills, and projects!",
    "Hello! I'm here to help you learn about Laila Mohamed Fikry (friends call her Lulu 🌸). What would you like to know?",
    "Hey there! I'm Lulu's portfolio assistant. She loves learning new tech — she's always working on something creative!"
  ],
  thanks: [
    "You're very welcome! Laila believes every interaction teaches something valuable 😊",
    "My pleasure! Feel free to ask anything else about Lulu's journey in tech!"
  ],
  goodbye: [
    "Goodbye! Thanks for your interest in Laila's work! 🌸",
    "Have a great day! Don't hesitate to reach out to Lulu directly - she's always excited to connect!"
  ],
  default: "I can tell you about Laila's skills, amazing projects, goals, or even some fun facts! What interests you most?",
  friendlyResponses: [
    "Laila loves learning new tech — she's always working on something creative!",
    "She believes great code should feel as elegant as it looks.",
    "Her projects mix logic, design, and human touch — just like her personality."
  ]
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
  if (text.match(/\b(name|who is|who are you|lulu|laila)\b/)) {
    return `I'm ${knowledgeBase.personal.name}, but friends call me ${knowledgeBase.personal.nickname} 🌸! I'm a ${knowledgeBase.personal.title} based in ${knowledgeBase.personal.location}. ${getRandomResponse(responses.friendlyResponses)}`;
  }
  
  // Education
  if (text.match(/\b(education|university|school|study|student|degree|alx|holberton)\b/)) {
    return `Laila graduated from ${knowledgeBase.education.join(' and ')}. She's passionate about continuous learning and currently focusing on ${knowledgeBase.learningFocus.currentlyLearning.join(', ')}.`;
  }
  
  // Career summary
  if (text.match(/\b(career|background|experience|summary|about)\b/)) {
    return knowledgeBase.careerSummary;
  }
  
  // Skills - Programming Languages
  if (text.match(/\b(programming languages|languages|python|javascript|c\+\+|sql)\b/)) {
    return `Laila's programming languages include: ${knowledgeBase.skills.programmingLanguages.join(', ')}. She loves Python and React — they're her comfort zone! 💻`;
  }
  
  // Skills - Frameworks and Libraries
  if (text.match(/\b(frameworks|libraries|react|node|express|bootstrap|tailwind)\b/)) {
    return `For frameworks and libraries, Laila works with: ${knowledgeBase.skills.frameworksAndLibraries.join(', ')}. She enjoys building clean UIs as much as solving backend challenges!`;
  }
  
  // Skills - Databases
  if (text.match(/\b(database|databases|mongodb|mysql|data)\b/)) {
    return `Laila has experience with databases: ${knowledgeBase.skills.databases.join(', ')}. She's comfortable with both SQL and NoSQL databases!`;
  }
  
  // Skills - Tools
  if (text.match(/\b(tools|git|github|vscode|figma|notion|postman)\b/)) {
    return `Laila's development tools include: ${knowledgeBase.skills.tools.join(', ')}. She believes great code should feel as elegant as it looks!`;
  }
  
  // General skills
  if (text.match(/\b(skills|technologies|tech stack|technical)\b/)) {
    return `Laila has a comprehensive skill set! Programming languages: ${knowledgeBase.skills.programmingLanguages.join(', ')}. Frameworks: ${knowledgeBase.skills.frameworksAndLibraries.slice(0,3).join(', ')}, and more. Check out her Skills section for the complete list!`;
  }
  
  // Specific projects
  if (text.match(/\b(dishcraft|dish craft|recipe|meal planner)\b/)) {
    return `${knowledgeBase.projects.dishcraft.name} is amazing! ${knowledgeBase.projects.dishcraft.description}`;
  }
  
  if (text.match(/\b(maze game|raycasting|3d game|sdl2)\b/)) {
    return `The ${knowledgeBase.projects.mazegame3D.name} is impressive! ${knowledgeBase.projects.mazegame3D.description}`;
  }
  
  if (text.match(/\b(techroad|tech road|skillsnap|career coach|ai coach)\b/)) {
    return `${knowledgeBase.projects.techroad.name} is innovative! ${knowledgeBase.projects.techroad.description}`;
  }
  
  if (text.match(/\b(movies app|movie|bootstrap)\b/)) {
    return `The ${knowledgeBase.projects.moviesApp.name} showcases her frontend skills! ${knowledgeBase.projects.moviesApp.description}`;
  }
  
  // General projects
  if (text.match(/\b(projects|portfolio|work|built|created)\b/)) {
    return `Laila has built amazing projects! Including ${knowledgeBase.projects.dishcraft.name}, ${knowledgeBase.projects.mazegame3D.name}, ${knowledgeBase.projects.techroad.name}, and ${knowledgeBase.projects.moviesApp.name}. Her projects mix logic, design, and human touch — just like her personality!`;
  }
  
  // Goals
  if (text.match(/\b(goals|future|plans|ambitions)\b/)) {
    return `Laila's short-term goal: ${knowledgeBase.goals.shortTerm} Her long-term vision: ${knowledgeBase.goals.longTerm}`;
  }
  
  // Learning
  if (text.match(/\b(learning|studying|currently learning|german)\b/)) {
    return `Laila is currently learning: ${knowledgeBase.learningFocus.currentlyLearning.join(', ')}. Her learning style is ${knowledgeBase.learningFocus.learningStyle}. She believes every bug teaches something valuable!`;
  }
  
  // Volunteering
  if (text.match(/\b(volunteer|volunteering|community|computality|hr)\b/)) {
    return `Laila has volunteering experience! She was an ${knowledgeBase.volunteering[0].role} at ${knowledgeBase.volunteering[0].organization} where she ${knowledgeBase.volunteering[0].description.toLowerCase()}. She also participated in ${knowledgeBase.volunteering[1].organization}.`;
  }
  
  // Personal interests
  if (text.match(/\b(interests|hobbies|personal|ai|blender|interior design|blogs)\b/)) {
    return `Laila's personal interests include: ${knowledgeBase.personalInterests.join(', ')}. She's passionate about AI and creative technology!`;
  }
  
  // Fun facts
  if (text.match(/\b(fun facts|fun|facts|interesting)\b/)) {
    return `Here are some fun facts about Laila: ${knowledgeBase.funFacts.join(' • ')}`;
  }
  
  // Contact and availability
  if (text.match(/\b(contact|email|reach|hire|available|work|linkedin|github)\b/)) {
    return `${knowledgeBase.contact.availability}! You can contact Laila at ${knowledgeBase.contact.email} or connect on LinkedIn: ${knowledgeBase.contact.linkedin}. Her GitHub is ${knowledgeBase.contact.github}. She's always excited to connect!`;
  }
  
  // Languages
  if (text.match(/\b(languages|speak|arabic|english|german)\b/)) {
    return `Laila speaks multiple languages: ${knowledgeBase.personal.languages.join(', ')}. This helps her work with international teams!`;
  }
  
  // Location
  if (text.match(/\b(location|where|cairo|egypt)\b/)) {
    return `Laila is based in ${knowledgeBase.personal.location}. She's open to both local and remote opportunities!`;
  }
  
  // Personality
  if (text.match(/\b(personality|values|passionate|empathetic)\b/)) {
    return `Laila is ${knowledgeBase.personal.personality.keywords.join(', ')}. Her core values are ${knowledgeBase.personal.personality.values.join(', ')}. Her tone is ${knowledgeBase.personal.personality.tone}.`;
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
  return `${responses.default} You can ask about:\n• Her skills and technologies\n• Projects like DishCraft or TechRoad\n• Her goals and learning journey\n• Fun facts and personal interests\n• How to contact her`;
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