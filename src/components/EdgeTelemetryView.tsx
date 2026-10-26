import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, AlertTriangle, Zap, Server, RefreshCw, BarChart2, Radio } from 'lucide-react';

interface StreamRequestItem {
  id: string;
  time: string;
  subsidiary: string;
  model: string;
  region: string;
  latencyMs: number;
  tokens: number;
  status: 'NOMINAL' | 'DEFLECTED' | 'SANITIZED';
}

export const EdgeTelemetryView: React.FC = () => {
  const [trafficRate, setTrafficRate] = useState<number>(14250); // requests per sec
  const [isBurstActive, setIsBurstActive] = useState<boolean>(false);
  const [driftThreshold, setDriftThreshold] = useState<number>(0.05);
  const [driftCurrent, setDriftCurrent] = useState<number>(0.024);
  const [totalProcessedToday, setTotalProcessedToday] = useState<number>(48920412);
  const [totalBlockedToday, setTotalBlockedToday] = useState<number>(14298);

  const [streamLog, setStreamLog] = useState<StreamRequestItem[]>([
    { id: 'REQ-90141', time: '14:20:04.812', subsidiary: 'Jio Infocomm', model: 'MOD-JIO-5G-01', region: 'Mumbai (BOM-01)', latencyMs: 14, tokens: 412, status: 'NOMINAL' },
    { id: 'REQ-90142', time: '14:20:04.829', subsidiary: 'Reliance Retail', model: 'MOD-REL-RET-09', region: 'Delhi (DEL-03)', latencyMs: 9, tokens: 120, status: 'NOMINAL' },
    { id: 'REQ-90143', time: '14:20:04.851', subsidiary: 'FinTech Bharat', model: 'MOD-BHARAT-CR-07', region: 'Bangalore (BLR-02)', latencyMs: 38, tokens: 840, status: 'SANITIZED' },
    { id: 'REQ-90144', time: '14:20:04.880', subsidiary: 'Jio Infocomm', model: 'MOD-JIO-5G-01', region: 'Chennai (MAA-01)', latencyMs: 18, tokens: 290, status: 'DEFLECTED' },
    { id: 'REQ-90145', time: '14:20:04.912', subsidiary: 'Adani Green Energy', model: 'MOD-ADN-GRN-04', region: 'Gujarat (AMD-01)', latencyMs: 7, tokens: 85, status: 'NOMINAL' },
    { id: 'REQ-90146', time: '14:20:04.945', subsidiary: 'OmniEnergy Corp', model: 'MOD-OMNI-LLM-01', region: 'London (LHR-02)', latencyMs: 52, tokens: 1420, status: 'NOMINAL' },
  ]);

  // High-throughput counter update
  useEffect(() => {
    const timer = setInterval(() => {
      const delta = Math.floor(trafficRate * 0.5);
      setTotalProcessedToday((prev) => prev + delta);

      // Add fresh request to stream log
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
      const subsidiaries = ['Jio Infocomm', 'Reliance Retail', 'Adani Green Energy', 'Adani Ports & Logistics', 'FinTech Bharat', 'OmniEnergy Corp'];
      const models = ['MOD-JIO-5G-01', 'MOD-REL-RET-09', 'MOD-ADN-GRN-04', 'MOD-ADN-PRT-02', 'MOD-BHARAT-CR-07', 'MOD-OMNI-LLM-01'];
      const regions = ['Mumbai (BOM-01)', 'Delhi (DEL-03)', 'Gujarat (AMD-01)', 'Bangalore (BLR-02)', 'Frankfurt (FRA-01)', 'Singapore (SIN-01)'];

      const randomIdx = Math.floor(Math.random() * subsidiaries.length);
      const isBlocked = Math.random() < (isBurstActive ? 0.35 : 0.04);
      const isSanitized = !isBlocked && Math.random() < 0.08;

      const newEntry: StreamRequestItem = {
        id: `REQ-${Math.floor(Math.random() * 90000) + 10000}`,
        time: timeStr,
        subsidiary: subsidiaries[randomIdx],
        model: models[randomIdx],
        region: regions[randomIdx],
        latencyMs: Math.floor(Math.random() * 38) + 8,
        tokens: Math.floor(Math.random() * 800) + 100,
        status: isBlocked ? 'DEFLECTED' : isSanitized ? 'SANITIZED' : 'NOMINAL',
      };

      if (isBlocked) {
        setTotalBlockedToday((prev) => prev + 1);
      }

      setStreamLog((prev) => [newEntry, ...prev.slice(0, 9)]);
    }, 600);

    return () => clearInterval(timer);
  }, [trafficRate, isBurstActive]);

  const triggerBurst = () => {
    setIsBurstActive(true);
    setTrafficRate(32000);
    setDriftCurrent(0.068); // Exceeds threshold!

    setTimeout(() => {
      setIsBurstActive(false);
      setTrafficRate(14250);
      setDriftCurrent(0.024);
    }, 8000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner & Gateway Architecture */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            High-Throughput Edge Telemetry & Drift Monitoring
          </h2>
          <p className="text-xs text-slate-400">
            eBPF-instrumented inference gateway serving 14,000+ requests/sec across India and international edge points of presence (PoPs).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={triggerBurst}
            disabled={isBurstActive}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              isBurstActive
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{isBurstActive ? 'Simulating 32k RPS Attack Burst...' : 'Inject Traffic & Drift Spike'}</span>
          </button>
        </div>
      </div>

      {/* Gateway Architecture Visual Frame */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        <div className="p-6 lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
              Optical Interconnect & Guardrail Layer
            </div>
            <h3 className="text-lg font-bold text-white">
              Zero-Copy eBPF Packet Intercept & Format Preserving Encryption
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every inference payload entering the conglomerate network is decrypted at the hardware boundary in isolated AWS Nitro / AMD SEV enclaves. Redis token buckets evaluate rate limits and DLP policies in <strong className="text-slate-200">under 4 milliseconds</strong> before dispatching to Triton Inference clusters.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800/80 text-xs">
            <div>
              <div className="text-slate-500 text-[11px]">eBPF Filter Mode</div>
              <div className="font-mono text-emerald-400 font-semibold pt-0.5">XDP Bypass</div>
            </div>
            <div>
              <div className="text-slate-500 text-[11px]">SLA Availability</div>
              <div className="font-mono text-white font-semibold pt-0.5">99.999%</div>
            </div>
            <div>
              <div className="text-slate-500 text-[11px]">ClickHouse Ingest</div>
              <div className="font-mono text-indigo-400 font-semibold pt-0.5">Zero Dropped</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative min-h-[180px] bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 overflow-hidden">
          <img
            src="/src/assets/images/infrastructure_cluster_1792994993603.jpg"
            alt="Infrastructure Cluster"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-3 text-[11px] font-mono text-slate-400">
            Datacenter: Reliance Jio Cloud IDC-1 / Adani ConneX HyperScale
          </div>
        </div>
      </div>

      {/* Real-time KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Live Conglomerate RPS</span>
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-400 tabular-nums">
            {trafficRate.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            p95 Latency: 38.4ms · p99: 64.2ms
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1">
          <div className="text-xs text-slate-400">Daily Requests Handled</div>
          <div className="text-3xl font-bold font-mono text-white tabular-nums">
            {totalProcessedToday.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            48.9 Million+ Today
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1">
          <div className="text-xs text-slate-400">Threats & PII Intercepted</div>
          <div className="text-3xl font-bold font-mono text-indigo-400 tabular-nums">
            {totalBlockedToday.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            99.94% Deflection Accuracy
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1">
          <div className="text-xs text-slate-400">Kolmogorov-Smirnov Drift Index</div>
          <div className={`text-3xl font-bold font-mono tabular-nums ${driftCurrent > driftThreshold ? 'text-rose-400' : 'text-slate-100'}`}>
            {driftCurrent.toFixed(3)}
          </div>
          <div className="text-[11px] font-mono">
            {driftCurrent > driftThreshold ? (
              <span className="text-rose-400 font-bold">ALARM: Drift Exceeds {driftThreshold}</span>
            ) : (
              <span className="text-emerald-400 font-medium">Nominal (Threshold {driftThreshold})</span>
            )}
          </div>
        </div>

      </div>

      {/* Traffic Sliders & Guardrail Control */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4 text-xs">
        <h4 className="font-bold text-white text-sm">
          Traffic Simulation & Drift Boundary Controls
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between font-mono text-slate-300">
              <span>Traffic Ingress Rate:</span>
              <span className="text-indigo-400 font-bold tabular-nums">{trafficRate.toLocaleString()} requests/sec</span>
            </div>
            <input
              type="range"
              min="2000"
              max="50000"
              step="1000"
              value={trafficRate}
              onChange={(e) => setTrafficRate(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>2,000 RPS (Night baseline)</span>
              <span>50,000 RPS (Festival peak)</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between font-mono text-slate-300">
              <span>Drift Alert Trigger (KS Distance):</span>
              <span className="text-indigo-400 font-bold tabular-nums">{driftThreshold.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="0.02"
              max="0.10"
              step="0.005"
              value={driftThreshold}
              onChange={(e) => setDriftThreshold(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>0.020 (Strict sensitivity)</span>
              <span>0.100 (Tolerant)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Streaming Live Ingress Waterfall Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Streaming Live Gateway Ingress Waterfall</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Sample Rate: 1 in 10,000 packets (Audited to ClickHouse)
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/30">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 text-[11px] uppercase">
              <tr>
                <th className="py-2.5 px-3">Packet ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Subsidiary</th>
                <th className="py-2.5 px-3">Model Target</th>
                <th className="py-2.5 px-3">Edge PoP</th>
                <th className="py-2.5 px-3">Latency</th>
                <th className="py-2.5 px-3">Tokens</th>
                <th className="py-2.5 px-3 text-right">Guardrail Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {streamLog.map((req) => (
                <tr key={req.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-2 px-3 text-slate-400">{req.id}</td>
                  <td className="py-2 px-3 text-slate-400 tabular-nums">{req.time}</td>
                  <td className="py-2 px-3 font-sans font-medium text-white">{req.subsidiary}</td>
                  <td className="py-2 px-3 text-slate-400">{req.model}</td>
                  <td className="py-2 px-3 text-slate-400">{req.region}</td>
                  <td className="py-2 px-3 tabular-nums text-slate-200">{req.latencyMs}ms</td>
                  <td className="py-2 px-3 tabular-nums text-slate-400">{req.tokens}</td>
                  <td className="py-2 px-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      req.status === 'NOMINAL'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : req.status === 'SANITIZED'
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
