const {
    fetchTags,
  } = require('../db');
  
  const express = require('express');
  const app = express.Router();
  const { isLoggedIn, isAdmin } = require('./middleware');
  const { createTags } = require('../db/tags');
  
  app.get('/', async(req, res, next)=> {
    try {
      res.send(await fetchTags());
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.post(`/:id`, async(req, res, next)=> {
    try {
      res.send(await createTags(req.body))
    } catch (error) {
      next(error)
    }
  });
  
  
  module.exports = app;
  