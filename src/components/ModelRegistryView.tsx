import React, { useState } from 'react';
import { AIModel, RiskTier, Subsidiary } from '../types/governance';
import { Search, Filter, ShieldCheck, AlertCircle, CheckCircle, Clock, X, Lock, Unlock, Leaf, Scale } from 'lucide-react';

interface ModelRegistryViewProps {
  models: AIModel[];
  onUpdateModel: (updated: AIModel) => void;
  selectedModel: AIModel | null;
  onSelectModel: (model: AIModel | null) => void;
}

export const ModelRegistryView: React.FC<ModelRegistryViewProps> = ({
  models,
  onUpdateModel,
  selectedModel,
  onSelectModel,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubsidiary, setSelectedSubsidiary] = useState<string>('all');
  const [selectedRiskTier, setSelectedRiskTier] = useState<string>('all');

  const filteredModels = models.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.intendedUse.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSub = selectedSubsidiary === 'all' || m.subsidiary === selectedSubsidiary;
    const matchesRisk = selectedRiskTier === 'all' || m.riskTier === selectedRiskTier;

    return matchesSearch && matchesSub && matchesRisk;
  });

  const toggleApproval = (role: 'ethicsOfficer' | 'cisoSecOps' | 'generalCounsel' | 'mlopsLead') => {
    if (!selectedModel) return;

    const currentVal = selectedModel.approvals[role];
    const newApprovals = {
      ...selectedModel.approvals,
      [role]: !currentVal,
    };

    // Determine status based on approvals and risk
    const allSigned = Object.values(newApprovals).every(Boolean);
    let newStatus = selectedModel.status;

    if (allSigned && selectedModel.riskScore < 50) {
      newStatus = 'production';
    } else if (!newApprovals.ethicsOfficer || !newApprovals.cisoSecOps) {
      newStatus = 'review_required';
    }

    const updated = {
      ...selectedModel,
      approvals: newApprovals,
      status: newStatus,
    };

    onUpdateModel(updated);
    onSelectModel(updated);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Controls Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Algorithmic Model Registry & Lifecycle Inventory
          </h2>
          <p className="text-xs text-slate-400">
            ISO/IEC 42001 and NIST AI RMF compliant directory of all active models across enterprise subsidiaries.
          </p>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search model ID or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={selectedSubsidiary}
            onChange={(e) => setSelectedSubsidiary(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Subsidiaries</option>
            <option value="Reliance Retail">Reliance Retail</option>
            <option value="Jio Infocomm">Jio Infocomm</option>
            <option value="Adani Green Energy">Adani Green Energy</option>
            <option value="Adani Ports & Logistics">Adani Ports & Logistics</option>
            <option value="FinTech Bharat">FinTech Bharat</option>
            <option value="OmniEnergy Corp">OmniEnergy Corp</option>
          </select>

          <select
            value={selectedRiskTier}
            onChange={(e) => setSelectedRiskTier(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Risk Tiers</option>
            <option value="high_risk">High Risk (EU Annex III)</option>
            <option value="transparency_risk">Transparency Risk</option>
            <option value="minimal_risk">Minimal Risk</option>
          </select>
        </div>
      </div>

      {/* Model Inventory Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/30">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono text-[11px]">
            <tr>
              <th className="py-3 px-4">Model & ID</th>
              <th className="py-3 px-4">Subsidiary</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Risk Tier</th>
              <th className="py-3 px-4">Risk Index</th>
              <th className="py-3 px-4">Disparate Impact</th>
              <th className="py-3 px-4">Gates Signed</th>
              <th className="py-3 px-4">Lifecycle State</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filteredModels.map((model) => {
              const signedCount = Object.values(model.approvals).filter(Boolean).length;
              const isSelected = selectedModel?.id === model.id;

              return (
                <tr
                  key={model.id}
                  onClick={() => onSelectModel(model)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-indigo-950/30 text-white' : 'hover:bg-slate-900/60 text-slate-300'
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{model.name}</div>
                    <div className="font-mono text-[11px] text-slate-500">{model.id} · {model.version}</div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                    {model.subsidiary}
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                    {model.type}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {model.riskTier === 'high_risk' && (
                      <span className="text-amber-300 font-mono text-[11px]">High Risk (Annex III)</span>
                    )}
                    {model.riskTier === 'transparency_risk' && (
                      <span className="text-indigo-300 font-mono text-[11px]">Transparency</span>
                    )}
                    {model.riskTier === 'minimal_risk' && (
                      <span className="text-emerald-300 font-mono text-[11px]">Minimal</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-mono tabular-nums text-slate-200">
                    <span className={model.riskScore > 45 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                      {model.riskScore}
                    </span> / 100
                  </td>

                  <td className="py-3.5 px-4 font-mono tabular-nums">
                    <span className={model.metrics.disparateImpactRatio < 0.8 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                      {model.metrics.disparateImpactRatio.toFixed(2)}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {signedCount} / 4
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {model.status === 'production' && (
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Production</span>
                      </span>
                    )}
                    {model.status === 'staging' && (
                      <span className="inline-flex items-center gap-1.5 text-indigo-400 text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Staging Canary</span>
                      </span>
                    )}
                    {model.status === 'review_required' && (
                      <span className="inline-flex items-center gap-1.5 text-rose-400 text-xs font-bold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Quarantine / Review</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectModel(model);
                      }}
                      className="px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors"
                    >
                      Inspect Card
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Model Card Detailed Drawer */}
      {selectedModel && (
        <div className="p-6 rounded-2xl border border-slate-700 bg-slate-900/95 space-y-6 shadow-xl">
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="text-xs font-mono text-indigo-400">
                Official Model Card Dossier · ISO/IEC 42001 Section A.6
              </div>
              <h3 className="text-xl font-bold text-white pt-1">{selectedModel.name}</h3>
              <div className="text-xs text-slate-400 font-mono pt-0.5">
                Model ID: {selectedModel.id} · Version: {selectedModel.version} · Subsidiary: {selectedModel.subsidiary}
              </div>
            </div>
            <button
              onClick={() => onSelectModel(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Col 1 & 2: Intended Use & Lineage */}
            <div className="lg:col-span-2 space-y-5 text-xs">
              <div>
                <h4 className="text-slate-300 font-semibold mb-1 text-sm">Designated Operational Boundary (Intended Use)</h4>
                <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  {selectedModel.intendedUse}
                </p>
              </div>

              <div>
                <h4 className="text-rose-400 font-semibold mb-1 text-sm flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>Prohibited & Out-of-Scope Deployments (Statutory Red-Lines)</span>
                </h4>
                <p className="text-rose-200/90 leading-relaxed bg-rose-950/20 p-3 rounded-lg border border-rose-900/40">
                  {selectedModel.outOfScopeUse}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-500 text-[11px]">Training Dataset Size</div>
                  <div className="font-mono text-slate-200 font-semibold pt-1">{selectedModel.trainingDatasetSize}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-500 text-[11px] flex items-center gap-1">
                    <Leaf className="w-3 h-3 text-emerald-400" />
                    <span>Carbon Footprint</span>
                  </div>
                  <div className="font-mono text-slate-200 font-semibold pt-1 tabular-nums">
                    {selectedModel.carbonFootprintKg} kgCO2e
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-500 text-[11px] flex items-center gap-1">
                    <Scale className="w-3 h-3 text-indigo-400" />
                    <span>Disparate Impact Ratio</span>
                  </div>
                  <div className={`font-mono font-semibold pt-1 tabular-nums ${selectedModel.metrics.disparateImpactRatio < 0.8 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {selectedModel.metrics.disparateImpactRatio.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Col 3: Multi-Party Approval Stage Gates */}
            <div className="space-y-4 bg-slate-950/80 p-5 rounded-xl border border-slate-800">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-400" />
                  <span>Production Promotion Gates</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Cryptographic 4-way governance approval required for live commercial traffic. Click any gate to toggle sign-off.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                
                {/* Gate 1 */}
                <div
                  onClick={() => toggleApproval('ethicsOfficer')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between text-xs ${
                    selectedModel.approvals.ethicsOfficer
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-white">Chief AI Ethics Officer (CAEO)</div>
                    <div className="text-[11px] text-slate-400">Fairness & Disparate Impact Sign-off</div>
                  </div>
                  <span className={`text-xs font-mono font-bold ${selectedModel.approvals.ethicsOfficer ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {selectedModel.approvals.ethicsOfficer ? 'APPROVED' : 'PENDING'}
                  </span>
                </div>

                {/* Gate 2 */}
                <div
                  onClick={() => toggleApproval('cisoSecOps')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between text-xs ${
                    selectedModel.approvals.cisoSecOps
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-white">Enterprise CISO & SecOps</div>
                    <div className="text-[11px] text-slate-400">Adversarial Hardening & DLP Enclave</div>
                  </div>
                  <span className={`text-xs font-mono font-bold ${selectedModel.approvals.cisoSecOps ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {selectedModel.approvals.cisoSecOps ? 'APPROVED' : 'PENDING'}
                  </span>
                </div>

                {/* Gate 3 */}
                <div
                  onClick={() => toggleApproval('generalCounsel')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between text-xs ${
                    selectedModel.approvals.generalCounsel
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-white">General Counsel & Statutory Lead</div>
                    <div className="text-[11px] text-slate-400">EU AI Act & India DPDP Act Certification</div>
                  </div>
                  <span className={`text-xs font-mono font-bold ${selectedModel.approvals.generalCounsel ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {selectedModel.approvals.generalCounsel ? 'APPROVED' : 'PENDING'}
                  </span>
                </div>

                {/* Gate 4 */}
                <div
                  onClick={() => toggleApproval('mlopsLead')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between text-xs ${
                    selectedModel.approvals.mlopsLead
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-white">Senior MLOps & Infra Lead</div>
                    <div className="text-[11px] text-slate-400">p95 Latency & Auto-Rollback Invariants</div>
                  </div>
                  <span className={`text-xs font-mono font-bold ${selectedModel.approvals.mlopsLead ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {selectedModel.approvals.mlopsLead ? 'APPROVED' : 'PENDING'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-center">
                <span className="text-[11px] text-slate-500 font-mono">
                  Audit Hash: SHA256:d8a9...b104 (Immutable Ledger Record)
                </span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
