const {
  fetchProducts,
  editProduct,
  createProduct
} = require('../db');

const express = require('express');
const app = express.Router();
const { isLoggedIn, isAdmin } = require('./middleware');

app.get('/', async(req, res, next)=> {
  try {
    res.send(await fetchProducts());
  }
  catch(ex){
    next(ex);
  }
});

app.post('/', async(req, res, next)=> {
  try {
    res.send(await createProduct(req.body))
  } catch (error) {
    next(error)
  }
});

app.put('/:id', async(req,res,next) => {
  try {
    res.send(await editProduct(req.body))
  } catch (error) {
    next(error)
  }
})

module.exports = app;