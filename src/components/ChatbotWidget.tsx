import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

const cannedResponses: { [key: string]: string } = {
  hello: "Hi! I'm Laila, a creative developer. How can I help you?",
  name: "I'm Laila Mohamed Fikry!",
  projects: "You can see my projects in the Projects section. I love working on web, systems, and AI projects!",
  skills: "I'm skilled in React, Node.js, C, Java, and more. Check out my Skills section!",
  contact: "You can contact me via the form or email laila.mohamed.fikry@gmail.com.",
  available: "Yes, Laila is currently available for work and open to new opportunities! Feel free to reach out via the contact form or email.",
  about: "Laila Mohamed Fikry is a passionate software engineer and creative developer with a strong foundation in both systems programming and modern web development. She loves building beautiful, efficient solutions and is always eager to learn and collaborate.",
  thanks: "You're welcome! I'm here to help. If you have more questions, just ask!",
  pleasure: "My pleasure! Let me know if you need anything else.",
  bye: "Goodbye! Have a wonderful day!",
  default: "I'm here to chat about my portfolio, skills, and projects! Try asking about my skills, projects, availability, or how to contact me."
};

function getBotResponse(input: string) {
  const text = input.toLowerCase();
  if (text.includes('hello') || text.includes('hi')) return cannedResponses.hello;
  if (text.includes('name')) return cannedResponses.name;
  if (text.includes('project')) return cannedResponses.projects;
  if (text.includes('skill')) return cannedResponses.skills;
  if (text.includes('contact') || text.includes('email')) return cannedResponses.contact;
  if (text.includes('available') || text.includes('hire') || text.includes('work')) return cannedResponses.available;
  if (text.includes('about') || text.includes('who is laila') || text.includes('what do you know about laila')) return cannedResponses.about;
  if (text.includes('thank')) return cannedResponses.thanks;
  if (text.includes('pleasure')) return cannedResponses.pleasure;
  if (text.includes('bye') || text.includes('goodbye')) return cannedResponses.bye;
  return cannedResponses.default;
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! I'm Laila's portfolio bot. Ask me about Laila, her skills, or projects!" }
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