import React from 'react';
import * as LucideIcons from 'lucide-react';

const DynamicIcon = ({ name, className = "", size = 24 }) => {
  // Map our simple string names to Lucide icons
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

  const getBannerStyle = (colorStr) => {
    switch(colorStr) {
      case 'green': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'red': return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      case 'orange': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
      case 'blue': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20';
    }
  };

  const getTextColor = (colorStr) => {
    switch(colorStr) {
      case 'green': return 'text-emerald-500 dark:text-emerald-400';
      case 'red': return 'text-red-500 dark:text-red-400';
      case 'orange': return 'text-orange-500 dark:text-orange-400';
      case 'blue': return 'text-blue-500 dark:text-blue-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  // Modern vibrant gradient headers based on color theme if specified, else generic vibrant
  const getHeaderGradient = () => {
    return 'bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 dark:from-indigo-900 dark:via-blue-800 dark:to-blue-900';
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-3xl shadow-xl shadow-blue-900/5 dark:shadow-black/40 bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl border border-white/50 dark:border-white/10 overflow-hidden hover:scale-[1.01] transition-all duration-300 group">
      
      {/* Header */}
      <div className={`${getHeaderGradient()} p-6 relative overflow-hidden`}>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all duration-700"></div>
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-32 h-32 rounded-full bg-black/10 blur-xl"></div>
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="bg-white/20 dark:bg-black/20 p-3.5 rounded-2xl backdrop-blur-md shadow-inner border border-white/30 dark:border-white/10">
            <DynamicIcon name={data.headerIcon || 'vial'} size={28} className="text-white drop-shadow-sm" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight drop-shadow-sm leading-tight">
              {drugName}
            </h2>
            {data.route && (
              <span className="inline-block mt-1.5 text-blue-50 font-medium text-xs px-2.5 py-0.5 bg-black/20 rounded-full w-max backdrop-blur-md border border-white/10 shadow-sm uppercase tracking-wider">
                {data.route}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col p-5 gap-3">
        {data.rows?.map((row, index) => {
          const isLast = index === data.rows.length - 1;
          const borderClass = !isLast ? "border-b border-slate-100 dark:border-white/5 pb-4" : "";

          switch (row.type) {
            case 'banner':
              return (
                <div key={row.id} className={`${getBannerStyle(row.color)} font-bold text-center py-3 px-4 rounded-xl my-1 uppercase tracking-wider text-xs border shadow-sm backdrop-blur-sm transition-all hover:brightness-105`}>
                  {row.text}
                </div>
              );

            case 'text':
              return (
                <div key={row.id} className={`flex items-start gap-4 py-2 px-1 ${borderClass} group/row`}>
                  {row.icon && (
                    <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 dark:bg-white/5 group-hover/row:scale-110 group-hover/row:bg-blue-50 dark:group-hover/row:bg-blue-900/30 transition-all duration-300 shadow-sm border border-slate-200/50 dark:border-white/5">
                      <DynamicIcon name={row.icon} size={18} className={getTextColor(row.iconColor)} />
                    </div>
                  )}
                  <div className="flex-1 text-slate-700 dark:text-slate-200 font-medium flex flex-col justify-center pt-0.5 gap-1.5">
                    {row.badge && (
                      <span className="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 text-[10px] uppercase px-2 py-0.5 rounded-md font-bold tracking-wide border border-indigo-200/50 dark:border-indigo-500/30 w-max shadow-sm">
                        {row.badge}
                      </span>
                    )}
                    <span className="leading-relaxed text-[15px]">{row.text}</span>
                  </div>
                </div>
              );

            case 'dosages':
              return (
                <div key={row.id} className={`flex items-center justify-center gap-3 py-4 px-1 ${borderClass}`}>
                  <div className="flex items-center justify-evenly gap-4 w-full bg-slate-50/80 dark:bg-black/20 p-4 rounded-2xl border border-slate-200/60 dark:border-white/5 shadow-inner">
                    {row.values?.map((val, i) => (
                      <React.Fragment key={i}>
                        <div className="flex flex-col items-center hover:-translate-y-1 transition-transform duration-300">
                          <span className="font-bold text-slate-800 dark:text-white mb-2 text-lg tracking-tight">{val}</span>
                          <div className={`p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200/80 dark:border-white/10 ${getTextColor(row.iconColor)}`}>
                            <DynamicIcon name={row.icon || 'syringe'} size={20} />
                          </div>
                        </div>
                        {i < row.values.length - 1 && (
                          <div className="hidden md:flex flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent mx-2 opacity-50"></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              );

            case 'split':
              return (
                <div key={row.id} className={`flex flex-col md:flex-row items-stretch gap-3 py-2 px-1 ${borderClass}`}>
                  <div className="flex-1 flex items-center gap-3 bg-slate-50/80 dark:bg-black/20 p-3 rounded-xl border border-slate-200/60 dark:border-white/5 shadow-sm transition-colors hover:bg-slate-100 dark:hover:bg-white/5">
                    {row.leftIcon && <DynamicIcon name={row.leftIcon} size={18} className={getTextColor(row.leftIconColor)} />}
                    <span className="text-slate-700 dark:text-slate-200 font-medium text-sm leading-tight">{row.leftText}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-3 md:justify-end bg-slate-50/80 dark:bg-black/20 p-3 rounded-xl border border-slate-200/60 dark:border-white/5 shadow-sm transition-colors hover:bg-slate-100 dark:hover:bg-white/5">
                    {row.rightIcon && <DynamicIcon name={row.rightIcon} size={18} className={getTextColor(row.rightIconColor)} />}
                    <span className="text-slate-800 dark:text-white font-bold text-sm leading-tight md:text-right">{row.rightText}</span>
                  </div>
                </div>
              );

            default:
              return null;
          }
        })}
      </div>

      {/* Footer */}
      {data.footer && (
        <div className={`m-4 mt-0 p-4 rounded-2xl flex items-center justify-center gap-3 ${getBannerStyle(data.footer.color)} shadow-sm border transition-transform hover:scale-[1.01]`}>
          {data.footer.icon && <DynamicIcon name={data.footer.icon} size={20} className="animate-pulse opacity-80" />}
          <span className="uppercase tracking-widest text-xs font-bold">{data.footer.text}</span>
        </div>
      )}
      
    </div>
  );
};

export default WorkflowCard;
