import React, { useEffect, useRef, useState } from 'react'
import api from './api';
import Orders from './Orders';
import NewProductForm from './NewProductForm';
import { useNavigate } from 'react-router-dom';

const Admin = ({users, setUsers, products, setProducts, allOrders, setAllOrders, allLineItems, auth, addresses}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('')
  const navigate = useNavigate()
  const el = useRef();

  const setVipTrue = async (user) => {
    user.is_vip = true;
    const response = await api.updateUser(user);
    setUsers(users.map(item => item.id === response.id ? response : item))
  }

  const setVipFalse = async (user) => {
    user.is_vip = false;
    const response = await api.updateUser(user);
    setUsers(users.map(item => item.id === response.id ? response : item)) 
  }



  if (!allOrders || !allLineItems || !products) return null;
  if (!auth.is_admin) return <p>Access Denied</p>

  return (
    <div>
      <h3>Users</h3>
      <ul>
        {
          users.map(user => {
            return <li key={user.id}>{user.username} 
            {user.is_vip ? <button onClick={() => setVipFalse(user)}>Remove VIP Status</button> : <button onClick={() => setVipTrue(user)}>Make VIP</button>}
            </li>
          })
        }
      </ul>
      <hr/>
      <Orders orders={allOrders} setorders={setAllOrders} lineItems={allLineItems} products={products} auth={auth} addresses={addresses} users={users}/>
      <hr/>
      <h3>Add a New Product:</h3>
      <NewProductForm products={products} setProducts={setProducts}/>
    </div>
  )
}

export default Admin;