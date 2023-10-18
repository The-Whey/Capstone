import React, {useState, useEffect} from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';

const Bookmark = ({ product, bookmark, createBookmark, removeBookmark })=> {
  return (
    <div>
      {
        bookmark ? <button onClick={ ()=> removeBookmark(bookmark)}>Remove From Wishlist</button> : <button onClick={ ()=> createBookmark({ product_id: product.id })}>Add to Wishlist</button>
      }
    </div>
  );
}

const Products = ({ products, cartItems, createLineItem, auth, bookmarks, createBookmark, removeBookmark, tags, tagsList, reviews})=> {

  const [tagId, setTagId] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();
  const {term} = useParams();
  const location = useLocation();

  useEffect(() => {
    setFilteredProducts(tags.filter(item => item.tag_id === tagId).map(obj => products.find(item => item.id === obj.product_id)))
  }, [tagId])
  

  if (filteredProducts.length) return(
    <div>
      <h2>Harmonic Harbor</h2>
      <input placeholder="search by name" value={term||''} onChange={ev => navigate(ev.target.value ? `/products/search/${ev.target.value.toLowerCase()}`: `/products`)}/> 
 
      {tagsList ? tagsList.filter(tag => tags.find(obj => obj.tag_id === tag.id)).map(obj => <button className='tag-button' onClick={() => setTagId(obj.id)} key={obj.id}>{obj.tag}</button>): null}
      {tagsList ? <button onClick={() => setTagId('')}>Show All</button> : null}

      {filteredProducts.filter(product => !term || product.name.toLowerCase().indexOf(term.toLowerCase()) !== -1).map(product => {
        const cartItem = cartItems.find(lineItem => lineItem.product_id === product.id);

        let avgRating = 0;
        const currentReviews = reviews.filter(review => review.product_id === product.id)
        if (currentReviews.length) avgRating = (currentReviews.map(rating => rating.rating).reduce((a,c) => a + c) / currentReviews.length)

        
        return (
          <div key={product.id}>
            <h3><Link to={`/products/${product.id}`} className='product-link'>{product.name}</Link>  {`$${(product.price/100).toFixed(2)}`}</h3>
            <h5>{avgRating ? avgRating > 1  ? `${avgRating.toFixed(1)} stars` : `${avgRating.toFixed(1)} star` : 'no reviews'}</h5>  
            <img src={product.image}/>
            {product.description.length > 100 ? <p>{`${product.description.substring(0,150)}...`}</p> : <p>{product.description}</p>}
            {auth.id ? (cartItem ? <button onClick={ ()=> navigate('/cart')}>View In Cart</button>: <button onClick={ ()=> createLineItem(product)}>Add to Cart</button>): null}
            {auth.id ? <Bookmark product={ product } bookmark = { bookmarks.find(bookmark => bookmark.product_id === product.id)} createBookmark={  createBookmark } removeBookmark={ removeBookmark }/>: null } 
          </div>
        )
      })}
    </div>
  );

  return(
    <div>
      <h2>Harmonic Harbor</h2>
      <input placeholder="search by name" value={term||''} onChange={ev => navigate(ev.target.value.trim() ? `/products/search/${ev.target.value.toLowerCase()}`: `/products`)}/> 
      {tagsList ? tagsList.filter(tag => tags.find(obj => obj.tag_id === tag.id)).map(obj => <button className='tag-button' onClick={() => setTagId(obj.id)} key={obj.id}>{obj.tag}</button>): null}
      {products.filter(product => !term || product.name.toLowerCase().indexOf(term.toLowerCase()) !== -1).map(product => {
        const cartItem = cartItems.find(lineItem => lineItem.product_id === product.id);
        let avgRating = 0;
        const currentReviews = reviews.filter(review => review.product_id === product.id)
        if (currentReviews.length) avgRating = (currentReviews.map(rating => rating.rating).reduce((a,c) => a + c) / currentReviews.length).toFixed(1)

        return (
          <div key={product.id}>
            <h3><Link to={`/products/${product.id}`}>{product.name}</Link>  {`$${(product.price/100).toFixed(2)}`}</h3>  
            <h5>{avgRating ? avgRating > 1  ? `Average Rating: ${avgRating} stars` : `Average Rating: ${avgRating} star` : 'no reviews'}</h5>  
            <Link to={`/products/${product.id}`}><img src={product.image}/></Link>
            {product.description.length > 100 ? <p>{`${product.description.substring(0,150)}...`}</p> : <p>{product.description}</p>}
            {
              auth.id ? (
                cartItem ? <button onClick={ ()=> navigate('/cart')}>View In Cart</button>: <button onClick={ ()=> createLineItem(product)}>Add to Cart</button>
              ): null
            }
          { auth.id ? <Bookmark product={ product } bookmark = { bookmarks.find(bookmark => bookmark.product_id === product.id)} createBookmark={  createBookmark } removeBookmark={ removeBookmark }/>: null } 
          </div>
        )
      })}
    </div>
  )
};

export default Products;
