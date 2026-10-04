import React from 'react';
import { ShieldCheck, UserCheck, Lock } from 'lucide-react';

export const PrivacyFooter: React.FC = () => {
  return (
    <footer className="mt-8 pt-4 pb-6 border-t border-ops-border text-slate-500 text-xs select-none">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1.5 text-slate-700 font-medium">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>No facial recognition is performed</span>
          </div>

          <div className="flex items-center space-x-1.5 text-slate-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Only aggregate crowd dynamics used</span>
          </div>

          <div className="flex items-center space-x-1.5 text-slate-700 font-medium">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Human operators make all final decisions</span>
          </div>
        </div>

        <div className="text-slate-400 text-[11px]">
          CrowdGuard v1.0 — Early-Warning Decision-Support System
        </div>
      </div>
    </footer>
  );
};
