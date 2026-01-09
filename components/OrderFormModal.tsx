
import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { OrderDetails } from '../types';

interface OrderFormModalProps {
  initialData: OrderDetails;
  onClose: () => void;
  onSave: (order: OrderDetails) => void;
}

const OrderFormModal: React.FC<OrderFormModalProps> = ({ initialData, onClose, onSave }) => {
  const [formData, setFormData] = useState<OrderDetails>(initialData);

  const handleSave = () => {
    // Only require these three for basic validation before saving
    if (formData.customerName && formData.phoneNumber && formData.deliveryAddress) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 flex items-center justify-between border-b border-slate-50">
          <h3 className="text-xl font-bold text-brand-blue">Review Extraction</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Customer Name</label>
              <input 
                type="text"
                value={formData.customerName || ''}
                placeholder={formData.customerName === null ? 'Not found' : ''}
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                className="w-full px-0 py-2 border-b-2 border-slate-100 focus:border-brand-blue outline-none transition-all font-semibold text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Phone</label>
                <input 
                  type="text"
                  value={formData.phoneNumber || ''}
                  placeholder={formData.phoneNumber === null ? 'Not found' : ''}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className="w-full px-0 py-2 border-b-2 border-slate-100 focus:border-brand-blue outline-none transition-all font-semibold text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Total (BDT)</label>
                <input 
                  type="number"
                  value={formData.totalPrice === null ? '' : formData.totalPrice}
                  placeholder="0"
                  onChange={(e) => setFormData({...formData, totalPrice: e.target.value === '' ? null : Number(e.target.value)})}
                  className={`w-full px-0 py-2 border-b-2 ${formData.totalPrice === null ? 'border-red-100' : 'border-slate-100'} focus:border-brand-blue outline-none transition-all font-bold text-slate-800`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Address</label>
              <textarea 
                value={formData.deliveryAddress || ''}
                placeholder={formData.deliveryAddress === null ? 'Not found in chat' : ''}
                onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                rows={2}
                className="w-full px-0 py-2 border-b-2 border-slate-100 focus:border-brand-blue outline-none transition-all font-medium text-slate-700 resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Note</label>
              <textarea 
                value={formData.note || ''}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
                rows={2}
                placeholder="Any special requests or details..."
                className="w-full px-0 py-2 border-b-2 border-slate-100 focus:border-brand-orange outline-none transition-all font-medium text-slate-700 resize-none italic"
              />
            </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-slate-50/50 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-3.5 text-slate-500 font-bold text-sm"
          >
            Discard
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 px-6 py-3.5 bg-brand-orange text-white font-bold rounded-2xl shadow-lg shadow-brand-orange/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Save Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderFormModal;
