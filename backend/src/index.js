const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./config/db');

const app = express();

// Asegurar clave secreta para la firma JWT
const JWT_SECRET = process.env.JWT_SECRET || 'secreto_super_seguro_tablero_2026';

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// INICIALIZACIÓN DE USUARIOS DEMO
const initDemoUsers = async () => {
  try {
    const hashedPw = await bcrypt.hash('123', 10);
    await db.query(`
      INSERT INTO users (name, email, password, role, is_active)
      VALUES 
      ('Administrador Demo', 'admin@demo.com', $1, 'Administrador', true),
      ('Usuario Demo', 'user@demo.com', $1, 'Usuario', true),
      ('Usuario Inactivo', 'inactivo@demo.com', $1, 'Usuario', false)
      ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;
    `, [hashedPw]);
    console.log('✅ Cuentas Demo sincronizadas con Hash Bcrypt.');
  } catch (err) {
    console.error('Error inicializando usuarios demo:', err.message);
  }
};

setTimeout(initDemoUsers, 2000);

// MIDDLEWARE DE AUTENTICACIÓN JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado.' });
    }
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'Administrador') {
    next();
  } else {
    res.status(403).json({ error: 'Acceso denegado. Se requiere rol de Administrador.' });
  }
};

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'Tu cuenta está inactiva. Contacta al administrador.' });
    }

  
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      String(JWT_SECRET),
      { expiresIn: '8h' }
    );

    const { password: _, ...userSession } = user;
    res.json({ user: userSession, token });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: err.message });
  }
});

// RUTAS USUARIOS
app.get('/api/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, email, role, is_active AS "isActive" FROM users ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', authenticateToken, requireAdmin, async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (name, email, password, role, is_active) VALUES ($1, $2, $3, $4, true) RETURNING id, name, email, role, is_active AS "isActive"',
      [name, email, hashedPassword, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {

    if (err.code === '23505') {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }
    res.status(500).json({ error: 'Error al crear el usuario en la base de datos.' });
  }
});
  //Actualizar usuario
app.put('/api/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, email, role, isActive, password } = req.body;
 if (password !== undefined && password !== null && password.trim() !== '') {
    if (password.trim().length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
    }
  }
  try {
    const targetUser = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (targetUser.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const activeAdmins = await db.query("SELECT COUNT(*) FROM users WHERE role = 'Administrador' AND is_active = true");
    const count = parseInt(activeAdmins.rows[0].count);

    if (targetUser.rows[0].role === 'Administrador' && targetUser.rows[0].is_active && count <= 1) {
      if (isActive === false || (role && role !== 'Administrador')) {
        return res.status(400).json({ error: 'Debe conservarse al menos un administrador activo.' });
      }
    }

    let hashedPassword = null;
    if (password && password.trim() !== '') {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const query = `
      UPDATE users 
      SET name = COALESCE($1, name),
          email = COALESCE($2, email),
          role = COALESCE($3, role),
          is_active = COALESCE($4, is_active),
          password = COALESCE($5, password)
      WHERE id = $6 RETURNING id, name, email, role, is_active AS "isActive"
    `;
    const result = await db.query(query, [name, email, role, isActive, hashedPassword, id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  });
  //Eliminar Usuario
  app.delete('/api/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const targetUser = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (targetUser.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Si es Administrador y está activo, verificar cuántos admins activos quedan
    if (targetUser.rows[0].role === 'Administrador' && targetUser.rows[0].is_active) {
      const activeAdmins = await db.query("SELECT COUNT(*) FROM users WHERE role = 'Administrador' AND is_active = true");
      const count = parseInt(activeAdmins.rows[0].count);

      if (count <= 1) {
        return res.status(400).json({ error: 'No se puede eliminar. Debe conservarse al menos un administrador activo.' });
      }
    }

    await db.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'Usuario eliminado correctamente.' });
    } catch (err) {
    res.status(500).json({ error: err.message });
  }
  });

// RUTAS NOTAS
app.get('/api/notes', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM notes ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notes', authenticateToken, async (req, res) => {
  const { title, text, status, x, y } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO notes (title, text, status, x, y) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title || 'Nueva Nota', text || 'Escribe aquí...', status || 'Pendiente', x || 50, y || 50]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/notes/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, text, status, x, y } = req.body;
  try {
    const result = await db.query(
      `UPDATE notes 
       SET title = COALESCE($1, title),
           text = COALESCE($2, text),
           status = COALESCE($3, status),
           x = COALESCE($4, x),
           y = COALESCE($5, y)
       WHERE id = $6 RETURNING *`,
      [title, text, status, x, y, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/notes/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM notes WHERE id = $1', [id]);
    res.json({ message: 'Nota eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Backend Express corriendo en puerto ${PORT}`));