const client = require('./client');

const {
  fetchProducts,
  createProduct,
  editProduct
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
  fetchAllLineItems
} = require('./cart');


const seed = async()=> {
  const SQL = `
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
      is_vip BOOLEAN NOT NULL
    );

    CREATE TABLE products(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      name VARCHAR(100) UNIQUE NOT NULL,
      price INT NOT NULL,
      description VARCHAR(1600)
    );

    CREATE TABLE orders(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      is_cart BOOLEAN NOT NULL DEFAULT true,
      user_id UUID REFERENCES users(id) NOT NULL
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
      tag_id UUID REFERENCES tags(id) NOT NULL

    );

  `;
  await client.query(SQL);

  const [moe, lucy, ethyl] = await Promise.all([
    createUser({ username: 'moe', password: 'm_password', is_admin: false, is_vip: false}),
    createUser({ username: 'lucy', password: 'l_password', is_admin: false, is_vip: false}),
    createUser({ username: 'ethyl', password: '1234', is_admin: true, is_vip: true})
  ]);
  // Creates a generic description for development
  const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ultrices lacus nec odio auctor, in congue lacus ultricies. Quisque non ligula et enim consequat scelerisque. Integer interdum leo tristique feugiat lobortis. Phasellus nunc erat, hendrerit vitae neque in, scelerisque convallis eros. Cras vitae purus bibendum, placerat lectus ut, consectetur arcu. Praesent porta, tellus dignissim cursus elementum, dolor ipsum iaculis purus, sed consequat erat magna et odio. In volutpat mi enim, eu tempus eros porta nec.'
  const [guitar, bass, keyboard, drums] = await Promise.all([
    createProduct({ name: 'Guitar', price: 100, description: loremIpsum}),
    createProduct({ name: 'Bass', price: 500, description: loremIpsum }),
    createProduct({ name: 'Keyboard', price: 1000, description: loremIpsum }),
    createProduct({ name: 'Drums', price: 12000, description: loremIpsum }),
  ]);
  let orders = await fetchOrders(ethyl.id);
  let cart = orders.find(order => order.is_cart);
  let lineItem = await createLineItem({ order_id: cart.id, product_id: guitar.id});
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
  console.log(woodwinds.id)
  const [guitar_tag1, bass_tag1, keyboard_tag1] = await Promise.all([
    insertProductTags(guitar.id, string.id),
    insertProductTags(bass.id,string.id),
    insertProductTags(keyboard.id, keyboards.id),
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
  fetchAllOrders,
  fetchAllLineItems,
  client
};
