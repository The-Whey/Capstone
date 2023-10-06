const client = require('./client');
const { v4 } = require('uuid');
const uuidv4 = v4;

const fetchProducts = async()=> {
  const SQL = `
    SELECT *
    FROM products
  `;
  const response = await client.query(SQL);
  return response.rows;
};


// Creates a generic description for development
const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ultrices lacus nec odio auctor, in congue lacus ultricies. Quisque non ligula et enim consequat scelerisque. Integer interdum leo tristique feugiat lobortis. Phasellus nunc erat, hendrerit vitae neque in, scelerisque convallis eros. Cras vitae purus bibendum, placerat lectus ut, consectetur arcu. Praesent porta, tellus dignissim cursus elementum, dolor ipsum iaculis purus, sed consequat erat magna et odio. In volutpat mi enim, eu tempus eros porta nec.'

const createProduct = async(product)=> {
  const SQL = `
    INSERT INTO products (id, name, price, description) VALUES($1, $2, $3, $4) RETURNING *
  `;
  const response = await client.query(SQL, [ uuidv4(), product.name, product.price, loremIpsum]);
  return response.rows[0];
};

module.exports = {
  fetchProducts,
  createProduct
};
