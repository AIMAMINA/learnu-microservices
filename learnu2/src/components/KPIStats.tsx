import { Users, BookOpen, GraduationCap, Activity } from 'lucide-react';

export function KPIStats() {
  const stats = [
    {
      title: 'Students',
      value: '3,482',
      trend: '+12%',
      trendLabel: 'this month',
      icon: Users,
      color: '#22D3EE'
    },
    {
      title: 'Courses',
      value: '145',
      trend: '+8%',
      trendLabel: 'this month',
      icon: BookOpen,
      color: '#22D3EE'
    },
    {
      title: 'Professors',
      value: '87',
      trend: '+3%',
      trendLabel: 'this month',
      icon: GraduationCap,
      color: '#22D3EE'
    },
    {
      title: 'Active Sessions',
      value: '312',
      trend: '+18%',
      trendLabel: 'this month',
      icon: Activity,
      color: '#22D3EE'
    }
  ];

  return (
    <div className="px-8 py-12 -mt-20 relative z-20">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-6 backdrop-blur-md group hover:scale-[1.03] transition-all duration-300 cursor-pointer"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.8)'
              }}
            >
              <div className="flex items-start justify-between mb-5">
                <div
                  className="p-3.5 rounded-2xl relative overflow-hidden"
                  style={{ 
                    background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}25 100%)`,
                    border: `1px solid ${stat.color}40`,
                    boxShadow: `0 4px 16px ${stat.color}20`
                  }}
                >
                  <stat.icon size={26} style={{ color: stat.color }} />
                </div>
                
                <div 
                  className="px-3 py-1 rounded-lg"
                  style={{ 
                    backgroundColor: 'rgba(34, 211, 238, 0.1)',
                    color: '#22D3EE',
                    fontWeight: 600
                  }}
                >
                  {stat.trend}
                </div>
              </div>

              <div style={{ color: '#3E4753', fontWeight: 500, opacity: 0.7 }} className="mb-2">
                {stat.title}
              </div>
              
              <div style={{ color: '#1E293B', fontWeight: 700, letterSpacing: '-0.02em' }} className="mb-2">
                {stat.value}
              </div>

              <div style={{ color: '#3E4753', opacity: 0.6 }}>
                {stat.trendLabel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
