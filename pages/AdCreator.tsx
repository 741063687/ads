import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Zap, Save, CheckCircle, AlertCircle, Layers, Video, ChevronRight, Check, Code, ShoppingBag } from 'lucide-react';

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
  customParams: CustomParam[];
}

// Structure for the parsed Creative JSON
interface CreativeItem {
  id: string;
  ad_name: string;
  ad_format: string;
  video_id: string;
  ad_text: string;
  call_to_action: string;
  landing_page_url: string;
  product_specific_type?: string;
}

const AdCreator: React.FC = () => {
  const navigate = useNavigate();
  const [configs, setConfigs] = useState<MediaInterfaceConfig[]>([]);
  const [selectedConfigId, setSelectedConfigId] = useState<string>('');
  
  // Step State: 1 = Settings, 2 = Creatives (Conditional), 3 = Review
  const [currentStep, setCurrentStep] = useState(1);
  
  // Dynamic Form State
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  // Creative Builder State (for the JSON param)
  const [creatives, setCreatives] = useState<CreativeItem[]>([
    {
      id: '1',
      ad_name: 'GMV Max Creative 01',
      ad_format: 'SINGLE_VIDEO',
      video_id: '',
      ad_text: '',
      call_to_action: 'SHOP_NOW',
      landing_page_url: '',
      product_specific_type: 'ALL'
    }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{success: boolean, message: string} | null>(null);

  // Load Configs
  useEffect(() => {
    const savedConfigs = localStorage.getItem('media_api_configs_v2');
    if (savedConfigs) {
      try {
        const parsed: MediaInterfaceConfig[] = JSON.parse(savedConfigs);
        setConfigs(parsed);
        // Prioritize GMV Max config if available
        const defaultCfg = parsed.find(c => c.id.includes('gmv')) || parsed[0];
        if (defaultCfg) {
          setSelectedConfigId(defaultCfg.id);
          initializeFormData(defaultCfg);
        }
      } catch (e) {
        console.error("Error loading configs", e);
      }
    }
  }, []);

  const initializeFormData = (config: MediaInterfaceConfig) => {
    const initialData: Record<string, any> = {};
    config.customParams.forEach(param => {
      if (param.key === 'creatives') {
        // We handle this separately in state
        initialData[param.key] = []; 
      } else {
        initialData[param.key] = param.value === 'true' ? true : param.value === 'false' ? false : param.value;
      }
    });
    setFormData(initialData);
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedConfigId(newId);
    const config = configs.find(c => c.id === newId);
    if (config) {
      initializeFormData(config);
      setCurrentStep(1); // Reset to start
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Creative Management
  const addCreative = () => {
    setCreatives(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        ad_name: `GMV Max Creative ${prev.length + 1}`,
        ad_format: 'SINGLE_VIDEO',
        video_id: '',
        ad_text: '',
        call_to_action: 'SHOP_NOW',
        landing_page_url: '',
        product_specific_type: 'ALL'
      }
    ]);
  };

  const removeCreative = (id: string) => {
    if (creatives.length > 1) {
      setCreatives(prev => prev.filter(c => c.id !== id));
    }
  };

  const updateCreative = (id: string, field: keyof CreativeItem, value: string) => {
    setCreatives(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const generatePayload = (config: MediaInterfaceConfig) => {
    const payload = { ...formData };
    const hasCreativesParam = config.customParams.some(p => p.key === 'creatives' && p.type === 'json');
    if (hasCreativesParam) {
      payload['creatives'] = creatives.map(({ id, ...rest }) => rest);
    }
    return payload;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitResult(null);

    const config = configs.find(c => c.id === selectedConfigId);
    if (!config) return;

    const payload = generatePayload(config);
    console.log("Submitting Payload to " + config.baseUrl, payload);

    // Simulate Network Request
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitResult({
        success: true,
        message: `Successfully created ${config.name}!`
      });
    }, 1500);
  };

  const selectedConfig = configs.find(c => c.id === selectedConfigId);

  if (!selectedConfig) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
         <div className="bg-gray-100 p-6 rounded-full mb-4">
            <AlertCircle className="text-gray-400" size={32} />
         </div>
         <h2 className="text-lg font-semibold text-gray-900">No Interface Configured</h2>
         <p className="text-gray-500 max-w-sm mt-2 mb-6">
           Please configure the GMV Max Ad Creation interface in the Media Config page first.
         </p>
         <button 
           onClick={() => navigate('/media-config')}
           className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium"
         >
           Go to Configuration
         </button>
      </div>
    );
  }

  // Determine if this config uses creatives
  const hasCreatives = selectedConfig.customParams.some(p => p.key === 'creatives' && p.type === 'json');
  
  // Define Steps based on config
  const steps = hasCreatives 
    ? [
        { id: 1, label: 'Settings', icon: Layers },
        { id: 2, label: 'Creatives', icon: Video },
        { id: 3, label: 'Review', icon: Check }
      ]
    : [
        { id: 1, label: 'Settings', icon: Layers },
        { id: 3, label: 'Review', icon: Check }
      ];

  const handleNext = () => {
    if (currentStep === 1) {
      // If we don't have creatives, skip step 2
      setCurrentStep(hasCreatives ? 2 : 3);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 3) {
      // If we don't have creatives, skip back to 1
      setCurrentStep(hasCreatives ? 2 : 1);
    } else {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-24">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/campaigns')}
          className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Ad Creator <Zap className="text-tiktok-cyan fill-current" size={20} />
          </h1>
          <p className="text-gray-500 text-sm">Visual flow for creating high-performance smart campaigns.</p>
        </div>
      </div>

      {/* Stepper Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-10"></div>
          {steps.map((s) => (
            <div key={s.id} className="flex flex-col items-center bg-[#f8fafc] px-4">
               <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300 ${
                 currentStep >= s.id 
                   ? 'bg-tiktok-magenta border-tiktok-magenta text-white' 
                   : 'bg-white border-gray-300 text-gray-400'
               }`}>
                 {currentStep > s.id ? <Check size={18} /> : (hasCreatives ? s.id : (s.id === 3 ? 2 : 1))}
               </div>
               <span className={`text-xs font-medium mt-2 ${currentStep >= s.id ? 'text-gray-900' : 'text-gray-500'}`}>
                 {s.label}
               </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        {/* Header Bar inside Card */}
        <div className="px-8 py-5 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <div>
               <h3 className="font-semibold text-lg text-gray-900">
                 {currentStep === 1 && 'Campaign Configuration'}
                 {currentStep === 2 && 'Creative Assets'}
                 {currentStep === 3 && 'Review & Launch'}
               </h3>
               <p className="text-xs text-gray-500 mt-1">
                 {currentStep === 1 && `Interface: ${selectedConfig.name}`}
                 {currentStep === 2 && 'Upload or define your ad creatives.'}
                 {currentStep === 3 && 'Verify payload and submit to API.'}
               </p>
            </div>
            {currentStep === 1 && (
               <div className="w-64">
                <select 
                  value={selectedConfigId}
                  onChange={handleConfigChange}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-tiktok-cyan/50 outline-none"
                >
                  {configs.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
               </div>
            )}
        </div>

        {/* Content Area */}
        <div className="p-8 flex-1">
          
          {/* STEP 1: CAMPAIGN SETTINGS */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-right-4 duration-300">
               {selectedConfig.customParams
                .filter(p => p.key !== 'creatives' && p.type !== 'json')
                .map(param => (
                <div key={param.id} className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                    {param.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    {param.required && <span className="text-red-500">*</span>}
                  </label>
                  
                  {param.type === 'boolean' ? (
                    <div className="flex items-center gap-4 py-2">
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${formData[param.key] === true ? 'bg-tiktok-cyan border-tiktok-cyan' : 'border-gray-300'}`}>
                           {formData[param.key] === true && <Check size={14} className="text-white"/>}
                        </div>
                        <input 
                          type="radio" 
                          name={param.key}
                          checked={formData[param.key] === true} 
                          onChange={() => handleInputChange(param.key, true)}
                          className="hidden"
                        />
                        Yes
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${formData[param.key] === false ? 'bg-tiktok-cyan border-tiktok-cyan' : 'border-gray-300'}`}>
                           {formData[param.key] === false && <Check size={14} className="text-white"/>}
                        </div>
                        <input 
                          type="radio" 
                          name={param.key}
                          checked={formData[param.key] === false} 
                          onChange={() => handleInputChange(param.key, false)}
                          className="hidden"
                        />
                        No
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                       <input
                        type={param.type === 'integer' ? 'number' : 'text'}
                        value={formData[param.key] || ''}
                        onChange={(e) => handleInputChange(param.key, param.type === 'integer' ? parseInt(e.target.value) : e.target.value)}
                        placeholder={param.description || `Enter ${param.key}`}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-tiktok-cyan/50 focus:border-tiktok-cyan outline-none transition"
                      />
                    </div>
                  )}
                  {param.description && <p className="text-xs text-gray-400 mt-1.5">{param.description}</p>}
                </div>
              ))}
            </div>
          )}

          {/* STEP 2: CREATIVES (Only if applicable) */}
          {currentStep === 2 && hasCreatives && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
               <div className="grid grid-cols-1 gap-6">
                 {creatives.map((creative, index) => (
                   <div key={creative.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm relative group hover:border-tiktok-cyan/30 transition-colors">
                      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                           onClick={() => removeCreative(creative.id)}
                           disabled={creatives.length === 1}
                           className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:hidden"
                         >
                           <Trash2 size={18} />
                         </button>
                      </div>

                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-black text-white text-sm flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <h4 className="font-semibold text-gray-900">Creative Asset {index + 1}</h4>
                        <div className="h-px bg-gray-100 flex-1 ml-4"></div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                         <div>
                           <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Ad Name</label>
                           <input 
                             type="text" 
                             value={creative.ad_name}
                             onChange={(e) => updateCreative(creative.id, 'ad_name', e.target.value)}
                             className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-tiktok-cyan outline-none focus:ring-2 focus:ring-tiktok-cyan/20"
                           />
                         </div>
                         <div>
                           <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Video ID</label>
                           <input 
                             type="text" 
                             value={creative.video_id}
                             onChange={(e) => updateCreative(creative.id, 'video_id', e.target.value)}
                             placeholder="v0123456789..."
                             className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-tiktok-cyan outline-none font-mono"
                           />
                         </div>
                         <div>
                           <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Call to Action</label>
                           <select 
                             value={creative.call_to_action}
                             onChange={(e) => updateCreative(creative.id, 'call_to_action', e.target.value)}
                             className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-tiktok-cyan outline-none bg-white"
                           >
                             <option value="SHOP_NOW">Shop Now</option>
                             <option value="LEARN_MORE">Learn More</option>
                             <option value="SIGN_UP">Sign Up</option>
                             <option value="INSTALL_APP">Install App</option>
                           </select>
                         </div>
                         <div className="md:col-span-2">
                           <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Ad Text</label>
                           <input 
                             type="text" 
                             value={creative.ad_text}
                             onChange={(e) => updateCreative(creative.id, 'ad_text', e.target.value)}
                             placeholder="Enter your engaging ad copy..."
                             className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-tiktok-cyan outline-none"
                           />
                         </div>
                         <div>
                           <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase flex items-center gap-1">
                             <ShoppingBag size={12}/> Product Type
                           </label>
                           <select 
                             value={creative.product_specific_type || 'ALL'}
                             onChange={(e) => updateCreative(creative.id, 'product_specific_type', e.target.value)}
                             className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-tiktok-cyan outline-none bg-white"
                           >
                             <option value="ALL">All Products</option>
                             <option value="PRODUCT_SET">Specific Product Set</option>
                           </select>
                         </div>
                      </div>
                   </div>
                 ))}

                 <button 
                   onClick={addCreative}
                   className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-tiktok-cyan hover:text-tiktok-cyan hover:bg-blue-50/30 transition flex items-center justify-center gap-2 font-medium"
                 >
                   <Plus size={20} /> Add Another Ad Variation
                 </button>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW */}
          {currentStep === 3 && (
            <div className="animate-in slide-in-from-right-4 duration-300">
               <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                 <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                       <Code size={18} className="text-gray-500"/>
                       JSON Payload Preview
                    </h4>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">POST {selectedConfig.baseUrl}</span>
                 </div>
                 <pre className="text-xs font-mono text-gray-700 overflow-x-auto bg-white p-4 rounded-lg border border-gray-200 shadow-inner max-h-[400px]">
                   {JSON.stringify(generatePayload(selectedConfig), null, 2)}
                 </pre>
               </div>
               
               <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <p>
                    You are about to submit 
                    {hasCreatives 
                      ? ` ${creatives.length} ad creative(s) under` 
                      : ''
                    } the campaign "<strong>{formData['campaign_name'] || 'Untitled'}</strong>". 
                    Please ensure the ID parameters are correct before launching.
                  </p>
               </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-200 p-4 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
           
           <div className="flex items-center gap-2">
             {submitResult && (
               <span className={`text-sm font-medium flex items-center gap-2 ${submitResult.success ? 'text-green-600' : 'text-red-600'}`}>
                  {submitResult.success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  {submitResult.message}
               </span>
             )}
           </div>

           <div className="flex gap-3">
             {currentStep > 1 && (
               <button 
                 onClick={handleBack}
                 className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
               >
                 Back
               </button>
             )}
             
             {currentStep < 3 ? (
               <button 
                 onClick={handleNext}
                 className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold bg-black text-white hover:bg-gray-800 transition shadow-lg"
               >
                 Next Step <ChevronRight size={16} />
               </button>
             ) : (
               <button 
                 onClick={handleSubmit}
                 disabled={isSubmitting}
                 className="flex items-center gap-2 px-8 py-2.5 rounded-lg text-sm font-bold bg-tiktok-magenta text-white hover:bg-red-600 transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
               >
                 {isSubmitting ? (
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 ) : (
                   <Save size={18} />
                 )}
                 Submit Campaign
               </button>
             )}
           </div>
         </div>
      </div>
    </div>
  );
};

export default AdCreator;