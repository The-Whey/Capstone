try {
  require('../env')
} catch (error) {
  console.log('If running locally add env.js file to root directory set process.env.HEREapi && set process.env.geoAPIfy')
    
}


const {
  seed,
  client,
} = require('./db');
const app = require('./app');

const init = async()=> {
  await client.connect();
  console.log('connected to database');
  if(process.env.SYNC){
    await seed();
    console.log('create your tables and seed data');
  }

  const port = process.env.PORT || 4000;
  app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
  });
}

init();
