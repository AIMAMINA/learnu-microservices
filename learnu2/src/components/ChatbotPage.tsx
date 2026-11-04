import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your LearnU2 assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false);
      const botMessage: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputValue),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1200);
  };

  const getBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('course') || lowerInput.includes('class')) {
      return "We offer a wide variety of courses across multiple disciplines. You can view all available courses in the Courses section. Is there a specific field you're interested in?";
    } else if (lowerInput.includes('enrollment') || lowerInput.includes('enroll')) {
      return "To enroll in a course, navigate to the Courses page, select your desired course, and click the 'Enroll' button. If you need assistance, please contact the registrar's office.";
    } else if (lowerInput.includes('schedule') || lowerInput.includes('timetable')) {
      return "Your personalized schedule can be found in your student portal. It includes all enrolled courses with times and locations.";
    } else if (lowerInput.includes('help') || lowerInput.includes('support')) {
      return "I'm here to help! You can ask me about courses, enrollment, schedules, grades, or general university information. What would you like to know?";
    } else {
      return "Thank you for your question! I can help you with information about courses, enrollment, schedules, and more. Could you please provide more details about what you're looking for?";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-8 py-10 -mt-20 relative z-10">
      <div className="max-w-[900px] mx-auto">
        <div
          className="flex flex-col overflow-hidden backdrop-blur-md"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '18px',
            height: 'calc(100vh - 400px)',
            minHeight: '600px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
            border: '1px solid rgba(202, 216, 228, 0.3)'
          }}
        >
          {/* Chat Header */}
          <div 
            className="px-8 py-5 border-b flex items-center gap-3"
            style={{ borderColor: 'rgba(202, 216, 228, 0.3)' }}
          >
            <div 
              className="p-2 rounded-lg"
              style={{ 
                backgroundColor: 'rgba(34, 211, 238, 0.1)',
                border: '1px solid rgba(34, 211, 238, 0.3)'
              }}
            >
              <Sparkles size={20} style={{ color: '#22D3EE' }} />
            </div>
            <div>
              <div style={{ color: '#1E293B', fontWeight: 600 }}>
                AI Assistant
              </div>
              <div style={{ color: '#3E4753', opacity: 0.6 }}>
                Always here to help
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[75%] px-5 py-3.5 ${message.isUser ? 'rounded-[20px] rounded-tr-[4px]' : 'rounded-[20px] rounded-tl-[4px]'}`}
                  style={{
                    backgroundColor: message.isUser ? '#22D3EE' : '#CAD8E4',
                    color: message.isUser ? '#FFFFFF' : '#1E293B',
                    boxShadow: message.isUser 
                      ? '0 4px 12px rgba(34, 211, 238, 0.25)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  <p style={{ fontWeight: message.isUser ? 500 : 400 }}>
                    {message.text}
                  </p>
                  <div 
                    className="mt-2 opacity-70"
                    style={{ 
                      color: message.isUser ? '#FFFFFF' : '#3E4753'
                    }}
                  >
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div
                  className="px-5 py-3.5 rounded-[20px] rounded-tl-[4px] flex items-center gap-2"
                  style={{
                    backgroundColor: '#CAD8E4',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  <div className="flex gap-1">
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: '#3E4753', animationDelay: '0ms' }}
                    />
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: '#3E4753', animationDelay: '150ms' }}
                    />
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: '#3E4753', animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div 
            className="p-6 border-t backdrop-blur-sm"
            style={{ 
              borderColor: 'rgba(202, 216, 228, 0.3)',
              backgroundColor: 'rgba(245, 248, 250, 0.5)'
            }}
          >
            <div 
              className="flex items-center gap-3 px-5 py-3.5 transition-all"
              style={{ 
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid rgba(202, 216, 228, 0.4)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
            >
              <input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent outline-none"
                style={{ color: '#3E4753', fontWeight: 400 }}
              />
              <button
                onClick={handleSend}
                className="p-2.5 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: inputValue.trim() ? '#22D3EE' : '#F5F8FA',
                  boxShadow: inputValue.trim() ? '0 4px 12px rgba(34, 211, 238, 0.3)' : 'none'
                }}
                disabled={!inputValue.trim()}
                onMouseEnter={(e) => {
                  if (inputValue.trim()) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Send size={20} style={{ color: inputValue.trim() ? '#FFFFFF' : '#3E4753' }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}