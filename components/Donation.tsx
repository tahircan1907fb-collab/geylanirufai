import React, { useEffect, useState } from 'react';
import { Copy, CreditCard, Check } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { showToast } from '../lib/toast';

interface DonationData {
  iban: string;
  ibanHolder: string;
}

const DEFAULT_DONATION: DonationData = {
  iban: 'TR120006100000001234567890',
  ibanHolder: 'Geylani Rufai Tasavvuf ve Kültür Derneği',
};

function formatIban(iban: string): string {
  return iban.replace(/\s+/g, '').replace(/(.{4})/g, '$1 ').trim();
}

const Donation: React.FC = () => {
  const [donation, setDonation] = useState<DonationData>(DEFAULT_DONATION);
  const [copied, setCopied] = useState(false);
  const sectionRef = useScrollReveal();

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((settings) => {
        setDonation({
          iban: (settings.iban || DEFAULT_DONATION.iban).replace(/\s+/g, ''),
          ibanHolder: settings.ibanHolder || DEFAULT_DONATION.ibanHolder,
        });
      })
      .catch(() => {
        setDonation(DEFAULT_DONATION);
      });
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('IBAN başarıyla kopyalandı!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="donate" className="py-20 bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-gradient-to-br from-emerald-900 to-navy-900 rounded-3xl p-8 md:p-12 shadow-2xl text-white text-center relative overflow-hidden scroll-reveal">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gold-500/10 rounded-full -ml-10 -mb-10 animate-pulse" style={{ animationDuration: '6s' }}></div>

          <div className="relative z-10">
            <CreditCard className="w-16 h-16 text-gold-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Hizmete Destek Olun</h2>
            <p className="text-gray-300 mb-10 max-w-2xl mx-auto font-serif">
              Yapacağınız bağışlar, ihtiyaç sahiplerine ulaştırılmakta ve dernek faaliyetlerinin sürdürülmesinde kullanılmaktadır. "Veren el, alan elden üstündür."
            </p>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 max-w-xl mx-auto">
              <p className="text-gold-400 text-sm uppercase tracking-widest mb-2">Resmi Banka Hesabı (TL)</p>
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-navy-900/50 p-4 rounded-lg">
                <code className="text-xs sm:text-sm md:text-lg lg:text-2xl font-mono tracking-tight sm:tracking-normal md:tracking-wide whitespace-nowrap">{formatIban(donation.iban)}</code>
                <button
                  onClick={() => copyToClipboard(donation.iban)}
                  className={`p-2.5 rounded-full transition-all duration-300 ${copied
                    ? 'bg-gold-500/30 text-gold-400 scale-110'
                    : 'hover:bg-gold-500/20 text-gold-500 hover:scale-110'
                    }`}
                  title="Kopyala"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-3">Alıcı: {donation.ibanHolder}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Donation;
