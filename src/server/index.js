const express = require('express');
const cors = require('cors');
const ViteExpress = require("vite-express");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = require('./app');
const { syncAndSeed, client } = require('./db');

const init = async()=> {
  try {
    await client.connect();
    if(process.env.SYNC === 'TRUE'){
      await syncAndSeed();
    }
    const port = process.env.PORT || 3000;
    ViteExpress.listen(app, port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  }
  catch(ex){
    console.log(ex);
  }
};

init();



