const {
    fetchTags,
    fetchTagList,
    checkDupeTags,
    insertProductTags
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

  app.post('/', async(req, res, next) => {
    try {
      const checkForDupes = await checkDupeTags(req.body);
      if (checkForDupes){
        res.send(await insertProductTags(req.body.product_id, checkForDupes.id, checkForDupes.tag))
      } else {
        const response = await createTags(req.body);
        res.send(await insertProductTags(req.body.product_id, response.id, response.tag))
      }
    } catch (error) {
      next(error);
    }
  })

  app.get('/list', async(req, res, next) => {
    try {
      res.send(await fetchTagList())
    } catch (error) {
      next(error)
    }
  })
  
  
  module.exports = app;
  