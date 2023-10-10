const {
  fetchOrders,
  updateOrder,
  fetchAllOrders
} = require('../db');


const express = require('express');
const app = express.Router();
const { isLoggedIn, isAdmin } = require('./middleware');

app.put('/:id', isLoggedIn, async(req, res, next)=> {
  try {
    //TODO make sure the order's user_id is req.user.id
    res.send(await updateOrder({ ...req.body, id: req.params.id}));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/', isLoggedIn, async(req, res, next)=> {
  try {
    res.send(fetchAllOrders);
  }
  catch(ex){
    next(ex);
  }
});

app.get('/admin', async(req,res,next) => {
  try {
    res.send(await fetchAllOrders())
  } catch (error) {
    next(error)
  }
})

module.exports = app;
