import React from 'react';
import { UserRole } from '../types';
import { Shield, BookOpen, User as UserIcon, Building2, UserCircle } from 'lucide-react';

interface RoleSelectorProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ currentRole, onRoleChange }) => {
  const roles: { role: UserRole; icon: React.ReactNode; label: string }[] = [
    { role: 'principal', icon: <Building2 className="w-4 h-4" />, label: 'Principal' },
    { role: 'teacher', icon: <BookOpen className="w-4 h-4" />, label: 'Teacher' },
    { role: 'clerk', icon: <Building2 className="w-4 h-4" />, label: 'Clerk' },
    { role: 'guard', icon: <Shield className="w-4 h-4" />, label: 'Guard' },
    { role: 'warden', icon: <UserCircle className="w-4 h-4" />, label: 'Warden' },
    { role: 'counselor', icon: <UserCircle className="w-4 h-4" />, label: 'Counselor' },
    { role: 'student', icon: <UserIcon className="w-4 h-4" />, label: 'Student' },
  ];

  return (
    <div className="flex gap-2 p-1 glass rounded-full self-center">
      {roles.map(({ role, icon, label }) => (
        <button
          key={role}
          onClick={() => onRoleChange(role)}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
            currentRole === role
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:bg-white/50'
          }`}
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  );
};
