import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <span className="font-bold text-lg text-indigo-400">Portal de Equipo</span>
            
            <div className="flex gap-4">
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive('/dashboard') ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Dashboard
              </Link>

              <Link
                to="/tablero"
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive('/tablero') ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Tablero de Notas
              </Link>

              {/* Solo visible para el rol Administrador */}
              {user?.role === 'Administrador' && (
                <Link
                  to="/usuarios"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive('/usuarios') ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Gestión Usuarios
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-100">{user?.name}</p>
              <p className="text-xs text-indigo-300">{user?.role}</p>
            </div>

            <button
              onClick={handleLogout}
              className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-md text-xs font-semibold transition"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}