import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Menu, X, LayoutDashboard, Users, CalendarClock, 
  FileText, Calendar, LogOut, ChevronLeft, Bell, Search
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Barre latérale */}
      <aside 
        className={`bg-white border-r border-slate-200 transition-sidebar ${
          sidebarOpen ? 'w-64' : 'w-20'
        } flex flex-col fixed h-full z-10`}
      >
        <div className={`flex items-center p-4 ${!sidebarOpen && 'justify-center'}`}>
          {sidebarOpen ? (
            <>
              <div className="text-blue-600 font-bold text-xl">MediConnect</div>
              <button 
                onClick={toggleSidebar}
                className="ml-auto text-slate-500 hover:text-slate-700"
              >
                <ChevronLeft size={20} />
              </button>
            </>
          ) : (
            <button 
              onClick={toggleSidebar}
              className="text-slate-500 hover:text-slate-700"
            >
              <Menu size={20} />
            </button>
          )}
        </div>

        <nav className="mt-6 flex-1">
          <ul className="space-y-1 px-2">
            <li>
              <NavLink to="/" className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }>
                <LayoutDashboard size={20} />
                {sidebarOpen && <span>Tableau de bord</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/patients" className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }>
                <Users size={20} />
                {sidebarOpen && <span>Patients</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/appointments" className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }>
                <CalendarClock size={20} />
                {sidebarOpen && <span>Rendez-vous</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/prescriptions" className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }>
                <FileText size={20} />
                {sidebarOpen && <span>Ordonnances</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/schedule" className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }>
                <Calendar size={20} />
                {sidebarOpen && <span>Planning</span>}
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-200">
          {sidebarOpen ? (
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                {user?.name.charAt(0)}
              </div>
              <div className="ml-3">
                <div className="font-medium text-sm">{user?.name}</div>
                <div className="text-xs text-slate-500">{user?.role}</div>
              </div>
              <button 
                onClick={handleLogout}
                className="ml-auto text-slate-500 hover:text-red-500"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogout}
              className="w-full flex justify-center text-slate-500 hover:text-red-500"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </aside>

      {/* Contenu principal */}
      <div className={`flex-1 overflow-auto ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all`}>
        {/* En-tête */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center w-1/2">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Rechercher patients, rendez-vous..."
                  className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative text-slate-500 hover:text-slate-700">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
              </button>
              <div className="h-6 w-px bg-slate-200"></div>
              <div className="text-sm font-medium">
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Contenu de la page */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;