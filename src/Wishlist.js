import React from 'react'
import { Link } from 'react-router-dom'

const Wishlist = ({bookmarks, products}) => {
    console.log(bookmarks)
    console.log(products)

  if (bookmarks.length && products.length) return(
    <div>
        <h2>Wishlist</h2>
    {
        bookmarks.map(bookmark => {
            const product = products.find(obj => obj.id === bookmark.product_id);
            return <div key={product.id}>
            <h3><Link to={`/products/${product.id}`}>{product.name}</Link>  {`$${(product.price/100).toFixed(2)}`}</h3>  
            <img src={product.image}/>
            {product.description.length > 100 ? <p>{`${product.description.substring(0,150)}...`}</p> : <p>{product.description}</p>}
          </div>
        })
    }
    </div>

  )  

  return (
    <div>loading</div>
  )
}

export default Wishlist