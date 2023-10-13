import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Link, HashRouter, Routes, Route } from 'react-router-dom';
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
    if(auth.is_admin){
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
              {auth.is_admin ? <Link to='/admin'>Admin</Link> : null}
              <span>
                Welcome { auth.username }!
                <button onClick={ logout }>Logout</button>
              </span>
            </nav>
            <Routes>
              <Route path='/products/:id' element={
                <Product 
                  tags={tags}
                  products={products} 
                  reviews={reviews}
                  auth={auth} 
                  cartItems={cartItems} 
                  createLineItem={createLineItem} 
                  updateLineItem={updateLineItem}/>}/>
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
                  auth={auth} />}
              />
              <Route path='/products/:id/edit' element={
                <Edit 
                  products={products}
                  setProducts={setProducts} />}
              />
              <Route path='/profile' element={
                <Profile
                  auth={auth}
                  users={users} />}
              />
            </Routes>
            <main>
              <Products
                tags={tags}
                auth = { auth }
                products={ products }
                cartItems = { cartItems }
                createLineItem = { createLineItem }
                updateLineItem = { updateLineItem }
                bookmarks = {bookmarks}
                createBookmark= { createBookmark}
                removeBookmark={ removeBookmark}
              />
              <Cart
                cart = { cart }
                lineItems = { lineItems }
                products = { products }
                updateOrder = { updateOrder }
                removeFromCart = { removeFromCart }
                updateLineItem = { updateLineItem }
              />
              <Orders
                orders = { orders }
                setorders={ setOrders}
                products = { products }
                lineItems = { lineItems }
                auth={auth}
              />
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
              cartItems={cartItems} 
              createLineItem={createLineItem} 
              updateLineItem={updateLineItem}/>}/>
            </Routes>
            <Products
              tags={tags}
              products={ products }
              cartItems = { cartItems }
              createLineItem = { createLineItem }
              updateLineItem = { updateLineItem }
              auth = { auth }
              bookmarks = { bookmarks }
              createBookmark= { createBookmark}
              removeBookmark={ removeBookmark}
            />
          </div>
        )
      }
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<HashRouter><App /></HashRouter>);
