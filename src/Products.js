import React from 'react';
import { Link } from 'react-router-dom';

const Bookmark = ({ product, bookmark, createBookmark, removeBookmark })=> {
  return (
    <div>
      {
        bookmark ? <button onClick={ ()=> removeBookmark(bookmark)}>Remove Bookmark</button> : <button onClick={ ()=> createBookmark({ product_id: product.id })}>Add Bookmark</button>
      }
    </div>
  );
}

const Products = ({ products, cartItems, createLineItem, updateLineItem, auth, bookmarks, createBookmark, removeBookmark})=> {
  console.log(createBookmark, removeBookmark);
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
                  {
                  auth.id ? <Bookmark product={ product } bookmark = { bookmarks.find(bookmark => bookmark.product_id === product.id)} createBookmark={  createBookmark } removeBookmark={ removeBookmark }/>: null
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
