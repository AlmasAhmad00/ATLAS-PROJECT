/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GlobalHealthBrief {
  id: string;
  source: string;
  title: string;
  summary: string;
  riskLevel: 'low' | 'moderate' | 'high';
  region: string;
  timestamp: Date;
}

export type UserRole = 'principal' | 'teacher' | 'guard' | 'student' | 'warden' | 'clerk' | 'counselor';

export interface StressCheck {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  level: number; // 1: Great, 2: Good, 3: Okay, 4: Stressed, 5: Exhausted
  status: 'pending' | 'resolved' | 'intervention-logged';
  timestamp: Date;
}

export interface User {
  id: string;
  fullName: string;
  role: UserRole;
  email?: string;
  grade?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  hydrationLevel?: number; // 0 to 100
  totalWaterIntake?: number; // in ml
}

export interface WaterLog {
  id: string;
  studentId: string;
  amountMl: number;
  imageUrl: string;
  timestamp: Date;
  isVerified: boolean;
  status: 'verified' | 'flagged' | 'pending';
  aiAnalysis?: string;
}

export interface TransportationSlot {
  id: string;
  time: string;
  maxCapacity: number;
  assignedStudentIds: string[];
  status: 'scheduled' | 'boarding' | 'in-transit' | 'arrived';
}

export type ClinicVisitType = 'fever' | 'respiratory' | 'eye-infection' | 'rash' | 'injury' | 'mental-health' | 'fatigue';

export interface ClinicVisit {
  id: string;
  studentId: string;
  studentName: string;
  studentGrade?: string;
  referrerId: string;
  reason: string;
  visitType?: ClinicVisitType;
  symptoms?: string[]; // Added: specific symptoms like nausea, vomiting
  status: 'pending' | 'in-progress' | 'discharged' | 'referred-to-clinic' | 'quarantined';
  timestamp: Date;
  transportationSlotId?: string;
}

export interface HealthForecast {
  id: string;
  title: string;
  symptoms: string[];
  suspectedDisease: string;
  affectedCount: number;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  description: string;
  suggestedAction: string;
  timestamp: Date;
}

export interface MiloChatMessage {
  role: 'user' | 'model';
  text: string;
  emoji?: string;
  timestamp: Date;
}

export interface MiloSession {
  studentId: string;
  messages: MiloChatMessage[];
}

export interface Zone {
  id: string;
  name: string;
  type: 'indoor' | 'outdoor';
  temperature: number;
  humidity: number;
}

export type HealthStatus = 'green' | 'yellow' | 'red';

export interface HealthScan {
  id: string;
  studentId: string;
  status: HealthStatus;
  features: string[]; // ['Ocular Redness', 'Respiratory Distress', 'Epidermal Rash']
  vitalSigns: {
    temperature: number;
    breathingRate: number; // breaths per minute
    vocalAffect?: 'low' | 'normal' | 'anxious';
  };
  timestamp: Date;
}

export interface PedagogicalAction {
  actionId: string;
  zoneId: string;
  teacherId: string;
  suggestedStyle: string;
  actionTaken: string;
  timestamp: Date;
}

export interface HygieneLog {
  id: string;
  zoneId: string;
  usageCount: number;
  type: 'sanitizer' | 'handwash';
  timestamp: Date;
}

export interface ClinicInventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
}

export interface OutbreakAlert {
  id: string;
  type: 'symptom-cluster' | 'low-hygiene' | 'environmental-hazard' | 'wellness-crisis';
  severity: 'moderate' | 'high' | 'critical';
  title: string;
  description: string;
  affectedGroup: string; // e.g. "Grade 4 KA 2"
  suggestedAction: string;
  timestamp: Date;
}
