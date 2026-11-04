export function RecentActivity() {
  const activities = [
    { 
      name: 'Emma Wilson', 
      course: 'Computer Science 101', 
      progress: 85, 
      date: 'Nov 15, 2024',
      status: 'Active'
    },
    { 
      name: 'James Chen', 
      course: 'Data Structures', 
      progress: 92, 
      date: 'Nov 15, 2024',
      status: 'Active'
    },
    { 
      name: 'Sophia Martinez', 
      course: 'Web Development', 
      progress: 68, 
      date: 'Nov 14, 2024',
      status: 'In Progress'
    },
    { 
      name: 'Oliver Brown', 
      course: 'Machine Learning', 
      progress: 45, 
      date: 'Nov 14, 2024',
      status: 'In Progress'
    },
    { 
      name: 'Ava Johnson', 
      course: 'Database Systems', 
      progress: 100, 
      date: 'Nov 13, 2024',
      status: 'Completed'
    },
    { 
      name: 'Liam Davis', 
      course: 'Mobile Development', 
      progress: 78, 
      date: 'Nov 13, 2024',
      status: 'Active'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return { bg: 'rgba(34, 211, 238, 0.15)', text: '#22D3EE', border: 'rgba(34, 211, 238, 0.3)' };
      case 'Completed':
        return { bg: 'rgba(34, 197, 94, 0.15)', text: '#22C55E', border: 'rgba(34, 197, 94, 0.3)' };
      case 'In Progress':
        return { bg: 'rgba(251, 146, 60, 0.15)', text: '#FB923C', border: 'rgba(251, 146, 60, 0.3)' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.15)', text: '#94A3B8', border: 'rgba(148, 163, 184, 0.3)' };
    }
  };

  return (
    <div className="px-8 py-12">
      <div className="max-w-[1600px] mx-auto">
        <div
          className="p-8 backdrop-blur-md overflow-hidden"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.8)'
          }}
        >
          <h3 className="mb-8" style={{ color: '#1E293B', fontWeight: 600, letterSpacing: '-0.02em' }}>
            Recent Student Activity
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '2px solid #E7EEF4' }}>
                  <th className="px-6 py-4 text-left" style={{ color: '#1E293B', fontWeight: 600 }}>
                    Name
                  </th>
                  <th className="px-6 py-4 text-left" style={{ color: '#1E293B', fontWeight: 600 }}>
                    Course
                  </th>
                  <th className="px-6 py-4 text-left" style={{ color: '#1E293B', fontWeight: 600 }}>
                    Progress
                  </th>
                  <th className="px-6 py-4 text-left" style={{ color: '#1E293B', fontWeight: 600 }}>
                    Date
                  </th>
                  <th className="px-6 py-4 text-left" style={{ color: '#1E293B', fontWeight: 600 }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, index) => (
                  <tr
                    key={index}
                    className="transition-all duration-200"
                    style={{ 
                      borderBottom: '1px solid #E7EEF4'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F5F8FA';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td className="px-6 py-5" style={{ color: '#1E293B', fontWeight: 600 }}>
                      {activity.name}
                    </td>
                    <td className="px-6 py-5" style={{ color: '#3E4753' }}>
                      {activity.course}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div 
                          className="flex-1 h-2 rounded-full overflow-hidden"
                          style={{ backgroundColor: '#E7EEF4', maxWidth: '120px' }}
                        >
                          <div 
                            className="h-full rounded-full transition-all"
                            style={{ 
                              width: `${activity.progress}%`,
                              background: 'linear-gradient(90deg, #22D3EE 0%, #1E9BB8 100%)'
                            }}
                          />
                        </div>
                        <span style={{ color: '#3E4753', fontWeight: 600 }}>
                          {activity.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5" style={{ color: '#3E4753', opacity: 0.8 }}>
                      {activity.date}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className="px-3 py-1.5 rounded-lg inline-block"
                        style={{ 
                          backgroundColor: getStatusColor(activity.status).bg,
                          color: getStatusColor(activity.status).text,
                          border: `1px solid ${getStatusColor(activity.status).border}`,
                          fontWeight: 600
                        }}
                      >
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
