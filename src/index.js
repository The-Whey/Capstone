import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { Link, HashRouter, Routes, Route, useParams } from 'react-router-dom';
import axios from 'axios';
import Products from './Products';
import Product from './Product';
import Orders from './Orders';
import Cart from './Cart';
import Login from './Login';
import api from './api';
import Admin from './Admin';
import Edit from './Edit';
import Profile from './Profile';
import FilteredProducts from './FilteredProducts';
import Map from './Map';
import Wishlist from './Wishlist';

const App = ()=> {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [allLineItems, setAllLineItems] = useState([]);
  const [auth, setAuth] = useState({});
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const HEREapikey = window.HEREapi
  const {term} = useParams();

  const getHeaders = ()=> {
    return {
      headers: {
        authorization: window.localStorage.getItem('token')
      }
    };
  };
  
  const attemptLoginWithToken = async()=> {
    await api.attemptLoginWithToken(setAuth);
  }

  useEffect(()=> {
    attemptLoginWithToken();
  }, []);

  useEffect(()=> {
    const fetchData = async()=> {
      await api.fetchProducts(setProducts);
    };
    fetchData();
  }, []);

  useEffect(()=> {
    const fetchData = async()=> {
      await api.fetchTags(setTags);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async() => {
      await api.fetchTagsList(setTagsList);
    }
    fetchData()
  }, [])

  useEffect(()=> {
    const fetchData = async()=> {
      await api.fetchReviews(setReviews);
    };
    fetchData();
  }, []);

  useEffect(()=> {
    if(auth.id){
      const fetchData = async()=> {
        await api.fetchOrders(setOrders);
      };
      fetchData();
    }
  }, [auth]);

  useEffect(()=> {
    if(auth.id){
      const fetchData = async()=> {
        const response = await axios.get('/api/orders/bookmarks', getHeaders());
        setBookmarks(response.data);
      };
      fetchData();
    }
  }, [auth]);

  useEffect(()=> {
    if(auth.id){
      const fetchData = async()=> {
        await api.fetchLineItems(setLineItems);
      };
      fetchData();
    }
  }, [auth]);

  useEffect(()=> {
    if(auth.is_admin){
      const fetchData = async() => {
        await api.fetchAllLineItems(setAllLineItems)
      }
      fetchData()
    }
  }, [auth, lineItems])

  useEffect(() => {
    const fetchAddresses = async() =>{
      await api.fetchAddresses(setAddresses)
    }
    fetchAddresses();
  }, [orders, auth])

  useEffect(() => {
    if(auth){
      const fetchData = async() => {
        await api.fetchUsers(setUsers);
      }
      fetchData();
    }
  }, [auth])

  useEffect(() => {
    if(auth.is_admin){
      const fetchData = async () => {
        await api.fetchAllOrders(setAllOrders)
      }
      fetchData()
    }
  }, [auth, orders])

  const createLineItem = async(product)=> {
    await api.createLineItem({ product, cart, lineItems, setLineItems});
  };

  const updateLineItem = async(lineItem)=> {
    await api.updateLineItem({ lineItem, cart, lineItems, setLineItems });
  };

  const updateOrder = async(order)=> {
    await api.updateOrder({ order, setOrders });
  };

  const removeFromCart = async(lineItem)=> {
    await api.removeFromCart({ lineItem, lineItems, setLineItems });
  };

  const createBookmark = async(bookmark)=> {
    const response = await axios.post('/api/orders/bookmarks', bookmark, getHeaders());
    setBookmarks([...bookmarks, response.data]);
  };

  const removeBookmark = async(bookmark)=> {
    await axios.delete(`/api/orders/bookmarks/${bookmark.id}`, getHeaders());
    setBookmarks(bookmarks.filter(_bookmark => _bookmark.id !== bookmark.id));
  };
  
  const cart = orders.find(order => order.is_cart) || {};

  const cartItems = lineItems.filter(lineItem => lineItem.order_id === cart.id);

  const cartCount = cartItems.reduce((acc, item)=> {
    return acc += item.quantity;
  }, 0);

  const login = async(credentials)=> {
    await api.login({ credentials, setAuth, setError });
  }

  const logout = ()=> {
    api.logout(setAuth);
  }
  const getUserImage = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.image : null;
  };
  return (
    <div>
      {
        auth.id ? (
          <>
            <nav>
              <Link to='/products'>Products ({ products.length })</Link>
              <Link to='/orders'>Orders ({ orders.filter(order => !order.is_cart).length })</Link>
              <Link to='/cart'>Cart ({ cartCount })</Link>
              <Link to='/profile'>Profile</Link>
              <Link to='/wishlist'>Wishlist ({bookmarks.length})</Link>
              {auth.is_admin ? <Link to='/admin'>Admin</Link> : null}
              <span>
                Welcome { auth.username }!
              </span>
              
            </nav>
            <div className='dropdown'>
              <button className='dropbtn button'><img
                src={getUserImage(auth.id)}
                alt="User Profile"
                width="40"
                height="40"
              /></button>
              <div class="dropdown-content">
              <a><button onClick={ logout }>Logout</button></a>
              </div>
              </div>
            <Routes>
            <Route path='/' element={
                <Products
                tags={tags}
                tagsList={tagsList}
                auth = { auth }
                products={ products }
                cartItems = { cartItems }
                createLineItem = { createLineItem }
                updateLineItem = { updateLineItem }
                bookmarks = {bookmarks}
                createBookmark= { createBookmark}
                removeBookmark={ removeBookmark}
                reviews={reviews}
            />}/>


              <Route path='/products/:id' element={
                <Product 
                  tags={tags}
                  setTags = {setTags}
                  setTagsList = {setTagsList}
                  tagsList = {tagsList}
                  products={products}
                  setProducts={setProducts} 
                  reviews={reviews}
                  setReviews={setReviews}
                  auth={auth} 
                  cartItems={cartItems} 
                  createLineItem={createLineItem} 
                  updateLineItem={updateLineItem}
                  users={users}
                />}/>

              <Route path='/admin' element={
                <Admin
                  users={users}
                  setUsers={setUsers}
                  products={products}
                  setProducts={setProducts}
                  orders={orders}
                  allOrders={allOrders}
                  setAllOrders = {setAllOrders}
                  allLineItems={allLineItems}
                  auth={auth}
                  addresses={addresses} 
                />}/>

              <Route path='/products/:id/edit' element={
                <Edit 
                  products={products}
                  setProducts={setProducts} 
                />}/>

              <Route path='/profile' element={
                <Profile
                  auth={auth}
                  users={users}
                  addresses={addresses} 
                  setAddresses={setAddresses}
                />}/>

              <Route path='/products' element={
                <Products
                  tags={tags}
                  tagsList={tagsList}
                  auth = { auth }
                  products={ products }
                  cartItems = { cartItems }
                  createLineItem = { createLineItem }
                  updateLineItem = { updateLineItem }
                  bookmarks = {bookmarks}
                  createBookmark= { createBookmark}
                  removeBookmark={ removeBookmark}
                  reviews={reviews}
              />}/>

              <Route path='/products/search/:term' element={
                <Products
                  tags={tags}
                  tagsList={tagsList}
                  auth = { auth }
                  products={ products }
                  cartItems = { cartItems }
                  createLineItem = { createLineItem }
                  updateLineItem = { updateLineItem }
                  bookmarks = {bookmarks}
                  createBookmark= { createBookmark}
                  removeBookmark={ removeBookmark}
                  reviews={reviews}
              />}/>

              <Route path='/cart' element={
                <Cart
                  cart = { cart }
                  lineItems = { lineItems }
                  products = { products }
                  updateOrder = { updateOrder }
                  removeFromCart = { removeFromCart }
                  updateLineItem = { updateLineItem }
                  setAddresses = {setAddresses}
                  addresses = {addresses}
                  auth={auth}
              />}/>

              <Route path='/orders' element={
                <Orders
                  orders = { orders }
                  setorders={ setOrders}
                  products = { products }
                  lineItems = { lineItems }
                  auth={auth}
                  addresses={addresses}
                  users={users}
              />}/>

              <Route path='/wishlist' element={
                <Wishlist
                  products={products}
                  bookmarks={bookmarks}
                  cartItems={cartItems}
                  createLineItem={createLineItem}
                  createBookmark= { createBookmark}
                  removeBookmark={ removeBookmark}
                  />}/>

            </Routes>
            <main>
              <Map apikey={HEREapikey} />
            </main>
            </>
        ):(
          <div>
            <p>{error}</p>
            <Login login={ login }/>

            <Routes>
              <Route path='/products/:id' element={
                <Product 
                tags={tags}
                products={products} 
                auth={auth} 
                reviews={reviews}
                setReviews={setReviews}
                cartItems={cartItems} 
                createLineItem={createLineItem} 
                updateLineItem={updateLineItem}
                users={users}
                />}/>

                <Route path='/products/search/:term' element={
                  <Products
                    tags={tags}
                    tagsList={tagsList}
                    auth = { auth }
                    reviews={reviews}
                    setReviews={setReviews}
                    products={ products }
                    cartItems = { cartItems }
                    createLineItem = { createLineItem }
                    updateLineItem = { updateLineItem }
                    bookmarks = {bookmarks}
                    createBookmark= { createBookmark}
                    removeBookmark={ removeBookmark}
                  />}/>

              <Route path='*' element={<Products
                    tags={tags}
                    tagsList = {tagsList}
                    auth = { auth }
                    reviews={reviews}
                    setReviews={setReviews}
                    products={ products }
                    cartItems = { cartItems }
                    createLineItem = { createLineItem }
                    updateLineItem = { updateLineItem }
                    bookmarks = {bookmarks}
                    createBookmark= { createBookmark}
                    removeBookmark={ removeBookmark}
                />}/>
              </Routes>

              <Map apikey={HEREapikey} />
          </div>
        )
      }
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<HashRouter><App /></HashRouter>);
