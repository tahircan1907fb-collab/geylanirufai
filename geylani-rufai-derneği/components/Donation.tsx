import React from 'react';
import { Copy, CreditCard } from 'lucide-react';

const Donation: React.FC = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("IBAN Kopyalandı!");
  };

  return (
    <section id="donate" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-gradient-to-br from-emerald-900 to-navy-900 rounded-3xl p-8 md:p-12 shadow-2xl text-white text-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gold-500/10 rounded-full -ml-10 -mb-10"></div>

            <div className="relative z-10">
                <CreditCard className="w-16 h-16 text-gold-500 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Hizmete Destek Olun</h2>
                <p className="text-gray-300 mb-10 max-w-2xl mx-auto font-serif">
                    Yapacağınız bağışlar, ihtiyaç sahiplerine ulaştırılmakta ve dernek faaliyetlerinin sürdürülmesinde kullanılmaktadır. "Veren el, alan elden üstündür."
                </p>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 max-w-lg mx-auto">
                    <p className="text-gold-400 text-sm uppercase tracking-widest mb-2">Resmi Banka Hesabı (TL)</p>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-navy-900/50 p-4 rounded-lg">
                        <code className="text-xl md:text-2xl font-mono tracking-wider">TR12 0006 1000 0000 1234 5678 90</code>
                        <button 
                            onClick={() => copyToClipboard("TR120006100000001234567890")}
                            className="p-2 hover:bg-gold-500/20 rounded-full transition-colors text-gold-500"
                            title="Kopyala"
                        >
                            <Copy size={20} />
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-3">Alıcı: Geylani Rufai Tasavvuf ve Kültür Derneği</p>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Donation;