
require('dotenv').config();
const express = require("express");
const cors = require('cors');
// const app = require('./app');
const { client } = require('./db');

//import express app from app.js
const app = require('./app'); 
const PORT = process.env.PORT || 3000;
app.use(cors({origin: ['http://localhost:3000', 'http://localhost:5173']}));

//start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});