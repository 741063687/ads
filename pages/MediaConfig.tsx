import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Server, Key, Globe, CheckCircle, Edit, ArrowLeft, MoreHorizontal, Clock, Shield, FileJson, Type, ToggleLeft, AlertCircle } from 'lucide-react';

interface CustomParam {
  id: string;
  key: string;
  value: string;
  type: 'string' | 'integer' | 'boolean' | 'json';
  required: boolean;
  description: string;
}

interface MediaInterfaceConfig {
  id: string;
  name: string;
  baseUrl: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  appId: string;
  accessToken: string;
  customParams: CustomParam[];
  updatedAt: string;
}

// Template for GMV Max Campaign Creation
const TIKTOK_GMV_MAX_TEMPLATE: MediaInterfaceConfig = {
  id: 'tiktok_gmv_max_v1',
  name: 'TikTok GMV Max Campaign',
  baseUrl: 'https://business-api.tiktok.com/open_api/v1.3/campaign/create/',
  method: 'POST',
  appId: '',
  accessToken: '',
  customParams: [
    { 
      id: 'p_adv_id', 
      key: 'advertiser_id', 
      value: '', 
      type: 'string', 
      required: true, 
      description: 'The Advertiser ID.' 
    },
    { 
      id: 'p_camp_name', 
      key: 'campaign_name', 
      value: 'GMV Max Campaign 2024', 
      type: 'string', 
      required: true, 
      description: 'Name of the campaign.' 
    },
    { 
      id: 'p_obj_type', 
      key: 'objective_type', 
      value: 'GMV_MAX', 
      type: 'string', 
      required: true, 
      description: 'Must be GMV_MAX for this campaign type.' 
    },
    { 
      id: 'p_budget', 
      key: 'budget', 
      value: '500', 
      type: 'integer', 
      required: true, 
      description: 'Daily budget amount.' 
    },
    { 
      id: 'p_budget_mode', 
      key: 'budget_mode', 
      value: 'BUDGET_MODE_DAY', 
      type: 'string', 
      required: true, 
      description: 'Budget mode (e.g. BUDGET_MODE_DAY).' 
    },
    { 
      id: 'p_pixel', 
      key: 'pixel_id', 
      value: '', 
      type: 'string', 
      required: true, 
      description: 'Pixel ID for tracking events.' 
    },
    { 
      id: 'p_catalog', 
      key: 'catalog_id', 
      value: '', 
      type: 'string', 
      required: true, 
      description: 'Product Catalog ID for Shop ads.' 
    },
    { 
      id: 'p_opt_goal', 
      key: 'optimization_goal', 
      value: 'GROSS_MERCHANDISE_VALUE', 
      type: 'string', 
      required: true, 
      description: 'Optimization goal.' 
    },
    { 
      id: 'p_creatives', 
      key: 'creatives', 
      value: '[\n  {\n    "ad_name": "Product Showcase 1",\n    "video_id": "",\n    "ad_text": "Check out this product!",\n    "call_to_action": "SHOP_NOW",\n    "product_specific_type": "ALL"\n  }\n]', 
      type: 'json', 
      required: true, 
      description: 'Array of ad creatives.' 
    }
  ],
  updatedAt: new Date().toISOString()
};

// Template for Standard Campaign Creation
const TIKTOK_CAMPAIGN_CREATE_TEMPLATE: MediaInterfaceConfig = {
  id: 'tiktok_campaign_create_v1',
  name: 'TikTok Standard Campaign',
  baseUrl: 'https://business-api.tiktok.com/open_api/v1.3/campaign/create/',
  method: 'POST',
  appId: '',
  accessToken: '',
  customParams: [
    { 
      id: 'p_std_adv_id', 
      key: 'advertiser_id', 
      value: '', 
      type: 'string', 
      required: true, 
      description: 'The Advertiser ID.' 
    },
    { 
      id: 'p_std_camp_name', 
      key: 'campaign_name', 
      value: 'New Standard Campaign', 
      type: 'string', 
      required: true, 
      description: 'Campaign Name (max 512 chars).' 
    },
    { 
      id: 'p_std_obj', 
      key: 'objective_type', 
      value: 'TRAFFIC', 
      type: 'string', 
      required: true, 
      description: 'TRAFFIC, CONVERSIONS, APP_INSTALL, REACH, VIDEO_VIEWS, LEAD_GENERATION.' 
    },
    { 
      id: 'p_std_bud_mode', 
      key: 'budget_mode', 
      value: 'BUDGET_MODE_DAY', 
      type: 'string', 
      required: true, 
      description: 'BUDGET_MODE_DAY, BUDGET_MODE_TOTAL, BUDGET_MODE_INFINITE.' 
    },
    { 
      id: 'p_std_budget', 
      key: 'budget', 
      value: '50', 
      type: 'integer', 
      required: false, 
      description: 'Campaign budget. Required if mode is not INFINITE.' 
    },
    { 
       id: 'p_std_status', 
       key: 'operation_status', 
       value: 'ENABLE', 
       type: 'string', 
       required: false, 
       description: 'ENABLE or DISABLE' 
    }
  ],
  updatedAt: new Date().toISOString()
};

const MediaConfig: React.FC = () => {
  const [configs, setConfigs] = useState<MediaInterfaceConfig[]>([]);
  const [editingConfig, setEditingConfig] = useState<MediaInterfaceConfig | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'edit'>('list');
  const [showSuccess, setShowSuccess] = useState(false);

  // Load from local storage on mount, and merge new templates if missing
  useEffect(() => {
    const savedConfigs = localStorage.getItem('media_api_configs_v2');
    const defaultTemplates = [TIKTOK_GMV_MAX_TEMPLATE, TIKTOK_CAMPAIGN_CREATE_TEMPLATE];

    if (savedConfigs) {
      try {
        const parsed = JSON.parse(savedConfigs);
        // Check if any default template is missing by ID
        const missingTemplates = defaultTemplates.filter(
          tpl => !parsed.some((saved: MediaInterfaceConfig) => saved.id === tpl.id)
        );

        if (missingTemplates.length > 0) {
          const merged = [...parsed, ...missingTemplates];
          setConfigs(merged);
          localStorage.setItem('media_api_configs_v2', JSON.stringify(merged));
        } else {
          setConfigs(parsed);
        }
      } catch (e) {
        console.error("Failed to parse configs", e);
        setConfigs(defaultTemplates);
        localStorage.setItem('media_api_configs_v2', JSON.stringify(defaultTemplates));
      }
    } else {
      setConfigs(defaultTemplates);
      localStorage.setItem('media_api_configs_v2', JSON.stringify(defaultTemplates));
    }
  }, []);

  const saveToStorage = (newConfigs: MediaInterfaceConfig[]) => {
    localStorage.setItem('media_api_configs_v2', JSON.stringify(newConfigs));
    setConfigs(newConfigs);
  };

  const handleCreate = () => {
    setEditingConfig({
      ...TIKTOK_CAMPAIGN_CREATE_TEMPLATE, // Use the simpler one as base for new
      id: Date.now().toString(),
      name: 'New Interface',
      updatedAt: new Date().toISOString(),
      customParams: [] // Start empty for a fresh custom interface
    });
    setViewMode('edit');
  };

  const handleEdit = (config: MediaInterfaceConfig) => {
    setEditingConfig({ ...config });
    setViewMode('edit');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this configuration?')) {
      const newConfigs = configs.filter(c => c.id !== id);
      saveToStorage(newConfigs);
    }
  };

  const handleSaveConfig = (config: MediaInterfaceConfig) => {
    const existingIndex = configs.findIndex(c => c.id === config.id);
    let newConfigs = [...configs];
    
    const configToSave = {
      ...config,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      newConfigs[existingIndex] = configToSave;
    } else {
      newConfigs.push(configToSave);
    }

    saveToStorage(newConfigs);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setViewMode('list');
      setEditingConfig(null);
    }, 800);
  };

  // --- List View Component ---
  if (viewMode === 'list') {
    return (
      <div className="max-w-6xl space-y-8 animate-in fade-in duration-300">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Media Interfaces</h2>
            <p className="text-gray-500 mt-1">Manage API connections for ad creation and media management.</p>
          </div>
          <button 
            onClick={handleCreate}
            className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition shadow-sm"
          >
            <Plus size={18} />
            Add Interface
          </button>
        </div>

        {configs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Server className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No Interfaces Configured</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">Get started by adding a new media API connection.</p>
            <button 
              onClick={handleCreate}
              className="text-tiktok-magenta font-medium hover:text-red-700 text-sm"
            >
              + Configure First Interface
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {configs.map((config) => (
              <div key={config.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 w-1 h-full bg-tiktok-cyan opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 shrink-0">
                        <Globe className="text-gray-500" size={20} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate pr-2">{config.name}</h3>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={10} />
                          {new Date(config.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button 
                        onClick={() => handleEdit(config)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(config.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                      <span className={`uppercase font-bold text-[10px] px-1.5 py-0.5 rounded ${config.method === 'POST' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {config.method || 'POST'}
                      </span>
                      <span className="truncate font-mono" title={config.baseUrl}>{config.baseUrl}</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Parameters</p>
                    <div className="flex flex-wrap gap-1.5">
                      {config.customParams.slice(0, 4).map(p => (
                        <span key={p.id} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200">
                          {p.key}
                          {p.required && <span className="text-red-500 ml-0.5">*</span>}
                        </span>
                      ))}
                      {config.customParams.length > 4 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-400 text-xs rounded border border-gray-100">
                          +{config.customParams.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                   <div className="flex items-center gap-2">
                     <Shield size={12} />
                     {config.appId ? 'Auth Configured' : 'No Auth'}
                   </div>
                   <span className="flex items-center gap-1 text-green-600">
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                     Active
                   </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- Edit View Component ---
  return (
    <ConfigEditor 
      initialConfig={editingConfig!} 
      onSave={handleSaveConfig} 
      onCancel={() => setViewMode('list')}
      showSuccess={showSuccess}
    />
  );
};

// --- Sub-component for the Form ---

interface ConfigEditorProps {
  initialConfig: MediaInterfaceConfig;
  onSave: (config: MediaInterfaceConfig) => void;
  onCancel: () => void;
  showSuccess: boolean;
}

const ConfigEditor: React.FC<ConfigEditorProps> = ({ initialConfig, onSave, onCancel, showSuccess }) => {
  const [config, setConfig] = useState<MediaInterfaceConfig>(initialConfig);
  const [isSaving, setIsSaving] = useState(false);

  const handleParamChange = (id: string, field: keyof CustomParam, value: any) => {
    setConfig(prev => ({
      ...prev,
      customParams: prev.customParams.map(p => 
        p.id === id ? { ...p, [field]: value } : p
      )
    }));
  };

  const handleAddParam = () => {
    setConfig(prev => ({
      ...prev,
      customParams: [...prev.customParams, { 
        id: Date.now().toString(), 
        key: '', 
        value: '', 
        type: 'string', 
        required: false, 
        description: '' 
      }]
    }));
  };

  const handleRemoveParam = (id: string) => {
    setConfig(prev => ({
      ...prev,
      customParams: prev.customParams.filter(p => p.id !== id)
    }));
  };

  const handleSubmit = () => {
    if (!config.name.trim()) {
      alert("Please provide a name for this interface configuration.");
      return;
    }
    setIsSaving(true);
    // Simulate API delay
    setTimeout(() => {
      onSave(config);
      setIsSaving(false);
    }, 600);
  };

  const getParamIcon = (type: string) => {
    switch(type) {
      case 'json': return <FileJson size={14} />;
      case 'boolean': return <ToggleLeft size={14} />;
      default: return <Type size={14} />;
    }
  };

  return (
    <div className="max-w-5xl space-y-6 animate-in slide-in-from-right-8 duration-300">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {initialConfig.id ? 'Edit Interface' : 'New Interface'}
          </h2>
          <p className="text-gray-500 text-sm">Configure connection details for this media endpoint.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: General Config */}
        <div className="space-y-6 lg:col-span-1">
          {/* Name Config */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Interface Name</label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tiktok-cyan/50 focus:border-tiktok-cyan outline-none transition"
            />
            
            <div className="mt-4">
               <label className="block text-sm font-medium text-gray-700 mb-1">HTTP Method</label>
               <select 
                value={config.method || 'POST'}
                onChange={(e) => setConfig({...config, method: e.target.value as any})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tiktok-cyan/50 outline-none bg-white"
               >
                 <option value="POST">POST</option>
                 <option value="GET">GET</option>
                 <option value="PUT">PUT</option>
               </select>
            </div>
          </div>

          {/* Authentication Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
              <Shield className="text-gray-500" size={18} />
              <h3 className="font-semibold text-gray-900">Authentication</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">App ID</label>
                <input
                  type="text"
                  value={config.appId}
                  onChange={(e) => setConfig({ ...config, appId: e.target.value })}
                  placeholder="e.g. 123456"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tiktok-cyan/50 focus:border-tiktok-cyan outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="password"
                    value={config.accessToken}
                    onChange={(e) => setConfig({ ...config, accessToken: e.target.value })}
                    placeholder="••••••••••••••••"
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tiktok-cyan/50 focus:border-tiktok-cyan outline-none transition font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Endpoint & Params */}
        <div className="space-y-6 lg:col-span-2">
           {/* API Endpoint Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
              <Globe className="text-gray-500" size={18} />
              <h3 className="font-semibold text-gray-900">Endpoint URL</h3>
            </div>
            <div className="p-6">
              <div className="relative">
                <Server className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={config.baseUrl}
                  onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                  placeholder="https://api.example.com/v1/..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tiktok-cyan/50 focus:border-tiktok-cyan outline-none transition font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Detailed Parameters Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MoreHorizontal className="text-gray-500" size={18} />
                <h3 className="font-semibold text-gray-900">Parameter Definition</h3>
              </div>
              <button 
                onClick={handleAddParam}
                className="text-sm flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 px-3 py-1.5 rounded-lg transition"
              >
                <Plus size={16} /> Add Field
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4 text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <AlertCircle size={16} />
                <p>Define the JSON body payload structure or query parameters required by this endpoint.</p>
              </div>

              {config.customParams.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No parameters defined. Add fields to define the API interface.
                </div>
              ) : (
                <div className="space-y-4">
                  {config.customParams.map((param) => (
                    <div key={param.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all">
                      <div className="flex gap-4 items-start mb-3">
                         <div className="flex-1">
                           <label className="text-xs font-medium text-gray-500 mb-1 block">Key Name</label>
                           <input
                            type="text"
                            value={param.key}
                            onChange={(e) => handleParamChange(param.id, 'key', e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm font-mono focus:border-tiktok-cyan outline-none"
                            placeholder="e.g. advertiser_id"
                          />
                         </div>
                         <div className="w-32">
                           <label className="text-xs font-medium text-gray-500 mb-1 block">Type</label>
                           <div className="relative">
                             <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                               {getParamIcon(param.type)}
                             </div>
                             <select
                              value={param.type}
                              onChange={(e) => handleParamChange(param.id, 'type', e.target.value)}
                              className="w-full pl-7 pr-2 py-1.5 border border-gray-300 rounded text-sm appearance-none bg-white focus:border-tiktok-cyan outline-none"
                            >
                              <option value="string">String</option>
                              <option value="integer">Integer</option>
                              <option value="boolean">Boolean</option>
                              <option value="json">JSON</option>
                            </select>
                           </div>
                         </div>
                         <div className="w-24 text-center">
                           <label className="text-xs font-medium text-gray-500 mb-1 block">Required</label>
                           <input 
                              type="checkbox" 
                              checked={param.required}
                              onChange={(e) => handleParamChange(param.id, 'required', e.target.checked)}
                              className="w-4 h-4 text-tiktok-cyan rounded focus:ring-tiktok-cyan border-gray-300 mt-2"
                           />
                         </div>
                         <div className="pt-5">
                            <button 
                              onClick={() => handleRemoveParam(param.id)}
                              className="text-gray-400 hover:text-red-500 transition"
                            >
                              <Trash2 size={18} />
                            </button>
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <input
                            type="text"
                            value={param.description || ''}
                            onChange={(e) => handleParamChange(param.id, 'description', e.target.value)}
                            placeholder="Description / Tooltip"
                            className="w-full px-3 py-1.5 border border-gray-200 rounded text-xs text-gray-600 focus:border-gray-300 outline-none bg-transparent"
                          />
                        </div>
                         <div>
                          {param.type === 'json' ? (
                            <textarea
                              value={param.value}
                              onChange={(e) => handleParamChange(param.id, 'value', e.target.value)}
                              placeholder="Default JSON Template..."
                              rows={1}
                              className="w-full px-3 py-1.5 border border-gray-200 rounded text-xs font-mono text-gray-600 focus:border-gray-300 outline-none bg-white resize-none h-8 focus:h-24 transition-all absolute-on-focus z-10"
                            />
                          ) : (
                            <input
                              type="text"
                              value={param.value}
                              onChange={(e) => handleParamChange(param.id, 'value', e.target.value)}
                              placeholder="Default Value"
                              className="w-full px-3 py-1.5 border border-gray-200 rounded text-xs text-gray-600 focus:border-gray-300 outline-none bg-white"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 pb-12 border-t border-gray-200">
        <div className="flex items-center gap-2">
          {showSuccess && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-green-600 animate-in fade-in slide-in-from-left-4">
              <CheckCircle size={16} />
              Saved successfully!
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium bg-black text-white hover:bg-gray-800 transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Save size={18} />
            )}
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaConfig;