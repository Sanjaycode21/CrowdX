import React from 'react';
import { 
  LayoutDashboard, Video, LineChart, Bell, 
  AlertTriangle, BarChart3, Sliders, Terminal, ShieldCheck 
} from 'lucide-react';

export type NavTab = 
  | 'overview' 
  | 'monitor' 
  | 'analysis' 
  | 'alerts' 
  | 'incidents' 
  | 'evaluation' 
  | 'configuration' 
  | 'logs';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeAlertCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, activeAlertCount }) => {
  const navItems = [
    { id: 'overview' as NavTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'monitor' as NavTab, label: 'Live Monitor', icon: Video },
    { id: 'analysis' as NavTab, label: 'Analysis', icon: LineChart },
    { id: 'alerts' as NavTab, label: 'Alerts', icon: Bell, badge: activeAlertCount > 0 ? activeAlertCount : undefined },
    { id: 'incidents' as NavTab, label: 'Incidents', icon: AlertTriangle },
    { id: 'evaluation' as NavTab, label: 'Evaluation', icon: BarChart3 },
    { id: 'configuration' as NavTab, label: 'Configuration', icon: Sliders },
    { id: 'logs' as NavTab, label: 'System Logs', icon: Terminal },
  ];

  return (
    <aside className="w-56 bg-ops-surface border-r border-ops-border flex flex-col justify-between select-none h-[calc(100vh-3.5rem)] sticky top-14">
      {/* Navigation List */}
      <nav className="p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
          Operations Controls
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                  isActive ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer System Status Card */}
      <div className="p-3 border-t border-ops-border bg-slate-50/50">
        <div className="p-2.5 bg-white border border-slate-200 rounded-md shadow-2xs">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Operational Mode</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 leading-tight">
            Decision-support monitoring active. Human operator required for final actions.
          </p>
        </div>
      </div>
    </aside>
  );
};
