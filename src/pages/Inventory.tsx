import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Package, AlertTriangle, Plus } from 'lucide-react';
import clsx from 'clsx';

export const Inventory: React.FC = () => {
  const { plans, refillInventory, currentUser } = useAppStore();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [refillAmount, setRefillAmount] = useState<number>(14);

  const handleRefill = () => {
    if (selectedPlan) {
      refillInventory(selectedPlan, refillAmount);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6 px-1">
        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
          <Package size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">药品库存</h2>
      </div>

      <div className="space-y-4">
        {plans.map((plan) => {
          const isLow = plan.inventory <= plan.inventoryThreshold;
          const percentage = Math.min(100, Math.max(0, (plan.inventory / (plan.inventoryThreshold * 3)) * 100));

          return (
            <div key={plan.id} className={clsx("bg-white p-5 rounded-2xl shadow-sm border", isLow ? "border-orange-200" : "border-gray-100")}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                  <p className="text-gray-500 mt-1">预警线: {plan.inventoryThreshold} {plan.unit}</p>
                </div>
                {isLow && (
                  <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <AlertTriangle size={16} className="mr-1" /> 余量告急
                  </span>
                )}
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">当前余量</span>
                  <span className={clsx("font-bold text-lg", isLow ? "text-orange-600" : "text-gray-800")}>
                    {plan.inventory} <span className="text-sm font-normal text-gray-500">{plan.unit}</span>
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className={clsx("h-3 rounded-full transition-all", isLow ? "bg-orange-500" : "bg-blue-500")} 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {currentUser.role === 'patient' && (
                <button 
                  onClick={() => setSelectedPlan(plan.id)}
                  className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl font-medium flex items-center justify-center hover:bg-blue-100 transition-colors"
                >
                  <Plus size={20} className="mr-1" /> 补充库存
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 补充库存弹窗 */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm animate-fade-in-up">
            <h3 className="text-xl font-bold mb-4 text-center">补充药品库存</h3>
            <p className="text-gray-600 mb-6 text-center">
              {plans.find(p => p.id === selectedPlan)?.name}
            </p>
            
            <div className="flex items-center justify-center space-x-4 mb-8">
              <button 
                onClick={() => setRefillAmount(Math.max(1, refillAmount - 7))}
                className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-600"
              >-</button>
              <div className="text-3xl font-bold w-20 text-center text-blue-600">{refillAmount}</div>
              <button 
                onClick={() => setRefillAmount(refillAmount + 7)}
                className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-600"
              >+</button>
            </div>

            <div className="flex space-x-3">
              <button 
                onClick={() => setSelectedPlan(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
              >
                取消
              </button>
              <button 
                onClick={handleRefill}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-md"
              >
                确认补充
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
