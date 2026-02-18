import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken } from './components/ProtectedRoute';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
     const [username, setUsername] = useState('');
     const [password, setPassword] = useState('');
     const [showPassword, setShowPassword] = useState(false);
     const [error, setError] = useState('');
     const [loading, setLoading] = useState(false);
     const navigate = useNavigate();

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setError('');
          setLoading(true);

          try {
               const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
               });
               const data = await res.json();

               if (!res.ok) {
                    setError(data.error || 'Giriş başarısız');
                    return;
               }

               setToken(data.token);
               navigate('/admin/dashboard', { replace: true });
          } catch {
               setError('Sunucu bağlantı hatası');
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
               <div className="w-full max-w-md">
                    {/* Logo / Brand */}
                    <div className="text-center mb-8">
                         <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl mb-4 shadow-lg shadow-amber-500/20">
                              <Lock className="w-8 h-8 text-white" />
                         </div>
                         <h1 className="text-2xl font-bold text-white">Yönetim Paneli</h1>
                         <p className="text-slate-400 mt-1">Geylani Rufai Derneği</p>
                    </div>

                    {/* Form */}
                    <form
                         onSubmit={handleSubmit}
                         className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl"
                    >
                         {error && (
                              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
                                   {error}
                              </div>
                         )}

                         <div className="mb-5">
                              <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-1.5">
                                   Kullanıcı Adı
                              </label>
                              <div className="relative">
                                   <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                   <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                                        placeholder="admin"
                                        required
                                   />
                              </div>
                         </div>

                         <div className="mb-6">
                              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                                   Şifre
                              </label>
                              <div className="relative">
                                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                   <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                                        placeholder="••••••••"
                                        required
                                   />
                                   <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                   >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                   </button>
                              </div>
                         </div>

                         <button
                              type="submit"
                              disabled={loading}
                              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
                         >
                              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                         </button>

                         <div className="mt-6 text-center">
                              <a href="/" className="text-sm text-slate-400 hover:text-amber-400 transition">
                                   ← Siteye dön
                              </a>
                         </div>
                    </form>
               </div>
          </div>
     );
}
