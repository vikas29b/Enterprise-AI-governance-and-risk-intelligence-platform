import React, { useState } from 'react';
import { SAMPLE_DATASETS } from '../data/mockEnterpriseData';
import { performDeepAuditScan } from '../services/deepAuditEngine';
import { requestGeminiAudit, GeminiAuditResponse } from '../services/geminiClient';
import { AuditScanResult } from '../types/governance';
import { UploadCloud, FileText, ShieldAlert, CheckCircle2, AlertTriangle, Sparkles, Download, RefreshCw, Lock, Scale, Eye, EyeOff } from 'lucide-react';

interface FileAuditViewProps {
  lastScanResult: AuditScanResult | null;
  onScanComplete: (res: AuditScanResult) => void;
}

export const FileAuditView: React.FC<FileAuditViewProps> = ({
  lastScanResult,
  onScanComplete,
}) => {
  const [activeContent, setActiveContent] = useState<string>(SAMPLE_DATASETS.kycDatasetCsv);
  const [activeFilename, setActiveFilename] = useState<string>('jio_kyc_credit_dataset.csv');
  const [scanResult, setScanResult] = useState<AuditScanResult | null>(() => {
    return lastScanResult || performDeepAuditScan('jio_kyc_credit_dataset.csv', SAMPLE_DATASETS.kycDatasetCsv);
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeminiAuditing, setIsGeminiAuditing] = useState(false);
  const [geminiResult, setGeminiResult] = useState<GeminiAuditResponse | null>(null);
  const [showRawContent, setShowRawContent] = useState(false);

  // Handle local user file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setActiveFilename(file.name);
        setActiveContent(content);
        executeScan(file.name, content);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setActiveFilename(file.name);
        setActiveContent(content);
        executeScan(file.name, content);
      }
    };
    reader.readAsText(file);
  };

  const executeScan = (fname: string, content: string) => {
    setIsAnalyzing(true);
    setGeminiResult(null);

    // Simulate real high-speed parsing micro-delay for UX visual feedback
    setTimeout(() => {
      const result = performDeepAuditScan(fname, content);
      setScanResult(result);
      onScanComplete(result);
      setIsAnalyzing(false);
    }, 150);
  };

  const loadSample = (type: 'kyc' | 'prompt' | 'spec' | 'log') => {
    let name = '';
    let content = '';

    if (type === 'kyc') {
      name = 'jio_kyc_credit_dataset.csv';
      content = SAMPLE_DATASETS.kycDatasetCsv;
    } else if (type === 'prompt') {
      name = 'bharatfin_enterprise_prompt.txt';
      content = SAMPLE_DATASETS.systemPromptTxt;
    } else if (type === 'spec') {
      name = 'adani_scada_model_spec.json';
      content = SAMPLE_DATASETS.modelSpecJson;
    } else if (type === 'log') {
      name = 'model_weights_audit_log.json';
      content = SAMPLE_DATASETS.modelWeightsAuditLog;
    }

    setActiveFilename(name);
    setActiveContent(content);
    executeScan(name, content);
  };

  // Run Gemini Deep Governance Audit
  const handleRunGeminiAudit = async () => {
    if (!scanResult) return;
    setIsGeminiAuditing(true);

    try {
      const response = await requestGeminiAudit(
        activeFilename,
        activeContent,
        `Deep Enterprise Governance Audit for high-conglomerate deployment under EU AI Act and DPDP Act 2023.`
      );
      setGeminiResult(response);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeminiAuditing(false);
    }
  };

  // Download redacted dataset
  const handleDownloadRedacted = () => {
    let sanitized = activeContent;
    scanResult?.piiViolations.forEach((v) => {
      // replace unmasked strings with tokens
      sanitized = sanitized.replace(new RegExp(v.valueMasked.replace(/\*/g, '\\d'), 'g'), `[REDACTED_${v.type.toUpperCase().replace(/\s+/g, '_')}]`);
    });

    const blob = new Blob([sanitized], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sanitized_${activeFilename}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner & File Dropzone */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Automated File, Dataset & Prompt Security Inspector
          </h2>
          <p className="text-xs text-slate-400">
            Real line-by-line inspection parsing PII (Aadhaar, PAN, CC), mathematical disparate impact ratios, and adversarial injection vectors.
          </p>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-mono text-[11px] mr-1">Load Enterprise Data:</span>
          <button
            onClick={() => loadSample('kyc')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeFilename.includes('kyc')
                ? 'bg-indigo-600 text-white font-medium'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Jio KYC (CSV)
          </button>
          <button
            onClick={() => loadSample('prompt')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeFilename.includes('prompt')
                ? 'bg-indigo-600 text-white font-medium'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            System Prompt (TXT)
          </button>
          <button
            onClick={() => loadSample('spec')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeFilename.includes('spec')
                ? 'bg-indigo-600 text-white font-medium'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Adani SCADA (JSON)
          </button>
          <button
            onClick={() => loadSample('log')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeFilename.includes('log')
                ? 'bg-indigo-600 text-white font-medium'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Integrity Log
          </button>
        </div>
      </div>

      {/* Upload Drag and Drop Area */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="p-6 rounded-2xl border-2 border-dashed border-slate-800 hover:border-indigo-500/60 bg-slate-950/40 transition-colors text-center cursor-pointer relative group"
      >
        <input
          type="file"
          accept=".csv,.json,.txt,.py,.log,.yaml,.yml"
          onChange={handleFileUpload}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white">
              Drop any production file here or <span className="text-indigo-400 underline">browse files</span>
            </p>
            <p className="text-xs text-slate-400">
              Supports CSV training data, model cards (JSON/YAML), LLM system prompts (TXT), and security logs up to 50MB.
            </p>
          </div>
          <div className="text-[11px] font-mono text-slate-500 pt-1">
            Active Target: <span className="text-slate-300 font-semibold">{activeFilename}</span> ({(new Blob([activeContent]).size / 1024).toFixed(1)} KB)
          </div>
        </div>
      </div>

      {/* Scan Results Board */}
      {scanResult && (
        <div className="space-y-6">
          
          {/* Top KPI Score Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Safety Score */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1">
              <div className="text-xs text-slate-400">Composite Safety Score</div>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-bold font-mono tabular-nums ${
                  scanResult.compositeSafetyScore > 75
                    ? 'text-emerald-400'
                    : scanResult.compositeSafetyScore > 45
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}>
                  {scanResult.compositeSafetyScore}
                </span>
                <span className="text-xs text-slate-500 font-mono">/ 100</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {scanResult.compositeSafetyScore > 75 ? 'Passable With Caveats' : 'Quarantine Mandated'}
              </div>
            </div>

            {/* PII Violations */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1">
              <div className="text-xs text-slate-400">Statutory PII Violations</div>
              <div className="text-3xl font-bold font-mono tabular-nums text-rose-400">
                {scanResult.piiViolations.length}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                DPDP Act 2023 Sec 8(1) Impact
              </div>
            </div>

            {/* Fairness Parity */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1">
              <div className="text-xs text-slate-400">Disparate Impact Ratio</div>
              <div className="text-3xl font-bold font-mono tabular-nums text-slate-100">
                {scanResult.fairnessAnalysis
                  ? scanResult.fairnessAnalysis.disparateImpactRatio.toFixed(2)
                  : 'N/A'}
              </div>
              <div className="text-[11px] font-mono">
                {scanResult.fairnessAnalysis ? (
                  scanResult.fairnessAnalysis.isCompliant80Rule ? (
                    <span className="text-emerald-400">EEOC 80% Rule Met</span>
                  ) : (
                    <span className="text-rose-400 font-bold">80% Rule Breached</span>
                  )
                ) : (
                  <span className="text-slate-500">Non-tabular file</span>
                )}
              </div>
            </div>

            {/* Injection Exploits */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1">
              <div className="text-xs text-slate-400">Adversarial Exploits Detected</div>
              <div className="text-3xl font-bold font-mono tabular-nums text-amber-400">
                {scanResult.injectionVulnerabilities.length}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Scan Latency: {scanResult.durationMs}ms
              </div>
            </div>

          </div>

          {/* Action Bar: Gemini AI Deep Synthesis & Redacted Download */}
          <div className="p-4 rounded-xl border border-indigo-900/40 bg-indigo-950/20 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Executive Gemini Governance Analysis Engine</span>
              </div>
              <div className="text-xs text-slate-400">
                Generate a boardroom-grade regulatory synthesis using Google Gemini 3.8 Flash.
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowRawContent(!showRawContent)}
                className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                {showRawContent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showRawContent ? 'Hide Raw Content' : 'Inspect Raw File'}</span>
              </button>

              <button
                onClick={handleDownloadRedacted}
                className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Redacted Copy</span>
              </button>

              <button
                onClick={handleRunGeminiAudit}
                disabled={isGeminiAuditing}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-1.5"
              >
                {isGeminiAuditing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run Gemini AI Deep Audit</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Gemini AI Audit Results Card (if run) */}
          {geminiResult && (
            <div className="p-6 rounded-2xl border border-indigo-500/40 bg-slate-900/90 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-indigo-600/30 flex items-center justify-center text-indigo-400">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-bold text-white text-sm">
                    Gemini 3.8 Flash · Boardroom Executive Risk Synthesis
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-indigo-300">
                  Model: {geminiResult.source}
                </span>
              </div>

              <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                {geminiResult.executiveSummary}
              </div>

              {geminiResult.keyRiskFindings && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
                  <div className="bg-rose-950/20 p-3 rounded-lg border border-rose-900/40 space-y-1">
                    <div className="font-semibold text-rose-300">Identified Critical Risks</div>
                    <ul className="list-disc list-inside text-rose-200/80 space-y-1">
                      {geminiResult.keyRiskFindings.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-emerald-950/20 p-3 rounded-lg border border-emerald-900/40 space-y-1">
                    <div className="font-semibold text-emerald-300">Engineering Remediation Roadmap</div>
                    <ul className="list-disc list-inside text-emerald-200/80 space-y-1">
                      {geminiResult.remediationRoadmap?.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Raw File Viewer Drawer (Toggleable) */}
          {showRawContent && (
            <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden text-xs">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-slate-400 font-mono text-[11px] flex justify-between items-center">
                <span>{activeFilename} (Raw Input Stream)</span>
                <span>{scanResult.totalRecordsScanned} Lines</span>
              </div>
              <pre className="p-4 font-mono text-slate-300 max-h-72 overflow-y-auto leading-relaxed select-text">
                {activeContent}
              </pre>
            </div>
          )}

          {/* Section 1: Detected PII Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Detected PII & Sensitive Credentials ({scanResult.piiViolations.length})</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Mandatory Encryption under DPDP Act 2023 Sec 8
              </span>
            </div>

            {scanResult.piiViolations.length === 0 ? (
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/20 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                Zero unmasked PII records detected in this file.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/30">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Violation ID</th>
                      <th className="py-2.5 px-3">Classification</th>
                      <th className="py-2.5 px-3">Masked Sample</th>
                      <th className="py-2.5 px-3">Line #</th>
                      <th className="py-2.5 px-3">Severity</th>
                      <th className="py-2.5 px-3">Statutory Violation Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                    {scanResult.piiViolations.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-900/50">
                        <td className="py-2 px-3 font-mono text-[11px] text-slate-400">{v.id}</td>
                        <td className="py-2 px-3 font-semibold text-white">{v.type}</td>
                        <td className="py-2 px-3 font-mono text-amber-300">{v.valueMasked}</td>
                        <td className="py-2 px-3 font-mono tabular-nums text-slate-400">{v.line}</td>
                        <td className="py-2 px-3">
                          <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                            v.severity === 'critical'
                              ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                          }`}>
                            {v.severity.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-400 font-mono text-[11px]">
                          {v.regulatoryImpact}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section 2: Mathematical Fairness & Bias Analysis (if CSV) */}
          {scanResult.fairnessAnalysis && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Scale className="w-4 h-4 text-indigo-400" />
                  <span>Demographic Fairness & Disparate Impact Evaluation</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Four-Fifths (80%) Rule Benchmark
                </span>
              </div>

              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-slate-500 text-[11px]">Privileged Segment ({scanResult.fairnessAnalysis.privilegedGroup})</div>
                    <div className="text-xl font-bold font-mono text-white pt-1">
                      {(scanResult.fairnessAnalysis.privilegedApprovalRate * 100).toFixed(1)}%
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-slate-500 text-[11px]">Unprivileged Segment ({scanResult.fairnessAnalysis.unprivilegedGroup})</div>
                    <div className="text-xl font-bold font-mono text-white pt-1">
                      {(scanResult.fairnessAnalysis.unprivilegedApprovalRate * 100).toFixed(1)}%
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-slate-500 text-[11px]">Computed Disparate Impact Ratio</div>
                    <div className={`text-xl font-bold font-mono pt-1 ${
                      scanResult.fairnessAnalysis.isCompliant80Rule ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {scanResult.fairnessAnalysis.disparateImpactRatio.toFixed(3)}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 space-y-1">
                  <div className="font-mono text-[11px] text-slate-400">
                    Mathematical Formulation:
                  </div>
                  <div className="font-mono text-indigo-300 text-xs">
                    DIR = P(Approval | Female) / P(Approval | Male) ={' '}
                    {(scanResult.fairnessAnalysis.unprivilegedApprovalRate * 100).toFixed(1)}% /{' '}
                    {(scanResult.fairnessAnalysis.privilegedApprovalRate * 100).toFixed(1)}% ={' '}
                    {scanResult.fairnessAnalysis.disparateImpactRatio.toFixed(3)}
                  </div>
                  <p className="text-slate-400 text-[11px] pt-1 leading-relaxed">
                    {scanResult.fairnessAnalysis.isCompliant80Rule
                      ? 'The model passes the statutory non-discrimination threshold (DIR ≥ 0.80).'
                      : 'CRITICAL ALERT: The computed Disparate Impact Ratio is below the mandatory 0.80 threshold. Under RBI guidelines and the EU AI Act, this model cannot be deployed in production for credit decisions without re-weighting or adversarial debiasing.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Prompt Injection Vulnerabilities */}
          {scanResult.injectionVulnerabilities.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Prompt Injection & Credential Exposure Vectors ({scanResult.injectionVulnerabilities.length})</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {scanResult.injectionVulnerabilities.map((inj, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-amber-900/40 bg-amber-950/10 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-200">{inj.vector}</span>
                      <span className="font-mono text-[11px] text-amber-400">Line {inj.line}</span>
                    </div>
                    <p className="text-slate-300 text-xs">{inj.description}</p>
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400">
                      Fix: {inj.mitigation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Regulatory Cross-Check Matrix */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-white text-sm">
              Statutory Cross-Check & Regulatory Mapping
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {scanResult.regulatoryGaps.map((gap, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/30 flex items-start gap-3"
                >
                  <div className="pt-0.5 shrink-0">
                    {gap.status === 'pass' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white">
                      {gap.framework} · {gap.clause}
                    </div>
                    <div className="text-slate-400 text-[11px] leading-relaxed">
                      {gap.notes}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
