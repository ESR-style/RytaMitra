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
    // First drop the existing table
    await pool.query('DROP TABLE IF EXISTS crop_transactions;');
    
    // Then recreate with consistent naming
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

      CREATE TABLE IF NOT EXISTS crop_transactions (
        id SERIAL PRIMARY KEY,
        item_name VARCHAR(100) NOT NULL,
        quantity DECIMAL(10,2) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        buyer_name VARCHAR(100) NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

// Add new endpoints for crop transactions
app.post('/api/crop-transactions', async (req, res) => {
  try {
    const { item_name, quantity, price, buyer_name } = req.body;
    
    // Log incoming request data
    console.log('Received crop transaction:', req.body);
    
    // Validate inputs
    if (!item_name || !quantity || !price || !buyer_name) {
      console.error('Missing required fields:', { item_name, quantity, price, buyer_name });
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: { item_name, quantity, price, buyer_name }
      });
    }

    // Execute database query with underscore naming
    const result = await pool.query(
      `INSERT INTO crop_transactions 
       (item_name, quantity, price, buyer_name) 
       VALUES ($1, $2::numeric, $3::numeric, $4) 
       RETURNING *`,
      [item_name.trim(), Number(quantity), Number(price), buyer_name.trim()]
    );
    
    console.log('Database response:', result.rows[0]);
    res.json(result.rows[0]);

  } catch (err) {
    console.error('Detailed error in /api/crop-transactions:', {
      message: err.message,
      stack: err.stack,
      code: err.code
    });
    
    res.status(500).json({ 
      error: 'Server error processing transaction',
      details: err.message
    });
  }
});

app.get('/api/crop-transactions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM crop_transactions ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
