
import React from 'react';
import { OrderRecord } from '../types';

interface StatsProps {
  orders: OrderRecord[];
}

const Stats: React.FC<StatsProps> = ({ orders }) => {
  if (orders.length === 0) return null;

  const totalRevenue = orders.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
  
  return (
    <div className="flex items-center gap-8 py-4 px-2">
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue</p>
        <p className="text-xl font-bold text-brand-blue">৳{totalRevenue.toLocaleString()}</p>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Orders</p>
        <p className="text-xl font-bold text-brand-blue">{orders.length}</p>
      </div>
    </div>
  );
};

export default Stats;
