//import express app from app.js
const app = require('./app'); 
const PORT = process.env.PORT || 3000;

//start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
