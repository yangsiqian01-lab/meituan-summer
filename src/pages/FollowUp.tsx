import React from 'react';
import { useAppStore } from '../store';
import { CalendarClock, MapPin, User as UserIcon, Phone } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

export const FollowUp: React.FC = () => {
  const { followUps } = useAppStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6 px-1">
        <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
          <CalendarClock size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">复诊续方</h2>
      </div>

      <div className="space-y-4">
        {followUps.map((f) => {
          const daysLeft = differenceInDays(new Date(f.nextVisitDate), new Date());
          const isUrgent = daysLeft <= 7;

          return (
            <div key={f.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className={`p-4 text-white ${isUrgent ? 'bg-orange-500' : 'bg-purple-500'} flex justify-between items-center`}>
                <div className="font-medium text-lg">距离下次复诊还有</div>
                <div className="text-3xl font-bold">{daysLeft} <span className="text-sm font-normal">天</span></div>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="text-gray-400 mt-0.5" size={20} />
                  <div>
                    <div className="font-bold text-gray-800 text-lg">{f.hospital}</div>
                    <div className="text-gray-500">{f.department}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <UserIcon className="text-gray-400" size={20} />
                  <div className="text-gray-700 text-lg">{f.doctor} 医生</div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="text-sm text-gray-500 mb-1">上次就诊：{format(new Date(f.lastVisitDate), 'yyyy年MM月dd日')}</div>
                  <div className="text-sm text-gray-500">计划复诊：{format(new Date(f.nextVisitDate), 'yyyy年MM月dd日')}</div>
                </div>

                {f.notes && (
                  <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg border border-orange-100">
                    <strong>医嘱/备忘：</strong> {f.notes}
                  </div>
                )}

                <button className="w-full mt-2 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-md flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <Phone size={20} className="mr-2" />
                  一键预约挂号
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
