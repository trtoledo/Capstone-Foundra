// const express = require("express");
// const ViteExpress = require("vite-express");

// const app = require('./app');
// const { syncAndSeed, client } = require('./db');

// const init = async()=> {
//   try {
//     if(process.env.SYNC === 'TRUE'){
//       await syncAndSeed();
//     }
//     const port = process.env.PORT || 3000;
//     ViteExpress.listen(app, port, () =>
//       console.log(`Server is listening on port ${port}...`)
//     );
//   }
//   catch(ex){
//     console.log(ex);
//   }
// };

// init();


//import express app from app.js
const app = require('./app'); 
const PORT = process.env.PORT || 3000;

//start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});