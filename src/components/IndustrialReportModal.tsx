import React from 'react';
import { X, Download, Printer, ShieldCheck, CheckCircle2, FileText, Layers, Users, Cpu, Lock } from 'lucide-react';
import { TEAM_ROLES } from '../data/mockEnterpriseData';

interface IndustrialReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IndustrialReportModal: React.FC<IndustrialReportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const reportText = `# AEGISGOV AI: ENTERPRISE AI GOVERNANCE & RISK INTELLIGENCE PLATFORM
## Grade-1 Enterprise Algorithmic Conformance & Production Assurance Report
**Target Conglomerates**: Reliance Industries, Adani Enterprises, Global Multi-Subsidiary Conglomerates
**Classification**: Highly Confidential / Boardroom Advisory Grade
**Audit Date**: October 2026 | ISO/IEC 42001 & NIST AI RMF Compliant

---

### CHAPTER 1: EXECUTIVE MANDATE & CONGLOMERATE PURPOSE
AegisGov AI is architected as a mission-critical enterprise governance backbone for conglomerates governing multiple high-risk AI workloads across telecommunications (Jio), consumer commerce (Reliance Retail), renewable energy grid dispatch (Adani Green Energy), maritime terminal vision (Adani Ports), and MSME credit underwriting (FinTech Bharat).
Handling over 48.9 million inference requests daily (14,200+ RPS sustained, 50,000 RPS burst), the platform enforces automated, continuous compliance against the EU AI Act (2024/1689), India DPDP Act 2023, NIST AI RMF 1.0, and ISO/IEC 42001:2023.

---

### CHAPTER 2: HIGH-THROUGHPUT INDUSTRIAL INGRESS ARCHITECTURE (500,000+ RPS CAPACITY)
1. **Edge Ingress Layer (eBPF & Envoy Gateway)**:
   - Kernel-level packet inspection utilizing eBPF XDP (eXpress Data Path).
   - Zero-copy hardware decryption in AWS Nitro Enclaves / AMD SEV-SNP secure confidential virtual machines.
   - Sub-4ms Format-Preserving Encryption (FPE) tokenizes all Indian identifiers (Aadhaar 12-digit, PAN alphanumeric, credit card numbers).

2. **Asynchronous Telemetry Bus (Apache Kafka & ClickHouse)**:
   - High-throughput streaming bus handling 500k events/sec.
   - Immutable audit logging to ClickHouse columnar database with cryptographic Merkle tree attestation.

3. **Inference Gateway & Sandwiched Guardrails (Triton / Redis)**:
   - Upstream Semantic Prompt Sandwiches neutralizing persona overrides, DAN vectors, and payload splitting.
   - Downstream Output Scrubber preventing data leakage or unauthorized model card extraction.

---

### CHAPTER 3: GOVERNANCE COMMITTEE ROLES & OPERATIONAL SLAs
${TEAM_ROLES.map((r, i) => `#### ${i + 1}. ${r.roleTitle}
- **Assigned Leader**: ${r.assignedLeader}
- **Mandate**: ${r.responsibilityScope}
- **Key Deliverables**: ${r.keyDeliverables.join('; ')}
- **Enforcement Authority**: ${r.enforcementPowers}
- **Statutory SLA**: ${r.slas}
`).join('\n')}

---

### CHAPTER 4: EMPIRICAL HYPOTHETICAL DATA PROCESSING & DESIRED OUTCOMES
1. **Jio KYC & Credit Dataset (jio_kyc_credit_dataset.csv)**:
   - **Input**: 15 applicant records with Aadhaar numbers, PAN cards, income, gender, and approval decisions.
   - **Processing**: Regex engine detected 15 Aadhaar numbers (DPDP Sec 8 violation) and 15 PAN cards.
   - **Mathematical Fairness Calculation**: Male approval rate = 87.5%, Female approval rate = 28.5%.
   - **Outcome**: Disparate Impact Ratio = 0.325 (< 0.80 statutory threshold). Automatic promotion veto executed.

2. **BharatFin Enterprise System Prompt (bharatfin_enterprise_prompt.txt)**:
   - **Input**: System prompt with exposed AWS credentials (AKIAIOSFODNN7EXAMPLE) and prompt injection triggers.
   - **Processing**: Pre-flight DLP scrubber flagged static credentials and prompt override vulnerabilities.
   - **Outcome**: Flagged for immediate quarantine and Vault integration.

3. **Adani Green SCADA Model Specification (adani_scada_model_spec.json)**:
   - **Input**: 30GW hybrid generation dispatcher parameters.
   - **Processing**: Cross-checked against EU AI Act Article 14 (Human Oversight).
   - **Outcome**: Gap identified—missing mechanical human-in-the-loop failover circuit.

---

### CHAPTER 5: ADVERSARIAL RED-TEAMING & JAILBREAK HARDENING
- **Test Matrix**: 6 standard high-impact attack vectors (DAN 11.4, translation traps, token splitting, recursive cognitive loops, system prompt extraction, indirect delimiter injection).
- **Observed Deflection Rate**: 100% across critical vectors.
- **Mean Intercept Latency**: 18 milliseconds (Target < 50ms).

---

### CHAPTER 6: STATUTORY CONFORMITY DECLARATION
- **EU AI Act**: 80% Compliant (Articles 9, 14 passed; Article 10 in remediation).
- **India DPDP Act 2023**: 90% Compliant (Mandatory tokenization enforced at edge gateway).
- **ISO/IEC 42001**: Stage-2 Audit Readiness Certified.
`;

    const blob = new Blob([reportText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AegisGov_Enterprise_AI_Governance_Report_2026.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 flex justify-center">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl overflow-hidden my-auto">
        
        {/* Header bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-slate-950/95 border-b border-slate-800 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Enterprise AI Governance & Risk Intelligence Platform Dossier
              </h2>
              <div className="text-xs text-slate-400 font-mono">
                Production Implementation Blueprint & Conglomerate Operating Whitepaper
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg border border-slate-700 transition-colors"
              title="Print Dossier"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Markdown</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg border border-slate-700 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-h-[80vh] overflow-y-auto">
          
          {/* Executive Mandate */}
          <section className="space-y-3 pb-6 border-b border-slate-800">
            <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest">
              Chapter 01 · Executive Mandate & Purpose
            </div>
            <h3 className="text-xl font-bold text-white">
              Industrial Scope: Governing Autonomous AI Across India's Commercial Giants
            </h3>
            <p>
              In conglomerates such as <strong>Reliance Industries</strong> and the <strong>Adani Group</strong>, AI systems are no longer experimental prototypes—they autonomously control retail dynamic pricing algorithms, 5G subscriber query routing, container customs clearance at deep-water ports, 30-GW renewable energy hybrid dispatch, and merchant credit lines.
            </p>
            <p>
              A breach, biased algorithmic refusal, or prompt injection exploit in these environments directly impacts billions of dollars in enterprise value and triggers immediate statutory liabilities under the <strong>EU AI Act (2024/1689)</strong>, the <strong>India Digital Personal Data Protection (DPDP) Act 2023</strong>, and <strong>Reserve Bank of India (RBI)</strong> regulatory frameworks.
            </p>
            <p>
              <strong>AegisGov AI</strong> was engineered to provide end-to-end, zero-trust algorithmic governance: automating model inventory, data privacy redaction, mathematical fairness audits, live adversarial penetration testing, and continuous high-throughput edge telemetry.
            </p>
          </section>

          {/* Core Parts & Functionality */}
          <section className="space-y-4 pb-6 border-b border-slate-800">
            <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest">
              Chapter 02 · System Architecture & Modular Functionality
            </div>
            <h3 className="text-xl font-bold text-white">
              Exhaustive Breakdown of Every Core Platform Component
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  <span>1. Conglomerate Risk Matrix</span>
                </div>
                <p className="text-slate-400 text-xs">
                  Aggregates federated risk indices across 6 subsidiary operating units, computing a composite Enterprise AI Risk Score from live fairness metrics, adversarial deflection history, and edge concept drift.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>2. ISO 42001 Model Registry</span>
                </div>
                <p className="text-slate-400 text-xs">
                  Standardized model cards with parameter provenance, dataset lineage, carbon footprint tracking (kgCO2e), and a 4-party multi-signature approval stage-gate blocking unauthorized production promotion.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>3. Deep File & Data Inspector</span>
                </div>
                <p className="text-slate-400 text-xs">
                  Real regex parser scanning Indian Aadhaar numbers, PAN cards, credit cards, and cloud secret keys. Dynamically computes Disparate Impact Ratio and Demographic Parity Difference on raw CSV datasets.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4 text-rose-400" />
                  <span>4. Adversarial Red-Teaming Harness</span>
                </div>
                <p className="text-slate-400 text-xs">
                  Automated jailbreak execution environment testing DAN v11 persona swaps, translation traps, payload splitting, and system prompt extraction, verifying sub-50ms guardrail deflection.
                </p>
              </div>
            </div>
          </section>

          {/* Team Roles & Execution Responsibilities */}
          <section className="space-y-4 pb-6 border-b border-slate-800">
            <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest">
              Chapter 03 · Governance Committee Roles & Operational SLAs
            </div>
            <h3 className="text-xl font-bold text-white">
              Every Member Included in the Governance Lifecycle
            </h3>

            <div className="space-y-3">
              {TEAM_ROLES.map((role, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-white text-sm">{role.roleTitle}</span>
                    <span className="font-mono text-indigo-300">{role.assignedLeader}</span>
                  </div>
                  <p className="text-slate-300">{role.responsibilityScope}</p>
                  <div className="text-slate-400">
                    <strong className="text-slate-200">Key Deliverables:</strong> {role.keyDeliverables.join(' · ')}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 border-t border-slate-800/80 text-[11px] font-mono text-slate-500">
                    <span>Power: {role.enforcementPowers}</span>
                    <span className="text-amber-400">SLA: {role.slas}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Hypothetical Data Processing Walkthrough */}
          <section className="space-y-4 pb-6 border-b border-slate-800">
            <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest">
              Chapter 04 · Empirical Hypothetical Data Processing
            </div>
            <h3 className="text-xl font-bold text-white">
              Actual Step-by-Step Execution on Real-World Enterprise Files
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2">
                <h4 className="font-bold text-indigo-300 text-sm">
                  Dataset 1: Jio 5G Credit & KYC Applicant Records (jio_kyc_credit_dataset.csv)
                </h4>
                <p className="text-slate-300">
                  <strong>The Task:</strong> Ingest 15 applicant records with Aadhaar numbers, PAN cards, monthly income, gender, and loan approval status.
                </p>
                <div className="p-3 rounded bg-slate-950 font-mono text-slate-300 space-y-1">
                  <div>• Regex PII Scanner: Detected 15 valid 12-digit Indian Aadhaar numbers and 15 PAN card numbers.</div>
                  <div>• Statutory Impact: DPDP Act 2023 Section 8(1) breach (Data Fiduciary failure to tokenize identifiers).</div>
                  <div>• Fairness Engine: Male Approval Rate = 87.5% (7 of 8), Female Approval Rate = 28.5% (2 of 7).</div>
                  <div className="text-rose-400 font-bold">• Disparate Impact Ratio (DIR) = 0.285 / 0.875 = 0.325 (CRITICAL VIOLATION of 80% Rule).</div>
                </div>
                <p className="text-slate-400">
                  <strong>Achieved Outcome:</strong> The platform quarantined the dataset, revoked the Stage-4 production promotion gate, and flagged an active board remediation ticket with a 2-hour SLA.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2">
                <h4 className="font-bold text-indigo-300 text-sm">
                  Dataset 2: Enterprise LLM Financial Assistant System Prompt (bharatfin_enterprise_prompt.txt)
                </h4>
                <p className="text-slate-300">
                  <strong>The Task:</strong> Audit production system prompt for credential exposure and instruction leakage vulnerabilities.
                </p>
                <div className="p-3 rounded bg-slate-950 font-mono text-slate-300 space-y-1">
                  <div>• Static Credential Scanner: Extracted AWS Access Key ID <code className="text-amber-300">AKIAIOSFODNN7EXAMPLE</code>.</div>
                  <div>• Vulnerability: Direct credential exposure violates ISO/IEC 27001 Clause A.9.4 and SOC-2 Type II standards.</div>
                  <div>• Adversarial Simulation: Tested against instruction reset vectors ("ignore previous instructions").</div>
                </div>
                <p className="text-slate-400">
                  <strong>Achieved Outcome:</strong> Recommended AWS Secrets Manager vault dynamic injection and sandwich prompt defense.
                </p>
              </div>
            </div>
          </section>

          {/* High-Throughput Production Scalability */}
          <section className="space-y-4">
            <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest">
              Chapter 05 · High-Throughput Production Ingress & Scaling
            </div>
            <h3 className="text-xl font-bold text-white">
              Sustaining 1.2 Billion Monthly Requests with 99.999% Availability
            </h3>
            <p className="text-slate-300">
              The platform ingress utilizes kernel-level eBPF XDP filters, Redis cluster token buckets, and Triton inference servers behind global Envoy edge gateways. The system processes an average of 14,200 requests/sec with p95 latency under 38.4ms, deflecting an average of 14,200+ prompt attacks and token leaks daily while maintaining complete cryptographic audit trails in ClickHouse.
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-mono">
            Signed by CAEO Dr. Evelyn Vasquez & CISO Vikramaditya Sengupta
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close Whitepaper
          </button>
        </div>

      </div>
    </div>
  );
};
