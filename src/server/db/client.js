//import prisma client class from @prisma/clien package
const { PrismaClient } = require('@prisma/client');

//create instance of prisma client for connecting to database
const prisma = new PrismaClient();

//export prisma client --> other files can import and use it
module.exports = prisma;
