import React, { useState } from 'react';
import { AlertTriangle, Plus, CheckCircle, Clock, MapPin, FileText, User } from 'lucide-react';
import { IncidentItem, RiskLevel } from '../types/crowd';
import { RiskBadge } from '../components/RiskBadge';

interface IncidentsPageProps {
  incidents: IncidentItem[];
  onCreateIncident: (data: Partial<IncidentItem>) => void;
  onUpdateStatus: (id: string, status: string, notes?: string) => void;
}

export const IncidentsPage: React.FC<IncidentsPageProps> = ({ incidents, onCreateIncident, onUpdateStatus }) => {
  const [selectedIncident, setSelectedIncident] = useState<IncidentItem | null>(incidents[0] || null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newLocation, setNewLocation] = useState<string>('Gate B');
  const [newNotes, setNewNotes] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateIncident({
      title: newTitle,
      location: newLocation,
      risk_level: 'HIGH' as RiskLevel,
      risk_score: 78,
      detected_factors: ['High Crowd Density', 'Movement Acceleration', 'Gate Convergence'],
      operator_notes: newNotes
    });
    setNewTitle('');
    setNewNotes('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Safety Incidents & Response Operations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Track escalation workflow, operator interventions, and safety incident timelines.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-2 bg-slate-900 text-white text-xs font-bold rounded-md hover:bg-slate-800 shadow-xs flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Incident Report</span>
        </button>
      </div>

      {/* Main Content Layout: Incident List (5 cols) & Details View (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Incident Cards List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Incident Queue</div>

          {incidents.map((inc) => {
            const isSelected = selectedIncident?.id === inc.id;
            return (
              <div
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-white border-blue-500 ring-2 ring-blue-100 shadow-sm' 
                    : 'bg-ops-surface border-ops-border hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-900">{inc.id}</span>
                  <RiskBadge level={inc.risk_level} size="sm" />
                </div>

                <h4 className="text-sm font-bold text-slate-800 mt-1.5 line-clamp-1">{inc.title}</h4>

                <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {inc.location}
                  </span>
                  <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Status: {inc.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Incident Detail Board */}
        <div className="lg:col-span-7 bg-ops-surface border border-ops-border rounded-lg p-6 shadow-2xs">
          {selectedIncident ? (
            <div className="space-y-5">
              {/* Top Details */}
              <div className="flex items-start justify-between border-b border-ops-border pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-slate-500">{selectedIncident.id}</span>
                    <RiskBadge level={selectedIncident.risk_level} score={selectedIncident.risk_score} size="sm" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-1">{selectedIncident.title}</h3>
                  <div className="flex items-center space-x-4 text-xs text-slate-500 mt-1 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Created: {selectedIncident.created_at}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedIncident.location}
                    </span>
                  </div>
                </div>

                {/* Status Switcher Buttons */}
                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-md border border-slate-200">
                  {['Open', 'Acknowledged', 'Investigating', 'Resolved'].map((st) => (
                    <button
                      key={st}
                      onClick={() => onUpdateStatus(selectedIncident.id, st)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded transition-all ${
                        selectedIncident.status === st
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Factors list */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Detected Risk Factors</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedIncident.detected_factors?.map((f) => (
                    <span key={f} className="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded border border-slate-200">
                      • {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Operator Notes */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Operator Notes & Instructions</span>
                </h4>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 leading-relaxed font-medium">
                  {selectedIncident.operator_notes || "No operator notes recorded."}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Incident Activity Timeline</h4>
                <div className="space-y-3 relative pl-4 border-l-2 border-slate-200">
                  {selectedIncident.timeline?.map((t, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                      <div className="text-xs">
                        <span className="font-mono font-bold text-slate-800">{t.time}</span> — {' '}
                        <span className="font-semibold text-slate-700">{t.event}</span>{' '}
                        <span className="text-slate-400 text-[11px]">({t.actor})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">Select an incident to view details.</div>
          )}
        </div>
      </div>

      {/* Modal for creating new incident */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full border border-slate-300 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Create New Safety Incident</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Incident Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Surge detected near Exit A concourse"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Location</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Operator Notes</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={3}
                  placeholder="Enter initial field dispatch instructions..."
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-slate-900 text-white rounded font-bold hover:bg-slate-800"
                >
                  Create Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
