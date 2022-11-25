const express = require('express');
require('./db/sequelize'); // DB


const userRouter = require('./routers/user');
const eventRouter = require('./routers/event');

const app = express();

// To parse the json to object.
app.use(express.json());


// To register the Router
app.use(userRouter);
app.use(eventRouter);

module.exports = app;