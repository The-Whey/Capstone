import React, { useState } from 'react'
import api from './api';
import Orders from './Orders';

const Admin = ({users, setUsers, products, setProducts, allOrders, setAllOrders, allLineItems, auth}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');

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

  const submitNewProduct = async(ev) => {
    ev.preventDefault();
    const json = {name, price: (price *  100), description};
    const response = await api.submitNewProduct(json);
    setProducts([...products, response])
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
      <form onSubmit={ev => submitNewProduct(ev)}>
        <label>Name:</label>
        <input type='text' value={name} onChange={ev => setName(ev.target.value)}></input>
        <label>Price:</label>
        <input type='number' value={price} min={0} onChange={ev => setPrice(ev.target.value)}></input>
        <label>Desription:</label>
        <input type='text' value={description} onChange={ev => setDescription(ev.target.value)}></input>
        <button disabled={!name || !description || price === 0}>Create New Product</button>
      </form>
      <hr/>
      <Orders orders={allOrders} setorders={setAllOrders} lineItems={allLineItems} products={products} auth={auth}/>
      <hr/>
      <h3>---- end of admin page here ----</h3>
      <hr/>
    </div>
  )
}

export default Admin;