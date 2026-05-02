import React from 'react';
import { BackgroundBlobs } from './BackgroundBlobs';
import { RoleSelector } from './RoleSelector';
import { UserRole, HealthForecast } from '../types';
import { Logo } from './Logo';
import { HealthAlertBanner } from './HealthAlertBanner';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  healthForecasts: HealthForecast[];
  onDismissForecast?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, role, onRoleChange, healthForecasts, onDismissForecast }) => {
  return (
    <div className="relative min-h-screen">
      <BackgroundBlobs />
      <header className="sticky top-0 z-40 w-full p-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Logo />
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-tight">
              ATLAS
            </h1>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
              <span className="text-slate-600">A</span>daptive <span className="text-slate-600">T</span>riage & <span className="text-slate-600">L</span>earner <span className="text-slate-600">A</span>ssurance <span className="text-slate-600">S</span>ystem • By Katwoo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:block text-right pr-6 border-r border-slate-100">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest leading-none mb-1">Current Outside</p>
            <p className="text-lg font-bold text-orange-600 leading-none">34.2°C <span className="text-xs font-normal text-slate-400 italic ml-1">Rising</span></p>
          </div>
          <RoleSelector currentRole={role} onRoleChange={onRoleChange} />
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4 lg:p-8">
        <HealthAlertBanner forecasts={healthForecasts} onClose={onDismissForecast} />
        {children}
      </main>
    </div>
  );
};
