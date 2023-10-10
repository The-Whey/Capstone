import React, { useState } from 'react'
import api from './api';

const Admin = ({users, setUsers, products, setProducts}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');

  const setVipTrue = async (user) => {
    user.is_vip = true;
    const response = await api.setVipStatus(user);
    setUsers(users.map(item => item.id === response.id ? response : item))
  }

  const setVipFalse = async (user) => {
    user.is_vip = false;
    const response = await api.setVipStatus(user);
    setUsers(users.map(item => item.id === response.id ? response : item)) 
  }

  const submitNewProduct = async(ev) => {
    ev.preventDefault();
    const json = {name, price, description};
    const response = await api.submitNewProduct(json);
    setProducts([...products, response])
  }

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
        <button>Create New Product</button>
      </form>
    </div>
  )
}

export default Admin;