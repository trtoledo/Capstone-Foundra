const express = require('express');
const app = express();
const path = require('path');
const cors = require("cors");
app.use(express.json());
app.use(cors({origin: ['http://localhost:3000', 'http://localhost:5173']}));

app.use('/api', require('./api'));

app.use((err, req, res, next)=> {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message });
});

module.exports = app;