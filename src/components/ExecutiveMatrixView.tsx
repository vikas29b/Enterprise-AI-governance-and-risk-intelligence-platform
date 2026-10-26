import React from 'react';
import { AIModel, Subsidiary } from '../types/governance';
import { Shield, AlertTriangle, CheckCircle2, TrendingUp, Cpu, Server, Activity, ArrowRight, Layers } from 'lucide-react';
import { ActiveTab } from './Header';

interface ExecutiveMatrixViewProps {
  models: AIModel[];
  onNavigateTab: (tab: ActiveTab) => void;
  onSelectModel: (model: AIModel) => void;
  onOpenReport: () => void;
}

export const ExecutiveMatrixView: React.FC<ExecutiveMatrixViewProps> = ({
  models,
  onNavigateTab,
  onSelectModel,
  onOpenReport,
}) => {
  // Compute Conglomerate Composite Risk Score
  const avgRiskScore = Math.round(
    models.reduce((acc, m) => acc + m.riskScore, 0) / (models.length || 1)
  );

  const quarantineModels = models.filter((m) => m.status === 'review_required' || m.status === 'quarantine');
  const compliantModels = models.filter((m) => m.riskScore < 40 && m.status === 'production');

  // Subsidiary breakdown
  const subsidiaries: { name: Subsidiary; sector: string; leadModel: AIModel; riskAvg: number }[] = [
    {
      name: 'Reliance Retail',
      sector: 'Consumer & Omnichannel Commerce',
      leadModel: models.find((m) => m.subsidiary === 'Reliance Retail')!,
      riskAvg: 28,
    },
    {
      name: 'Jio Infocomm',
      sector: '5G Telecom & Digital Services',
      leadModel: models.find((m) => m.subsidiary === 'Jio Infocomm')!,
      riskAvg: 34,
    },
    {
      name: 'Adani Green Energy',
      sector: 'Renewable Hybrid Power & BESS',
      leadModel: models.find((m) => m.subsidiary === 'Adani Green Energy')!,
      riskAvg: 19,
    },
    {
      name: 'Adani Ports & Logistics',
      sector: 'Maritime Infrastructure & Customs',
      leadModel: models.find((m) => m.subsidiary === 'Adani Ports & Logistics')!,
      riskAvg: 46,
    },
    {
      name: 'FinTech Bharat',
      sector: 'SME Lending & Financial Inclusion',
      leadModel: models.find((m) => m.subsidiary === 'FinTech Bharat')!,
      riskAvg: 61,
    },
    {
      name: 'OmniEnergy Corp',
      sector: 'Refining & Energy Trading Contracts',
      leadModel: models.find((m) => m.subsidiary === 'OmniEnergy Corp')!,
      riskAvg: 24,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Hero Executive Spotlight */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          
          <div className="p-6 sm:p-8 lg:p-10 lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="text-xs uppercase font-mono tracking-widest text-indigo-400">
                Conglomerate AI Governance Matrix · FY 2026-27
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                Enterprise Algorithmic Risk & Autonomous Governance
              </h1>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
                Real-time oversight governing 6 mission-critical AI workloads across telecom, renewable grid dispatch, container logistics, dynamic retail pricing, and credit underwriting. Enforcing statutory adherence to the EU AI Act, NIST AI RMF, and India DPDP Act 2023.
              </p>
            </div>

            {/* Quick Stat Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
              <div>
                <div className="text-xs text-slate-500 font-medium">Enterprise Risk Index</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                  {avgRiskScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                </div>
                <div className="text-[11px] text-slate-400">Grade A (Controlled)</div>
              </div>

              <div>
                <div className="text-xs text-slate-500 font-medium">Daily Ingress Traffic</div>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">
                  48.9M
                </div>
                <div className="text-[11px] text-slate-400">14,200 req/sec</div>
              </div>

              <div>
                <div className="text-xs text-slate-500 font-medium">Guardrail Intercept</div>
                <div className="text-2xl font-bold font-mono text-indigo-300 tabular-nums">
                  99.94%
                </div>
                <div className="text-[11px] text-slate-400">14.2k attacks blocked</div>
              </div>

              <div>
                <div className="text-xs text-slate-500 font-medium">Active Quarantine</div>
                <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
                  {quarantineModels.length}
                </div>
                <div className="text-[11px] text-amber-300/80">Remediation in progress</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigateTab('audit')}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-sm flex items-center gap-2"
              >
                <span>Launch File & Data Inspector</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onOpenReport}
                className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
              >
                View 10-Chapter Architecture Whitepaper
              </button>
            </div>
          </div>

          {/* Visual Command Center Frame */}
          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 overflow-hidden">
            <img
              src="/src/assets/images/enterprise_command_center_1792994991762.jpg"
              alt="Enterprise AI Command Center"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-80 hover:opacity-95 transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 text-xs text-slate-300 flex items-center justify-between">
              <span className="font-mono text-[11px] text-slate-400">Cluster: asia-south1 (Mumbai Enclave)</span>
              <span className="text-[11px] font-mono text-emerald-400">eBPF Telemetry Ingress Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conglomerate Subsidiary Risk Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Subsidiary Algorithmic Risk Profiles
            </h2>
            <p className="text-xs text-slate-400">
              Federated risk indices calculated from fairness audits, adversarial tests, and live edge telemetry.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('models')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View All Models ({models.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subsidiaries.map((sub) => {
            const isHighRisk = sub.riskAvg >= 50;
            const isMediumRisk = sub.riskAvg >= 30 && sub.riskAvg < 50;
            const riskColor = isHighRisk
              ? 'text-rose-400'
              : isMediumRisk
              ? 'text-amber-400'
              : 'text-emerald-400';

            const badgeBg = isHighRisk
              ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
              : isMediumRisk
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';

            return (
              <div
                key={sub.name}
                onClick={() => {
                  if (sub.leadModel) onSelectModel(sub.leadModel);
                }}
                className="cursor-pointer p-5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 hover:border-slate-700 transition-all space-y-4 group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {sub.name}
                    </h3>
                    <div className="text-xs text-slate-400">{sub.sector}</div>
                  </div>
                  <div className={`px-2 py-0.5 text-xs font-mono rounded border ${badgeBg}`}>
                    Risk {sub.riskAvg} / 100
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="text-slate-400 flex items-center justify-between">
                    <span>Lead Model:</span>
                    <span className="font-medium text-slate-200 truncate max-w-[180px]">
                      {sub.leadModel?.name}
                    </span>
                  </div>

                  <div className="text-slate-400 flex items-center justify-between">
                    <span>Disparate Impact:</span>
                    <span className={`font-mono tabular-nums ${sub.leadModel?.metrics.disparateImpactRatio < 0.8 ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
                      {sub.leadModel?.metrics.disparateImpactRatio.toFixed(2)} {sub.leadModel?.metrics.disparateImpactRatio < 0.8 && '(VIOLATION)'}
                    </span>
                  </div>

                  <div className="text-slate-400 flex items-center justify-between">
                    <span>p95 Latency:</span>
                    <span className="font-mono tabular-nums text-slate-200">
                      {sub.leadModel?.metrics.p95LatencyMs} ms
                    </span>
                  </div>

                  <div className="text-slate-400 flex items-center justify-between">
                    <span>Approval Gates:</span>
                    <span className="font-mono text-slate-300">
                      {Object.values(sub.leadModel?.approvals || {}).filter(Boolean).length} / 4 Signed
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Version {sub.leadModel?.version}</span>
                  <span className="text-indigo-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Inspect Card <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Critical Active Incident Triage Strip */}
      <div className="p-5 rounded-xl border border-amber-900/50 bg-amber-950/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="font-semibold text-amber-200 text-sm">
              Active Enterprise Incident: Bharat FinCredit Underwriting Disparity (Triage ID: INC-2026-9812)
            </span>
          </div>
          <span className="text-xs font-mono text-amber-400/80">SLA Timer: 01h:42m remaining</span>
        </div>

        <p className="text-xs text-amber-300/80 leading-relaxed">
          The monthly batch fairness evaluation for <code className="font-mono text-amber-100">MOD-BHARAT-CR-07</code> recorded a Disparate Impact Ratio of <strong>0.74</strong> between female and male merchant applicants in the rural Tier-3 sector, breaching the statutory 80% rule defined in the Enterprise AI Ethics Charter and RBI Digital Lending Directives. Model promotion is automatically halted.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
          <button
            onClick={() => onNavigateTab('audit')}
            className="px-3 py-1.5 font-medium bg-amber-600/30 border border-amber-500/40 text-amber-200 rounded-md hover:bg-amber-600/50 transition-colors"
          >
            Review Empirical KYC Dataset & Run Audit
          </button>
          <button
            onClick={() => {
              const bharatModel = models.find((m) => m.id === 'MOD-BHARAT-CR-07');
              if (bharatModel) onSelectModel(bharatModel);
            }}
            className="px-3 py-1.5 font-medium text-slate-300 hover:text-white transition-colors"
          >
            Open Model Card & Quarantine Actions
          </button>
        </div>
      </div>

      {/* Key Architectural Controls Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30 space-y-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-white text-base">Stage-Gate Zero-Trust Governance</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            No machine learning model or LLM system prompt can be promoted to production without cryptographic multi-party sign-offs from the Chief AI Ethics Officer, Enterprise CISO, General Counsel, and MLOps Lead.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30 space-y-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-white text-base">Sub-50ms Edge Guardrail Intercept</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ingress traffic at enterprise scale (14,000+ RPS) is routed through eBPF kernels and Redis token bucket caches, scanning for PII exfiltration, prompt injection, and toxicity before reaching inference GPUs.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30 space-y-3">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-white text-base">Statutory Cross-Walk Automation</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Continuously maps model cards, test artifacts, and training datasets to EU AI Act Articles 9-15, NIST AI RMF 1.0 (Govern, Map, Measure, Manage), and India DPDP Act 2023 Section 8 obligations.
          </p>
        </div>
      </div>
    </div>
  );
};
