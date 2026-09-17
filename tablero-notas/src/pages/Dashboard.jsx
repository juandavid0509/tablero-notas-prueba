import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { UsersIcon, NoteIcon, ClockIcon, CheckCircleIcon } from '../components/Icons';

export default function Dashboard() {
  const { token } = useAuth();
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalNotes: 0,
    statusBreakdown: { Pendiente: 0, 'En curso': 0, Hecho: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMetrics = async () => {
    try {
      const activeToken = token || localStorage.getItem('token');
      const response = await fetch('/api/metrics', {
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener las métricas desde AWS Lambda.');
      }

      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error cargando métricas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Panel de Métricas</h1>
            <p className="text-xs text-slate-500">
              Métricas procesadas mediante <span className="font-semibold text-indigo-600">AWS Lambda</span>.
            </p>
          </div>
          <button
            onClick={fetchMetrics}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow transition cursor-pointer"
          >
            Actualizar
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-sm rounded shadow-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">Cargando métricas...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Usuarios */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Usuarios Registrados</p>
                <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{metrics.totalUsers}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <UsersIcon className="w-6 h-6" />
              </div>
            </div>

            {/* Total Notas */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Notas</p>
                <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{metrics.totalNotes}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center text-sky-600">
                <NoteIcon className="w-6 h-6" />
              </div>
            </div>

            {/* En Curso */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">En Curso</p>
                <h3 className="text-3xl font-extrabold text-amber-600 mt-1">
                  {metrics.statusBreakdown['En curso'] || 0}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                <ClockIcon className="w-6 h-6" />
              </div>
            </div>

            {/* Completadas */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completadas</p>
                <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">
                  {metrics.statusBreakdown['Hecho'] || 0}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircleIcon className="w-6 h-6" />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}