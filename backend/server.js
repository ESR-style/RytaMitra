const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()
app.use(cors())
app.use(express.json())

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'rytamitra',
  password: '945830',
  port: 5432,
})

// Database initialization
const initDb = async () => {
  try { 
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        type VARCHAR(10) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        description TEXT,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS livestock (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        count INTEGER NOT NULL,
        daily_production DECIMAL(10,2),
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS crops (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        area_planted DECIMAL(10,2),
        planting_date DATE,
        expected_harvest DATE,
        status VARCHAR(50)
      );
    `)
    console.log('Database tables initialized')
  } catch (err) {
    console.error('Database initialization error:', err)
    process.exit(1)
  }
}

// Initialize database on startup
initDb()

// Endpoints for transactions
app.post('/api/transactions', async (req, res) => {
  try {
    const { type, amount, description } = req.body
    const result = await pool.query(
      'INSERT INTO transactions (type, amount, description) VALUES ($1, $2, $3) RETURNING *',
      [type, amount, description]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/transactions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions ORDER BY date DESC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Add this new endpoint before the existing livestock endpoints
app.delete('/api/livestock/:type', async (req, res) => {
  try {
    await pool.query('DELETE FROM livestock WHERE type = $1', [req.params.type]);
    res.json({ message: 'Livestock data deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoints for livestock
app.post('/api/livestock', async (req, res) => {
  try {
    const { type, count, dailyProduction } = req.body
    const result = await pool.query(
      'INSERT INTO livestock (type, count, daily_production) VALUES ($1, $2, $3) RETURNING *',
      [type, count, dailyProduction]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/livestock/:type', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM livestock WHERE type = $1', [req.params.type])
    res.json(result.rows[0] || null)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
