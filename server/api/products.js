const {
  fetchProducts,
  editProduct,
  createProduct,
  createReview, 
  fetchReviews, 
} = require('../db');

const express = require('express');
const app = express.Router();
const { isLoggedIn, isAdmin } = require('./middleware');

app.get('/', async (req, res, next) => {
  try {
    res.send(await fetchProducts());
  } catch (ex) {
    next(ex);
  }
});

app.post('/', async (req, res, next) => {
  try {
    res.send(await createProduct(req.body));
  } catch (error) {
    next(error);
  }
});

app.put('/:id', async (req, res, next) => {
  try {
    res.send(await editProduct(req.body));
  } catch (error) {
    next(error);
  }
});

app.post('/reviews', async (req, res, next) => {
  try {
    res.send(await createReview(req.body));
  } catch (error) {
    next(error);
  }
});


app.get('/reviews', async (req, res, next) => {
  try {
    res.send(await fetchReviews());
  } catch (ex) {
    next(ex);
  }
});

module.exports = app;