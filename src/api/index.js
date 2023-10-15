import axios from 'axios';

const getHeaders = ()=> {
  return {
    headers: {
      authorization: window.localStorage.getItem('token')
    }
  };
};

const fetchProducts = async(setProducts)=> {
  const response = await axios.get('/api/products');
  setProducts(response.data);
};

const fetchAddresses = async(setAddresses) => {
  const response = await axios.get('/api/orders/addresses');
  setAddresses(response.data)
}

const fetchTags = async(setTags)=> {
  const response = await axios.get('/api/tags');
  setTags(response.data);
};

const fetchReviews = async(setReviews)=> {
  const response = await axios.get('/api/products');
  setReviews(response.data);
};

const fetchUsers = async(setUsers) => {
  const response = await axios.get('/api/users');
  setUsers(response.data);
}

const fetchOrders = async(setOrders)=> {
  const response = await axios.get('/api/orders', getHeaders());
  setOrders(response.data);
};

const fetchAllOrders = async(setAllOrders)=> {
  const response = await axios.get('/api/orders/admin')
  setAllOrders(response.data);
}

const fetchLineItems = async(setLineItems)=> {
  const response = await axios.get('/api/lineItems', getHeaders());
  setLineItems(response.data);
};

const fetchAllLineItems = async(setAllLineItems) => {
  const response = await axios.get('/api/lineitems/admin');
  setAllLineItems(response.data)
}

const createLineItem = async({ product, cart, lineItems, setLineItems })=> {
  const response = await axios.post('/api/lineItems', {
    order_id: cart.id,
    product_id: product.id
  }, getHeaders());
  setLineItems([...lineItems, response.data]);
};

const updateLineItem = async({ lineItem, cart, lineItems, setLineItems })=> {
  const response = await axios.put(`/api/lineItems/${lineItem.id}`, {
    quantity: lineItem.quantity + 1,
    order_id: cart.id
  }, getHeaders());
  setLineItems(lineItems.map( lineItem => lineItem.id == response.data.id ? response.data: lineItem));
};

const updateOrder = async({ order, setOrders })=> {
  await axios.put(`/api/orders/${order.id}`, order, getHeaders());
  const response = await axios.get('/api/orders', getHeaders());
  setOrders(response.data);
};

const removeFromCart = async({ lineItem, lineItems, setLineItems })=> {
  const response = await axios.delete(`/api/lineItems/${lineItem.id}`, getHeaders());
  setLineItems(lineItems.filter( _lineItem => _lineItem.id !== lineItem.id));
};

const addAddress = async(json) => {
  const response = await axios.post(`/api/orders/addresses`, json);
  return response.data;
}

const attemptLoginWithToken = async(setAuth)=> {
  const token = window.localStorage.getItem('token');
  if(token){
    try {
      const response = await axios.get('/api/me', getHeaders());
      setAuth(response.data);
    }
    catch(ex){
      if(ex.response.status === 401){
        window.localStorage.removeItem('token');
      }
    }
  }
}

const login = async({ credentials, setAuth, setError })=> {
  try{
  const response = await axios.post('/api/login', credentials);
  const { token } = response.data;
  window.localStorage.setItem('token', token);
  attemptLoginWithToken(setAuth);
  setError('');
}catch(error){if (error.response && error.response.status === 401){
  setError("Invalid credentials.");
} else {
  setError("An error occurred during login.");
}}}


const logout = (setAuth)=> {
  window.localStorage.removeItem('token');
  setAuth({});
}

const createUser = async(user) => {
  await axios.post('/api/users', user);
}

const updateUser = async(user) => {
  const response = await axios.put(`/api/users/${user.id}`, user);
  return response.data;
}

const submitNewProduct = async(json) => {
  const response = await axios.post('/api/products', json);
  return response.data;
}

const editProduct = async(json) => {
  const response = await axios.put(`/api/products/${json.id}`, json);
  return response.data;
}

const orderFulfilled = async(json) => {
  const response = await axios.put(`/api/orders/${json.id}/fulfilled`, json);
  return response.data;
}

const api = {
  login,
  logout,
  fetchProducts,
  fetchReviews,
  fetchOrders,
  fetchUsers,
  fetchLineItems,
  createLineItem,
  updateLineItem,
  updateOrder,
  removeFromCart,
  attemptLoginWithToken,
  updateUser,
  submitNewProduct,
  editProduct,
  createUser,
  fetchAllOrders,
  fetchAllLineItems,
  orderFulfilled,
  addAddress,
  fetchTags,
  fetchAddresses
};

export default api;
