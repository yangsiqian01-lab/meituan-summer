import React, { useState } from 'react';
import { useAppStore } from '../store';
import { format } from 'date-fns';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { TimeSlot } from '../types';
import clsx from 'clsx';

const TIME_SLOTS: { id: TimeSlot; label: string; icon: any }[] = [
  { id: 'morning', label: '早晨', icon: Clock },
  { id: 'noon', label: '中午', icon: Clock },
  { id: 'evening', label: '晚上', icon: Clock },
];

export const Home: React.FC = () => {
  const { plans, records, takeMedication, currentUser } = useAppStore();
  const [activeSlot, setActiveSlot] = useState<TimeSlot>('morning');
  const [showToast, setShowToast] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');

  const handleTakeMedication = (planId: string) => {
    takeMedication(planId, today, activeSlot);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // 获取当前时间段需要服用的药物
  const currentSlotPlans = plans.filter(p => p.times.includes(activeSlot));

  return (
    <div className="space-y-6">
      {/* 头部欢迎 */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">今日用药计划</h2>
        <p className="opacity-90 text-lg">
          {format(new Date(), 'MM月dd日')}，
          {currentUser.role === 'family' ? '请监督按时服药' : '记得按时吃药哦'}
        </p>
      </div>

      {/* 时间段切换 */}
      <div className="flex space-x-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
        {TIME_SLOTS.map((slot) => (
          <button
            key={slot.id}
            onClick={() => setActiveSlot(slot.id)}
            className={clsx(
              'flex-1 py-3 px-4 rounded-lg font-medium text-lg transition-all',
              activeSlot === slot.id
                ? 'bg-blue-100 text-blue-700 shadow-sm'
                : 'text-gray-500 hover:bg-gray-50'
            )}
          >
            {slot.label}
          </button>
        ))}
      </div>

      {/* 药品列表 */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 px-1">{TIME_SLOTS.find(s => s.id === activeSlot)?.label}待服药物</h3>
        
        {currentSlotPlans.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100 border-dashed">
            <CheckCircle2 size={48} className="mx-auto mb-3 text-green-400 opacity-50" />
            <p className="text-lg">该时段无需服药</p>
          </div>
        ) : (
          currentSlotPlans.map((plan) => {
            const isTaken = records.some(
              r => r.planId === plan.id && r.date === today && r.timeSlot === activeSlot
            );
            const isLowInventory = plan.inventory <= plan.inventoryThreshold;

            return (
              <div 
                key={plan.id} 
                className={clsx(
                  "bg-white rounded-2xl p-5 shadow-sm border transition-all",
                  isTaken ? "border-green-200 bg-green-50/30" : "border-gray-100",
                  isLowInventory && !isTaken && "border-orange-200 bg-orange-50/30"
                )}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-800 mb-1">{plan.name}</h4>
                    <p className="text-gray-600 text-lg flex items-center">
                      每次 <span className="font-bold text-blue-600 mx-1">{plan.dosage}</span>
                    </p>
                    
                    {isLowInventory && (
                      <div className="flex items-center text-orange-500 text-sm mt-2">
                        <AlertCircle size={16} className="mr-1" />
                        余量不足（剩{plan.inventory}{plan.unit}）
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleTakeMedication(plan.id)}
                    disabled={isTaken || currentUser.role === 'family'}
                    className={clsx(
                      "ml-4 flex flex-col items-center justify-center w-20 h-20 rounded-full shrink-0 transition-transform active:scale-95",
                      isTaken 
                        ? "bg-green-100 text-green-600 cursor-not-allowed" 
                        : currentUser.role === 'family'
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                    )}
                  >
                    {isTaken ? (
                      <>
                        <CheckCircle2 size={28} className="mb-1" />
                        <span className="text-sm font-medium">已服</span>
                      </>
                    ) : (
                      <span className="text-lg font-bold">打卡</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 成功提示 Toast */}
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg flex items-center animate-fade-in-down z-50">
          <CheckCircle2 className="text-green-400 mr-2" size={24} />
          <span className="text-lg">打卡成功，继续保持！</span>
        </div>
      )}
    </div>
  );
};
