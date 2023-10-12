import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

const Products = ({ products, cartItems, createLineItem, updateLineItem, auth})=> {
  

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {
          products.map( product => {
            const cartItem = cartItems.find(lineItem => lineItem.product_id === product.id);
            return (
              <div key={ product.id }>
                <li>
                  <h3><Link to={`/products/${product.id}`}>{product.name}</Link>  {`$${(product.price/100).toFixed(2)}`} {auth.is_admin ? (<Link to={`/products/${product.id}/edit`}>Edit</Link>): null}</h3>
                </li>
                {product.description.length > 100 ? <p>{`${product.description.substring(0,150)}...`}</p> : <p>{product.description}</p>}
                {
                    auth.id ? (
                      cartItem ? <button onClick={ ()=> updateLineItem(cartItem)}>Add Another</button>: <button onClick={ ()=> createLineItem(product)}>Add to Cart</button>
                    ): null
                  }
              </div>
            );
          })
        }
      </ul>
    </div>
  );
};

export default Products;
