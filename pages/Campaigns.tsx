import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Campaign } from '../types';
import { Play, Pause, AlertCircle, Wand2, X, Zap } from 'lucide-react';
import { generateAdCopy } from '../services/geminiService';

interface CampaignsProps {
  campaigns: Campaign[];
}

const Campaigns: React.FC<CampaignsProps> = ({ campaigns }) => {
  const navigate = useNavigate();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerateCopy = async (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
    setIsGenerating(true);
    setAiResult('');
    
    const result = await generateAdCopy(campaign.name, campaign.objective);
    setAiResult(result);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-lg font-semibold text-gray-900">Active Campaigns</h2>
           <p className="text-sm text-gray-500">Manage your TikTok ad campaigns and optimize performance.</p>
        </div>
        <button 
          onClick={() => navigate('/ad-creator')}
          className="bg-tiktok-magenta hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm flex items-center gap-2"
        >
          <Zap size={16} />
          Create GMV Max Ad
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Campaign Name</th>
              <th className="px-6 py-4 text-right">Budget</th>
              <th className="px-6 py-4 text-right">Results</th>
              <th className="px-6 py-4 text-right">CPA</th>
              <th className="px-6 py-4 text-center">AI Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {campaigns.map((camp) => (
              <tr key={camp.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    camp.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' :
                    camp.status === 'PAUSED' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }`}>
                    {camp.status === 'ACTIVE' && <Play size={10} className="mr-1 fill-current" />}
                    {camp.status === 'PAUSED' && <Pause size={10} className="mr-1 fill-current" />}
                    {camp.status === 'REVIEW' && <AlertCircle size={10} className="mr-1" />}
                    {camp.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{camp.name}</div>
                  <div className="text-xs text-gray-500">ID: {camp.id} • {camp.objective}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="text-sm font-medium text-gray-900">${camp.budget.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Spent: ${camp.spent.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 text-right">
                   <div className="text-sm font-medium text-gray-900">{camp.conversions}</div>
                   <div className="text-xs text-gray-500">Conversions</div>
                </td>
                <td className="px-6 py-4 text-right font-mono text-sm text-gray-600">
                  ${camp.cpa.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => handleGenerateCopy(camp)}
                    className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 p-2 rounded-lg transition group relative"
                    title="Generate AI Creatives"
                  >
                    <Wand2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI Modal */}
      {isModalOpen && selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Wand2 className="text-tiktok-cyan" size={20} />
                AI Creative Generator
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="text-sm text-gray-600">
                Generating captions for campaign: <span className="font-medium text-gray-900">{selectedCampaign.name}</span>
              </div>

              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tiktok-magenta"></div>
                  <p className="text-sm text-gray-500">Consulting Gemini models...</p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-line border border-gray-200">
                  {aiResult}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium text-sm hover:bg-gray-200 rounded-lg">
                Close
              </button>
              <button className="px-4 py-2 bg-black text-white font-medium text-sm hover:bg-gray-800 rounded-lg" disabled={isGenerating}>
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;
