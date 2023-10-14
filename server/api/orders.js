const {
  fetchOrders,
  updateOrder,
  fetchBookmarks, 
  fetchAllOrders,
  deleteBookmark,
  createBookmark,
  updateOrderFulfilled,
  createAddress,
  fetchAddresses
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

app.put('/:id/fulfilled', async(req, res, next)=> {
  try {
    res.send(await updateOrderFulfilled(req.body));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/', isLoggedIn, async(req, res, next)=> {
  try {
    res.send(await fetchOrders(req.user.id));
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

app.get('/bookmarks', isLoggedIn, async(req, res, next)=> {
  try {
    res.send(await fetchBookmarks(req.user.id));
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/bookmarks/:id', isLoggedIn, async(req, res, next)=> {
  try {
    await deleteBookmark({ id: req.params.id, user_id: req.user.id});
    res.sendStatus(201);
  }
  catch(ex){
    next(ex);
  }
});

app.post('/bookmarks', isLoggedIn, async(req, res, next)=> {
  try {
    res.send(await createBookmark({user_id: req.user.id, product_id: req.body.product_id }));
  }
  catch(ex){
    next(ex);
  }
});

app.post('/addresses', async(req, res, next)=> {
  try {
    res.send(await createAddress(req.body))
  } catch (error) {
    next(error)
  }
});

app.get('/addresses', async(req, res, next) => {
  try {
    res.send(await fetchAddresses())
  } catch (error) {
    next(error)
  }
})

module.exports = app;
