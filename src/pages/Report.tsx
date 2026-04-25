import React from 'react';
import { useAppStore } from '../store';
import { PieChart as PieChartIcon, Activity, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, subDays } from 'date-fns';

const MOCK_LINE_DATA = Array.from({ length: 7 }).map((_, i) => ({
  name: format(subDays(new Date(), 6 - i), 'MM-dd'),
  rate: Math.floor(Math.random() * 30) + 70, // 70-100的随机依从率
}));

const MOCK_PIE_DATA = [
  { name: '按时服药', value: 85, color: '#3b82f6' }, // blue-500
  { name: '漏服', value: 15, color: '#ef4444' },     // red-500
];

export const Report: React.FC = () => {
  const { currentUser } = useAppStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6 px-1">
        <div className="bg-green-100 p-2 rounded-lg text-green-600">
          <PieChartIcon size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">健康报告</h2>
      </div>

      {/* 依从性折线图 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <Activity size={20} className="text-blue-500 mr-2" />
            近7日服药依从率
          </h3>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_LINE_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                domain={[0, 100]}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 漏服情况饼图 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <PieChartIcon size={20} className="text-green-500 mr-2" />
            本月服药统计
          </h3>
        </div>
        <div className="flex flex-row items-center">
          <div className="h-48 w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {MOCK_PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 space-y-4 pl-4">
            {MOCK_PIE_DATA.map(item => (
              <div key={item.name} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                <div className="flex-1 text-gray-600">{item.name}</div>
                <div className="font-bold text-gray-800">{item.value}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 导出报告 */}
      <button className="w-full py-4 bg-green-50 text-green-700 rounded-2xl font-bold text-lg flex items-center justify-center shadow-sm hover:bg-green-100 transition-colors border border-green-100">
        <FileText size={24} className="mr-2" />
        {currentUser.role === 'patient' ? '生成报告发给家属/医生' : '导出看护人健康报告'}
      </button>

    </div>
  );
};
