import React, { useEffect, useState } from 'react';
import { authHeaders } from '../components/ProtectedRoute';
import { Save, CheckCircle, MapPin, Phone, Mail, Clock } from 'lucide-react';

interface ContactSettingsData {
     phone: string;
     phone2: string;
     email: string;
     address: string;
     workingHoursWeekday: string;
     workingHoursSaturday: string;
     workingHoursSunday: string;
}

const EMPTY: ContactSettingsData = {
     phone: '', phone2: '', email: '', address: '',
     workingHoursWeekday: '09:00 - 18:00',
     workingHoursSaturday: '10:00 - 15:00',
     workingHoursSunday: 'Kapalı'
};

// Generate time slots every 30 mins for suggestions
const HOURS = Array.from({ length: 25 }).map((_, i) => {
     const h = Math.floor(i / 2) + 8; // Start from 08:00
     const m = i % 2 === 0 ? '00' : '30';
     return `${h.toString().padStart(2, '0')}:${m}`;
}).filter(t => parseInt(t.split(':')[0]) < 24); // Limit until 23:30

const parseTime = (str: string) => {
     if (!str || str === 'Kapalı') return { start: '09:00', end: '18:00', isClosed: true };
     const [start, end] = str.split(' - ');
     return { start: start || '09:00', end: end || '18:00', isClosed: false };
};

// Extracted TimeSelector to prevent re-renders losing focus
const TimeSelector = ({ label, day, times, updateTime, selectClass }: {
     label: string,
     day: 'weekday' | 'saturday' | 'sunday',
     times: any,
     updateTime: (day: string, field: string, value: any) => void,
     selectClass: string
}) => {
     const t = times[day];
     return (
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
               <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-slate-300">{label}</label>
                    <div className="flex items-center gap-2">
                         <input
                              type="checkbox"
                              checked={!t.isClosed}
                              onChange={(e) => updateTime(day, 'isClosed', !e.target.checked)}
                              className="w-4 h-4 rounded border-slate-600 text-amber-500 focus:ring-amber-500 bg-slate-800"
                         />
                         <span className="text-xs text-slate-400">Açık</span>
                    </div>
               </div>

               <div className={`flex items-center gap-2 ${t.isClosed ? 'opacity-40 pointer-events-none' : ''}`}>
                    <input
                         list={`time-options-${day}-start`}
                         value={t.start}
                         onChange={(e) => updateTime(day, 'start', e.target.value)}
                         className={`${selectClass} min-w-[100px] text-center bg-slate-800`}
                         placeholder="09:00"
                    />
                    <span className="text-slate-500">-</span>
                    <input
                         list={`time-options-${day}-end`}
                         value={t.end}
                         onChange={(e) => updateTime(day, 'end', e.target.value)}
                         className={`${selectClass} min-w-[100px] text-center bg-slate-800`}
                         placeholder="18:00"
                    />
                    <datalist id={`time-options-${day}-start`}>
                         {HOURS.map(h => <option key={h} value={h} />)}
                    </datalist>
                    <datalist id={`time-options-${day}-end`}>
                         {HOURS.map(h => <option key={h} value={h} />)}
                    </datalist>
               </div>
          </div>
     );
};

export default function ContactSettings() {
     const [form, setForm] = useState<ContactSettingsData>(EMPTY);
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const [saved, setSaved] = useState(false);

     // Local state for time pickers to handle separate start/end selection
     const [times, setTimes] = useState({
          weekday: { start: '09:00', end: '18:00', isClosed: false },
          saturday: { start: '10:00', end: '15:00', isClosed: false },
          sunday: { start: '10:00', end: '15:00', isClosed: true },
     });

     useEffect(() => {
          fetch('/api/settings', { headers: authHeaders() })
               .then((r) => r.json())
               .then((data) => {
                    const { id, ...rest } = data;
                    const filtered: any = {};
                    Object.keys(EMPTY).forEach(key => {
                         if (rest[key] !== undefined) filtered[key] = rest[key];
                    });

                    setForm({ ...EMPTY, ...filtered });

                    // Parse DB strings into local time state
                    setTimes({
                         weekday: parseTime(rest.workingHoursWeekday),
                         saturday: parseTime(rest.workingHoursSaturday),
                         sunday: parseTime(rest.workingHoursSunday),
                    });

                    setLoading(false);
               });
     }, []);

     // Sync local time state back to form string format
     useEffect(() => {
          const format = (t: typeof times.weekday) => t.isClosed ? 'Kapalı' : `${t.start} - ${t.end}`;
          setForm(prev => ({
               ...prev,
               workingHoursWeekday: format(times.weekday),
               workingHoursSaturday: format(times.saturday),
               workingHoursSunday: format(times.sunday),
          }));
     }, [times]);

     async function handleSave(e: React.FormEvent) {
          e.preventDefault();
          setSaving(true);
          await fetch('/api/settings', {
               method: 'PUT',
               headers: { ...authHeaders(), 'Content-Type': 'application/json' },
               body: JSON.stringify(form),
          });
          setSaving(false);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
     }

     const inputClass = "w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500 transition";
     const selectClass = "px-2 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500 transition appearance-none cursor-pointer min-w-[80px]";

     const formatPhoneNumber = (value: string) => {
          // Remove all non-digit chars
          const cleaned = value.replace(/\D/g, '');

          // Helper to limit length
          const limit = (val: string, max: number) => val.slice(0, max);

          if (cleaned.length === 0) return '';

          // Format: 0 (5XX) XXX XX XX
          let formatted = cleaned;

          // If starts with 90, remove it for easier formatting handling logic below
          if (formatted.startsWith('90')) formatted = formatted.slice(2);
          // If starts with 0, keep it but don't duplicate
          if (formatted.startsWith('0')) formatted = formatted.slice(1);

          // Reconstruct
          let parts = [];
          parts.push('0');

          if (formatted.length > 0) parts.push(' (' + limit(formatted, 3));
          if (formatted.length >= 3) parts.push(') ' + limit(formatted.slice(3), 3));
          if (formatted.length >= 6) parts.push(' ' + limit(formatted.slice(6), 2));
          if (formatted.length >= 8) parts.push(' ' + limit(formatted.slice(8), 2));

          return parts.join('').trim();
     };

     function update(key: keyof ContactSettingsData) {
          return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
               let value = e.target.value;
               if (key === 'phone' || key === 'phone2') {
                    // Allow deletion
                    if (value.length < form[key].length) {
                         setForm({ ...form, [key]: value });
                         return;
                    }
                    value = formatPhoneNumber(value);
               }
               setForm({ ...form, [key]: value });
          };
     }

     const updateTime = (day: keyof typeof times, field: 'start' | 'end' | 'isClosed', value: any) => {
          setTimes(prev => ({
               ...prev,
               [day]: { ...prev[day], [field]: value }
          }));
     };

     if (loading) {
          return <div className="space-y-4">{[1].map((i) => <div key={i} className="h-20 bg-slate-800 rounded-xl animate-pulse" />)}</div>;
     }

     return (
          <form onSubmit={handleSave} className="max-w-4xl mx-auto space-y-8">
               <div className="flex items-center justify-between mb-6">
                    <div>
                         <h1 className="text-2xl font-bold text-white">İletişim Bilgileri Ayarları</h1>
                         <p className="text-slate-400 text-sm mt-1">Dernek iletişim bilgilerini düzenleyin.</p>
                    </div>
                    <button
                         type="submit"
                         disabled={saving}
                         className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition disabled:opacity-50"
                    >
                         {saved ? <><CheckCircle className="w-4 h-4" /> Kaydedildi</> : <><Save className="w-4 h-4" /> {saving ? 'Kaydediliyor...' : 'Kaydet'}</>}
                    </button>
               </div>

               {/* Form Fields */}
               <section className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl space-y-6">
                    <h2 className="text-lg font-semibold text-white border-b border-slate-700 pb-2 mb-4">İletişim Detayları</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                              <label className="block text-sm text-slate-300 mb-1">Telefon (1)</label>
                              <input value={form.phone} onChange={update('phone')} className={inputClass} placeholder="0 (5XX) XXX XX XX" />
                         </div>
                         <div>
                              <label className="block text-sm text-slate-300 mb-1">Telefon (2)</label>
                              <input value={form.phone2} onChange={update('phone2')} className={inputClass} placeholder="0 (5XX) XXX XX XX" />
                         </div>
                         <div className="sm:col-span-2">
                              <label className="block text-sm text-slate-300 mb-1">E-posta</label>
                              <input value={form.email} onChange={update('email')} className={inputClass} />
                         </div>
                         <div className="sm:col-span-2">
                              <label className="block text-sm text-slate-300 mb-1">Adres</label>
                              <textarea value={form.address} onChange={update('address')} rows={3} className={`${inputClass} resize-none`} />
                         </div>
                    </div>

                    <h2 className="text-lg font-semibold text-white border-b border-slate-700 pb-2 mt-8 mb-4">Çalışma Saatleri</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         <TimeSelector label="Hafta İçi" day="weekday" times={times} updateTime={updateTime} selectClass={selectClass} />
                         <TimeSelector label="Cumartesi" day="saturday" times={times} updateTime={updateTime} selectClass={selectClass} />
                         <TimeSelector label="Pazar" day="sunday" times={times} updateTime={updateTime} selectClass={selectClass} />
                    </div>
               </section>

               {/* Live Preview */}
               <section className="bg-slate-900 border border-slate-700 rounded-xl p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                         <div className="flex items-center gap-2 mb-6">
                              <span className="h-px w-8 bg-amber-500/50"></span>
                              <span className="text-amber-500 font-medium uppercase tracking-wider text-xs">Canlı Önizleme</span>
                              <span className="h-px w-8 bg-amber-500/50"></span>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-6">
                                   <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-amber-500/20">
                                             <MapPin className="w-5 h-5 text-amber-500" />
                                        </div>
                                        <div>
                                             <h3 className="text-white font-semibold text-sm mb-1">Adres</h3>
                                             <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">{form.address || 'Adres girilmedi'}</p>
                                        </div>
                                   </div>

                                   <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-amber-500/20">
                                             <Phone className="w-5 h-5 text-amber-500" />
                                        </div>
                                        <div>
                                             <h3 className="text-white font-semibold text-sm mb-1">Telefon</h3>
                                             <p className="text-slate-400 text-sm">{form.phone || 'Telefon girilmedi'}</p>
                                             {form.phone2 && <p className="text-slate-400 text-sm">{form.phone2}</p>}
                                        </div>
                                   </div>
                              </div>

                              <div className="space-y-6">
                                   <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-amber-500/20">
                                             <Mail className="w-5 h-5 text-amber-500" />
                                        </div>
                                        <div>
                                             <h3 className="text-white font-semibold text-sm mb-1">E-posta</h3>
                                             <p className="text-slate-400 text-sm">{form.email || 'E-posta girilmedi'}</p>
                                        </div>
                                   </div>

                                   <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-amber-500/20">
                                             <Clock className="w-5 h-5 text-amber-500" />
                                        </div>
                                        <div>
                                             <h3 className="text-white font-semibold text-sm mb-1">Çalışma Saatleri</h3>
                                             <p className="text-slate-400 text-sm">Hafta İçi: {form.workingHoursWeekday}</p>
                                             <p className="text-slate-400 text-sm">Cumartesi: {form.workingHoursSaturday}</p>
                                             <p className="text-slate-400 text-sm">Pazar: {form.workingHoursSunday}</p>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               </section>
          </form>
     );
}
