const express = require('express');
const routes = require('./routes/routes');
const cookieParser = require('cookie-parser');

const app = express();

// CORS middleware - izinkan frontend mengakses API secara dinamis (mendukung Next.js local & Vercel production)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});


app.use(express.json());
app.use(cookieParser());
app.use('/api', routes);

module.exports = app;