
import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { OrderDetails } from '../types';

interface OrderFormModalProps {
  initialData: OrderDetails;
  onClose: () => void;
  onSave: (order: OrderDetails) => void;
}

const OrderFormModal: React.FC<OrderFormModalProps> = ({ initialData, onClose, onSave }) => {
  const [formData, setFormData] = useState<OrderDetails>(initialData);
  const [showValidation, setShowValidation] = useState(false);

  const handleSave = () => {
    setShowValidation(true);
    // Basic validation: Name, Phone, Address, and Price are required
    const isValid = 
      formData.customerName?.trim() && 
      formData.phoneNumber?.trim() && 
      formData.deliveryAddress?.trim() && 
      formData.totalPrice !== null && 
      formData.totalPrice > 0;

    if (isValid) {
      onSave(formData);
    }
  };

  const isMissing = (val: any) => val === null || val === undefined || val === '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
        <div className="px-8 py-6 flex items-center justify-between border-b border-slate-50">
          <div>
            <h3 className="text-xl font-bold text-brand-blue">Review Order Info</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Verification required</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Missing Price Alert inside Modal */}
          {formData.totalPrice === null && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-pulse">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-700">Price Not Found</p>
                <p className="text-xs text-red-600 mt-0.5">The AI couldn't find a price in the chat. Please enter it manually below.</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-2">
                Customer Name
                {showValidation && isMissing(formData.customerName) && <span className="text-red-500 font-bold">Required</span>}
              </label>
              <input 
                type="text"
                value={formData.customerName || ''}
                placeholder="Name..."
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                className={`w-full px-0 py-2 border-b-2 outline-none transition-all font-semibold text-slate-800 ${showValidation && isMissing(formData.customerName) ? 'border-red-400 bg-red-50/30' : 'border-slate-100 focus:border-brand-blue'}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-2">
                  Phone
                  {showValidation && isMissing(formData.phoneNumber) && <span className="text-red-500 font-bold">Required</span>}
                </label>
                <input 
                  type="text"
                  value={formData.phoneNumber || ''}
                  placeholder="Phone..."
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className={`w-full px-0 py-2 border-b-2 outline-none transition-all font-semibold text-slate-800 ${showValidation && isMissing(formData.phoneNumber) ? 'border-red-400 bg-red-50/30' : 'border-slate-100 focus:border-brand-blue'}`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-2">
                  Total (BDT)
                  {formData.totalPrice === null && <span className="text-red-600 font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Required</span>}
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    value={formData.totalPrice === null ? '' : formData.totalPrice}
                    placeholder="Enter total price..."
                    onChange={(e) => setFormData({...formData, totalPrice: e.target.value === '' ? null : Number(e.target.value)})}
                    className={`w-full px-0 py-2 border-b-2 outline-none transition-all font-bold text-slate-800 ${formData.totalPrice === null ? 'border-red-400 bg-red-50/50' : 'border-slate-100 focus:border-brand-blue'}`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-2">
                Address
                {showValidation && isMissing(formData.deliveryAddress) && <span className="text-red-500 font-bold">Required</span>}
              </label>
              <textarea 
                value={formData.deliveryAddress || ''}
                placeholder="Delivery address..."
                onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                rows={2}
                className={`w-full px-0 py-2 border-b-2 outline-none transition-all font-medium text-slate-700 resize-none ${showValidation && isMissing(formData.deliveryAddress) ? 'border-red-400 bg-red-50/30' : 'border-slate-100 focus:border-brand-blue'}`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Note</label>
              <textarea 
                value={formData.note || ''}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
                rows={2}
                placeholder="Additional instructions..."
                className="w-full px-0 py-2 border-b-2 border-slate-100 focus:border-brand-orange outline-none transition-all font-medium text-slate-700 resize-none italic"
              />
            </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-slate-50/50 flex flex-col gap-4">
          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-3.5 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-2xl transition-colors"
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
    </div>
  );
};

// Fixed: Added missing default export for OrderFormModal
export default OrderFormModal;
