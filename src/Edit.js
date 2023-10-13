import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from './api';



const Edit = ({products, setProducts}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('')
  const navigate = useNavigate();
  const {id} = useParams();
  const el = useRef();
  const product = products.find(item => item.id === id);

   const submitHandler = async (ev) => {
    ev.preventDefault;
    const updatedProduct = {
      id,
      name,
      price,
      description,
      image
    };
    const response = await api.editProduct(updatedProduct)
    setProducts(products.map(item => item.id === id ? response : item))
    navigate(`/products/${id}`)
   }

  useEffect(() => {
    const product = products.find(item => item.id === id);
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setDescription(product.description);
      setImage(product.image)
      el.current.addEventListener('change', (ev) => {
        const file = ev.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener('load', () => {
          setImage(reader.result)
        })
      })
    }
  }, [id, products])

   if (!product) return null;

  return (
    <div>
      <h3>Edit Product:</h3>
      <img src={image}/>
      <input type='file' ref={el}/>
      <form onSubmit={submitHandler}>
        <label>Name:</label>
        <input type='text' value={name}  onChange={ev => setName(ev.target.value)}></input>
        <label>Price:</label>
        <input type='number' value={price}  onChange={ev => setPrice(ev.target.value)}></input>
        <label>Description:</label>
        <input type='text' value={description} onChange={ev => setDescription(ev.target.value)}></input>
        <button>Submit Changes</button>
      </form>
    </div>
  )

}

export default Edit