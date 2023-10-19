import React, {useState, useEffect} from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Bookmark = ({ product, bookmark, createBookmark, removeBookmark }) => {
  return (
    <div>
      {
        bookmark ? <button onClick={ ()=> removeBookmark(bookmark)}>Remove From Wishlist</button> : <button onClick={ ()=> createBookmark({ product_id: product.id })}>Add to Wishlist</button>
      }
    </div>
  );
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;


const ProductWrapper = styled.div`
  display: flex;
  margin-top: 30px;
  margin-bottom: 30px;
`;

const ProductImage = styled.img`
  max-width: 350px;
  max-height 350px;
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background-color: rgb(252, 238, 222);
  width 300px;
  padding: 20px;
`;

const ProductDescription = styled.div`
  color: rgb(114, 183, 217);
  // font-family: verdana;
  // overflow: auto;
  // text-align: left;
  // display: flex;
  // align-items: center;
  // flex: 1
  // width: 200px;
`;

const Price = styled.h4`
  color: rgb(114, 183, 217);
  text-align: left; 
`;

const Rating = styled.h4`
  color: rgb(114, 183, 217);
  text-align: left; 
`;

const TagButton = styled.button`
  padding: 10px 20px; 
  background-color: rgb(114, 183, 217); 
  color: rgb(252, 238, 222); 
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold; 
  transition: background-color 0.3s;
`;

const BookmarkButton = styled.button`
  padding: 10px 20px; 
  background-color: rgb(114, 183, 217); 
  color: rgb(252, 238, 222); 
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold; 
  transition: background-color 0.3s;
`;

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
    
      <div className='products'>
        <h1 className="center-title">Harmonic Harbor</h1>
        
          <div className='searchtags'>
            <div className='searchBar'><input className='search' placeholder="search by name" value={term||''} onChange={ev => navigate(ev.target.value ? `/products/search/${ev.target.value.toLowerCase()}`: `/products`)}/></div>
            <div className='tags'>
              {tagsList ? tagsList.filter(tag => tags.find(obj => obj.tag_id === tag.id)).map(obj => <button className='tag-button' onClick={() => setTagId(obj.id)} key={obj.id}>{obj.tag}</button>): null}
              {tagsList ? <button onClick={() => setTagId('')}>Show All</button> : null}
            </div>
          </div>
        
        <Container>
        {filteredProducts.filter(product => !term || product.name.toLowerCase().indexOf(term.toLowerCase()) !== -1).map(product => {
          const cartItem = cartItems.find(lineItem => lineItem.product_id === product.id);
          let avgRating = 0;
          const currentReviews = reviews.filter(review => review.product_id === product.id)
          if (currentReviews.length) avgRating = (currentReviews.map(rating => rating.rating).reduce((a,c) => a + c) / currentReviews.length)
          return (
            <ProductWrapper key={product.id}>
               <ProductImage src={product.image} />
               <ProductDetails>
                <h3><Link to={`/products/${product.id}`} className="link-style">{product.name}</Link></h3>
                <Price>{`$${(product.price/100).toFixed(2)}`}</Price>
                <Rating>{avgRating ? avgRating > 1  ? `${avgRating.toFixed(1)} stars` : `${avgRating.toFixed(1)} star` : 'no reviews'}</Rating>
                {product.description.length > 100 ? ( <ProductDescription>{`${product.description.substring(0, 150)}...`}</ProductDescription> ) : ( <ProductDescription>{product.description}</ProductDescription>)}
                  <div className='cartButtons'>
                    {auth.id ? (cartItem ? <button onClick={ ()=> navigate('/cart')}>View In Cart</button>: <button onClick={ ()=> createLineItem(product)}>Add to Cart</button>): null}
                    {auth.id ? <Bookmark product={ product } bookmark = { bookmarks.find(bookmark => bookmark.product_id === product.id)} createBookmark={  createBookmark } removeBookmark={ removeBookmark }/>: null }
                  </div>
                </ProductDetails>
               </ProductWrapper>
          )
        })}
            </Container>
      </div>
  );

  return(

      <div className='products'>
        <h1 className="center-title">Harmonic Harbor</h1>
        <div className='searchtags'>
        <div className='searchBar'><input className='search' placeholder="search by name" value={term||''} onChange={ev => navigate(ev.target.value ? `/products/search/${ev.target.value.toLowerCase()}`: `/products`)}/></div>
          <div className='tags'>{tagsList ? tagsList.filter(tag => tags.find(obj => obj.tag_id === tag.id)).map(obj => <button className='tag-button' onClick={() => setTagId(obj.id)} key={obj.id}>{obj.tag}</button>): null}</div>
        </div>
        <Container>
        {products.filter(product => !term || product.name.toLowerCase().indexOf(term.toLowerCase()) !== -1).map(product => {
          const cartItem = cartItems.find(lineItem => lineItem.product_id === product.id);
          const bookmark = bookmarks.find(bookmark => bookmark.product_id === product.id);
          let avgRating = 0;
          const currentReviews = reviews.filter(review => review.product_id === product.id)
          if (currentReviews.length) avgRating = (currentReviews.map(rating => rating.rating).reduce((a,c) => a + c) / currentReviews.length)
        
          return (
            <ProductWrapper key={product.id}>
               <ProductImage src={product.image} />
               <ProductDetails>
                <h3><Link to={`/products/${product.id}`} className="link-style">{product.name}</Link></h3>
                <Price>{`$${(product.price/100).toFixed(2)}`}</Price>
                <Rating>{avgRating ? avgRating > 1  ? `${avgRating.toFixed(1)} stars` : `${avgRating.toFixed(1)} star` : 'no reviews'}</Rating>
                <ProductDescription>{product.description}</ProductDescription>
                <div className='cartButtons'>
                  {auth.id ? <Bookmark product={ product } bookmark = { bookmarks.find(bookmark => bookmark.product_id === product.id)} createBookmark={  createBookmark } removeBookmark={ removeBookmark }/>: null }
                  {auth.id ? (cartItem ? <button onClick={ ()=> navigate('/cart')}>View In Cart</button>: <button onClick={ ()=> createLineItem(product)}>Add to Cart</button>): null}
                </div>
                </ProductDetails>
               </ProductWrapper>
          )
        })}
            </Container>
      </div>
  );
}
    
    export default Products;
