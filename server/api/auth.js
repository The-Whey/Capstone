const {
  authenticate,
  findUserByToken,
  createUser
} = require('../db');

const express = require('express');
const app = express.Router();
const { isLoggedIn } = require('./middleware');


app.post('/login', async(req, res, next)=> {
  try {
    const token = await authenticate(req.body);
    res.send({ token });
  }
  catch(ex){
    next(ex);
  }
});


app.get('/me', isLoggedIn, (req, res, next)=> {
  try {
    res.send(req.user);
  } 
  catch(ex){
    next(ex);
  }
});

app.post('/users', async(req,res,next) => {
  try {
    res.send(await createUser(req.body))
  } catch (error) {
    next(error)
  }
})

module.exports = app;
