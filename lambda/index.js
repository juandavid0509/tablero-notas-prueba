const { Client } = require('pg');

exports.handler = async (event) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@db:5432/tablero_db'
  });

  try {
    await client.connect();

    // Consultar métricas en la base de datos
    const usersCount = await client.query('SELECT COUNT(*) FROM users');
    const notesCount = await client.query('SELECT COUNT(*) FROM notes');
    const notesByStatus = await client.query(`
      SELECT status, COUNT(*) as count 
      FROM notes 
      GROUP BY status
    `);

    await client.end();

    const metrics = {
      totalUsers: parseInt(usersCount.rows[0].count),
      totalNotes: parseInt(notesCount.rows[0].count),
      statusBreakdown: notesByStatus.rows.reduce((acc, row) => {
        acc[row.status] = parseInt(row.count);
        return acc;
      }, { Pendiente: 0, 'En curso': 0, Hecho: 0 })
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(metrics)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};