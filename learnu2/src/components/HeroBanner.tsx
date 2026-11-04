import { TrendingUp, UserPlus } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function HeroBanner() {
  return (
    <div 
      className="relative w-full overflow-hidden"
      style={{ height: '480px' }}
    >
      {/* Background Image */}
      <ImageWithFallback
        src="https://images.unsplash.com/photo-1752920299211-28be8c9b0121?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwbGlicmFyeXxlbnwxfHx8fDE3NjMzODMxMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
        alt="Students studying"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.92) 0%, rgba(30, 41, 59, 0.7) 50%, transparent 100%)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-8">
        <div className="max-w-[1600px] mx-auto w-full">
          <div className="max-w-2xl">
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                backgroundColor: 'rgba(34, 211, 238, 0.15)',
                border: '1px solid rgba(34, 211, 238, 0.3)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: '#22D3EE' }}
              />
              <span style={{ color: '#22D3EE', fontWeight: 600 }}>
                Live Dashboard
              </span>
            </div>

            {/* Title */}
            <h1 
              className="mb-4"
              style={{ 
                color: '#FFFFFF', 
                fontWeight: 700, 
                letterSpacing: '-0.03em',
                textShadow: '0 2px 12px rgba(0, 0, 0, 0.3)'
              }}
            >
              Welcome to your Dashboard
            </h1>

            {/* Subtitle */}
            <p 
              className="mb-8"
              style={{ 
                color: '#CAD8E4', 
                fontWeight: 400,
                opacity: 0.95
              }}
            >
              Monitor your academic activity at a glance. Track students, courses, and performance metrics in real-time.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4">
              <button
                className="px-6 py-3 rounded-xl flex items-center gap-2 transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #22D3EE 0%, #1E9BB8 100%)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  boxShadow: '0 8px 24px rgba(34, 211, 238, 0.35)'
                }}
              >
                <TrendingUp size={20} />
                View Reports
              </button>

              <button
                className="px-6 py-3 rounded-xl flex items-center gap-2 transition-all hover:scale-105"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <UserPlus size={20} />
                New Student
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
