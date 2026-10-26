import { AuditScanResult, PIIViolation, FairnessMetric, InjectionVulnerability } from '../types/governance';

// Indian Aadhaar Regex: 12 digits (starting with 2-9), optional space every 4 digits
const AADHAAR_REGEX = /\b[2-9]\d{3}\s?\d{4}\s?\d{4}\b/g;

// Indian Income Tax PAN Card: 5 uppercase letters, 4 digits, 1 uppercase letter
const PAN_REGEX = /\b[A-Z]{5}[0-9]{4}[A-Z]\b/g;

// Indian Mobile Number: +91 or 91 optional, starts with 6-9, 10 digits
const INDIAN_PHONE_REGEX = /\b(?:\+91|91)?[6-9]\d{9}\b/g;

// Standard Credit Card (Visa, MC, Amex)
const CREDIT_CARD_REGEX = /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9]{2})[0-9]{12}|3[47][0-9]{13})\b/g;

// AWS Access Key ID
const AWS_KEY_REGEX = /\bAKIA[0-9A-Z]{16}\b/g;

// Generic Secret / Bearer / Token
const SECRET_TOKEN_REGEX = /(?:sk-[a-zA-Z0-9]{32,}|ghp_[a-zA-Z0-9]{36}|bearer\s+[a-zA-Z0-9\-._~+/]+=*)/gi;

// Email
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

// Prompt Injection Triggers
const INJECTION_PATTERNS = [
  {
    pattern: /ignore\s+(all\s+)?previous\s+instructions/i,
    vector: 'Instruction Override',
    severity: 'critical' as const,
    description: 'Attempts to reset model operating boundaries and erase system safety prompt.',
    mitigation: 'Implement architectural sandwich defense and prompt guard filter before tokenization.',
  },
  {
    pattern: /(?:do\s+anything\s+now|DAN\s+mode|developer\s+mode|uncensored\s+mode)/i,
    vector: 'Persona Jailbreak (DAN)',
    severity: 'critical' as const,
    description: 'Adversarial jailbreak attempting to evoke a persona unconstrained by regulatory guidelines.',
    mitigation: 'System prompt hard-clamping with semantic intent classification at API gateway.',
  },
  {
    pattern: /(?:AKIA[0-9A-Z]{16}|secret_key|password\s*[:=])/i,
    vector: 'Credential / Secret Ingestion',
    severity: 'critical' as const,
    description: 'Raw API tokens or credentials embedded directly into prompt or training data context.',
    mitigation: 'Pre-flight DLP token scrubber and AWS Secrets Manager dynamic vault integration.',
  },
  {
    pattern: /(?:translate\s+.*and\s+execute|in\s+base64\s+decode)/i,
    vector: 'Multi-Language / Encoding Obfuscation',
    severity: 'high' as const,
    description: 'Uses secondary language or encoding translation to bypass primary keyword filters.',
    mitigation: 'Normalize all cross-lingual inputs through canonical multilingual safety classifier.',
  },
  {
    pattern: /(?:dump|output|reveal|leak)\s+(?:the\s+)?(?:verbatim\s+)?system\s+(?:prompt|instructions)/i,
    vector: 'System Prompt Extraction',
    severity: 'high' as const,
    description: 'Adversary probes to leak proprietary intellectual property and system instructions.',
    mitigation: 'Negative output guardrails suppressing matches to system directive hashes.',
  },
];

function maskValue(val: string): string {
  if (val.length <= 4) return '****';
  return val.slice(0, 2) + '*'.repeat(Math.max(4, val.length - 4)) + val.slice(-2);
}

export function performDeepAuditScan(filename: string, content: string): AuditScanResult {
  const startTime = performance.now();
  const lines = content.split(/\r?\n/);
  const piiViolations: PIIViolation[] = [];
  const injectionVulnerabilities: InjectionVulnerability[] = [];

  // Line-by-line scanning
  lines.forEach((lineText, idx) => {
    const lineNum = idx + 1;

    // Aadhaar Check
    const aadhaarMatches = lineText.match(AADHAAR_REGEX);
    if (aadhaarMatches) {
      aadhaarMatches.forEach((match) => {
        // filter obvious false positives (e.g. 0000 0000 0000)
        if (!/^(\d)\1{3}\s?\1{4}\s?\1{4}$/.test(match)) {
          piiViolations.push({
            id: `PII-AAD-${lineNum}-${Math.random().toString(36).substring(2, 6)}`,
            type: 'Aadhaar Card',
            valueMasked: maskValue(match),
            line: lineNum,
            severity: 'critical',
            regulatoryImpact: 'DPDP Act 2023 Sec 8(1) & Aadhaar Act 2016 Reg 16A',
          });
        }
      });
    }

    // PAN Check
    const panMatches = lineText.match(PAN_REGEX);
    if (panMatches) {
      panMatches.forEach((match) => {
        piiViolations.push({
          id: `PII-PAN-${lineNum}-${Math.random().toString(36).substring(2, 6)}`,
          type: 'PAN Card',
          valueMasked: maskValue(match),
          line: lineNum,
          severity: 'high',
          regulatoryImpact: 'IT Act 2000 Sec 43A & DPDP Act 2023 Sec 8',
        });
      });
    }

    // Mobile Check
    const phoneMatches = lineText.match(INDIAN_PHONE_REGEX);
    if (phoneMatches) {
      phoneMatches.forEach((match) => {
        // exclude if it looks like standard large integers that aren't phone
        if (match.length >= 10 && match.length <= 13) {
          piiViolations.push({
            id: `PII-TEL-${lineNum}-${Math.random().toString(36).substring(2, 6)}`,
            type: 'Indian Mobile',
            valueMasked: maskValue(match),
            line: lineNum,
            severity: 'medium',
            regulatoryImpact: 'DPDP Act 2023 Personal Data Protection',
          });
        }
      });
    }

    // Credit Card Check
    const ccMatches = lineText.match(CREDIT_CARD_REGEX);
    if (ccMatches) {
      ccMatches.forEach((match) => {
        piiViolations.push({
          id: `PII-CC-${lineNum}-${Math.random().toString(36).substring(2, 6)}`,
          type: 'Credit Card',
          valueMasked: maskValue(match),
          line: lineNum,
          severity: 'critical',
          regulatoryImpact: 'PCI-DSS v4.0 Req 3.4 & RBI Card Tokenization Norms',
        });
      });
    }

    // AWS & Secret Check
    const awsMatches = lineText.match(AWS_KEY_REGEX);
    if (awsMatches) {
      awsMatches.forEach((match) => {
        piiViolations.push({
          id: `PII-KEY-${lineNum}-${Math.random().toString(36).substring(2, 6)}`,
          type: 'Cloud Secret Key',
          valueMasked: maskValue(match),
          line: lineNum,
          severity: 'critical',
          regulatoryImpact: 'ISO/IEC 27001 A.9.4 & SOC 2 Type II Security',
        });
      });
    }

    // Email Check
    const emailMatches = lineText.match(EMAIL_REGEX);
    if (emailMatches) {
      emailMatches.forEach((match) => {
        piiViolations.push({
          id: `PII-EML-${lineNum}-${Math.random().toString(36).substring(2, 6)}`,
          type: 'Email',
          valueMasked: maskValue(match),
          line: lineNum,
          severity: 'medium',
          regulatoryImpact: 'DPDP Act 2023 Direct Identifier',
        });
      });
    }

    // Injection vulnerability check
    INJECTION_PATTERNS.forEach((inj) => {
      if (inj.pattern.test(lineText)) {
        injectionVulnerabilities.push({
          vector: inj.vector,
          severity: inj.severity,
          pattern: inj.pattern.source,
          line: lineNum,
          description: inj.description,
          mitigation: inj.mitigation,
        });
      }
    });
  });

  // Fairness Analysis for CSV data
  let fairnessAnalysis: FairnessMetric | undefined;
  if (filename.endsWith('.csv') || content.includes(',')) {
    fairnessAnalysis = evaluateCsvFairness(lines);
  }

  // Composite Safety Score (0 - 100, where 100 is pristine compliance)
  let scoreDeduction = 0;
  scoreDeduction += piiViolations.filter((v) => v.severity === 'critical').length * 15;
  scoreDeduction += piiViolations.filter((v) => v.severity === 'high').length * 8;
  scoreDeduction += piiViolations.filter((v) => v.severity === 'medium').length * 4;
  scoreDeduction += injectionVulnerabilities.filter((v) => v.severity === 'critical').length * 20;
  scoreDeduction += injectionVulnerabilities.filter((v) => v.severity === 'high').length * 10;

  if (fairnessAnalysis && !fairnessAnalysis.isCompliant80Rule) {
    scoreDeduction += 25; // Serious bias penalty
  }

  const compositeSafetyScore = Math.max(12, Math.min(100, Math.round(100 - scoreDeduction)));

  // Regulatory Gap Cross-Reference
  const regulatoryGaps = [
    {
      framework: 'EU AI Act',
      clause: 'Article 10 (Data Governance & Bias Scrutiny)',
      status: (fairnessAnalysis && !fairnessAnalysis.isCompliant80Rule ? 'fail' : 'pass') as 'fail' | 'pass',
      notes: fairnessAnalysis && !fairnessAnalysis.isCompliant80Rule
        ? `Disparate Impact Ratio (${fairnessAnalysis.disparateImpactRatio.toFixed(2)}) violates 80% parity threshold across protected groups.`
        : 'Dataset demonstrates balanced demographic representation.',
    },
    {
      framework: 'India DPDP Act 2023',
      clause: 'Section 8 (Data Fiduciary Safeguards & PII Hygiene)',
      status: (piiViolations.length > 0 ? 'fail' : 'pass') as 'fail' | 'pass',
      notes: piiViolations.length > 0
        ? `Detected ${piiViolations.length} unmasked Indian statutory identifiers (Aadhaar/PAN/Phones) without encrypted tokenization.`
        : 'Zero unmasked PII tokens detected.',
    },
    {
      framework: 'NIST AI RMF 1.0',
      clause: 'MEASURE 2.7 (Adversarial Robustness & Jailbreak Protection)',
      status: (injectionVulnerabilities.length > 0 ? 'fail' : 'pass') as 'fail' | 'pass',
      notes: injectionVulnerabilities.length > 0
        ? `Unmitigated prompt injection signatures detected (${injectionVulnerabilities.map((i) => i.vector).join(', ')}).`
        : 'Prompt constructs satisfy NIST adversarial hardness benchmarks.',
    },
    {
      framework: 'ISO/IEC 42001:2023',
      clause: 'Clause A.7.4 (Control of Third-Party & Embedded Secrets)',
      status: (piiViolations.some((p) => p.type === 'Cloud Secret Key') ? 'fail' : 'pass') as 'fail' | 'pass',
      notes: piiViolations.some((p) => p.type === 'Cloud Secret Key')
        ? 'CRITICAL: Static AWS cloud credential found embedded in prompt artifact.'
        : 'No exposed cryptographic secrets found.',
    },
  ];

  const durationMs = Math.round(performance.now() - startTime);

  return {
    scanId: `SCAN-${Date.now().toString(36).toUpperCase()}`,
    filename,
    fileSize: new Blob([content]).size,
    totalRecordsScanned: lines.length,
    durationMs,
    timestamp: new Date().toISOString(),
    piiViolations,
    fairnessAnalysis,
    injectionVulnerabilities,
    compositeSafetyScore,
    regulatoryGaps,
  };
}

function evaluateCsvFairness(lines: string[]): FairnessMetric | undefined {
  if (lines.length < 3) return undefined;
  const header = lines[0].split(',').map((h) => h.trim().toLowerCase());

  // Find gender or protected demographic column
  const genderColIdx = header.findIndex((h) => h.includes('gender') || h.includes('sex'));
  // Find decision column (loan_approved, approved, label, decision, target)
  const decisionColIdx = header.findIndex(
    (h) => h.includes('approved') || h.includes('approval') || h.includes('decision') || h.includes('label') || h.includes('target')
  );

  if (genderColIdx === -1 || decisionColIdx === -1) {
    return undefined;
  }

  let maleCount = 0;
  let maleApproved = 0;
  let femaleCount = 0;
  let femaleApproved = 0;

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map((c) => c.trim());
    if (row.length <= Math.max(genderColIdx, decisionColIdx)) continue;

    const gender = row[genderColIdx].toLowerCase();
    const approvedVal = row[decisionColIdx].toLowerCase();
    const isApproved = approvedVal === '1' || approvedVal === 'true' || approvedVal === 'yes' || approvedVal === 'approved';

    if (gender === 'male' || gender === 'm') {
      maleCount++;
      if (isApproved) maleApproved++;
    } else if (gender === 'female' || gender === 'f') {
      femaleCount++;
      if (isApproved) femaleApproved++;
    }
  }

  if (maleCount === 0 || femaleCount === 0) return undefined;

  const maleApprovalRate = maleApproved / maleCount;
  const femaleApprovalRate = femaleApproved / femaleCount;

  // Disparate Impact Ratio = Unprivileged Rate / Privileged Rate
  const disparateImpactRatio = femaleApprovalRate / (maleApprovalRate || 1);
  const demographicParityDiff = Math.abs(maleApprovalRate - femaleApprovalRate);
  const isCompliant80Rule = disparateImpactRatio >= 0.8;

  return {
    attribute: 'Gender (Self-Reported)',
    favorableOutcome: 'Loan / Credit Approval',
    privilegedGroup: `Male (Approval Rate: ${(maleApprovalRate * 100).toFixed(1)}%)`,
    unprivilegedGroup: `Female (Approval Rate: ${(femaleApprovalRate * 100).toFixed(1)}%)`,
    privilegedApprovalRate: maleApprovalRate,
    unprivilegedApprovalRate: femaleApprovalRate,
    disparateImpactRatio,
    demographicParityDiff,
    isCompliant80Rule,
  };
}
