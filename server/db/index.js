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
    createProduct({ name: 'Epiphone PRO-1 Acoustic', price: 18999, description: "The Epiphone PRO-1 Acoustic Guitar, a pioneering dreadnought that makes playing and learning a breeze. Epiphone, a leader in accessible, professional-grade instruments, has reimagined the iconic dreadnought profile with innovative features that reduce hand fatigue and simplify fretting. Now available at Guitar Center, the PRO-1 blends premium components like a solid spruce top and mahogany back and sides with a shorter scale length, slim neck, and slick fretboard for peerless playability."}),
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
    createProduct({ name: 'Yamaha P-125A Digital Piano (Black)', price: 79999, description: "The P-125A is an 88-key graded hammer action piano with a complement of common sounds including multiple grand piano voices, electric pianos from an authentic Rhodes to an FM-style piano, clavinet, strings, vibes and more." }),
    createProduct({ name: 'Yamaha P-125A Digital Piano (White)', price: 79999, description: "The P-125A is an 88-key graded hammer action piano with a complement of common sounds including multiple grand piano voices, electric pianos from an authentic Rhodes to an FM-style piano, clavinet, strings, vibes and more." }),
  ]);

  editProduct({...guitar, image: 'https://i.imgur.com/EtIXBar.png'}),
  editProduct({...bass, image: 'https://i.imgur.com/ymWDk3Z.png'}),
  editProduct({...keyboard, image: 'https://i.imgur.com/zGLigId.png'}),
  editProduct({...drums, image: 'https://i.imgur.com/IaORL3H.png'}),
  editProduct({...fenderbassWhite, image: 'https://i.imgur.com/cZTSCWv.png'}),
  editProduct({...fenderbassSilver, image: 'https://i.imgur.com/BXb6GRN.png'}),
  editProduct({...fenderStrat, image: 'https://i.imgur.com/bkVxIF7.png'}),
  editProduct({...gibsonlespaulBlue, image: 'https://i.imgur.com/4C1j9Ce.png'}),
  editProduct({...gibsonlespaulBlack, image: 'https://i.imgur.com/TTGgStH.png'}),
  editProduct({...martinSpecial, image: 'https://i.imgur.com/zMX7InU.png'}),
  editProduct({...rogueStarter, image: 'https://i.imgur.com/gKSXDfU.png'}),
  editProduct({...yamahaGuitar, image: 'https://i.imgur.com/ulzaYzz.png'}),
  editProduct({...rogueJunior, image: 'https://i.imgur.com/KkAE0Xl.png'}),
  editProduct({...yamahaRydeen, image: 'https://i.imgur.com/zPnOgt3.png'}),
  editProduct({...yamahakeyboardBlack, image: 'https://i.imgur.com/Uufd0kw.png'}),
  editProduct({...yamahakeyboardWhite, image: 'https://i.imgur.com/llSnIH1.png'}),


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
  const loremIpsum = "I can't believe it took me this long to find this instrument! I can't imagine playing anything else from now on!"
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

  const [electric, acoustic, drum, keys, guitars, basses] = await Promise.all([
    createTags({tag : "Electric"}),
    createTags({tag : "Acoustic"}),
    createTags({tag : "Drums"}),
    createTags({tag : "Keyboard"}),
    createTags({tag : "Guitar"}),
    createTags({tag : "Bass"}),

  ]);
  
  const [a,aa,b,bb,c,cc,d,dd,e,ee,f,ff,g,gg,h,hh,i,ii,j,jj,k,kk,l,ll,m,mm,n,nn,o,oo,p,pp]  = await Promise.all([
    insertProductTags(guitar.id, acoustic.id, acoustic.tag),
    insertProductTags(guitar.id, guitars.id, guitars.tag),
    insertProductTags(bass.id,electric.id, electric.tag),
    insertProductTags(bass.id,basses.id, basses.tag),
    insertProductTags(keyboard.id, keys.id, keys.tag),
    insertProductTags(keyboard.id, electric.id, electric.tag),
    insertProductTags(drums.id, drum.id, drum.tag),
    insertProductTags(drums.id, electric.id, electric.tag),
    insertProductTags(fenderbassWhite.id, electric.id, electric.tag),
    insertProductTags(fenderbassWhite.id, basses.id, basses.tag),
    insertProductTags(fenderbassSilver.id, electric.id, electric.tag),
    insertProductTags(fenderbassSilver.id, basses.id, basses.tag),
    insertProductTags(fenderStrat.id, electric.id, electric.tag),
    insertProductTags(fenderStrat.id, guitars.id, guitars.tag),
    insertProductTags(gibsonlespaulBlue.id, electric.id, electric.tag),
    insertProductTags(gibsonlespaulBlue.id, guitars.id, guitars.tag),
    insertProductTags(gibsonlespaulBlack.id, electric.id, electric.tag),
    insertProductTags(gibsonlespaulBlack.id, guitars.id, guitars.tag),
    insertProductTags(martinSpecial.id, acoustic.id, acoustic.tag),
    insertProductTags(martinSpecial.id, guitars.id, guitars.tag),
    insertProductTags(rogueStarter.id, acoustic.id, acoustic.tag),
    insertProductTags(rogueStarter.id, guitars.id, guitars.tag),
    insertProductTags(yamahaGuitar.id, acoustic.id, acoustic.tag),
    insertProductTags(yamahaGuitar.id, guitars.id, guitars.tag),
    insertProductTags(rogueJunior.id, drum.id, drum.tag),
    insertProductTags(rogueJunior.id, acoustic.id, acoustic.tag),
    insertProductTags(yamahaRydeen.id, drum.id, drum.tag),
    insertProductTags(yamahaRydeen.id, acoustic.id, acoustic.tag),
    insertProductTags(yamahakeyboardBlack.id, keys.id, keys.tag),
    insertProductTags(yamahakeyboardBlack.id,electric.id, electric.tag),
    insertProductTags(yamahakeyboardWhite.id, keys.id, keys.tag),
    insertProductTags(yamahakeyboardWhite.id,electric.id, electric.tag),
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