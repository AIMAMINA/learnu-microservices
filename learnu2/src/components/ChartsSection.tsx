import { 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

export function ChartsSection() {
  // Students per Department
  const departmentData = [
    { name: 'Computer Science', value: 842, color: '#22D3EE' },
    { name: 'Engineering', value: 687, color: '#1E293B' },
    { name: 'Business', value: 594, color: '#3E4753' },
    { name: 'Arts', value: 421, color: '#CAD8E4' },
    { name: 'Medicine', value: 938, color: '#22D3EE' }
  ];

  // Monthly New Registrations
  const registrationData = [
    { month: 'Jan', students: 245 },
    { month: 'Feb', students: 312 },
    { month: 'Mar', students: 289 },
    { month: 'Apr', students: 401 },
    { month: 'May', students: 378 },
    { month: 'Jun', students: 445 }
  ];

  // Courses Completion Rate
  const completionData = [
    { name: 'Completed', value: 72, color: '#22D3EE' },
    { name: 'In Progress', value: 23, color: '#CAD8E4' },
    { name: 'Not Started', value: 5, color: '#E7EEF4' }
  ];

  // Performance Overview
  const performanceData = [
    { category: 'Excellent', count: 1245 },
    { category: 'Good', count: 1680 },
    { category: 'Average', count: 432 },
    { category: 'Below Avg', count: 125 }
  ];

  return (
    <div className="px-8 py-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            
            {/* Students per Department - Pie Chart */}
            <div
              className="p-8 backdrop-blur-md"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.8)'
              }}
            >
              <h3 className="mb-6" style={{ color: '#1E293B', fontWeight: 600, letterSpacing: '-0.02em' }}>
                Students per Department
              </h3>
              
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {departmentData.map((dept, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: dept.color }}
                    />
                    <span style={{ color: '#3E4753' }}>
                      {dept.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly New Registrations - Line Chart */}
            <div
              className="p-8 backdrop-blur-md"
              style={{ 
                backgroundColor: '#E7EEF4',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(202, 216, 228, 0.5)'
              }}
            >
              <h3 className="mb-6" style={{ color: '#1E293B', fontWeight: 600, letterSpacing: '-0.02em' }}>
                Monthly New Registrations
              </h3>
              
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={registrationData}>
                  <XAxis dataKey="month" stroke="#3E4753" />
                  <YAxis stroke="#3E4753" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '1px solid #CAD8E4',
                      borderRadius: '12px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="students" 
                    stroke="#22D3EE" 
                    strokeWidth={3}
                    dot={{ fill: '#22D3EE', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-8">
            
            {/* Courses Completion Rate - Donut Chart */}
            <div
              className="p-8 backdrop-blur-md"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.8)'
              }}
            >
              <h3 className="mb-6" style={{ color: '#1E293B', fontWeight: 600, letterSpacing: '-0.02em' }}>
                Courses Completion Rate
              </h3>
              
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={completionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {completionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 space-y-3">
                {completionData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span style={{ color: '#3E4753' }}>
                        {item.name}
                      </span>
                    </div>
                    <span style={{ color: '#1E293B', fontWeight: 600 }}>
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Overview - Bar Chart */}
            <div
              className="p-8 backdrop-blur-md"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.8)'
              }}
            >
              <h3 className="mb-6" style={{ color: '#1E293B', fontWeight: 600, letterSpacing: '-0.02em' }}>
                Performance Overview
              </h3>
              
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={performanceData}>
                  <XAxis dataKey="category" stroke="#3E4753" />
                  <YAxis stroke="#3E4753" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '1px solid #CAD8E4',
                      borderRadius: '12px'
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#22D3EE" 
                    radius={[12, 12, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
