/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header, ActiveTab } from './components/Header';
import { ExecutiveMatrixView } from './components/ExecutiveMatrixView';
import { ModelRegistryView } from './components/ModelRegistryView';
import { FileAuditView } from './components/FileAuditView';
import { AdversarialRedTeamView } from './components/AdversarialRedTeamView';
import { EdgeTelemetryView } from './components/EdgeTelemetryView';
import { ComplianceFrameworksView } from './components/ComplianceFrameworksView';
import { IndustrialReportModal } from './components/IndustrialReportModal';
import { TeamRolesModal } from './components/TeamRolesModal';
import { ENTERPRISE_MODELS } from './data/mockEnterpriseData';
import { AIModel, AuditScanResult } from './types/governance';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('executive');
  const [models, setModels] = useState<AIModel[]>(ENTERPRISE_MODELS);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [lastScanResult, setLastScanResult] = useState<AuditScanResult | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);

  const handleUpdateModel = (updated: AIModel) => {
    setModels((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleSelectModel = (model: AIModel | null) => {
    setSelectedModel(model);
    if (model) {
      setActiveTab('models');
    }
  };

  // Count active audit alerts
  const alertCount = (lastScanResult?.piiViolations.length || 0) + (lastScanResult?.injectionVulnerabilities.length || 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-600/30 selection:text-indigo-200">
      
      {/* Top Bar Contract Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenTeam={() => setIsTeamOpen(true)}
        auditAlertCount={alertCount}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {activeTab === 'executive' && (
          <ExecutiveMatrixView
            models={models}
            onNavigateTab={setActiveTab}
            onSelectModel={handleSelectModel}
            onOpenReport={() => setIsReportOpen(true)}
          />
        )}

        {activeTab === 'models' && (
          <ModelRegistryView
            models={models}
            onUpdateModel={handleUpdateModel}
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
          />
        )}

        {activeTab === 'audit' && (
          <FileAuditView
            lastScanResult={lastScanResult}
            onScanComplete={setLastScanResult}
          />
        )}

        {activeTab === 'redteam' && (
          <AdversarialRedTeamView />
        )}

        {activeTab === 'telemetry' && (
          <EdgeTelemetryView />
        )}

        {activeTab === 'compliance' && (
          <ComplianceFrameworksView
            onOpenReport={() => setIsReportOpen(true)}
          />
        )}

      </main>

      {/* Clean Enterprise Footer (anti-slop, no telemetry tickers) */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">AegisGov AI</span>
            <span>·</span>
            <span>Enterprise AI Governance & Risk Intelligence Platform</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span>ISO/IEC 42001:2023 Stage-2 Accredited</span>
            <span>·</span>
            <span>EU AI Act (2024/1689) Conformance Certified</span>
            <span>·</span>
            <span>DPDP Act 2023 Tokenizer Enclave Active</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <IndustrialReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

      <TeamRolesModal
        isOpen={isTeamOpen}
        onClose={() => setIsTeamOpen(false)}
      />

    </div>
  );
}
