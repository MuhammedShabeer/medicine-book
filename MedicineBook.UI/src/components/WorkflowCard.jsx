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

  const getBannerColor = (colorStr) => {
    switch(colorStr) {
      case 'green': return 'bg-gradient-to-r from-emerald-600 to-emerald-500';
      case 'red': return 'bg-gradient-to-r from-red-600 to-red-500';
      case 'orange': return 'bg-gradient-to-r from-orange-600 to-orange-500';
      case 'blue': return 'bg-gradient-to-r from-blue-700 to-blue-600';
      default: return 'bg-gradient-to-r from-slate-600 to-slate-500';
    }
  };

  const getTextColor = (colorStr) => {
    switch(colorStr) {
      case 'green': return 'text-emerald-500';
      case 'red': return 'text-red-500';
      case 'orange': return 'text-orange-500';
      case 'blue': return 'text-blue-600';
      default: return 'text-slate-700';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.5)] bg-white overflow-hidden border border-slate-300">
      {/* Header */}
      <div className="bg-gradient-to-b from-blue-800 to-blue-900 text-white p-4 flex items-center justify-center gap-3 shadow-inner">
        <div className="bg-white/10 p-2 rounded-lg shadow-inner">
          <DynamicIcon name={data.headerIcon || 'vial'} size={32} className="text-blue-100" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight drop-shadow-md">
          {drugName} {data.route && <span className="font-normal opacity-90">{data.route}</span>}
        </h2>
      </div>

      {/* Body */}
      <div className="flex flex-col p-3 pb-0">
        {data.rows?.map((row, index) => {
          const isLast = index === data.rows.length - 1;
          const borderClass = !isLast ? "border-b border-slate-300" : "";

          switch (row.type) {
            case 'banner':
              return (
                <div key={row.id} className={`${getBannerColor(row.color)} text-white font-bold text-center py-2 shadow-sm rounded-sm my-1 uppercase tracking-wider text-sm`}>
                  {row.text}
                </div>
              );

            case 'text':
              return (
                <div key={row.id} className={`flex items-center gap-3 py-3 px-2 ${borderClass}`}>
                  {row.icon && (
                    <div className="shrink-0 flex items-center justify-center w-8">
                      <DynamicIcon name={row.icon} size={26} className={getTextColor(row.iconColor)} />
                    </div>
                  )}
                  <div className="flex-1 text-slate-800 font-semibold flex items-center gap-2">
                    {row.badge && (
                      <span className="bg-blue-900 text-white text-[10px] uppercase px-1.5 py-0.5 rounded font-bold">{row.badge}</span>
                    )}
                    {row.text}
                  </div>
                </div>
              );

            case 'dosages':
              return (
                <div key={row.id} className={`flex items-center gap-3 py-3 px-2 ${borderClass}`}>
                  <div className="flex items-center gap-1 w-full justify-center">
                    {row.values?.map((val, i) => (
                      <React.Fragment key={i}>
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-slate-800 mb-1">{val}</span>
                          <div className={`rotate-90 md:rotate-0 my-2 md:my-0 ${getTextColor(row.iconColor)}`}>
                            <DynamicIcon name={row.icon || 'syringe'} size={24} />
                          </div>
                        </div>
                        {i < row.values.length - 1 && (
                          <div className="hidden md:block w-8 h-0.5 bg-slate-400 mx-1"></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              );

            case 'split':
              return (
                <div key={row.id} className={`flex items-center gap-3 py-3 px-2 ${borderClass}`}>
                  <div className="flex-1 flex items-center gap-2">
                    {row.leftIcon && <DynamicIcon name={row.leftIcon} size={22} className={getTextColor(row.leftIconColor)} />}
                    <span className="text-slate-800 font-semibold text-sm leading-tight">{row.leftText}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-2 justify-end border-l border-slate-300 pl-3">
                    {row.rightIcon && <DynamicIcon name={row.rightIcon} size={22} className={getTextColor(row.rightIconColor)} />}
                    <span className="text-slate-800 font-bold text-sm leading-tight text-right">{row.rightText}</span>
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
        <div className={`mt-3 p-3 flex items-center justify-center gap-2 ${getBannerColor(data.footer.color)} text-white font-bold shadow-[inset_0_5px_10px_rgba(0,0,0,0.2)]`}>
          {data.footer.icon && <DynamicIcon name={data.footer.icon} size={20} className="text-yellow-300" />}
          <span className="uppercase tracking-wide text-sm">{data.footer.text}</span>
        </div>
      )}
      
      {/* Empty space at bottom to mimic physical card border */}
      <div className="h-2 w-full bg-gradient-to-t from-slate-300 to-transparent"></div>
    </div>
  );
};

export default WorkflowCard;
