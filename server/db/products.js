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

const fetchReviews = async()=> {
  const SQL = `
    SELECT *
    FROM reviews
  `;
  const response = await client.query(SQL);
  return response.rows;
};


const createProduct = async(product)=> {
  const SQL = `
    INSERT INTO products (id, name, price, description) VALUES($1, $2, $3, $4) RETURNING *
  `;
  const response = await client.query(SQL, [ uuidv4(), product.name, product.price, product.description]);
  return response.rows[0];
};

const createReview = async(review)=> {
  const SQL = `
  INSERT INTO reviews (id, product_id, user_id, txt, rating) VALUES($1, $2, $3, $4, $5) RETURNING * 
  `;
  const response = await client.query(SQL, [ uuidv4(), review.product_id, review.user_id, review.txt, review.rating]);
  return response.rows[0];
};

const editProduct = async(product) => {
  const SQL = `
    UPDATE products set
    name = $1,
    price = $2,
    description = $3,
    image = $4
    WHERE id = $5
    RETURNING *
  `;
  const response = await client.query(SQL, [product.name, product.price, product.description, product.image, product.id]);
  return response.rows[0];
}

module.exports = {
  fetchProducts,
  fetchReviews,
  createProduct,
  createReview,
  editProduct
};
