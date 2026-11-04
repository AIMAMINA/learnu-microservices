import { Search, Filter } from 'lucide-react';
import { useState } from 'react';

export function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Freshman', 'Sophomore', 'Junior', 'Senior'];

  const students = [
    { id: '001', name: 'Emily Rodriguez', email: 'emily.r@learnu2.edu', major: 'Computer Science', year: 'Junior', gpa: '3.8' },
    { id: '002', name: 'James Wilson', email: 'james.w@learnu2.edu', major: 'Business Administration', year: 'Senior', gpa: '3.6' },
    { id: '003', name: 'Sophia Chen', email: 'sophia.c@learnu2.edu', major: 'Engineering', year: 'Sophomore', gpa: '3.9' },
    { id: '004', name: 'Michael Brown', email: 'michael.b@learnu2.edu', major: 'Psychology', year: 'Freshman', gpa: '3.5' },
    { id: '005', name: 'Olivia Martinez', email: 'olivia.m@learnu2.edu', major: 'Biology', year: 'Junior', gpa: '3.7' },
    { id: '006', name: 'Daniel Kim', email: 'daniel.k@learnu2.edu', major: 'Mathematics', year: 'Senior', gpa: '4.0' },
    { id: '007', name: 'Ava Thompson', email: 'ava.t@learnu2.edu', major: 'Art History', year: 'Sophomore', gpa: '3.4' },
    { id: '008', name: 'Ethan Davis', email: 'ethan.d@learnu2.edu', major: 'Physics', year: 'Junior', gpa: '3.8' },
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.major.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || student.year === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="px-8 py-10 -mt-20 relative z-10">
      <div className="max-w-[1400px] mx-auto">
        {/* Header with Search and Filters */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 style={{ color: '#1E293B', fontWeight: 600, letterSpacing: '-0.02em' }} className="mb-2">
              All Students
            </h2>
            <p style={{ color: '#3E4753', opacity: 0.6 }}>
              {filteredStudents.length} students found
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Filters */}
            <div className="flex items-center gap-2">
              <Filter size={18} style={{ color: '#3E4753', opacity: 0.6 }} />
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className="px-4 py-2 rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: activeFilter === filter ? '#22D3EE' : '#F5F8FA',
                    color: activeFilter === filter ? '#FFFFFF' : '#3E4753',
                    fontWeight: activeFilter === filter ? 600 : 400,
                    border: `1px solid ${activeFilter === filter ? '#22D3EE' : 'rgba(202, 216, 228, 0.4)'}`,
                    boxShadow: activeFilter === filter ? '0 4px 12px rgba(34, 211, 238, 0.25)' : 'none'
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>
            
            {/* Search */}
            <div 
              className="flex items-center gap-3 px-5 py-2.5 transition-all"
              style={{ 
                backgroundColor: '#F5F8FA',
                borderRadius: '16px',
                width: '320px',
                border: '1px solid rgba(202, 216, 228, 0.4)'
              }}
            >
              <Search size={18} style={{ color: '#3E4753', opacity: 0.6 }} />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none w-full"
                style={{ color: '#3E4753' }}
              />
            </div>
          </div>
        </div>

        {/* Premium Table */}
        <div
          className="overflow-hidden backdrop-blur-sm"
          style={{ 
            borderRadius: '18px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
            border: '1px solid rgba(202, 216, 228, 0.3)'
          }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ 
                backgroundColor: '#FFFFFF',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
              }}>
                <th className="px-6 py-5 text-left" style={{ color: '#1E293B', fontWeight: 600 }}>
                  ID
                </th>
                <th className="px-6 py-5 text-left" style={{ color: '#1E293B', fontWeight: 600 }}>
                  Name
                </th>
                <th className="px-6 py-5 text-left" style={{ color: '#1E293B', fontWeight: 600 }}>
                  Email
                </th>
                <th className="px-6 py-5 text-left" style={{ color: '#1E293B', fontWeight: 600 }}>
                  Major
                </th>
                <th className="px-6 py-5 text-left" style={{ color: '#1E293B', fontWeight: 600 }}>
                  Year
                </th>
                <th className="px-6 py-5 text-left" style={{ color: '#1E293B', fontWeight: 600 }}>
                  GPA
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr
                  key={student.id}
                  className="transition-all duration-200 cursor-pointer"
                  style={{ 
                    backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F5F8FA',
                    borderTop: '1px solid rgba(202, 216, 228, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#CAD8E4';
                    e.currentTarget.style.outline = '1px solid rgba(34, 211, 238, 0.3)';
                    e.currentTarget.style.outlineOffset = '-1px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#FFFFFF' : '#F5F8FA';
                    e.currentTarget.style.outline = 'none';
                  }}
                >
                  <td className="px-6 py-5" style={{ color: '#3E4753', fontWeight: 500 }}>
                    {student.id}
                  </td>
                  <td className="px-6 py-5" style={{ color: '#1E293B', fontWeight: 600 }}>
                    {student.name}
                  </td>
                  <td className="px-6 py-5" style={{ color: '#3E4753' }}>
                    {student.email}
                  </td>
                  <td className="px-6 py-5" style={{ color: '#3E4753' }}>
                    {student.major}
                  </td>
                  <td className="px-6 py-5" style={{ color: '#3E4753' }}>
                    {student.year}
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className="px-3 py-1.5 rounded-full"
                      style={{ 
                        backgroundColor: 'rgba(34, 211, 238, 0.15)',
                        color: '#22D3EE',
                        fontWeight: 600,
                        border: '1px solid rgba(34, 211, 238, 0.3)'
                      }}
                    >
                      {student.gpa}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}