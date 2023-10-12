const client = require('./client');

const {
  fetchProducts,
  createProduct,
  editProduct,
  fetchReviews,
  createReview
} = require('./products');

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
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS line_items;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS users;

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

    CREATE TABLE reviews(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      product_id UUID REFERENCES products(id) NOT NULL,
      txt VARCHAR(255) NOT NULL,
      rating INTEGER NOT NULL CHECK (rating>0 AND rating<6)
    );

  `;
  await client.query(SQL);

  const [moe, lucy, ethyl] = await Promise.all([
    createUser({ username: 'moe', password: 'm_password', is_admin: false, is_vip: false}),
    createUser({ username: 'lucy', password: 'l_password', is_admin: false, is_vip: false}),
    createUser({ username: 'ethyl', password: '1234', is_admin: true, is_vip: true})
  ]);
  const [foo, bar, bazz] = await Promise.all([
    createProduct({ name: 'Guitar', price: 100, description: 'A high-quality acoustic guitar, perfect for beginners and experienced players.' }),
    createProduct({ name: 'Bass', price: 500, description: 'A versatile electric bass guitar with a rich tone, ideal for bassists.' }),
    createProduct({ name: 'Keyboard', price: 1000, description: 'An advanced digital keyboard with a wide range of sounds and features.' }),
    createProduct({ name: 'Drums', price: 12000, description: 'A professional drum kit for drummers who demand the best in sound and durability.' }),
  ]);
  let orders = await fetchOrders(ethyl.id);
  let cart = orders.find(order => order.is_cart);
  let lineItem = await createLineItem({ order_id: cart.id, product_id: foo.id});
  // Creates a generic description for development
  const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ultrices lacus nec odio auctor, in congue lacus ultricies. Quisque non ligula et enim consequat scelerisque. Integer interdum leo tristique feugiat lobortis. Phasellus nunc erat, hendrerit vitae neque in, scelerisque convallis eros. Cras vitae purus bibendum, placerat lectus ut, consectetur arcu. Praesent porta, tellus dignissim cursus elementum, dolor ipsum iaculis purus, sed consequat erat magna et odio. In volutpat mi enim, eu tempus eros porta nec.'
  const [reviews] = await Promise.all([
    createReview({ product_id: bar.id, txt: loremIpsum, rating: '4' }),
    createReview({ product_id: foo.id, txt: loremIpsum, rating: '5' }),
    createReview({ product_id: bar.id, txt: loremIpsum, rating: '1' })
  ]);
  const productReviews = reviews.filter((review) => {
    const matchingProduct = products.find((product) => product.id === review.product_id);
    return matchingProduct !== undefined;
  });
  lineItem.quantity++;
  await updateLineItem(lineItem);
  lineItem = await createLineItem({ order_id: cart.id, product_id: bar.id});
  cart.is_cart = false;
  await updateOrder(cart);
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
  editProduct,
  createProduct,
  createReview,
  fetchReviews,
  fetchAllOrders,
  fetchAllLineItems,
  client
};
