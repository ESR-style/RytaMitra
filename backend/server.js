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

      CREATE TABLE IF NOT EXISTS farmer_loans (
        id SERIAL PRIMARY KEY,
        farmer_id INTEGER,
        bank_name VARCHAR(100),
        loan_type VARCHAR(100),
        amount DECIMAL(10,2),
        interest_rate DECIMAL(5,2),
        start_date DATE,
        end_date DATE,
        monthly_payment DECIMAL(10,2),
        remaining_amount DECIMAL(10,2),
        status VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS bank_loan_offers (
        id SERIAL PRIMARY KEY,
        bank_name VARCHAR(100),
        loan_type VARCHAR(100),
        interest_rate_min DECIMAL(5,2),
        interest_rate_max DECIMAL(5,2),
        special_features TEXT,
        eligibility_criteria TEXT
      );

      CREATE TABLE IF NOT EXISTS fd_rates (
        id SERIAL PRIMARY KEY,
        bank_name VARCHAR(100),
        duration_days INTEGER,
        interest_rate DECIMAL(5,2)
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

// Add new endpoints for loan management
app.post('/api/farmer-loans', async (req, res) => {
  try {
    const { farmer_id, bank_name, loan_type, amount, interest_rate, start_date, end_date } = req.body;
    const monthly_payment = calculateMonthlyPayment(amount, interest_rate, start_date, end_date);
    
    const result = await pool.query(
      `INSERT INTO farmer_loans 
       (farmer_id, bank_name, loan_type, amount, interest_rate, start_date, end_date, monthly_payment, remaining_amount, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $4, 'active') 
       RETURNING *`,
      [farmer_id, bank_name, loan_type, amount, interest_rate, start_date, end_date, monthly_payment]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/bank-loan-offers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bank_loan_offers ORDER BY bank_name, interest_rate_min');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/fd-rates', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM fd_rates ORDER BY bank_name, duration_days');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new endpoint for loan risk analysis
app.post('/api/loan-risk-analysis', async (req, res) => {
  try {
    const { monthlyIncome, existingEMIs, expenses, creditScore } = req.body;
    
    // Calculate debt-to-income ratio
    const dti = (existingEMIs / monthlyIncome) * 100;
    
    // Calculate maximum eligible loan amount
    const maxEligible = calculateMaxLoanAmount(monthlyIncome, existingEMIs, expenses, creditScore);
    
    // Generate repayment scenarios
    const scenarios = generateRepaymentScenarios(maxEligible);
    
    res.json({
      riskLevel: calculateRiskLevel(dti, creditScore),
      maxEligibleAmount: maxEligible,
      recommendedEMI: calculateRecommendedEMI(maxEligible, monthlyIncome),
      scenarios
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper function to calculate monthly loan payment
function calculateMonthlyPayment(principal, annualRate, startDate, endDate) {
  const monthlyRate = annualRate / 12 / 100;
  const durationMonths = Math.ceil((new Date(endDate) - new Date(startDate)) / (30 * 24 * 60 * 60 * 1000));
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) / (Math.pow(1 + monthlyRate, durationMonths) - 1);
}

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
