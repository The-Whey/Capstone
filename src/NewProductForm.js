import React, { useEffect, useRef, useState } from 'react'
import api from './api';
import { useNavigate } from 'react-router-dom';

const NewProductForm = ({products, setProducts}) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('')
    const navigate = useNavigate()
    const el = useRef();

    const submitNewProduct = async(ev) => {
        ev.preventDefault();
        const json = {name, price: (price *  100), description, image};
        const response = await api.submitNewProduct(json);
        setProducts([...products, response])
        navigate(`/products/${response.id}`)
        setName('');
        setPrice(0);
        setDescription('');
        setImage('')
      }
    
      useEffect(() => {
          el.current.addEventListener('change', (ev) => {
            const file = ev.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.addEventListener('load', () => {
              setImage(reader.result)
              console.log(image)
            })
          })
      }, [])

  return (
    <form onSubmit={ev => submitNewProduct(ev)}>
      <input type='file' ref={el}/>
        <label>Name:</label>
        <input type='text' value={name} onChange={ev => setName(ev.target.value)}></input>
        <label>Price:</label>
        <input type='number' value={price} min={0} onChange={ev => setPrice(ev.target.value)}></input>
        <label>Desription:</label>
        <input type='text' value={description} onChange={ev => setDescription(ev.target.value)}></input>
        <button disabled={!name || !description || price === 0}>Create New Product</button>
      </form>
  )
}

export default NewProductForm;