const client = require('./client');
const { v4 } = require('uuid');
const uuidv4 = v4;
const path = require('path');
const fs = require('fs')

const {
  fetchProducts,
  createProduct,
  editProduct,
  fetchReviews,
  createReview
} = require('./products');

const {
  fetchTags,
  insertProductTags,
  createTags,
} = require('./tags');

const {
  createUser,
  authenticate,
  findUserByToken,
  fetchUsers,
  fetchUser,
  updateUser
} = require('./auth');

const {
  fetchLineItems,
  createLineItem,
  updateLineItem,
  deleteLineItem,
  updateOrder,
  fetchOrders,
  fetchAllOrders,
  fetchAllLineItems,
  fetchBookmarks,
  deleteBookmark,
  updateOrderFulfilled
} = require('./cart');

const createBookmark = async(bookmark)=> {
  const SQL = `
  INSERT INTO bookmarks (product_id, user_id, id) VALUES($1, $2, $3) RETURNING *
`;
 response = await client.query(SQL, [ bookmark.product_id, bookmark.user_id, uuidv4()]);
  return response.rows[0];
};

const loadImage = (filepath) => {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(__dirname, filepath)
    fs.readFile(fullPath, 'base64', (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(`data:image/png;base64,${result}`)
      }
    });  
  });
}

const seed = async()=> {
  const productImage = await loadImage('images/product-placeholder.png')
  const profileImage = await loadImage('images/profile-placeholder.png')

  const SQL = `
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS bookmarks;
    DROP TABLE IF EXISTS product_tags;
    DROP TABLE IF EXISTS tags;
    DROP TABLE IF EXISTS line_items;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS users;
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE users(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      is_admin BOOLEAN DEFAULT false NOT NULL,
      is_vip BOOLEAN NOT NULL,
      image TEXT DEFAULT '${profileImage}'
    );

    CREATE TABLE products(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      name VARCHAR(100) UNIQUE NOT NULL,
      price INT NOT NULL,
      description VARCHAR(1600),
      image TEXT DEFAULT '${productImage}'
    );

    CREATE TABLE orders(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      is_cart BOOLEAN NOT NULL DEFAULT true,
      user_id UUID REFERENCES users(id) NOT NULL,
      fulfilled BOOLEAN NOT NULL DEFAULT false
    );

    CREATE TABLE line_items(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      product_id UUID REFERENCES products(id) NOT NULL,
      order_id UUID REFERENCES orders(id) NOT NULL,
      quantity INTEGER DEFAULT 1,
      CONSTRAINT product_and_order_key UNIQUE(product_id, order_id)
    );

    CREATE TABLE tags (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      tag VARCHAR(100)
    );

    CREATE TABLE product_tags (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      product_id UUID REFERENCES products(id) NOT NULL,
      tag_id UUID REFERENCES tags(id) NOT NULL,
      tag VARCHAR(100)
    );

    CREATE TABLE bookmarks(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      product_id UUID REFERENCES products(id) NOT NULL,
      user_id UUID REFERENCES users(id) NOT NULL,
      CONSTRAINT product_and_user_key UNIQUE(product_id, user_id)
    );

    CREATE TABLE reviews(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      product_id UUID REFERENCES products(id) NOT NULL,
      txt VARCHAR(3000) NOT NULL,
      rating INTEGER NOT NULL CHECK (rating>0 AND rating<6)
    );
  `;
  
  await client.query(SQL);

  const [moe, lucy, ethyl] = await Promise.all([
    createUser({ username: 'moe', password: 'm_password', is_admin: false, is_vip: false}),
    createUser({ username: 'lucy', password: 'l_password', is_admin: false, is_vip: false}),
    createUser({ username: 'ethyl', password: '1234', is_admin: true, is_vip: true})
  ]);
  

  const [guitar, bass, keyboard, drums] = await Promise.all([
    createProduct({ name: 'Guitar', price: 100, description: 'A high-quality acoustic guitar, perfect for beginners and experienced players.'}),
    createProduct({ name: 'Bass', price: 500, description: 'A versatile electric bass guitar with a rich tone, ideal for bassists.' }),
    createProduct({ name: 'Keyboard', price: 1000, description: 'An advanced digital keyboard with a wide range of sounds and features.' }),
    createProduct({ name: 'Drums', price: 12000, description: 'A professional drum kit for drummers who demand the best in sound and durability.' }),
  ]);
  await editProduct({...guitar, image: profileImage})
  await Promise.all([
    createBookmark({ user_id: ethyl.id, product_id: guitar.id }),
    createBookmark({ user_id: ethyl.id, product_id: bass.id }),
    createBookmark({ user_id: moe.id, product_id: drums.id }),
    createBookmark({ user_id: moe.id, product_id: keyboard.id })

  ]);
  let orders = await fetchOrders(ethyl.id);
  let cart = orders.find(order => order.is_cart);
  let lineItem = await createLineItem({ order_id: cart.id, product_id: guitar.id});
  // Creates a generic description for development
  const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ultrices lacus nec odio auctor, in congue lacus ultricies. Quisque non ligula et enim consequat scelerisque. Integer interdum leo tristique feugiat lobortis. Phasellus nunc erat, hendrerit vitae neque in, scelerisque convallis eros. Cras vitae purus bibendum, placerat lectus ut, consectetur arcu. Praesent porta, tellus dignissim cursus elementum, dolor ipsum iaculis purus, sed consequat erat magna et odio. In volutpat mi enim, eu tempus eros porta nec.'
  await Promise.all([
    createReview({ product_id: bass.id, txt: loremIpsum, rating: '4' }),
    createReview({ product_id: guitar.id, txt: loremIpsum, rating: '5' }),
    createReview({ product_id: bass.id, txt: loremIpsum, rating: '1' })
  ]);
  // const productReviews = reviews.filter((review) => {
  //   const matchingProduct = products.find((product) => product.id === review.product_id);
  //   return matchingProduct !== undefined;
  // });
  lineItem.quantity++;
  await updateLineItem(lineItem);
  lineItem = await createLineItem({ order_id: cart.id, product_id: bass.id});
  cart.is_cart = false;
  await updateOrder(cart);
  const [string, percussion, keyboards, woodwinds] = await Promise.all([
    createTags({tag : "string"}),
    createTags({tag : "percussion"}),
    createTags({tag : "keyboards"}),
    createTags({tag : "woodwinds"}),
  ]);

  const [guitar_tag1, bass_tag1, keyboard_tag1] = await Promise.all([
    insertProductTags(guitar.id, string.id, string.tag),
    insertProductTags(bass.id,string.id, string.tag),
    insertProductTags(keyboard.id, keyboards.id, keyboards.tag),
    insertProductTags(keyboard.id, percussion.id, percussion.tag),
  ]);
};

module.exports = {
  fetchProducts,
  fetchOrders,
  fetchLineItems,
  createLineItem,
  updateLineItem,
  deleteLineItem,
  updateOrder,
  authenticate,
  findUserByToken,
  seed,
  createUser,
  fetchUsers,
  fetchUser,
  updateUser,
  fetchTags,
  editProduct,
  createProduct,
  createReview,
  fetchReviews,
  fetchAllOrders,
  fetchAllLineItems,
  fetchBookmarks,
  deleteBookmark,
  createBookmark,
  updateOrderFulfilled,
  client
};
