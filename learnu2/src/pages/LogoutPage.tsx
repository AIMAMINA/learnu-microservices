import { useNavigate } from 'react-router-dom';
import { LogOut, ArrowRight } from 'lucide-react';

export function LogoutPage() {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8"
      style={{ backgroundColor: '#E7EEF4' }}
    >
      <div className="text-center max-w-md">
        {/* Icon */}
        <div 
          className="w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #22D3EE 0%, #1E9BB8 100%)',
            boxShadow: '0 12px 40px rgba(34, 211, 238, 0.3)'
          }}
        >
          <LogOut size={48} style={{ color: '#FFFFFF' }} />
        </div>

        {/* Message */}
        <h1 
          className="mb-4"
          style={{ 
            color: '#1E293B', 
            fontWeight: 700, 
            letterSpacing: '-0.02em' 
          }}
        >
          You have been logged out
        </h1>
        
        <p className="mb-8" style={{ color: '#3E4753', opacity: 0.8 }}>
          Thanks for using LearnU2. Come back soon!
        </p>

        {/* Button */}
        <button
          onClick={() => navigate('/login')}
          className="px-8 py-3.5 rounded-xl inline-flex items-center gap-2 transition-all hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #22D3EE 0%, #1E9BB8 100%)',
            color: '#FFFFFF',
            fontWeight: 600,
            boxShadow: '0 8px 24px rgba(34, 211, 238, 0.35)'
          }}
        >
          Return to Login
          <ArrowRight size={20} />
        </button>

        {/* Illustration - Simple animated circles */}
        <div className="mt-12 flex items-center justify-center gap-3">
          <div 
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ 
              backgroundColor: '#22D3EE',
              animationDelay: '0ms' 
            }}
          />
          <div 
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ 
              backgroundColor: '#CAD8E4',
              animationDelay: '150ms' 
            }}
          />
          <div 
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ 
              backgroundColor: '#22D3EE',
              animationDelay: '300ms' 
            }}
          />
        </div>
      </div>
    </div>
  );
}
