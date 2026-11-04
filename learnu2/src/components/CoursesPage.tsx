import { Clock, Users, BookOpen, ArrowRight } from 'lucide-react';

export function CoursesPage() {
  const courses = [
    {
      title: 'Introduction to Computer Science',
      code: 'CS 101',
      description: 'Learn the fundamentals of programming and computational thinking.',
      instructor: 'Dr. Sarah Williams',
      students: 145,
      duration: '12 weeks'
    },
    {
      title: 'Data Structures & Algorithms',
      code: 'CS 201',
      description: 'Master essential data structures and algorithmic problem-solving.',
      instructor: 'Prof. Michael Chen',
      students: 98,
      duration: '14 weeks'
    },
    {
      title: 'Database Management Systems',
      code: 'CS 301',
      description: 'Design and implement relational and NoSQL databases.',
      instructor: 'Dr. Emily Johnson',
      students: 76,
      duration: '12 weeks'
    },
    {
      title: 'Web Development',
      code: 'CS 250',
      description: 'Build modern, responsive web applications using latest technologies.',
      instructor: 'Prof. David Martinez',
      students: 132,
      duration: '10 weeks'
    },
    {
      title: 'Machine Learning',
      code: 'CS 401',
      description: 'Explore supervised and unsupervised learning algorithms.',
      instructor: 'Dr. Lisa Anderson',
      students: 64,
      duration: '16 weeks'
    },
    {
      title: 'Mobile App Development',
      code: 'CS 350',
      description: 'Create cross-platform mobile applications for iOS and Android.',
      instructor: 'Prof. James Taylor',
      students: 89,
      duration: '12 weeks'
    },
  ];

  return (
    <div className="px-8 py-10 -mt-20 relative z-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <div
              key={index}
              className="overflow-hidden group hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              style={{ 
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                border: '1px solid rgba(202, 216, 228, 0.3)'
              }}
            >
              {/* Gradient Banner Header */}
              <div 
                className="h-2 w-full"
                style={{
                  background: 'linear-gradient(90deg, #22D3EE 0%, #CAD8E4 100%)'
                }}
              />
              
              <div className="p-6">
                {/* Course Code Badge */}
                <div className="mb-4">
                  <span
                    className="px-3 py-1.5 rounded-lg"
                    style={{ 
                      backgroundColor: 'rgba(34, 211, 238, 0.1)',
                      color: '#22D3EE',
                      fontWeight: 600,
                      border: '1px solid rgba(34, 211, 238, 0.3)'
                    }}
                  >
                    {course.code}
                  </span>
                </div>

                {/* Course Title */}
                <h3 
                  className="mb-3 transition-colors"
                  style={{ color: '#1E293B', fontWeight: 600, letterSpacing: '-0.02em' }}
                >
                  {course.title}
                </h3>

                {/* Description */}
                <p className="mb-5" style={{ color: '#3E4753', opacity: 0.7 }}>
                  {course.description}
                </p>

                {/* Separator */}
                <div 
                  className="h-px w-full mb-5"
                  style={{ backgroundColor: '#CAD8E4', opacity: 0.5 }}
                />

                {/* Instructor */}
                <div className="mb-5 flex items-center gap-2">
                  <BookOpen size={16} style={{ color: '#22D3EE' }} />
                  <span style={{ color: '#3E4753', fontWeight: 500 }}>
                    {course.instructor}
                  </span>
                </div>

                {/* Meta Information */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Users size={16} style={{ color: '#3E4753', opacity: 0.6 }} />
                    <span style={{ color: '#3E4753', opacity: 0.8 }}>
                      {course.students} students
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} style={{ color: '#3E4753', opacity: 0.6 }} />
                    <span style={{ color: '#3E4753', opacity: 0.8 }}>
                      {course.duration}
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  className="w-full py-3 rounded-xl flex items-center justify-center gap-2 group/btn transition-all duration-200"
                  style={{
                    backgroundColor: '#F5F8FA',
                    color: '#1E293B',
                    fontWeight: 600,
                    border: '1px solid rgba(202, 216, 228, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#22D3EE';
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#22D3EE';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 211, 238, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F5F8FA';
                    e.currentTarget.style.color = '#1E293B';
                    e.currentTarget.style.borderColor = 'rgba(202, 216, 228, 0.4)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  View Details
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}