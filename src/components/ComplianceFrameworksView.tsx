import React, { useState } from 'react';
import { COMPLIANCE_FRAMEWORKS } from '../data/mockEnterpriseData';
import { ComplianceControl } from '../types/governance';
import { CheckCircle2, AlertTriangle, XCircle, FileCheck, ExternalLink, Shield, Download } from 'lucide-react';

interface ComplianceFrameworksViewProps {
  onOpenReport: () => void;
}

export const ComplianceFrameworksView: React.FC<ComplianceFrameworksViewProps> = ({ onOpenReport }) => {
  const [controls, setControls] = useState<ComplianceControl[]>(COMPLIANCE_FRAMEWORKS);
  const [selectedFramework, setSelectedFramework] = useState<string>('all');

  const filteredControls = controls.filter(
    (c) => selectedFramework === 'all' || c.framework === selectedFramework
  );

  const compliantCount = controls.filter((c) => c.status === 'compliant').length;
  const remediationCount = controls.filter((c) => c.status === 'in_remediation').length;
  const nonCompliantCount = controls.filter((c) => c.status === 'non_compliant').length;
  const readinessPercent = Math.round((compliantCount / controls.length) * 100);

  const cycleStatus = (id: string) => {
    setControls((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus: ComplianceControl['status'] =
            c.status === 'compliant'
              ? 'in_remediation'
              : c.status === 'in_remediation'
              ? 'non_compliant'
              : 'compliant';
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Multi-Regulatory Framework Cross-Walk & Gap Tracker
          </h2>
          <p className="text-xs text-slate-400">
            Harmonized compliance controls spanning the EU AI Act (2024/1689), NIST AI RMF 1.0, ISO/IEC 42001, and India DPDP Act 2023.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedFramework}
            onChange={(e) => setSelectedFramework(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-mono"
          >
            <option value="all">All Regulatory Frameworks</option>
            <option value="EU AI Act">EU AI Act (2024/1689)</option>
            <option value="NIST AI RMF 1.0">NIST AI RMF 1.0</option>
            <option value="ISO/IEC 42001">ISO/IEC 42001:2023</option>
            <option value="India DPDP Act 2023">India DPDP Act 2023</option>
            <option value="RBI AI Guidelines">RBI AI Guidelines</option>
          </select>

          <button
            onClick={onOpenReport}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Generate Boardroom Certification</span>
          </button>
        </div>
      </div>

      {/* Audit Readiness Gauge */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1">
          <div className="text-xs text-slate-400">Statutory Audit Readiness</div>
          <div className="text-3xl font-bold font-mono text-emerald-400 tabular-nums">
            {readinessPercent}%
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            {compliantCount} of {controls.length} Controls Fully Passed
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1">
          <div className="text-xs text-slate-400">Controls In Remediation</div>
          <div className="text-3xl font-bold font-mono text-amber-400 tabular-nums">
            {remediationCount}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Active Engineering Sprints</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1">
          <div className="text-xs text-slate-400">Non-Compliant Gaps</div>
          <div className="text-3xl font-bold font-mono text-rose-400 tabular-nums">
            {nonCompliantCount}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Requires Board Remediation Plan</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1">
          <div className="text-xs text-slate-400">Lead External Auditor</div>
          <div className="text-base font-bold text-white pt-1">
            BSI / TÜV SÜD
          </div>
          <div className="text-[11px] text-slate-500 font-mono">ISO 42001 Stage-2 Accredited</div>
        </div>

      </div>

      {/* Interactive Controls Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/30">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
            <tr>
              <th className="py-3 px-4">Control Ref & Title</th>
              <th className="py-3 px-4">Framework</th>
              <th className="py-3 px-4">Statutory Clause</th>
              <th className="py-3 px-4">Audit Evidence Artifact</th>
              <th className="py-3 px-4">Status (Click to Toggle)</th>
              <th className="py-3 px-4 text-right">Review Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filteredControls.map((ctrl) => (
              <tr key={ctrl.id} className="hover:bg-slate-900/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-semibold text-white">{ctrl.title}</div>
                  <div className="text-slate-400 text-[11px] max-w-md pt-0.5 leading-relaxed font-sans font-normal">
                    {ctrl.description}
                  </div>
                </td>

                <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap">
                  {ctrl.framework}
                </td>

                <td className="py-3 px-4 font-mono text-indigo-300 whitespace-nowrap">
                  {ctrl.section}
                </td>

                <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                  <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800">
                    {ctrl.auditEvidenceRef}
                  </span>
                </td>

                <td className="py-3 px-4 whitespace-nowrap">
                  <button
                    onClick={() => cycleStatus(ctrl.id)}
                    className={`px-2.5 py-1 text-xs font-mono rounded font-semibold transition-all border ${
                      ctrl.status === 'compliant'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                        : ctrl.status === 'in_remediation'
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                    }`}
                  >
                    {ctrl.status === 'compliant' && 'COMPLIANT'}
                    {ctrl.status === 'in_remediation' && 'IN REMEDIATION'}
                    {ctrl.status === 'non_compliant' && 'NON-COMPLIANT'}
                  </button>
                </td>

                <td className="py-3 px-4 text-right font-mono text-slate-400 tabular-nums">
                  {ctrl.lastReviewDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
