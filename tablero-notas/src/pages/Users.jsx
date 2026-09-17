import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { PlusIcon, EditIcon, TrashIcon } from '../components/Icons';
export default function Users() {
  const { users, createUser, updateUser, deleteUser, user: currentUser } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Usuario');
  const [editingId, setEditingId] = useState(null);

  // Filtros y Paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Conteo de administradores activos
  const activeAdminsCount = users.filter((u) => u.role === 'Administrador' && u.isActive).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanName || !cleanEmail || (!editingId && !cleanPassword)) {
      setError('Todos los campos son obligatorios y no pueden contener solo espacios.');
      return;
    }

    if ((!editingId || cleanPassword) && cleanPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    try {
      if (editingId) {
        await updateUser(editingId, {
          name: cleanName,
          email: cleanEmail,
          role,
          ...(cleanPassword && { password: cleanPassword }),
        });
        setSuccess('Usuario actualizado correctamente.');
      } else {
        await createUser({ name: cleanName, email: cleanEmail, password: cleanPassword, role });
        setSuccess('Usuario creado correctamente.');
      }
      resetForm();
    } catch (err) {
      setError(err.message || 'Error al procesar la solicitud.');
    }
  };

  const handleEdit = (u) => {
    setEditingId(u.id);
    setName(u.name);
    setEmail(u.email);
    setRole(u.role);
    setPassword('');
    setError('');
    setSuccess('');
  };

  const handleToggleStatus = async (u) => {
  setError('');
  setSuccess('');
  try {
    
    await updateUser(u.id, { isActive: !u.isActive });
    setSuccess(`Estado de ${u.name} cambiado a ${!u.isActive ? 'Activo' : 'Inactivo'}.`);
  } catch (err) {
    setError(err.message || 'Error al cambiar estado.');
  }
};

  const handleDelete = async (u) => {
    setError('');
    setSuccess('');

    // Validación local rápida si intenta borrar al último admin
    if (u.role === 'Administrador' && u.isActive && activeAdminsCount <= 1) {
      setError('No se puede eliminar. Debe conservarse al menos un administrador activo.');
      return;
    }

    if (!window.confirm(`¿Estás seguro de que deseas eliminar a ${u.name}?`)) return;

    try {
      await deleteUser(u.id);
      setSuccess(`Usuario ${u.name} eliminado correctamente.`);
    } catch (err) {
      setError(err.message || 'Error al eliminar el usuario.');
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('Usuario');
    setEditingId(null);
  };

  // Filtrado por Búsqueda y Rol
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'Todos' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto p-4 space-y-4">
        
        {/* Banner de Notificaciones Compacto */}
        {(error || success) && (
          <div className={`p-3 text-xs rounded-lg border flex justify-between items-center ${
            error ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}>
            <span>{error || success}</span>
            <button onClick={() => { setError(''); setSuccess(''); }} className="font-bold ml-2">✕</button>
          </div>
        )}

        {/* Sección Superior Compacta: Formulario (2 Cols) + Resumen Rápido (1 Col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Formulario Crear / Editar */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-bold text-slate-800">
              {editingId ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </h2>
              {editingId && (
                <button onClick={resetForm} className="text-xs text-slate-500 hover:underline">
                  Cancelar Edición
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Ej. Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                  Contraseña {editingId && '(Opcional)'}
                </label>
                <input
                  type="password"
                  required={!editingId}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Rol de Usuario</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Usuario">Usuario</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>

              <div className="sm:col-span-2 md:col-span-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-1.5 rounded-lg text-xs transition shadow-sm cursor-pointer"
                >
                  {editingId ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>

          {/* Tarjetas Estadísticas Resumidas */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <h3 className="text-xs font-bold text-slate-700 mb-2">Resumen de Cuentas</h3>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <span className="block text-lg font-bold text-indigo-700">
                  {users.filter((u) => u.role === 'Administrador').length}
                </span>
                <span className="text-[10px] text-indigo-600 font-medium">Admins</span>
              </div>
              <div className="p-2 bg-slate-100 rounded-lg">
                <span className="block text-lg font-bold text-slate-700">
                  {users.filter((u) => u.role === 'Usuario').length}
                </span>
                <span className="text-[10px] text-slate-600 font-medium">Estándar</span>
              </div>
            </div>
          </div>

        </div>

        {/* Sección Inferior: Controles de Filtro + Tabla de Usuarios */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          
          {/* Barra en 1 sola línea: Título + Filtro por Rol + Buscador */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
            <h2 className="text-sm font-bold text-slate-800">Usuarios Registrados ({filteredUsers.length})</h2>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Filtro por Tipo de Usuario */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-500 font-medium">Filtrar:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                  className="px-2 py-1 border rounded-lg text-xs bg-slate-50 font-semibold focus:outline-none"
                >
                  <option value="Todos">Todos los roles</option>
                  <option value="Administrador">Administradores</option>
                  <option value="Usuario">Usuarios</option>
                </select>
              </div>

              {/* Búsqueda por Nombre o Email */}
              
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="px-2.5 py-1 border rounded-lg text-xs w-full sm:w-48 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Tabla de Usuarios */}
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b">
                <tr>
                  <th className="p-2.5">Nombre</th>
                  <th className="p-2.5">Correo</th>
                  <th className="p-2.5">Rol</th>
                  <th className="p-2.5">Estado</th>
                  <th className="p-2.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((u) => {
                    const isLastAdmin = u.role === 'Administrador' && u.isActive && activeAdminsCount <= 1;

                    return (
                      <tr key={u.id} className="border-b hover:bg-slate-50">
                        <td className="p-2.5 font-semibold text-slate-800">{u.name}</td>
                        <td className="p-2.5 text-slate-600">{u.email}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                            u.role === 'Administrador' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                            u.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {u.isActive ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="p-2.5 text-right flex justify-end gap-1.5">
                          <button
                            onClick={() => handleEdit(u)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded text-[11px] font-medium"
                          >
                            <EditIcon className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className={`px-2 py-1 rounded text-[11px] font-medium text-white ${
                              u.isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'
                            }`}
                          >
                            {u.isActive ? 'Desactivar' : 'Activar'}
                          </button>
                          
                          {/* Botón de Eliminar protegido */}
                          <button
                            onClick={() => handleDelete(u)}
                            disabled={isLastAdmin}
                            title={isLastAdmin ? 'No se puede eliminar al único administrador activo' : 'Eliminar usuario'}
                            className="bg-rose-500 hover:bg-rose-600 text-white px-2 py-1 rounded text-[11px] font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-slate-400">
                      No se encontraron usuarios coincidentes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="flex justify-between items-center pt-3 text-[11px] text-slate-500">
            <span>Página {currentPage} de {totalPages}</span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 py-0.5 border rounded bg-white disabled:opacity-40"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2 py-0.5 border rounded bg-white disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}