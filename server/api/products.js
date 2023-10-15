const {
  fetchProducts,
  editProduct,
  createProduct,
  createReview, 
  fetchReviews, 
  checkExistingReview,
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
    const { user_id, product_id } = req.body; // check these are correct values
    const existingReview = await checkExistingReview(user_id, product_id);

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product.' });
    }

    const newReview = req.body;
    await createReview(newReview);

    res.status(200).json({ message: 'Review submitted successfully' });
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