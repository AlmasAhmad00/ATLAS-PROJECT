import React, { useState, useMemo } from 'react';
import { User } from '../types';
import { UserPlus, CheckCircle } from 'lucide-react';

interface ClinicReferralFormProps {
  students: User[];
  onAddVisit: (studentId: string, reason: string, symptoms?: string[]) => void;
  description?: string;
  allGrades?: string[];
}

const COMMON_SYMPTOMS = [
  'Nausea',
  'Vomiting',
  'Stomach Ache',
  'Diarrhea',
  'High Fever',
  'Dizziness',
  'Sore Throat',
  'Coughing'
];

export const ClinicReferralForm: React.FC<ClinicReferralFormProps> = ({ 
  students, 
  onAddVisit,
  description = "Submit a student for clinic evaluation. This will notify the clerk for transportation arrangement.",
  allGrades
}) => {
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [reason, setReason] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const availableGrades = useMemo(() => {
    if (allGrades && allGrades.length > 0) return [...allGrades].sort();
    const grades = new Set(students.map(s => s.grade).filter(Boolean));
    return Array.from(grades).sort();
  }, [students, allGrades]);

  const filteredStudents = useMemo(() => {
    if (!selectedGrade) return [];
    return students.filter(s => s.grade === selectedGrade);
  }, [selectedGrade, students]);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom) 
        : [...prev, symptom]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !reason) return;
    
    onAddVisit(selectedStudent, reason, selectedSymptoms);
    setSelectedStudent('');
    setReason('');
    setSelectedSymptoms([]);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs text-slate-500 font-medium whitespace-pre-wrap">
        {description}
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block mb-2">Select Class</label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={selectedGrade}
            onChange={(e) => {
              setSelectedGrade(e.target.value);
              setSelectedStudent('');
            }}
            required
          >
            <option value="">Choose a class...</option>
            {availableGrades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block mb-2">Select Student</label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            disabled={!selectedGrade}
            required
          >
            <option value="">{selectedGrade ? 'Choose student...' : 'Select class first'}</option>
            {filteredStudents.map(s => (
              <option key={s.id} value={s.id}>{s.fullName}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block mb-3">Associated Symptoms (AI Detection)</label>
        <div className="grid grid-cols-2 gap-2">
          {COMMON_SYMPTOMS.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSymptom(s)}
              className={`text-left px-3 py-2 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center justify-between border ${
                selectedSymptoms.includes(s)
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
              }`}
            >
              {s}
              {selectedSymptoms.includes(s) && <CheckCircle className="w-3 h-3" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block mb-2">Observations/Notes</label>
        <textarea 
          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm h-24 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="E.g. Student looks pale, complained of stomach pain..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
      </div>

      <button 
        type="submit"
        className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold text-sm tracking-wide shadow-lg hover:bg-red-700 transition transform active:scale-95 flex items-center justify-center gap-2"
      >
        <UserPlus className="w-5 h-5" />
        Register to Clinic
      </button>

      {isSuccess && (
        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-xl animate-in fade-in slide-in-from-top-1">
          <CheckCircle className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Referral Submitted Successfully</span>
        </div>
      )}
    </form>
  );
};
