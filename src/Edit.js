import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import api from './api';



const Edit = ({products}) => {
    const product = products.find(item => item.id === useParams().id);
if (product) {
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price);
    const [description, setDescription] = useState(product.description);

   const submitHandler = async (ev) => {
    ev.preventDefault;
    const json = {name, price, description, id: product.id}
    await api.editProduct(json)
   }


  return product ?(
   <form onSubmit={ev => submitHandler(ev)}>
    <label>Name:</label>
    <input type='text' value={name} onChange={ev => setName(ev.target.value)}></input>
    <label>Price:</label>
    <input type='number' value={price} onChange={ev => setPrice(ev.target.value)}></input>
    <label>Description:</label>
    <input type='text' value={description} onChange={ev => setDescription(ev.target.value)}></input>
    <button>Submit Changes</button>
   </form>
  ):(
    null
  )
}}

export default Edit