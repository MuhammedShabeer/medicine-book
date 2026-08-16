import React from 'react';
import * as LucideIcons from 'lucide-react';

const DynamicIcon = ({ name, className = "", size = 24 }) => {
  const iconMap = {
    'syringe': LucideIcons.Syringe,
    'vial': LucideIcons.FlaskConical,
    'box': LucideIcons.Archive,
    'droplet': LucideIcons.Droplet,
    'scale': LucideIcons.Scale,
    'pills': LucideIcons.Pill,
    'activity': LucideIcons.Activity,
    'shield': LucideIcons.ShieldAlert,
    'clock': LucideIcons.Clock,
    'bag': LucideIcons.Beaker,
    'arrow-up': LucideIcons.ArrowUpCircle,
    'calendar': LucideIcons.Calendar,
    'thermometer': LucideIcons.ThermometerSnowflake
  };
  
  const IconComponent = iconMap[name] || LucideIcons.CircleDot;
  return <IconComponent className={className} size={size} />;
};

const WorkflowCard = ({ drugName, data }) => {
  if (!data) return null;

  // Backwards compatibility for old array-based workflow data
  let normalizedData = data;
  if (Array.isArray(data)) {
    normalizedData = {
      route: 'STANDARD',
      headerIcon: 'vial',
      rows: data.map(row => ({
        id: row.id || Math.random().toString(),
        type: 'text',
        icon: row.icon || 'activity',
        iconColor: row.color || 'blue',
        text: row.text || JSON.stringify(row)
      }))
    };
  }

  const getBannerStyle = (colorStr) => {
    switch(colorStr) {
      case 'green': return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
      case 'red': return 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)]';
      case 'orange': return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]';
      case 'blue': return 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]';
      default: return 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30 shadow-[0_0_15px_rgba(100,116,139,0.1)]';
    }
  };

  const getTextColor = (colorStr) => {
    switch(colorStr) {
      case 'green': return 'text-emerald-500 dark:text-emerald-400';
      case 'red': return 'text-rose-500 dark:text-rose-400';
      case 'orange': return 'text-amber-500 dark:text-amber-400';
      case 'blue': return 'text-blue-500 dark:text-blue-400';
      default: return 'text-slate-500 dark:text-slate-400';
    }
  };

  const getHeaderGradient = (colorStr) => {
    switch(colorStr) {
      case 'IV / INJ': return 'from-indigo-600 via-blue-600 to-sky-500 dark:from-indigo-900 dark:via-blue-800 dark:to-cyan-900';
      case 'PO': return 'from-emerald-600 via-teal-600 to-cyan-500 dark:from-emerald-900 dark:via-teal-800 dark:to-cyan-900';
      case 'TOPICAL': return 'from-amber-600 via-orange-600 to-rose-500 dark:from-amber-900 dark:via-orange-800 dark:to-rose-900';
      case 'SUPPOSITORY': return 'from-rose-600 via-pink-600 to-fuchsia-500 dark:from-rose-900 dark:via-pink-800 dark:to-fuchsia-900';
      case 'INHALATION': return 'from-sky-600 via-cyan-600 to-teal-500 dark:from-sky-900 dark:via-cyan-800 dark:to-teal-900';
      default: return 'from-slate-700 via-slate-600 to-slate-500 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700';
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto rounded-[2rem] shadow-2xl shadow-blue-900/10 dark:shadow-black/50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/60 dark:border-white/10 overflow-hidden transform-gpu transition-all duration-500 hover:shadow-3xl group flex flex-col max-h-[85vh]">
      
      {/* Dynamic Header */}
      <div className={`bg-gradient-to-br ${getHeaderGradient(normalizedData.route)} p-7 relative overflow-hidden shrink-0`}>
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-white/10 blur-3xl group-hover:scale-150 group-hover:bg-white/20 transition-all duration-1000 ease-in-out"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 rounded-full bg-black/20 blur-2xl"></div>
        
        <div className="relative z-10 flex items-center gap-5">
          <div className="bg-white/20 dark:bg-black/20 p-4 rounded-2xl backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] border border-white/30 dark:border-white/10 group-hover:-translate-y-1 transition-transform duration-500">
            <DynamicIcon name={normalizedData.headerIcon || 'vial'} size={32} className="text-white drop-shadow-md" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-md leading-none mb-2">
              {drugName}
            </h2>
            {normalizedData.route && (
              <span className="inline-flex items-center gap-1.5 text-white/90 font-bold text-xs px-3 py-1 bg-black/20 rounded-full w-max backdrop-blur-md border border-white/20 shadow-sm uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                {normalizedData.route}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex flex-col p-6 gap-3.5 relative flex-1 overflow-y-auto">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none opacity-50 dark:opacity-20"></div>
        
        {normalizedData.rows?.map((row, index) => {
          const isLast = index === normalizedData.rows.length - 1;
          const borderClass = !isLast ? "border-b border-slate-200/50 dark:border-slate-700/50 pb-4" : "";

          switch (row.type) {
            case 'banner':
              return (
                <div key={row.id} className={`${getBannerStyle(row.color)} relative overflow-hidden font-bold text-center py-3.5 px-5 rounded-2xl my-1.5 uppercase tracking-widest text-xs border backdrop-blur-md transition-all hover:scale-[1.02] hover:brightness-110 cursor-default group/banner`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/banner:animate-[shimmer_1.5s_infinite]"></div>
                  <span className="relative z-10">{row.text}</span>
                </div>
              );

            case 'text':
              return (
                <div key={row.id} className={`flex items-start gap-4 py-2 px-2 ${borderClass} group/row relative z-10`}>
                  {row.icon && (
                    <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 group-hover/row:scale-110 group-hover/row:rotate-3 group-hover/row:border-blue-300 dark:group-hover/row:border-blue-600 transition-all duration-300">
                      <DynamicIcon name={row.icon} size={20} className={`${getTextColor(row.iconColor)} drop-shadow-sm`} />
                    </div>
                  )}
                  <div className="flex-1 text-slate-700 dark:text-slate-300 font-medium flex flex-col justify-center pt-1 gap-1">
                    {row.badge && (
                      <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 text-[10px] uppercase px-2.5 py-0.5 rounded-full font-bold tracking-widest border border-indigo-200/50 dark:border-indigo-500/30 w-max shadow-sm">
                        {row.badge}
                      </span>
                    )}
                    <span className="leading-relaxed text-[15px]">{row.text}</span>
                  </div>
                </div>
              );

            case 'dosages':
              return (
                <div key={row.id} className={`flex items-center justify-center gap-3 py-4 px-2 ${borderClass} relative z-10`}>
                  <div className="flex items-center justify-evenly gap-4 w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/80 dark:to-slate-900/80 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]">
                    {row.values?.map((val, i) => (
                      <React.Fragment key={i}>
                        <div className="flex flex-col items-center group/dose cursor-default">
                          <span className="font-extrabold text-slate-800 dark:text-white mb-2.5 text-xl tracking-tight group-hover/dose:scale-110 transition-transform duration-300">{val}</span>
                          <div className={`p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700 ${getTextColor(row.iconColor)} group-hover/dose:-translate-y-1 transition-all duration-300`}>
                            <DynamicIcon name={row.icon || 'syringe'} size={22} />
                          </div>
                        </div>
                        {i < row.values.length - 1 && (
                          <div className="hidden md:flex flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent mx-4 opacity-70"></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              );

            case 'split':
              return (
                <div key={row.id} className={`flex flex-col md:flex-row items-stretch gap-3 py-2 px-2 ${borderClass} relative z-10`}>
                  <div className="flex-1 flex items-center gap-3.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <div className="p-1.5 bg-slate-100 dark:bg-slate-900 rounded-lg">
                      {row.leftIcon && <DynamicIcon name={row.leftIcon} size={18} className={getTextColor(row.leftIconColor)} />}
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-semibold text-sm leading-tight">{row.leftText}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-3.5 md:justify-end bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <div className="p-1.5 bg-slate-100 dark:bg-slate-900 rounded-lg md:hidden">
                      {row.rightIcon && <DynamicIcon name={row.rightIcon} size={18} className={getTextColor(row.rightIconColor)} />}
                    </div>
                    <span className="text-slate-800 dark:text-white font-extrabold text-sm leading-tight md:text-right">{row.rightText}</span>
                    <div className="p-1.5 bg-slate-100 dark:bg-slate-900 rounded-lg hidden md:block">
                      {row.rightIcon && <DynamicIcon name={row.rightIcon} size={18} className={getTextColor(row.rightIconColor)} />}
                    </div>
                  </div>
                </div>
              );

            default:
              return null;
          }
        })}
      </div>

      {/* Footer */}
      {normalizedData.footer && (
        <div className="p-5 pt-0 relative z-10 shrink-0">
          <div className={`w-full p-4 rounded-2xl flex items-center justify-center gap-3 ${getBannerStyle(normalizedData.footer.color)} shadow-inner border transition-all hover:brightness-105`}>
            {normalizedData.footer.icon && <DynamicIcon name={normalizedData.footer.icon} size={20} className="animate-[pulse_2s_ease-in-out_infinite]" />}
            <span className="uppercase tracking-[0.2em] text-xs font-black">{normalizedData.footer.text}</span>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default WorkflowCard;

