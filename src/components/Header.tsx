import React from 'react';
import { ShieldCheck, FileText, Cpu, AlertTriangle, Activity, CheckCircle, Users } from 'lucide-react';

export type ActiveTab = 'executive' | 'models' | 'audit' | 'redteam' | 'telemetry' | 'compliance';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenReport: () => void;
  onOpenTeam: () => void;
  auditAlertCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenReport,
  onOpenTeam,
  auditAlertCount,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            AegisGov AI
          </span>
          <span className="hidden xl:inline text-xs text-slate-500 tracking-wide font-medium">
            Enterprise AI Governance & Risk Intelligence
          </span>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-1 sm:gap-2 text-sm font-medium text-slate-400">
          <button
            onClick={() => onTabChange('executive')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'executive'
                ? 'bg-slate-800/80 text-white font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Executive Matrix
          </button>

          <button
            onClick={() => onTabChange('models')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'models'
                ? 'bg-slate-800/80 text-white font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Model Registry
          </button>

          <button
            onClick={() => onTabChange('audit')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'bg-slate-800/80 text-white font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <span>File & Data Inspector</span>
            {auditAlertCount > 0 && (
              <span className="text-[11px] font-mono px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                {auditAlertCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange('redteam')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'redteam'
                ? 'bg-slate-800/80 text-white font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Adversarial Red-Team
          </button>

          <button
            onClick={() => onTabChange('telemetry')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'telemetry'
                ? 'bg-slate-800/80 text-white font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Live Edge Telemetry
          </button>

          <button
            onClick={() => onTabChange('compliance')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'compliance'
                ? 'bg-slate-800/80 text-white font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Compliance Frameworks
          </button>
        </nav>

        {/* Zone 3: Primary Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenTeam}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap flex items-center gap-1.5"
            title="View Executive Governance Committee & Member SLAs"
          >
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>Governance Team</span>
          </button>

          <button
            onClick={onOpenReport}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Executive Dossier</span>
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      <div className="lg:hidden border-t border-slate-900 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs font-medium text-slate-400">
        <button
          onClick={() => onTabChange('executive')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'executive' ? 'bg-slate-800 text-white' : ''}`}
        >
          Executive Matrix
        </button>
        <button
          onClick={() => onTabChange('models')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'models' ? 'bg-slate-800 text-white' : ''}`}
        >
          Models
        </button>
        <button
          onClick={() => onTabChange('audit')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'audit' ? 'bg-slate-800 text-white' : ''}`}
        >
          File Inspector ({auditAlertCount})
        </button>
        <button
          onClick={() => onTabChange('redteam')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'redteam' ? 'bg-slate-800 text-white' : ''}`}
        >
          Red-Team
        </button>
        <button
          onClick={() => onTabChange('telemetry')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'telemetry' ? 'bg-slate-800 text-white' : ''}`}
        >
          Telemetry
        </button>
        <button
          onClick={() => onTabChange('compliance')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'compliance' ? 'bg-slate-800 text-white' : ''}`}
        >
          Compliance
        </button>
      </div>
    </header>
  );
};
