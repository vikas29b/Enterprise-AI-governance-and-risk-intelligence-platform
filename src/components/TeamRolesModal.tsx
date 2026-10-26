import React from 'react';
import { X, Users, Shield, Lock, Scale, Server, Database, CheckCircle2 } from 'lucide-react';
import { TEAM_ROLES } from '../data/mockEnterpriseData';

interface TeamRolesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeamRolesModal: React.FC<TeamRolesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 flex justify-center">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl overflow-hidden my-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Enterprise AI Governance Committee & Accountability Matrix
              </h2>
              <div className="text-xs text-slate-400 font-mono">
                Statutory Sign-Off Roles & Production Quarantine Authorities
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto text-xs sm:text-sm">
          
          {/* Executive Spotlight */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shrink-0 border-2 border-indigo-500/40 shadow-lg">
              <img
                src="/src/assets/images/officer_avatar_1792994992985.jpg"
                alt="Chief AI Risk and Ethics Officer"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest">
                Committee Chair
              </div>
              <h3 className="text-lg font-bold text-white">
                Dr. Evelyn Vasquez, Ph.D. · Chief AI Ethics & Governance Officer
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                Direct reporting line to the Board of Directors Audit Committee. Holds absolute statutory veto authority over all autonomous algorithmic decisions across Reliance, Jio, and Adani operating subsidiaries.
              </p>
            </div>
          </div>

          {/* Member Roles Grid */}
          <div className="space-y-4 pt-2">
            <h4 className="font-bold text-white text-sm">
              Functional Governance Leaders & Operational Mandates
            </h4>

            <div className="space-y-3">
              {TEAM_ROLES.map((role, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-slate-800/60">
                    <div className="font-bold text-white text-sm flex items-center gap-2">
                      <Shield className="w-4 h-4 text-indigo-400" />
                      <span>{role.roleTitle}</span>
                    </div>
                    <span className="font-mono text-indigo-300">{role.assignedLeader}</span>
                  </div>

                  <p className="text-slate-300 leading-relaxed">{role.responsibilityScope}</p>

                  <div className="space-y-1">
                    <span className="font-semibold text-slate-200">Key Deliverables:</span>
                    <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                      {role.keyDeliverables.map((del, dIdx) => (
                        <li key={dIdx}>{del}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px] font-mono text-slate-400 border-t border-slate-800/40">
                    <div>
                      <span className="text-slate-500">Enforcement Authority: </span>
                      <span className="text-rose-300">{role.enforcementPowers}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Statutory SLA: </span>
                      <span className="text-emerald-300">{role.slas}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors"
          >
            Close Committee Matrix
          </button>
        </div>

      </div>
    </div>
  );
};
