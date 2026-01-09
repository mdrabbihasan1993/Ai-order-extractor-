
import React from 'react';
import { Trash2, Phone, MapPin } from 'lucide-react';
import { OrderRecord } from '../types';

interface OrderListProps {
  orders: OrderRecord[];
  onDelete: (id: string) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onDelete }) => {
  if (orders.length === 0) {
    return (
      <div className="py-12 text-center text-slate-300 font-medium">
        No orders recorded yet.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="space-y-1">
        {orders.map((order) => (
          <div key={order.id} className="group flex items-center justify-between py-4 border-b border-slate-50 hover:bg-slate-50/50 px-4 -mx-4 rounded-xl transition-all">
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-800 truncate">{order.customerName}</span>
                <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest bg-brand-orange/5 px-2 py-0.5 rounded">৳{order.totalPrice?.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  <Phone className="w-3 h-3" />
                  <span>{order.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate max-w-[200px]">{order.deliveryAddress}</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => onDelete(order.id)}
              className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-400 transition-all active:scale-90"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;
