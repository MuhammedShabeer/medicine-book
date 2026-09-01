import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Cpu, 
  Key, 
  Globe, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ExternalLink, 
  Terminal,
  Zap,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Layers,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
  Activity
} from 'lucide-react';

const PROVIDER_PRESETS = {
  deepseek: {
    name: 'DeepSeek Official (api.deepseek.com)',
    endpoint: 'https://api.deepseek.com/chat/completions',
    defaultModel: 'deepseek-chat',
    models: [
      { id: 'deepseek-chat', label: 'DeepSeek V3 (deepseek-chat)' },
      { id: 'deepseek-reasoner', label: 'DeepSeek R1 (deepseek-reasoner)' }
    ],
    keyPlaceholder: 'sk-...',
    docsUrl: 'https://platform.deepseek.com/api_keys'
  },
  nvidia: {
    name: 'NVIDIA NIM (build.nvidia.com)',
    endpoint: 'https://integrate.api.nvidia.com/v1/chat/completions',
    defaultModel: 'deepseek-ai/deepseek-r1',
    models: [
      { id: 'deepseek-ai/deepseek-r1', label: 'DeepSeek R1 (Reasoning)' },
      { id: 'deepseek-ai/deepseek-v3', label: 'DeepSeek V3 (High Performance)' },
      { id: 'meta/llama-3.3-70b-instruct', label: 'Llama 3.3 70B' },
      { id: 'nvidia/llama-3.1-nemotron-70b-instruct', label: 'Nemotron 70B' }
    ],
    keyPlaceholder: 'nvapi-...',
    docsUrl: 'https://build.nvidia.com/deepseek-ai/deepseek-r1'
  },
  openrouter: {
    name: 'OpenRouter',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    defaultModel: 'openai/gpt-4o',
    models: [
      { id: 'openai/gpt-4o', label: 'GPT-4o' },
      { id: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
      { id: 'deepseek/deepseek-r1', label: 'DeepSeek R1' },
      { id: 'deepseek/deepseek-chat', label: 'DeepSeek V3' }
    ],
    keyPlaceholder: 'sk-or-v1-...',
    docsUrl: 'https://openrouter.ai/keys'
  },
  groq: {
    name: 'Groq (Ultra-Fast Inference)',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    defaultModel: 'deepseek-r1-distill-llama-70b',
    models: [
      { id: 'deepseek-r1-distill-llama-70b', label: 'DeepSeek R1 Distill 70B' },
      { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B Versatile' },
      { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant (Free Tier)' }
    ],
    keyPlaceholder: 'gsk_...',
    docsUrl: 'https://console.groq.com/keys'
  },
  custom: {
    name: 'Custom OpenAI-Compatible',
    endpoint: '',
    defaultModel: '',
    models: [],
    keyPlaceholder: 'Bearer key...',
    docsUrl: ''
  }
};

const DEFAULT_SYSTEM_PROMPT = `You are a clinical pharmacologist and medical AI specialist.
You MUST output ONLY a valid, raw JSON object (with no markdown backticks, no code block markers, and no text outside the JSON).

The JSON object MUST strictly adhere to this schema:
{
  "summary": "Concise 1-2 sentence clinical summary of the medicine.",
  "classification": "Therapeutic drug class / category",
  "indications": [
    "Primary indication 1",
    "Indication 2"
  ],
  "mechanismOfAction": "Clinical mechanism of action and pharmacodynamics.",
  "dosageAndAdministration": [
    { "indicationOrRoute": "Adult Dosage / Route", "dosage": "Specific dosage, frequency, and administration instructions" }
  ],
  "precautionsAndWarnings": [
    "Key clinical warning or monitoring requirement",
    "Black box warning if applicable"
  ],
  "contraindications": [
    "Key contraindication 1",
    "Key contraindication 2"
  ],
  "commonSideEffects": [
    "Common side effect 1",
    "Side effect 2"
  ],
  "workflowAndDispensingNotes": [
    "Storage, handling, or dispensing safety notes based on provided workflow & tips"
  ]
}`;

const AdminConfig = () => {
  const { user } = useContext(AuthContext);
  const { addToast } = useToast();
  const isAdmin = user?.roles?.includes('Admin');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [models, setModels] = useState([]);
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);

  // Model Modal State
  const [showModelModal, setShowModelModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [modelForm, setModelForm] = useState({
    name: '',
    tier: 'Paid',
    provider: 'nvidia',
    endpoint: 'https://integrate.api.nvidia.com/v1/chat/completions',
    apiKey: '',
    model: 'deepseek-ai/deepseek-r1',
    isActive: true
  });
  const [showKeyInModal, setShowKeyInModal] = useState(false);

  // Test state
  const [testingId, setTestingId] = useState(null);
  const [testResults, setTestResults] = useState({});

  const getCaseInsensitive = (obj, key) => {
    if (!obj) return undefined;
    if (obj[key] !== undefined) return obj[key];
    const lower = key.toLowerCase();
    const foundKey = Object.keys(obj).find(k => k.toLowerCase() === lower);
    return foundKey ? obj[foundKey] : undefined;
  };

  const persistSettings = async (modelsList, promptText) => {
    try {
      const payload = {
        'AI:ModelList': JSON.stringify(modelsList),
        'AI:SystemPrompt': promptText
      };

      // Also sync top active model to legacy keys for compatibility
      const firstActive = modelsList.find(m => m.isActive && m.apiKey);
      if (firstActive) {
        payload['AI:Provider'] = firstActive.provider;
        payload['AI:Endpoint'] = firstActive.endpoint;
        payload['AI:ApiKey'] = firstActive.apiKey;
        payload['AI:Model'] = firstActive.model;
      }

      await axios.post('/api/settings/bulk', payload);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/settings');
      const data = res.data || {};

      const promptVal = getCaseInsensitive(data, 'AI:SystemPrompt');
      if (promptVal) {
        setSystemPrompt(promptVal);
      }

      // Load models list
      const modelListVal = getCaseInsensitive(data, 'AI:ModelList');
      if (modelListVal) {
        try {
          const parsed = JSON.parse(modelListVal);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setModels(parsed);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }

      // Fallback: migrate from legacy single-model settings if no model list exists
      const legacyKey = getCaseInsensitive(data, 'AI:ApiKey') || getCaseInsensitive(data, 'OpenRouter:ApiKey') || '';
      const legacyEndpoint = getCaseInsensitive(data, 'AI:Endpoint') || 'https://api.deepseek.com/chat/completions';
      const legacyModel = getCaseInsensitive(data, 'AI:Model') || 'deepseek-chat';
      const legacyProvider = getCaseInsensitive(data, 'AI:Provider') || 'deepseek';

      const initialList = [
        {
          id: 'model-1',
          name: 'DeepSeek Official (Primary)',
          tier: 'Paid',
          provider: legacyProvider,
          endpoint: legacyEndpoint,
          apiKey: legacyKey,
          model: legacyModel,
          isActive: true,
          priority: 1
        },
        {
          id: 'model-2',
          name: 'NVIDIA NIM DeepSeek R1',
          tier: 'Fallback',
          provider: 'nvidia',
          endpoint: 'https://integrate.api.nvidia.com/v1/chat/completions',
          apiKey: '',
          model: 'deepseek-ai/deepseek-r1',
          isActive: false,
          priority: 2
        }
      ];

      setModels(initialList);
    } catch (err) {
      console.error(err);
      addToast('Failed to load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingIndex(null);
    setModelForm({
      id: `model-${Date.now()}`,
      name: '',
      tier: 'Paid',
      provider: 'deepseek',
      endpoint: 'https://api.deepseek.com/chat/completions',
      apiKey: '',
      model: 'deepseek-chat',
      isActive: true,
      priority: models.length + 1
    });
    setShowKeyInModal(false);
    setShowModelModal(true);
  };

  const handleOpenEditModal = (index) => {
    setEditingIndex(index);
    setModelForm({ ...models[index] });
    setShowKeyInModal(false);
    setShowModelModal(true);
  };

  const handleProviderChangeInModal = (prov) => {
    const preset = PROVIDER_PRESETS[prov];
    setModelForm(prev => ({
      ...prev,
      provider: prov,
      endpoint: preset ? preset.endpoint : prev.endpoint,
      model: preset && preset.defaultModel ? preset.defaultModel : prev.model
    }));
  };

  const handleSaveModelModal = async (e) => {
    e.preventDefault();
    if (!modelForm.name.trim()) {
      addToast('Model display name is required', 'error');
      return;
    }

    let updated;
    if (editingIndex !== null) {
      updated = [...models];
      updated[editingIndex] = { ...modelForm };
    } else {
      updated = [...models, { ...modelForm, id: modelForm.id || `model-${Date.now()}` }];
    }
    setModels(updated);
    setShowModelModal(false);

    const ok = await persistSettings(updated, systemPrompt);
    if (ok) {
      addToast('Model saved and updated in database!', 'success');
    } else {
      addToast('Saved locally. Click "Save All Configuration" to retry saving to database.', 'error');
    }
  };

  const handleDeleteModel = async (index) => {
    if (!window.confirm('Are you sure you want to remove this AI model from the configuration?')) return;
    const updated = models.filter((_, i) => i !== index);
    setModels(updated);
    await persistSettings(updated, systemPrompt);
    addToast('Model removed and saved!', 'info');
  };

  const handleToggleActive = async (index) => {
    const updated = [...models];
    updated[index] = { ...updated[index], isActive: !updated[index].isActive };
    setModels(updated);
    await persistSettings(updated, systemPrompt);
    addToast(`Model set to ${updated[index].isActive ? 'Active' : 'Inactive'}`, 'info');
  };

  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= models.length) return;
    const updated = [...models];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setModels(updated);
    await persistSettings(updated, systemPrompt);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const ok = await persistSettings(models, systemPrompt);
      if (ok) {
        addToast('All AI models and system prompt saved to database successfully!', 'success');
      } else {
        addToast('Failed to save configuration to database', 'error');
      }
    } catch (err) {
      addToast('Failed to save configuration', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleTestIndividualModel = async (item) => {
    if (!item.apiKey) {
      addToast('Cannot test: API key is empty', 'error');
      return;
    }

    setTestingId(item.id);
    const startTime = Date.now();

    try {
      const res = await axios.post('/api/settings/test-ai', {
        provider: item.provider,
        endpoint: item.endpoint,
        apiKey: item.apiKey,
        model: item.model
      });

      const elapsed = Date.now() - startTime;
      setTestResults(prev => ({
        ...prev,
        [item.id]: {
          success: true,
          reply: res.data.reply || 'Connection verified successfully!',
          latency: elapsed
        }
      }));
      addToast(`Connection to ${item.name} verified!`, 'success');
    } catch (err) {
      const rawError = err.response?.data?.error || err.response?.data?.Error || err.response?.data?.message || err.response?.data?.Message || err.message;
      const errorMsg = typeof rawError === 'object' ? JSON.stringify(rawError) : String(rawError);
      setTestResults(prev => ({
        ...prev,
        [item.id]: {
          success: false,
          error: errorMsg
        }
      }));
      addToast(`Connection to ${item.name} failed: ${errorMsg.substring(0, 50)}`, 'error');
    } finally {
      setTestingId(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertCircle size={48} className="text-danger mb-4" />
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-slate-500 mt-2">Only administrators can access the system configuration page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/60 dark:bg-slate-800/60 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-white/10 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-primary to-secondary rounded-xl text-white shadow-md shadow-primary/20">
            <Cpu size={26} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              Multi-API & Model Failover Config
            </h2>
            <p className="text-xs text-slate-500">Configure Paid, Free, and Fallback AI models with automatic failover and structured JSON output.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm transition-all active:scale-95"
          >
            <Plus size={16} /> Add AI Model
          </button>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save All Configuration
          </button>
        </div>
      </div>

      {/* Failover Execution Order Info Banner */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-cyan-500/10 dark:from-indigo-950/30 dark:to-cyan-950/30 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800/40 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-primary shrink-0" />
          <span><strong>Automatic Failover Strategy:</strong> Active models are queried in order (<strong>Paid</strong> → <strong>Free</strong> → <strong>Fallback</strong>). If one provider encounters rate limits (429) or errors, the system automatically falls back to the next active API.</span>
        </div>
      </div>

      {/* Models List */}
      <div className="flex flex-col gap-4">
        {models.map((item, index) => {
          const test = testResults[item.id];
          const isTesting = testingId === item.id;

          const tierBadgeStyle = {
            Paid: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
            Free: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
            Fallback: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800'
          }[item.tier] || 'bg-slate-100 text-slate-700';

          return (
            <div
              key={item.id || index}
              className={`p-5 rounded-2xl border transition-all ${
                item.isActive 
                  ? 'bg-white/85 dark:bg-surface border-slate-200 dark:border-white/10 shadow-md' 
                  : 'bg-slate-100/50 dark:bg-slate-900/40 border-slate-200/50 dark:border-white/5 opacity-60'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center justify-center gap-1 pt-0.5">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, -1)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded disabled:opacity-20 text-slate-500"
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={index === models.length - 1}
                      onClick={() => handleMove(index, 1)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded disabled:opacity-20 text-slate-500"
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="font-bold text-base text-slate-900 dark:text-white">
                        {item.name || 'Unnamed Model'}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider border ${tierBadgeStyle}`}>
                        {item.tier}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400">
                        {item.provider}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-mono">
                      <span><strong>Model:</strong> {item.model}</span>
                      <span><strong>Key:</strong> {item.apiKey ? `${item.apiKey.substring(0, 8)}...` : <span className="text-danger">Not configured</span>}</span>
                    </div>
                  </div>
                </div>

                {/* Right Controls */}
                <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
                  {/* Active Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(index)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      item.isActive
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-200 dark:bg-white/10 text-slate-500 border border-transparent'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${item.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    {item.isActive ? 'Active' : 'Inactive'}
                  </button>

                  {/* Test Connection Button */}
                  <button
                    type="button"
                    onClick={() => handleTestIndividualModel(item)}
                    disabled={isTesting || !item.apiKey}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all disabled:opacity-40"
                    title="Test this API connection"
                  >
                    {isTesting ? <Loader2 size={13} className="animate-spin text-primary" /> : <Zap size={13} className="text-amber-500" />}
                    {isTesting ? 'Testing...' : 'Test API'}
                  </button>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(index)}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 rounded-lg transition-colors"
                    title="Edit Model Config"
                  >
                    <Edit2 size={16} />
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteModel(index)}
                    className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-400 hover:text-danger rounded-lg transition-colors"
                    title="Delete Model"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Test Result for this item */}
              {test && (
                <div className={`mt-3 p-3 rounded-xl border text-xs animate-slide-up ${
                  test.success 
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    {test.success ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertCircle size={14} className="text-rose-500" />}
                    {test.success ? `Connection Successful (${test.latency}ms)` : 'Connection Failed'}
                  </div>
                  <p className="font-mono text-[11px]">{test.success ? test.reply : test.error}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* System Prompt Customization */}
      <div className="bg-white/80 dark:bg-surface p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-white/10 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <Terminal size={16} className="text-primary" />
            Global Clinical System Prompt (JSON Schema Enforcer)
          </label>
          <button
            type="button"
            onClick={() => setSystemPrompt(DEFAULT_SYSTEM_PROMPT)}
            className="text-xs text-primary hover:underline font-semibold"
          >
            Reset to Recommended JSON Prompt
          </button>
        </div>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          rows={7}
          placeholder="Enter system prompt and JSON schema instructions..."
          className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl p-3.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white font-mono text-xs leading-relaxed resize-y"
        />
        <p className="text-xs text-slate-500">
          This system prompt instructs all configured models to return consistent clinical JSON schemas.
        </p>
      </div>

      {/* Footer Save Action */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-sm shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save All Configuration
        </button>
      </div>

      {/* Add / Edit Model Modal */}
      {showModelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-surface rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 dark:border-white/10 animate-slide-up max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Cpu size={20} className="text-primary" />
                {editingIndex !== null ? 'Edit AI Model API' : 'Add New AI Model API'}
              </h3>
              <button onClick={() => setShowModelModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveModelModal} className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
              {/* Display Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={modelForm.name}
                  onChange={(e) => setModelForm({ ...modelForm, name: e.target.value })}
                  placeholder="e.g. NVIDIA NIM DeepSeek R1"
                  className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white"
                  required
                />
              </div>

              {/* Tier & Provider Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Tier Role
                  </label>
                  <select
                    value={modelForm.tier}
                    onChange={(e) => setModelForm({ ...modelForm, tier: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none dark:text-white"
                  >
                    <option value="Paid">Primary (Paid Tier)</option>
                    <option value="Free">Free Tier (Groq / Quota)</option>
                    <option value="Fallback">Emergency Fallback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Provider Preset
                  </label>
                  <select
                    value={modelForm.provider}
                    onChange={(e) => handleProviderChangeInModal(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none dark:text-white"
                  >
                    <option value="deepseek">DeepSeek Official (api.deepseek.com)</option>
                    <option value="nvidia">NVIDIA NIM (build.nvidia.com)</option>
                    <option value="openrouter">OpenRouter</option>
                    <option value="groq">Groq</option>
                    <option value="custom">Custom OpenAI Endpoint</option>
                  </select>
                </div>
              </div>

              {/* Endpoint URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  API Endpoint URL
                </label>
                <input
                  type="text"
                  value={modelForm.endpoint}
                  onChange={(e) => setModelForm({ ...modelForm, endpoint: e.target.value })}
                  placeholder="https://integrate.api.nvidia.com/v1/chat/completions"
                  className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-xs font-mono focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white"
                  required
                />
              </div>

              {/* API Key */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    API Key
                  </label>
                  {PROVIDER_PRESETS[modelForm.provider]?.docsUrl && (
                    <a
                      href={PROVIDER_PRESETS[modelForm.provider].docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-primary hover:underline flex items-center gap-1 font-semibold"
                    >
                      Get Key <ExternalLink size={10} />
                    </a>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showKeyInModal ? 'text' : 'password'}
                    value={modelForm.apiKey}
                    onChange={(e) => setModelForm({ ...modelForm, apiKey: e.target.value })}
                    placeholder={PROVIDER_PRESETS[modelForm.provider]?.keyPlaceholder || 'Enter API Key...'}
                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl pl-4 pr-10 py-2 text-xs font-mono focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeyInModal(!showKeyInModal)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showKeyInModal ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Model Identifier */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Model Identifier
                </label>

                {PROVIDER_PRESETS[modelForm.provider]?.models?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {PROVIDER_PRESETS[modelForm.provider].models.map((m) => (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setModelForm({ ...modelForm, model: m.id })}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                          modelForm.model === m.id
                            ? 'bg-primary text-white border-primary'
                            : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                )}

                <input
                  type="text"
                  value={modelForm.model}
                  onChange={(e) => setModelForm({ ...modelForm, model: e.target.value })}
                  placeholder="e.g. deepseek-ai/deepseek-r1"
                  className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-xs font-mono focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white"
                  required
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={modelForm.isActive}
                  onChange={(e) => setModelForm({ ...modelForm, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
                <label htmlFor="isActiveToggle" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Enable this model for active failover rotation
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModelModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-xs shadow-md shadow-primary/20 transition-all active:scale-95"
                >
                  <Check size={14} />
                  {editingIndex !== null ? 'Update Model' : 'Add to List'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminConfig;
