export type RiskTier = 'prohibited' | 'high_risk' | 'transparency_risk' | 'minimal_risk';
export type Subsidiary = 'Reliance Retail' | 'Jio Infocomm' | 'Adani Green Energy' | 'Adani Ports & Logistics' | 'FinTech Bharat' | 'OmniEnergy Corp';

export interface AIModel {
  id: string;
  name: string;
  subsidiary: Subsidiary;
  version: string;
  type: 'LLM' | 'Vision Transformer' | 'Tabular Classifier' | 'Time-Series Forecaster' | 'Multimodal RAG';
  riskTier: RiskTier;
  riskScore: number; // 0 - 100 (lower is safer)
  status: 'production' | 'staging' | 'quarantine' | 'review_required';
  intendedUse: string;
  outOfScopeUse: string;
  trainingDatasetSize: string;
  carbonFootprintKg: number;
  lastAuditedDate: string;
  approvals: {
    ethicsOfficer: boolean;
    cisoSecOps: boolean;
    generalCounsel: boolean;
    mlopsLead: boolean;
  };
  metrics: {
    disparateImpactRatio: number;
    toxicityDeflectionRate: number; // percentage (e.g. 99.4%)
    p95LatencyMs: number;
    driftDelta: number; // percentage
  };
}

export interface PIIViolation {
  id: string;
  type: 'Aadhaar Card' | 'PAN Card' | 'Indian Mobile' | 'Credit Card' | 'Cloud Secret Key' | 'Email' | 'Medical ID';
  valueMasked: string;
  line: number;
  severity: 'critical' | 'high' | 'medium';
  regulatoryImpact: string; // e.g. "DPDP Act 2023 Sec 8(1)"
}

export interface FairnessMetric {
  attribute: string;
  favorableOutcome: string;
  privilegedGroup: string;
  unprivilegedGroup: string;
  privilegedApprovalRate: number;
  unprivilegedApprovalRate: number;
  disparateImpactRatio: number; // unprivileged / privileged
  demographicParityDiff: number;
  isCompliant80Rule: boolean;
}

export interface InjectionVulnerability {
  vector: string;
  severity: 'critical' | 'high' | 'medium';
  pattern: string;
  line?: number;
  description: string;
  mitigation: string;
}

export interface AuditScanResult {
  scanId: string;
  filename: string;
  fileSize: number;
  totalRecordsScanned: number;
  durationMs: number;
  timestamp: string;
  piiViolations: PIIViolation[];
  fairnessAnalysis?: FairnessMetric;
  injectionVulnerabilities: InjectionVulnerability[];
  compositeSafetyScore: number; // 0 - 100
  regulatoryGaps: {
    framework: string;
    clause: string;
    status: 'pass' | 'fail' | 'warning';
    notes: string;
  }[];
  geminiExecutiveSummary?: string;
}

export interface AdversarialAttackTest {
  id: string;
  category: 'Prompt Injection' | 'Jailbreak (DAN)' | 'PII Extraction' | 'System Override' | 'Payload Splitting' | 'Cognitive Overload';
  name: string;
  payload: string;
  expectedDeflection: boolean;
  actualDeflected?: boolean;
  latencyMs?: number;
  guardrailTriggered?: string;
  verdict?: 'DEFLECTED' | 'BYPASSED' | 'ERROR';
  modelOutputSnippet?: string;
}

export interface TelemetryMetricPoint {
  timestamp: string;
  requestsPerSec: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
  guardrailDeflections: number;
  tokenConsumptionRate: number;
  driftIndex: number;
  anomalyDetected: boolean;
}

export interface ComplianceControl {
  id: string;
  framework: 'EU AI Act' | 'NIST AI RMF 1.0' | 'ISO/IEC 42001' | 'India DPDP Act 2023' | 'RBI AI Guidelines';
  section: string;
  title: string;
  description: string;
  mandatory: boolean;
  status: 'compliant' | 'in_remediation' | 'non_compliant' | 'not_applicable';
  auditEvidenceRef: string;
  lastReviewDate: string;
}

export interface TeamMemberRole {
  roleTitle: string;
  assignedLeader: string;
  responsibilityScope: string;
  keyDeliverables: string[];
  enforcementPowers: string;
  slas: string;
}
