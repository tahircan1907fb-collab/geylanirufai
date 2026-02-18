import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { removeToken } from './components/ProtectedRoute';
import {
     LayoutDashboard,
     Users,
     Calendar,
     Image,
     Settings,
     LogOut,
     Menu,
     X,
     ChevronRight,
     Home,
     Info,
     CreditCard,
     Phone,
     Share2,
     MapPin,
} from 'lucide-react';

const NAV_ITEMS = [
     { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
     { to: '/admin/activities', label: 'Faaliyetler', icon: Users },
     { to: '/admin/events', label: 'Etkinlikler', icon: Calendar },
     { to: '/admin/gallery', label: 'Galeri', icon: Image },
     // Settings
     { to: '/admin/settings/hero', label: 'Ana Sayfa (Hero)', icon: Home },
     { to: '/admin/settings/about', label: 'Hakkımızda', icon: Info },
     { to: '/admin/settings/donation', label: 'Bağış Bilgileri', icon: CreditCard },
     { to: '/admin/settings/contact', label: 'İletişim', icon: Phone },
     { to: '/admin/settings/social', label: 'Sosyal Medya', icon: Share2 },
     { to: '/admin/settings/map', label: 'Harita Konumu', icon: MapPin },
];

export default function AdminLayout() {
     const [sidebarOpen, setSidebarOpen] = useState(false);
     const navigate = useNavigate();

     const handleLogout = () => {
          removeToken();
          navigate('/admin', { replace: true });
     };

     return (
          <div className="min-h-screen bg-slate-900 flex">
               {/* Mobile overlay */}
               {sidebarOpen && (
                    <div
                         className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                         onClick={() => setSidebarOpen(false)}
                    />
               )}

               {/* Sidebar */}
               <aside
                    className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                         }`}
               >
                    {/* Brand */}
                    <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
                         <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                                   <ChevronRight className="w-4 h-4 text-white" />
                              </div>
                              <span className="font-bold text-white text-sm">Geylani Rufai</span>
                         </div>
                         <button
                              className="lg:hidden text-slate-400 hover:text-white"
                              onClick={() => setSidebarOpen(false)}
                         >
                              <X className="w-5 h-5" />
                         </button>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                         {NAV_ITEMS.map((item) => (
                              <NavLink
                                   key={item.to}
                                   to={item.to}
                                   onClick={() => setSidebarOpen(false)}
                                   className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                             ? 'bg-amber-500/10 text-amber-500 shadow-sm border border-amber-500/20'
                                             : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                        }`
                                   }
                              >
                                   <item.icon className="w-4 h-4" />
                                   {item.label}
                              </NavLink>
                         ))}
                    </nav>

                    {/* Logout */}
                    <div className="p-3 border-t border-slate-800">
                         <button
                              onClick={handleLogout}
                              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                         >
                              <LogOut className="w-4 h-4" />
                              Çıkış Yap
                         </button>
                    </div>
               </aside>

               {/* Main content */}
               <div className="flex-1 flex flex-col min-w-0">
                    {/* Top bar */}
                    <header className="sticky top-0 z-30 h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center px-4 lg:px-6">
                         <button
                              className="lg:hidden mr-4 text-slate-400"
                              onClick={() => setSidebarOpen(true)}
                         >
                              <Menu className="w-6 h-6" />
                         </button>
                         <h2 className="text-white font-semibold">Yönetim Paneli</h2>
                         <a
                              href="/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-auto text-sm text-slate-400 hover:text-amber-500 transition-colors"
                         >
                              Siteyi Görüntüle →
                         </a>
                    </header>

                    {/* Page content */}
                    <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                         <Outlet />
                    </main>
               </div>
          </div>
     );
}
