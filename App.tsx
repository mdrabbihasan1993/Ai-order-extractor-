
import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Sparkles,
  AlertCircle,
  Plus,
  Info
} from 'lucide-react';
import { OrderDetails, OrderRecord, ExtractionStatus } from './types';
import { extractOrderDetails } from './services/geminiService';
import OrderFormModal from './components/OrderFormModal';
import OrderList from './components/OrderList';

const App: React.FC = () => {
  const [chatInput, setChatInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState<ExtractionStatus>(ExtractionStatus.IDLE);
  const [currentOrder, setCurrentOrder] = useState<OrderDetails | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('merchant_orders');
    if (saved) {
      setOrderHistory(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('merchant_orders', JSON.stringify(orderHistory));
  }, [orderHistory]);

  const handleAIDetect = async () => {
    if (!chatInput.trim()) {
      setErrorMessage("Please paste the chat text first.");
      return;
    }

    setExtractionStatus(ExtractionStatus.LOADING);
    setErrorMessage(null);

    try {
      const details = await extractOrderDetails(chatInput);
      setCurrentOrder(details);
      setIsModalOpen(true);
      setExtractionStatus(ExtractionStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setErrorMessage("AI failed to extract details. Please try again.");
      setExtractionStatus(ExtractionStatus.ERROR);
    }
  };

  const handleSaveOrder = (updatedOrder: OrderDetails) => {
    const newRecord: OrderRecord = {
      ...updatedOrder,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      status: 'Confirmed'
    };
    setOrderHistory([newRecord, ...orderHistory]);
    setIsModalOpen(false);
    setChatInput('');
    setExtractionStatus(ExtractionStatus.IDLE);
    setCurrentOrder(null);
  };

  const handleDeleteOrder = (id: string) => {
    setOrderHistory(orderHistory.filter(o => o.id !== id));
  };

  const filteredOrders = orderHistory.filter(order => 
    order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.phoneNumber?.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-brand-orange selection:text-white">
      {/* Minimal Header */}
      <header className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-blue rounded-md flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-brand-blue">AI Order Extractor</span>
        </div>
        <button 
          onClick={() => {
            setCurrentOrder({ customerName: '', phoneNumber: '', deliveryAddress: '', totalPrice: 0, items: '', note: '' });
            setIsModalOpen(true);
          }}
          className="text-sm font-semibold text-slate-600 hover:text-brand-orange transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Manual Entry
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-6 pb-20 space-y-12">
        
        {/* Verification Warning Alert */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-700">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 font-medium leading-relaxed">
            <span className="font-bold">Important:</span> AI can occasionally make mistakes or miss details. Please <span className="underline decoration-amber-300">verify all information</span> carefully before saving your order.
          </p>
        </div>

        {/* Simplified Extractor Section */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">New Order</h2>
            <p className="text-slate-500 font-medium">Paste the customer's chat log to extract details automatically.</p>
          </div>

          <div className="relative group">
            <textarea 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Example: Rahim, 01712345678, Dhanmondi, 1200tk for 2 shirts..."
              className="w-full h-48 p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-1 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all resize-none text-slate-700 font-medium"
            />
            
            <div className="absolute bottom-4 right-4 flex items-center gap-4">
              {extractionStatus === ExtractionStatus.LOADING && (
                <div className="flex items-center gap-2 text-xs font-bold text-brand-blue animate-pulse">
                  <div className="w-3 h-3 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
                  ANALYZING
                </div>
              )}
              <button 
                onClick={handleAIDetect}
                disabled={extractionStatus === ExtractionStatus.LOADING}
                className="bg-brand-blue hover:bg-slate-800 disabled:bg-slate-300 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-brand-orange" />
                Extract Details
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 text-red-500 text-sm font-semibold px-2">
              <AlertCircle className="w-4 h-4" />
              {errorMessage}
            </div>
          )}
        </section>

        {/* Minimal Order History Section */}
        <section className="space-y-8 pt-4">
          <div className="flex items-end justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-800">History</h3>
            <div className="relative">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-6 pr-2 py-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-600 placeholder:text-slate-300"
              />
            </div>
          </div>

          <OrderList orders={filteredOrders} onDelete={handleDeleteOrder} />
        </section>
      </main>

      {isModalOpen && currentOrder && (
        <OrderFormModal 
          initialData={currentOrder} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveOrder}
        />
      )}
    </div>
  );
};

export default App;
