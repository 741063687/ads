import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, MousePointer, Eye, Activity } from 'lucide-react';
import { Campaign } from '../types';
import { analyzeCampaignPerformance } from '../services/geminiService';

interface DashboardProps {
  campaigns: Campaign[];
}

const StatCard = ({ title, value, change, icon: Icon, colorClass }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
        <Icon className={colorClass.replace('bg-', 'text-')} size={24} />
      </div>
      <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {change >= 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
        {Math.abs(change)}%
      </span>
    </div>
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ campaigns }) => {
  const [aiInsight, setAiInsight] = useState<{topPerformer?: string, insight?: string} | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  useEffect(() => {
    if (campaigns.length > 0 && !aiInsight) {
      setIsLoadingInsight(true);
      analyzeCampaignPerformance(campaigns).then(result => {
        setAiInsight(result);
        setIsLoadingInsight(false);
      });
    }
  }, [campaigns, aiInsight]);

  const totalSpent = campaigns.reduce((acc, c) => acc + c.spent, 0);
  const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0);
  const totalConversions = campaigns.reduce((acc, c) => acc + c.conversions, 0);
  const avgRoas = campaigns.length ? (campaigns.reduce((acc, c) => acc + c.roas, 0) / campaigns.length).toFixed(2) : 0;

  const chartData = campaigns.map(c => ({
    name: c.name.split(' ')[0] + '...', // Short name
    spend: c.spent,
    conversions: c.conversions,
    impressions: c.impressions / 1000 // In k
  }));

  return (
    <div className="space-y-6">
      {/* AI Insight Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <Activity className="text-tiktok-cyan" size={20} />
               <h2 className="text-lg font-bold">Gemini AI Intelligence</h2>
            </div>
            {isLoadingInsight ? (
              <p className="text-white/80 animate-pulse">Analyzing real-time campaign data...</p>
            ) : (
              <div className="space-y-1">
                 <p className="font-medium text-lg">Top Performer: <span className="text-tiktok-cyan">{aiInsight?.topPerformer || 'N/A'}</span></p>
                 <p className="text-white/80 text-sm">{aiInsight?.insight || 'Data analysis complete. Optimization recommended for lower performing assets.'}</p>
              </div>
            )}
          </div>
          <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition shadow-sm">
            Full Report
          </button>
        </div>
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Spend" value={`$${totalSpent.toLocaleString()}`} change={12.5} icon={DollarSign} colorClass="bg-blue-500 text-blue-500" />
        <StatCard title="Impressions" value={`${(totalImpressions / 1000).toFixed(1)}K`} change={8.2} icon={Eye} colorClass="bg-purple-500 text-purple-500" />
        <StatCard title="Conversions" value={totalConversions} change={-2.4} icon={MousePointer} colorClass="bg-tiktok-magenta text-tiktok-magenta" />
        <StatCard title="Avg. ROAS" value={avgRoas} change={5.1} icon={Activity} colorClass="bg-tiktok-cyan text-tiktok-cyan" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Spend vs Conversions</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  cursor={{ fill: '#F3F4F6' }}
                />
                <Bar yAxisId="left" dataKey="spend" fill="#25F4EE" radius={[4, 4, 0, 0]} barSize={30} name="Spend ($)" />
                <Bar yAxisId="right" dataKey="conversions" fill="#FE2C55" radius={[4, 4, 0, 0]} barSize={30} name="Conversions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Impression Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="impressions" stroke="#4F46E5" fill="url(#colorImp)" strokeWidth={2} />
                <defs>
                  <linearGradient id="colorImp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;