const express = require('express');
const routes = require('./routes/routes');
const cookieParser = require('cookie-parser');

const app = express();

// CORS Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin === 'http://localhost:3000' || origin === 'http://127.0.0.1:3000') {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use('/api', routes);

module.exports = app; 
