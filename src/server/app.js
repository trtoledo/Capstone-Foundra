const express = require('express');
const app = express();
const path = require('path');
app.use(express.json());

app.use('/api', require('./api'));

const cors = require("cors");
app.use(cors({ origin: ["http://localhost:5173"] }));

app.use((err, req, res, next)=> {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message });
});

module.exports = app;