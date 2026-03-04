import React from 'react';
import { ArrowUp } from 'lucide-react';

const Footer: React.FC = () => {
    const [contact, setContact] = React.useState({
        address: 'Molla Gürani Mah. Fatih/İst.',
        phone: '+90 212 555 12 34',
        email: 'bilgi@geylanirufai.org.tr'
    });

    React.useEffect(() => {
        fetch('/api/settings')
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                setContact({
                    address: data.address || 'Molla Gürani Mah. Fatih/İst.',
                    phone: data.phone || '+90 212 555 12 34',
                    email: data.email || 'bilgi@geylanirufai.org.tr'
                });
            })
            .catch(err => console.error('Footer contact fetch error:', err));
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-navy-900 text-white pt-16 pb-8 border-t-4 border-gold-500 relative">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    {/* Column 1: Brand */}
                    <div className="mb-6 md:mb-0">
                        <a href="#" className="flex items-center gap-3 group mb-4">
                            <div className="w-14 h-14 relative">
                                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" style={{ imageRendering: 'auto' }} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-heading font-bold text-white">Geylani Rufai</h3>
                                <p className="text-gold-500 text-xs tracking-[0.2em] uppercase">İlim ve Kültür Derneği</p>
                            </div>
                        </a>
                        <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                            Bu dernek, tasavvuf kültürünü yaşatmak ve gelecek nesillere aktarmak amacıyla kurulmuştur.
                        </p>
                    </div>

                    {/* Column 2: Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2 inline-block">Hızlı Bağlantılar</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><a href="#about" className="hover:text-gold-500 transition-colors">Hakkımızda</a></li>
                            <li><a href="#activities" className="hover:text-gold-500 transition-colors">Faaliyetlerimiz</a></li>
                            <li><a href="#events" className="hover:text-gold-500 transition-colors">Etkinlik Takvimi</a></li>
                            <li><a href="#gallery" className="hover:text-gold-500 transition-colors">Galeri</a></li>
                            <li><a href="#contact" className="hover:text-gold-500 transition-colors">İletişim</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2 inline-block">İletişim</h3>
                        <p className="text-gray-400 text-sm mb-2 whitespace-pre-line">{contact.address}</p>
                        <p className="text-gray-400 text-sm mb-2">{contact.phone}</p>
                        <p className="text-gray-400 text-sm">{contact.email}</p>
                    </div>

                    {/* Column 4: Newsletter (Mock) */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2 inline-block">Bülten</h3>
                        <p className="text-xs text-gray-400 mb-4">Etkinliklerden haberdar olmak için bültenimize abone olun.</p>
                        <div className="flex">
                            <input type="email" placeholder="E-posta" className="bg-navy-900 border border-gray-600 rounded-l px-3 py-2 text-sm w-full focus:outline-none focus:border-gold-500" />
                            <button className="bg-gold-500 text-navy-900 px-3 py-2 rounded-r font-bold hover:bg-gold-400 text-sm">Kayıt</button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-500 text-center md:text-left">
                        © {new Date().getFullYear()} Geylani Rufai Tasavvuf ve Kültür Derneği. Tüm hakları saklıdır.
                    </p>

                    <button
                        onClick={scrollToTop}
                        className="w-10 h-10 bg-gold-500 rounded flex items-center justify-center text-navy-900 hover:bg-gold-400 transition-colors shadow-lg"
                    >
                        <ArrowUp size={20} />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;