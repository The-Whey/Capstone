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
  createReview,
  checkExistingReview
} = require('./products');

const {
  fetchTags,
  insertProductTags,
  createTags,
  fetchTagList,
  checkDupeTags,
  checkDupeProductTags
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
  createBookmark,
  deleteBookmark,
  updateOrderFulfilled,
  createAddress,
  fetchAddresses,
  deleteAddress,
} = require('./cart');

// const createBookmark = async(bookmark)=> {
//   const SQL = `
//   INSERT INTO bookmarks (product_id, user_id, id) VALUES($1, $2, $3) RETURNING *
// `;
//  response = await client.query(SQL, [ bookmark.product_id, bookmark.user_id, uuidv4()]);
//   return response.rows[0];
// };



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
    DROP TABLE IF EXISTS addresses;
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

    CREATE TABLE addresses(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      data JSON DEFAULT '{}',
      user_id UUID REFERENCES users(id) NOT NULL,
      nickname VARCHAR(50)
    );

    CREATE TABLE orders(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      is_cart BOOLEAN NOT NULL DEFAULT true,
      user_id UUID REFERENCES users(id) NOT NULL,
      fulfilled BOOLEAN NOT NULL DEFAULT false,
      address UUID REFERENCES addresses(id)
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
      user_id UUID REFERENCES users(id) NOT NULL,
      txt VARCHAR(3000) NOT NULL,
      rating INTEGER NOT NULL CHECK (rating>0 AND rating<6),
      CONSTRAINT unique_user_product_review UNIQUE (user_id, product_id)
    );
  `;
  
  await client.query(SQL);

  const [moe, lucy, ethyl] = await Promise.all([
    createUser({ username: 'moe', password: 'm_password', is_admin: false, is_vip: false}),
    createUser({ username: 'lucy', password: 'l_password', is_admin: false, is_vip: false}),
    createUser({ username: 'ethyl', password: '1234', is_admin: true, is_vip: true})
  ]);
  
  const [guitar, bass, keyboard, drums,fenderbassWhite, fenderbassSilver, fenderStrat, gibsonlespaulBlue, gibsonlespaulBlack, martinSpecial, rogueStarter, yamahaGuitar, rogueJunior, yamahaRydeen, yamahakeyboardBlack, yamahakeyboardWhite] = await Promise.all([
    createProduct({ name: 'Epiphone PRO-1 Acoustic', price: 18999, description: "Epiphone's PRO-1 is the fastest and easiest way to start playing the guitar! Specifically designed to make learning how to play as easy as possible!"}),
    createProduct({ name: 'Fender Jazz Bass', price: 129999, description: "This model is characterized by its distinctive color and is built with a basswood body paired to a maple neck and fingerboard. Dual vintage-style single-coil pickups top off the look and sound of this slick electric and deliver classic tones for limitless inspiration." }),
    createProduct({ name: 'Williams Legato IV 88-key Digital Piano', price: 34999, description: "The Williams Legato IV digital piano motivates aspiring keyboardists with a stunning concert grand sound—as well as a collection of electric pianos, organs, strings, basses and a synth." }),
    createProduct({ name: 'Roland VAD507 V-Drums', price: 499999, description: "The Roland VAD507 V-drums kit delivers the commanding presence of a full acoustic drum set on stage with the convenience and control of electronic drums." }),
    createProduct({ name: 'Fender Player Jazz Bass (White)', price: 84999, description: "With its dual single-coil pickups and smooth playing feel, the Player Jazz Bass is an inspiring instrument with classic, elevated style and authentic Fender bass tone." }),
    createProduct({ name: 'Fender Player Jazz Bass (Silver)', price: 79900, description: "With its dual single-coil pickups and smooth playing feel, the Player Jazz Bass is an inspiring instrument with classic, elevated style and authentic Fender bass tone." }),
    createProduct({ name: 'Fender Stratocaster', price: 89999, description: "Loaded with innovative features catering to discerning players searching for ultimate precision, tone and comfort, this state of the art Stratocaster is a bold step forward." }),
    createProduct({ name: 'Gibson Les Paul (Blue)', price: 299900, description: "This Les Paul Standard features a mahogany body with an AA figured maple top and a slim taper mahogany neck with a rosewood fretboard for resonant tone and fast playability." }),
    createProduct({ name: 'Gibson Les Paul (Black)', price: 299900, description: "This Les Paul Standard features a mahogany body with an AA figured maple top and a slim taper mahogany neck with a rosewood fretboard for resonant tone and fast playability." }),
    createProduct({ name: 'Martin Special Road Series', price: 149900, description: "With a gorgeous glossed Sitka spruce top and Etimoe back and sides, this Martin cutaway model is a great sounding guitar at an affordable price." }),
    createProduct({ name: 'Rogue Starter Acoustic Guitar', price: 7999, description: "The small-bodied Rogue Starter acoustic guitar is an amazing deal for a starter guitar. Its smaller profile makes it very playable for kids or aspiring guitarists with smaller body frames and hands." }),
    createProduct({ name: 'Yamaha F335', price: 18999, description: "The F335 acoustic guitar from Yamaha is a stellar blend of quality, playability and affordability that offers an appealing option for both beginners and seasoned musicians alike." }),
    createProduct({ name: 'Rogue Junior Kicker 5pc Drum Set', price: 29999, description: "This drum set has a compact frame to appease smaller rockers but maintains Rogue's great playability and sound that its customers have grown accustomed to." }),
    createProduct({ name: 'Yamaha Rydeen 5- Piece Drum set', price: 41999, description: "This set utilizes genuine Yamaha tom holders for simple adjustments and features solid and glitter finishes. Yamaha Hardware allows creative setup variations and grows with the needs of a younger player." }),
    createProduct({ name: 'Yamaha P-125A Digial Piano (Black)', price: 79999, description: "The P-125A is an 88-key graded hammer action piano with a complement of common sounds including multiple grand piano voices, electric pianos from an authentic Rhodes to an FM-style piano, clavinet, strings, vibes and more." }),
    createProduct({ name: 'Yamaha P-125A Digial Piano (White)', price: 79999, description: "The P-125A is an 88-key graded hammer action piano with a complement of common sounds including multiple grand piano voices, electric pianos from an authentic Rhodes to an FM-style piano, clavinet, strings, vibes and more." }),
  ]);

  editProduct({...guitar, image: 'https://i.imgur.com/AHBcSQc.png'}),
  editProduct({...bass, image: 'https://i.imgur.com/nVdnXCh.png'}),
  editProduct({...keyboard, image: 'https://i.imgur.com/3bx0RvN.png'}),
  editProduct({...drums, image: 'https://i.imgur.com/RSyLpZa.png'}),
  editProduct({...fenderbassWhite, image: 'https://i.imgur.com/j3Sb9lc.png'}),
  editProduct({...fenderbassSilver, image: 'https://i.imgur.com/pPFphWA.png'}),
  editProduct({...fenderStrat, image: 'https://i.imgur.com/wPWBac3.png'}),
  editProduct({...gibsonlespaulBlue, image: 'https://i.imgur.com/eK07wzy.png'}),
  editProduct({...gibsonlespaulBlack, image: 'https://i.imgur.com/AQowZ9S.png'}),
  editProduct({...martinSpecial, image: 'https://i.imgur.com/z2K9atU.png'}),
  editProduct({...rogueStarter, image: 'https://i.imgur.com/Kg6LnhI.png'}),
  editProduct({...yamahaGuitar, image: 'https://i.imgur.com/7wzXRoQ.png'}),
  editProduct({...rogueJunior, image: 'https://i.imgur.com/kv4LlAa.png'}),
  editProduct({...yamahaRydeen, image: 'https://i.imgur.com/4fhELwB.png'}),
  editProduct({...yamahakeyboardBlack, image: 'https://i.imgur.com/yG2NIpO.png'}),
  editProduct({...yamahakeyboardWhite, image: 'https://i.imgur.com/hb6HBkw.png'}),


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
  const [reviews] = await Promise.all([
    createReview({ product_id: bass.id, user_id: moe.id, txt: loremIpsum, rating: '4' }),
    createReview({ product_id: guitar.id, user_id: moe.id, txt: loremIpsum, rating: '5' }),
    createReview({ product_id: bass.id, user_id: ethyl.id, txt: loremIpsum, rating: '1' })
  ]);
  lineItem.quantity++;
  await updateLineItem(lineItem);
  lineItem = await createLineItem({ order_id: cart.id, product_id: bass.id});
  const address = await createAddress({user_id: ethyl.id, nickname: 'Home', data: {properties: {formatted: '742 Evergreen Terrace, Springfield, MO 77747'}}})
  cart.is_cart = false;
  cart.address = address.id
  await updateOrder(cart);

  const [string, percussion, keyboards, woodwinds] = await Promise.all([
    createTags({tag : "string"}),
    createTags({tag : "percussion"}),
    createTags({tag : "keyboards"}),
    createTags({tag : "woodwinds"}),
  ]);
  
  const [guitar_tag1, bass_tag1, keyboard_tag1, keyboard_tag2, guitar_tag2, bass_tag2, keyboard_tag3, drums_tag1] = await Promise.all([
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
  checkExistingReview,
  createAddress,
  fetchAddresses,
  fetchTagList,
  checkDupeTags,
  insertProductTags,
  checkDupeProductTags,
  deleteAddress,
  client
};