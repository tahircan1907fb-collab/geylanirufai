import React, { useState } from 'react';
import { authHeaders } from '../components/ProtectedRoute';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { adminToast } from '../../lib/adminToast';

const MIN_PASSWORD_LENGTH = 6;

export default function SecuritySettings() {
     const [currentPassword, setCurrentPassword] = useState('');
     const [newPassword, setNewPassword] = useState('');
     const [confirmPassword, setConfirmPassword] = useState('');
     const [showCurrent, setShowCurrent] = useState(false);
     const [showNew, setShowNew] = useState(false);
     const [loading, setLoading] = useState(false);

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();

          if (newPassword.length < MIN_PASSWORD_LENGTH) {
               adminToast(`Yeni şifre en az ${MIN_PASSWORD_LENGTH} karakter olmalıdır`, 'warning');
               return;
          }

          if (newPassword !== confirmPassword) {
               adminToast('Yeni şifreler eşleşmiyor', 'warning');
               return;
          }

          setLoading(true);
          try {
               const res = await fetch('/api/auth/change-password', {
                    method: 'PUT',
                    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ currentPassword, newPassword }),
               });

               const data = await res.json();

               if (!res.ok) {
                    adminToast(data.error || 'Şifre değiştirilemedi', 'error');
                    return;
               }

               adminToast('Şifre başarıyla değiştirildi', 'success');
               setCurrentPassword('');
               setNewPassword('');
               setConfirmPassword('');
          } catch {
               adminToast('Sunucu bağlantı hatası', 'error');
          } finally {
               setLoading(false);
          }
     };

     return (
          <div>
               <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-6 h-6 text-amber-400" />
                    <h1 className="text-2xl font-bold text-white">Güvenlik Ayarları</h1>
               </div>

               <div className="max-w-md">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                         <h2 className="text-white font-semibold mb-4">Şifre Değiştir</h2>

                         <form onSubmit={handleSubmit} className="space-y-4">
                              {/* Current Password */}
                              <div>
                                   <label className="block text-sm font-medium text-slate-300 mb-1.5">Mevcut Şifre</label>
                                   <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                             type={showCurrent ? 'text' : 'password'}
                                             value={currentPassword}
                                             onChange={(e) => setCurrentPassword(e.target.value)}
                                             required
                                             className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                                             placeholder="Mevcut şifreniz"
                                        />
                                        <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                                             {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                   </div>
                              </div>

                              {/* New Password */}
                              <div>
                                   <label className="block text-sm font-medium text-slate-300 mb-1.5">Yeni Şifre</label>
                                   <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                             type={showNew ? 'text' : 'password'}
                                             value={newPassword}
                                             onChange={(e) => setNewPassword(e.target.value)}
                                             required
                                             minLength={MIN_PASSWORD_LENGTH}
                                             className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                                             placeholder="En az 6 karakter"
                                        />
                                        <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                                             {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                   </div>
                              </div>

                              {/* Confirm Password */}
                              <div>
                                   <label className="block text-sm font-medium text-slate-300 mb-1.5">Yeni Şifre (Tekrar)</label>
                                   <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                             type="password"
                                             value={confirmPassword}
                                             onChange={(e) => setConfirmPassword(e.target.value)}
                                             required
                                             minLength={MIN_PASSWORD_LENGTH}
                                             className={`w-full pl-10 pr-4 py-2.5 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition ${confirmPassword && confirmPassword !== newPassword
                                                       ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                       : 'border-slate-600 focus:border-amber-500 focus:ring-amber-500'
                                                  }`}
                                             placeholder="Yeni şifreyi tekrarlayın"
                                        />
                                   </div>
                                   {confirmPassword && confirmPassword !== newPassword && (
                                        <p className="text-xs text-red-400 mt-1">Şifreler eşleşmiyor</p>
                                   )}
                              </div>

                              <button
                                   type="submit"
                                   disabled={loading || !currentPassword || !newPassword || newPassword !== confirmPassword}
                                   className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
                              >
                                   {loading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
                              </button>
                         </form>
                    </div>
               </div>
          </div>
     );
}
