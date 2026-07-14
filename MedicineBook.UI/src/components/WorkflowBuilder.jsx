import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Settings } from 'lucide-react';

const ICON_OPTIONS = ['syringe', 'vial', 'box', 'droplet', 'scale', 'pills', 'activity', 'shield', 'clock', 'bag', 'arrow-up', 'calendar', 'thermometer', ''];
const COLOR_OPTIONS = ['slate', 'green', 'red', 'orange', 'blue'];

const WorkflowBuilder = ({ data, onChange }) => {
  const [editingCard, setEditingCard] = useState(data || {
    route: '',
    headerIcon: 'vial',
    rows: [],
    footer: null
  });

  const updateField = (field, value) => {
    const newData = { ...editingCard, [field]: value };
    setEditingCard(newData);
    onChange(newData);
  };

  const addRow = (type) => {
    const newRow = { id: Date.now().toString(), type };
    if (type === 'text') {
      newRow.icon = 'clock';
      newRow.text = 'New Instruction';
    } else if (type === 'banner') {
      newRow.text = 'New Banner';
      newRow.color = 'orange';
    } else if (type === 'dosages') {
      newRow.icon = 'syringe';
      newRow.values = ['10 mg', '20 mg'];
    } else if (type === 'split') {
      newRow.leftIcon = 'activity';
      newRow.leftText = 'Left side';
      newRow.rightIcon = 'activity';
      newRow.rightText = 'Right side';
    }
    
    const newData = { ...editingCard, rows: [...(editingCard.rows || []), newRow] };
    setEditingCard(newData);
    onChange(newData);
  };

  const updateRow = (id, field, value) => {
    const rows = editingCard.rows.map(r => r.id === id ? { ...r, [field]: value } : r);
    const newData = { ...editingCard, rows };
    setEditingCard(newData);
    onChange(newData);
  };

  const removeRow = (id) => {
    const rows = editingCard.rows.filter(r => r.id !== id);
    const newData = { ...editingCard, rows };
    setEditingCard(newData);
    onChange(newData);
  };

  const moveRow = (index, direction) => {
    if (index + direction < 0 || index + direction >= editingCard.rows.length) return;
    const rows = [...editingCard.rows];
    const temp = rows[index];
    rows[index] = rows[index + direction];
    rows[index + direction] = temp;
    const newData = { ...editingCard, rows };
    setEditingCard(newData);
    onChange(newData);
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-white/10 p-4">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
        <Settings size={18} /> Workflow Builder
      </h3>

      {/* Header Settings */}
      <div className="bg-white dark:bg-white/5 p-3 rounded-lg border border-slate-200 dark:border-white/5 mb-4 grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">Route (e.g., (IV))</label>
          <input 
            type="text" 
            className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded px-2 py-1 text-sm text-slate-900 dark:text-white" 
            value={editingCard.route || ''} 
            onChange={(e) => updateField('route', e.target.value)} 
          />
        </div>
        <div>
          <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">Header Icon</label>
          <select 
            className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded px-2 py-1 text-sm text-slate-900 dark:text-white"
            value={editingCard.headerIcon || ''}
            onChange={(e) => updateField('headerIcon', e.target.value)}
          >
            {ICON_OPTIONS.map(i => <option key={i} value={i}>{i || 'None'}</option>)}
          </select>
        </div>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-2 mb-4">
        {editingCard.rows?.map((row, index) => (
          <div key={row.id} className="bg-white dark:bg-white/5 p-3 rounded-lg border border-slate-200 dark:border-white/10 relative group flex gap-3">
            
            <div className="flex flex-col gap-1 w-6 shrink-0 pt-1">
              <button onClick={() => moveRow(index, -1)} className="text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white disabled:opacity-30" disabled={index === 0}>
                <ArrowUp size={14} />
              </button>
              <button onClick={() => moveRow(index, 1)} className="text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white disabled:opacity-30" disabled={index === editingCard.rows.length - 1}>
                <ArrowDown size={14} />
              </button>
            </div>

            <div className="flex-1">
              <div className="text-xs text-cyan-500 dark:text-cyan-400 uppercase font-bold tracking-wider mb-2">{row.type}</div>
              
              {row.type === 'text' && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <input type="text" className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded px-2 py-1 text-sm text-slate-900 dark:text-white" placeholder="Text" value={row.text} onChange={e => updateRow(row.id, 'text', e.target.value)} />
                  </div>
                  <div>
                    <select className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded px-2 py-1 text-sm text-slate-900 dark:text-white" value={row.icon || ''} onChange={e => updateRow(row.id, 'icon', e.target.value)}>
                      {ICON_OPTIONS.map(i => <option key={i} value={i}>{i || 'None'}</option>)}
                    </select>
                  </div>
                  <div>
                    <input type="text" className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded px-2 py-1 text-sm text-slate-900 dark:text-white" placeholder="Badge (e.g. up-arrow)" value={row.badge || ''} onChange={e => updateRow(row.id, 'badge', e.target.value)} />
                  </div>
                  <div>
                    <select className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded px-2 py-1 text-sm text-slate-900 dark:text-white" value={row.iconColor || ''} onChange={e => updateRow(row.id, 'iconColor', e.target.value)}>
                      {COLOR_OPTIONS.map(c => <option key={c} value={c}>{c} color</option>)}
                    </select>
                  </div>
                </div>
              )}

              {row.type === 'banner' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input type="text" className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded px-2 py-1 text-sm text-slate-900 dark:text-white" placeholder="Banner Text" value={row.text} onChange={e => updateRow(row.id, 'text', e.target.value)} />
                  </div>
                  <div>
                    <select className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded px-2 py-1 text-sm text-slate-900 dark:text-white" value={row.color || 'green'} onChange={e => updateRow(row.id, 'color', e.target.value)}>
                      {COLOR_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {row.type === 'dosages' && (
                <div className="grid grid-cols-1 gap-2">
                  <input type="text" className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded px-2 py-1 text-sm text-slate-900 dark:text-white" placeholder="Comma separated values" value={(row.values || []).join(', ')} onChange={e => updateRow(row.id, 'values', e.target.value.split(',').map(s=>s.trim()))} />
                  <select className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded px-2 py-1 text-sm text-slate-900 dark:text-white" value={row.icon || 'syringe'} onChange={e => updateRow(row.id, 'icon', e.target.value)}>
                    {ICON_OPTIONS.map(i => <option key={i} value={i}>{i || 'None'}</option>)}
                  </select>
                </div>
              )}

              {row.type === 'split' && (
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded px-2 py-1 text-sm text-slate-900 dark:text-white" placeholder="Left Text" value={row.leftText || ''} onChange={e => updateRow(row.id, 'leftText', e.target.value)} />
                  <input type="text" className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded px-2 py-1 text-sm text-slate-900 dark:text-white" placeholder="Right Text" value={row.rightText || ''} onChange={e => updateRow(row.id, 'rightText', e.target.value)} />
                  <select className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded px-2 py-1 text-sm text-slate-900 dark:text-white" value={row.leftIcon || ''} onChange={e => updateRow(row.id, 'leftIcon', e.target.value)}>
                    {ICON_OPTIONS.map(i => <option key={i} value={i}>Left {i || 'None'}</option>)}
                  </select>
                  <select className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded px-2 py-1 text-sm text-slate-900 dark:text-white" value={row.rightIcon || ''} onChange={e => updateRow(row.id, 'rightIcon', e.target.value)}>
                    {ICON_OPTIONS.map(i => <option key={i} value={i}>Right {i || 'None'}</option>)}
                  </select>
                </div>
              )}

            </div>

            <button onClick={() => removeRow(row.id)} className="text-slate-500 hover:text-danger absolute right-3 top-3">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button type="button" onClick={() => addRow('text')} className="bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs px-2 py-1 rounded border border-slate-300 dark:border-white/10 shadow-sm dark:shadow-none">+ Text Row</button>
        <button type="button" onClick={() => addRow('banner')} className="bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs px-2 py-1 rounded border border-slate-300 dark:border-white/10 shadow-sm dark:shadow-none">+ Banner</button>
        <button type="button" onClick={() => addRow('dosages')} className="bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs px-2 py-1 rounded border border-slate-300 dark:border-white/10 shadow-sm dark:shadow-none">+ Dosages</button>
        <button type="button" onClick={() => addRow('split')} className="bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs px-2 py-1 rounded border border-slate-300 dark:border-white/10 shadow-sm dark:shadow-none">+ Split Row</button>
      </div>

      {/* Footer Settings */}
      <div className="bg-white dark:bg-white/5 p-3 rounded-lg border border-slate-200 dark:border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Footer Alert</span>
          <button type="button" onClick={() => updateField('footer', editingCard.footer ? null : { text: 'Alert', color: 'red', icon: 'shield' })} className="text-xs text-cyan-500 dark:text-cyan-400 hover:underline">
            {editingCard.footer ? 'Remove' : 'Add Footer'}
          </button>
        </div>
        {editingCard.footer && (
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <input type="text" className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded px-2 py-1 text-sm text-slate-900 dark:text-white" value={editingCard.footer.text} onChange={e => updateField('footer', { ...editingCard.footer, text: e.target.value })} />
            </div>
            <div>
              <select className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded px-2 py-1 text-sm text-slate-900 dark:text-white" value={editingCard.footer.color} onChange={e => updateField('footer', { ...editingCard.footer, color: e.target.value })}>
                {COLOR_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default WorkflowBuilder;
