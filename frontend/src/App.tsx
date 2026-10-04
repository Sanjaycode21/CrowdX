import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { Sidebar, NavTab } from './components/Sidebar';
import { PrivacyFooter } from './components/PrivacyFooter';

import { OverviewPage } from './pages/OverviewPage';
import { LiveMonitorPage } from './pages/LiveMonitorPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { AlertsPage } from './pages/AlertsPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { EvaluationPage } from './pages/EvaluationPage';
import { ConfigurationPage } from './pages/ConfigurationPage';
import { SystemLogsPage } from './pages/SystemLogsPage';

import { 
  fetchCurrentRisk, fetchAlerts, fetchIncidents, 
  fetchMetrics, fetchConfig, fetchLogs, 
  acknowledgeAlert, escalateAlert, createIncident, 
  updateIncidentStatus, updateConfig, postScenario 
} from './services/api';
import { RiskCurrentData, AlertItem, IncidentItem, EvaluationMetrics, ConfigData, LogEntry } from './types/crowd';
import { DemoScenario, generateSimulatedData } from './services/demoSimulator';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [mode, setMode] = useState<'AI' | 'RULE'>('AI');
  const [scenario, setScenario] = useState<DemoScenario>('Normal Crowd');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(true);

  // Core Data States
  const [currentRisk, setCurrentRisk] = useState<RiskCurrentData>(generateSimulatedData('Normal Crowd', 'AI'));
  const [history, setHistory] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [incidents, setIncidents] = useState<IncidentItem[]>([]);
  const [metrics, setMetrics] = useState<EvaluationMetrics | null>(null);
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Initial Data Load
  useEffect(() => {
    async function loadInitial() {
      const a = await fetchAlerts();
      setAlerts(a);
      const inc = await fetchIncidents();
      setIncidents(inc);
      const m = await fetchMetrics();
      setMetrics(m);
      const cfg = await fetchConfig();
      setConfig(cfg);
      const l = await fetchLogs();
      setLogs(l);
    }
    loadInitial();
  }, []);

  // Real-time Tick Loop (1 second sampling)
  useEffect(() => {
    if (!isAnalyzing) return;

    const interval = setInterval(async () => {
      const data = await fetchCurrentRisk(scenario, mode);
      setCurrentRisk(data);

      const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
      setHistory(prev => {
        const next = [...prev, {
          timestamp: timeStr,
          score: data.score,
          level: data.level,
          people_count: data.people_count,
          density: data.density_ppm2,
          speed: data.speed_ms,
          acceleration: data.acceleration_ms2,
          turbulence: data.turbulence_pct,
          direction_entropy: data.direction_entropy_pct,
          convergence: data.convergence_pct
        }];
        return next.slice(-25); // keep last 25 ticks
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isAnalyzing, scenario, mode]);

  // Mode Switch Handler
  const handleToggleMode = async (newMode: 'AI' | 'RULE') => {
    setMode(newMode);
    await postScenario(scenario, newMode);
  };

  // Scenario Switch Handler
  const handleSelectScenario = async (newScenario: DemoScenario) => {
    setScenario(newScenario);
    await postScenario(newScenario, mode);
    const data = await fetchCurrentRisk(newScenario, mode);
    setCurrentRisk(data);
  };

  // Alert Actions
  const handleAcknowledgeAlert = async (id: string) => {
    await acknowledgeAlert(id);
    const a = await fetchAlerts();
    setAlerts(a);
  };

  const handleEscalateAlert = async (id: string) => {
    await escalateAlert(id);
    const a = await fetchAlerts();
    setAlerts(a);
  };

  // Incident Actions
  const handleCreateIncident = async (data: Partial<IncidentItem>) => {
    await createIncident(data);
    const inc = await fetchIncidents();
    setIncidents(inc);
  };

  const handleUpdateIncidentStatus = async (id: string, status: string, notes?: string) => {
    await updateIncidentStatus(id, status, notes);
    const inc = await fetchIncidents();
    setIncidents(inc);
  };

  // Config Actions
  const handleSaveConfig = async (updated: Partial<ConfigData>) => {
    await updateConfig(updated);
    const cfg = await fetchConfig();
    setConfig(cfg);
  };

  // Log Refresh Action
  const handleRefreshLogs = async () => {
    const l = await fetchLogs();
    setLogs(l);
  };

  const activeAlert = alerts.find(a => a.status === 'Active' && (a.level === 'HIGH' || a.level === 'CRITICAL'));

  return (
    <div className="min-h-screen flex flex-col bg-ops-bg text-ops-text select-none">
      {/* Top Header */}
      <TopBar 
        mode={mode}
        onToggleMode={handleToggleMode}
        fps={currentRisk.fps || (mode === 'AI' ? 29.4 : 46.2)}
        onOpenSettings={() => setActiveTab('configuration')}
      />

      {/* Main Body Layout */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar 
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          activeAlertCount={alerts.filter(a => a.status === 'Active').length}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'overview' && (
            <OverviewPage
              data={currentRisk}
              activeAlert={activeAlert}
              history={history}
              onAcknowledgeAlert={handleAcknowledgeAlert}
              onEscalateAlert={handleEscalateAlert}
              onNavigateToMonitor={() => setActiveTab('monitor')}
            />
          )}

          {activeTab === 'monitor' && (
            <LiveMonitorPage
              data={currentRisk}
              scenario={scenario}
              onSelectScenario={handleSelectScenario}
              isAnalyzing={isAnalyzing}
              onTogglePlay={() => setIsAnalyzing(!isAnalyzing)}
            />
          )}

          {activeTab === 'analysis' && (
            <AnalysisPage history={history} />
          )}

          {activeTab === 'alerts' && (
            <AlertsPage
              alerts={alerts}
              onAcknowledge={handleAcknowledgeAlert}
              onEscalate={handleEscalateAlert}
            />
          )}

          {activeTab === 'incidents' && (
            <IncidentsPage
              incidents={incidents}
              onCreateIncident={handleCreateIncident}
              onUpdateStatus={handleUpdateIncidentStatus}
            />
          )}

          {activeTab === 'evaluation' && metrics && (
            <EvaluationPage metrics={metrics} />
          )}

          {activeTab === 'configuration' && config && (
            <ConfigurationPage
              config={config}
              onSaveConfig={handleSaveConfig}
            />
          )}

          {activeTab === 'logs' && (
            <SystemLogsPage
              logs={logs}
              onRefresh={handleRefreshLogs}
            />
          )}

          {/* Privacy & Scope Disclaimer Footer */}
          <PrivacyFooter />
        </main>
      </div>
    </div>
  );
};
