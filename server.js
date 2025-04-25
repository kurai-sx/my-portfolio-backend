require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});


db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// API route
app.post('/api/contact', (req, res) => {
  const { Name, Email, Message } = req.body;

  console.log('📩 Received data:', { Name, Email, Message });

  const sql = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';

  db.query(sql, [Name, Email, Message], (err, result) => {
    if (err) {
      console.error('❌ MySQL Insert Error:', err);  // <<-- Add this for visibility
      return res.status(500).send('DB Insert Failed');
    }

    console.log('✅ MySQL Insert Result:', result);  // <<-- See what MySQL returns
    res.status(200).send('Message saved');
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
