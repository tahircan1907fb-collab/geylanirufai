import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { showToast } from '../lib/toast';

const DEFAULT_LAT = 41.0082;
const DEFAULT_LNG = 28.9784;
const DEFAULT_ZOOM = 15;

interface ContactData {
    mapLat: number;
    mapLng: number;
    mapZoom: number;
    mapTitle: string;
    phone: string;
    phone2: string;
    email: string;
    address: string;
    workingHoursWeekday: string;
    workingHoursSaturday: string;
    workingHoursSunday: string;
}

const Contact: React.FC = () => {
    const [contact, setContact] = useState<ContactData>({
        mapLat: DEFAULT_LAT,
        mapLng: DEFAULT_LNG,
        mapZoom: DEFAULT_ZOOM,
        mapTitle: 'Dernek Konumu',
        phone: '',
        phone2: '',
        email: '',
        address: '',
        workingHoursWeekday: '',
        workingHoursSaturday: '',
        workingHoursSunday: ''
    });
    const sectionRef = useScrollReveal();

    const [formData, setFormData] = useState({ name: '', surname: '', email: '', subject: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            showToast('Ad, e-posta ve mesaj alanları zorunludur', 'info');
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error();
            setSubmitted(true);
            setFormData({ name: '', surname: '', email: '', subject: '', message: '' });
            showToast('Mesajınız başarıyla gönderildi!', 'success');
            setTimeout(() => setSubmitted(false), 4000);
        } catch {
            showToast('Mesaj gönderilemedi, lütfen tekrar deneyin', 'info');
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        fetch('/api/settings')
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => setContact({
                mapLat: Number(data.mapLat) || DEFAULT_LAT,
                mapLng: Number(data.mapLng) || DEFAULT_LNG,
                mapZoom: Number(data.mapZoom) || DEFAULT_ZOOM,
                mapTitle: data.mapTitle || 'Dernek Konumu',
                phone: data.phone || '',
                phone2: data.phone2 || '',
                email: data.email || '',
                address: data.address || '',
                workingHoursWeekday: data.workingHoursWeekday || '09:00 - 18:00',
                workingHoursSaturday: data.workingHoursSaturday || '10:00 - 15:00',
                workingHoursSunday: data.workingHoursSunday || 'Kapalı',
            }))
            .catch(() => {
                // API unavailable – keep default state values
            });
    }, []);


    const mapUrl = `https://maps.google.com/maps?q=${contact.mapLat},${contact.mapLng}&z=${contact.mapZoom}&output=embed`;

    return (
        <section id="contact" className="py-20 bg-slate-900 relative overflow-hidden" ref={sectionRef}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
            {/* Additional mystic overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/80 to-slate-900/90 pointer-events-none"></div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="h-px w-8 bg-amber-500"></span>
                        <span className="text-amber-500 font-medium uppercase tracking-wider text-sm">İletişim</span>
                        <span className="h-px w-8 bg-amber-500"></span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Bize Ulaşın</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Hizmetlerimiz hakkında bilgi almak, gönüllü olmak veya bağış yapmak için bizimle iletişime geçebilirsiniz.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <div className="space-y-8 scroll-reveal-left">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-amber-500/20">
                                <MapPin className="w-6 h-6 text-amber-500" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg mb-1">Adres</h3>
                                <p className="text-slate-400 leading-relaxed whitespace-pre-line">
                                    {contact.address || 'Adres bilgisi yükleniyor...'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-amber-500/20">
                                <Phone className="w-6 h-6 text-amber-500" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg mb-1">Telefon</h3>
                                <p className="text-slate-400">{contact.phone || '...'}</p>
                                {contact.phone2 && <p className="text-slate-400">{contact.phone2}</p>}
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-amber-500/20">
                                <Mail className="w-6 h-6 text-amber-500" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg mb-1">E-posta</h3>
                                <p className="text-slate-400">{contact.email || '...'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-amber-500/20">
                                <Clock className="w-6 h-6 text-amber-500" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg mb-1">Çalışma Saatleri</h3>
                                <p className="text-slate-400">Pazartesi - Cuma: {contact.workingHoursWeekday}</p>
                                <p className="text-slate-400">Cumartesi: {contact.workingHoursSaturday}</p>
                                <p className="text-slate-400">Pazar: {contact.workingHoursSunday}</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl relative overflow-hidden group scroll-reveal-right">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-700"></div>

                        {submitted ? (
                            <div className="flex flex-col items-center justify-center py-12 relative z-10">
                                <CheckCircle className="w-16 h-16 text-emerald-400 mb-4" />
                                <p className="text-white font-semibold text-lg">Mesajınız Gönderildi!</p>
                                <p className="text-slate-400 text-sm mt-1">En kısa sürede size dönüş yapacağız.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleFormSubmit} className="space-y-4 relative z-10">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-300 ml-1">Adınız *</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleFormChange} required className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-600" placeholder="Adınız" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-300 ml-1">Soyadınız</label>
                                        <input type="text" name="surname" value={formData.surname} onChange={handleFormChange} className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-600" placeholder="Soyadınız" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-300 ml-1">E-posta Adresi *</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleFormChange} required className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-600" placeholder="ornek@email.com" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-300 ml-1">Konu</label>
                                    <input type="text" name="subject" value={formData.subject} onChange={handleFormChange} className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-600" placeholder="Mesajınızın konusu" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-300 ml-1">Mesajınız *</label>
                                    <textarea rows={4} name="message" value={formData.message} onChange={handleFormChange} required className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none placeholder:text-slate-600" placeholder="Mesajınızı buraya yazınız..."></textarea>
                                </div>
                                <button type="submit" disabled={submitting} className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <span>{submitting ? 'Gönderiliyor...' : 'Gönder'}</span>
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="mt-12 rounded-xl overflow-hidden shadow-lg h-64 border-4 border-white dark:border-slate-700">
                    <iframe
                        src={mapUrl}
                        title={contact.mapTitle}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy">
                    </iframe>
                </div>
            </div>
        </section>
    );
};

export default Contact;