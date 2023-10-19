import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Products from './Products';

const Wishlist = ({bookmarks, products, cartItems, createLineItem, removeBookmark}) => {
    const navigate = useNavigate();
  if (bookmarks.length && products.length) return(
    <div>
        <h2 className="centered-title">Wishlist</h2>
    {
        bookmarks.map(bookmark => {
            const product = products.find(obj => obj.id === bookmark.product_id);
            const cartItem = cartItems.find(lineItem => lineItem.product_id === product.id)
            return <div key={product.id}>
            <h3><Link to={`/products/${product.id}`}>{product.name}</Link>  {`$${(product.price/100).toFixed(2)}`}</h3>  
            <Link to={`/products/${product.id}`}><img src={product.image}/></Link>
            {product.description.length > 100 ? <p>{`${product.description.substring(0,150)}...`}</p> : <p>{product.description}</p>}
            {cartItem ? <button onClick={ ()=> navigate('/cart')}>View In Cart</button>: <button onClick={ ()=> createLineItem(product)}>Add to Cart</button>}
            <button onClick={ ()=> removeBookmark(bookmarks.find(bookmark => bookmark.product_id === product.id))}>Remove From Wishlist</button>
          </div>
        })
    }
    </div>

  )  

  return (
    <div>
        <h3>There are currently no items in your wishlist.</h3> 
        <h3>Why not <Link to='/products' >add</Link> some?</h3>
    </div>
  )
}

export default Wishlist