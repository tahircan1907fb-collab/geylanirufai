import React, { useState, FormEvent } from 'react';
import SectionTitle from './SectionTitle';
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube, Send, CheckCircle } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const FORM_SUBJECTS = ['Genel Bilgi', 'Faaliyetler Hakkında', 'Bağış Bildirimi', 'Ziyaret Talebi'] as const;

const Contact: React.FC = () => {
    const sectionRef = useScrollReveal<HTMLElement>();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: FORM_SUBJECTS[0],
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const mailtoLink = `mailto:iletisim@geylanirufai.org.tr?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`İsim: ${formData.name}\nE-posta: ${formData.email}\n\nMesaj:\n${formData.message}`)}`;
        window.open(mailtoLink);

        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ name: '', email: '', subject: FORM_SUBJECTS[0], message: '' });
        }, 3000);
    };

    return (
        <section id="contact" ref={sectionRef} className="py-24 bg-cream-50 islamic-pattern scroll-reveal">
            <div className="container mx-auto px-4">
                <SectionTitle title="İletişim" subtitle="Bizimle irtibata geçin, çayımızı içmeye bekleriz." />

                <div className="flex flex-col lg:flex-row gap-0 bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Info Side */}
                    <div className="lg:w-1/3 bg-emerald-900 p-10 text-white flex flex-col justify-between">
                        <div>
                            <h3 className="text-2xl font-heading font-bold mb-8 text-gold-500">Adres Bilgileri</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <MapPin className="text-gold-500 shrink-0 mt-1" />
                                    <p>Molla Gürani Mah. İlim Sok. No: 12<br />Fatih / İstanbul</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Phone className="text-gold-500 shrink-0" />
                                    <a href="tel:+902125551234" className="hover:text-gold-400 transition-colors">+90 212 555 12 34</a>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Mail className="text-gold-500 shrink-0" />
                                    <a href="mailto:iletisim@geylanirufai.org.tr" className="hover:text-gold-400 transition-colors">iletisim@geylanirufai.org.tr</a>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-gold-500">Bizi Takip Edin</h4>
                            <div className="flex gap-4">
                                <a href="#" aria-label="Instagram" className="p-3 bg-white/10 rounded-lg hover:bg-gold-500 hover:text-navy-900 transition-all duration-300 hover:scale-110"><Instagram size={20} /></a>
                                <a href="#" aria-label="Facebook" className="p-3 bg-white/10 rounded-lg hover:bg-gold-500 hover:text-navy-900 transition-all duration-300 hover:scale-110"><Facebook size={20} /></a>
                                <a href="#" aria-label="YouTube" className="p-3 bg-white/10 rounded-lg hover:bg-gold-500 hover:text-navy-900 transition-all duration-300 hover:scale-110"><Youtube size={20} /></a>
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="lg:w-2/3 p-10">
                        {isSubmitted ? (
                            <div className="flex flex-col items-center justify-center h-full gap-4 text-center animate-fade-in">
                                <CheckCircle className="w-16 h-16 text-emerald-800" />
                                <h3 className="text-2xl font-heading font-bold text-navy-900">Mesajınız Hazırlandı!</h3>
                                <p className="text-gray-600">E-posta istemciniz açılacak. Gönder'e basarak mesajınızı iletebilirsiniz.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="contact-name" className="block text-sm font-bold text-gray-700 mb-2">Adınız Soyadınız</label>
                                        <input id="contact-name" type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 bg-cream-50 transition-all" placeholder="Ahmet Yılmaz" />
                                    </div>
                                    <div>
                                        <label htmlFor="contact-email" className="block text-sm font-bold text-gray-700 mb-2">E-posta Adresiniz</label>
                                        <input id="contact-email" type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 bg-cream-50 transition-all" placeholder="ornek@email.com" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="contact-subject" className="block text-sm font-bold text-gray-700 mb-2">Konu</label>
                                    <select id="contact-subject" name="subject" value={formData.subject} onChange={handleChange} className="w-full p-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 bg-cream-50 transition-all">
                                        {FORM_SUBJECTS.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="contact-message" className="block text-sm font-bold text-gray-700 mb-2">Mesajınız</label>
                                    <textarea id="contact-message" name="message" rows={4} value={formData.message} onChange={handleChange} required className="w-full p-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 bg-cream-50 transition-all resize-none" placeholder="Mesajınızı buraya yazınız..."></textarea>
                                </div>
                                <button type="submit" className="group px-8 py-3.5 bg-emerald-900 text-white font-bold rounded-lg hover:bg-emerald-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                                    Gönder
                                    <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Map */}
                <div className="mt-12 rounded-xl overflow-hidden shadow-lg h-72 border-4 border-white">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.749007530666!2d28.976375615413345!3d41.00823797929987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9be92011c27%3A0x236e6f6f37444fae!2sSultan%20Ahmet%2C%20Ayasofya%20Meydan%C4%B1%2C%2034122%20Fatih%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1633023222534!5m2!1str!2str"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        title="Dernek Konumu"
                    >
                    </iframe>
                </div>
            </div>
        </section>
    );
};

export default Contact;