import { create } from 'zustand';
import { format, addDays, subDays } from 'date-fns';
import { User, MedicationPlan, MedicationRecord, FollowUp, TimeSlot } from '../types';

interface AppState {
  currentUser: User;
  plans: MedicationPlan[];
  records: MedicationRecord[];
  followUps: FollowUp[];
  switchRole: () => void;
  takeMedication: (planId: string, date: string, timeSlot: TimeSlot) => void;
  refillInventory: (planId: string, amount: number) => void;
  renewFollowUp: (followUpId: string, newDate: string) => void;
}

const today = format(new Date(), 'yyyy-MM-dd');
const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

export const useAppStore = create<AppState>((set) => ({
  currentUser: { id: 'u1', name: '李大爷', role: 'patient' },
  
  plans: [
    {
      id: 'p1',
      name: '阿托伐他汀钙片',
      dosage: '1片',
      times: ['evening'],
      inventory: 6,
      inventoryThreshold: 7,
      unit: '片'
    },
    {
      id: 'p2',
      name: '二甲双胍',
      dosage: '1片',
      times: ['morning', 'evening'],
      inventory: 28,
      inventoryThreshold: 14,
      unit: '片'
    },
    {
      id: 'p3',
      name: '苯磺酸氨氯地平片',
      dosage: '1片',
      times: ['morning'],
      inventory: 12,
      inventoryThreshold: 7,
      unit: '片'
    }
  ],

  records: [
    // 昨天的记录
    { id: 'r1', planId: 'p2', date: yesterday, timeSlot: 'morning', taken: true, takenAt: `${yesterday} 08:00` },
    { id: 'r2', planId: 'p3', date: yesterday, timeSlot: 'morning', taken: true, takenAt: `${yesterday} 08:05` },
    { id: 'r3', planId: 'p1', date: yesterday, timeSlot: 'evening', taken: true, takenAt: `${yesterday} 19:30` },
    { id: 'r4', planId: 'p2', date: yesterday, timeSlot: 'evening', taken: false }, // 漏服
  ],

  followUps: [
    {
      id: 'f1',
      hospital: '市中心医院',
      department: '心内科',
      doctor: '张主任',
      lastVisitDate: format(subDays(new Date(), 20), 'yyyy-MM-dd'),
      nextVisitDate: format(addDays(new Date(), 8), 'yyyy-MM-dd'),
      notes: '记得带上近期的血压记录本'
    },
    {
      id: 'f2',
      hospital: '社区卫生服务中心',
      department: '内分泌科',
      doctor: '王医生',
      lastVisitDate: format(subDays(new Date(), 60), 'yyyy-MM-dd'),
      nextVisitDate: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
      notes: '空腹抽血查血糖'
    }
  ],

  switchRole: () => set((state) => ({
    currentUser: state.currentUser.role === 'patient' 
      ? { id: 'u2', name: '李大爷家属', role: 'family' }
      : { id: 'u1', name: '李大爷', role: 'patient' }
  })),

  takeMedication: (planId, date, timeSlot) => set((state) => {
    // 检查是否已打卡
    const exists = state.records.find(r => r.planId === planId && r.date === date && r.timeSlot === timeSlot);
    if (exists) return state;

    // 扣减库存，简单逻辑：每次打卡扣减 1
    const updatedPlans = state.plans.map(p => {
      if (p.id === planId && p.inventory > 0) {
        return { ...p, inventory: p.inventory - 1 };
      }
      return p;
    });

    const newRecord: MedicationRecord = {
      id: Date.now().toString(),
      planId,
      date,
      timeSlot,
      taken: true,
      takenAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    };

    return {
      plans: updatedPlans,
      records: [...state.records, newRecord]
    };
  }),

  refillInventory: (planId, amount) => set((state) => ({
    plans: state.plans.map(p => p.id === planId ? { ...p, inventory: p.inventory + amount } : p)
  })),

  renewFollowUp: (followUpId, newDate) => set((state) => ({
    followUps: state.followUps.map(f => 
      f.id === followUpId ? { ...f, lastVisitDate: format(new Date(), 'yyyy-MM-dd'), nextVisitDate: newDate } : f
    )
  }))
}));
