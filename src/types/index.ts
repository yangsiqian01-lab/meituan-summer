export type Role = 'patient' | 'family';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar?: string;
}

export type TimeSlot = 'morning' | 'noon' | 'evening';

export interface MedicationPlan {
  id: string;
  name: string;
  dosage: string; // 每次用量，如 "1片"
  times: TimeSlot[]; // 每日服药时间段
  inventory: number; // 当前库存总量
  inventoryThreshold: number; // 库存预警阈值
  unit: string; // 单位，如 "片"、"粒"
}

export interface MedicationRecord {
  id: string;
  planId: string;
  date: string; // YYYY-MM-DD
  timeSlot: TimeSlot;
  taken: boolean;
  takenAt?: string; // 实际服药时间戳
}

export interface FollowUp {
  id: string;
  hospital: string;
  department: string;
  doctor: string;
  lastVisitDate: string; // YYYY-MM-DD
  nextVisitDate: string; // YYYY-MM-DD
  notes?: string;
}
