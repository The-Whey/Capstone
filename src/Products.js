import React, {useState, useEffect} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const Bookmark = ({ product, bookmark, createBookmark, removeBookmark })=> {
  return (
    <div>
      {
        bookmark ? <button onClick={ ()=> removeBookmark(bookmark)}>Remove Bookmark</button> : <button onClick={ ()=> createBookmark({ product_id: product.id })}>Add Bookmark</button>
      }
    </div>
  );
}

const Products = ({ products, cartItems, createLineItem, updateLineItem, auth, bookmarks, createBookmark, removeBookmark, tags, tagsList})=> {

  const [tagId, setTagId] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const uniqueTagNames = [...new Set(tags.map((tag) => tag.tag))];
  const navigate = useNavigate();
  const {term}=useParams();

  useEffect(() => {
    setFilteredProducts(tags.filter(item => item.tag_id === tagId).map(obj => products.find(item => item.id === obj.product_id)))
  }, [tagId])
  
  if (filteredProducts.length) return(
    <div>
      <h2>Products</h2>
      <input placeholder="search by name" value={term||''} onChange={ev => navigate(ev.target.value ? `/products/search/${ev.target.value.toLowerCase()}`: `/products`)}/> 
      <p>--- or ---</p>
      {tagsList ? tagsList.filter(tag => tags.find(obj => obj.tag_id === tag.id)).map(obj => <button className='tag-button' onClick={() => setTagId(obj.id)} key={obj.id}>{obj.tag}</button>): null}
      {filteredProducts.filter(product => !term || product.name.toLowerCase().indexOf(term.toLowerCase()) !== -1).map(product => {
        const cartItem = cartItems.find(lineItem => lineItem.product_id === product.id);
        return (
          <div key={product.id}>
            <h3><Link to={`/products/${product.id}`}>{product.name}</Link>  {`$${(product.price/100).toFixed(2)}`}</h3>  
            <img src={product.image}/>
            {product.description.length > 100 ? <p>{`${product.description.substring(0,150)}...`}</p> : <p>{product.description}</p>}
            {
              auth.id ? (
                cartItem ? <button onClick={ ()=> updateLineItem(cartItem)}>Add Another</button>: <button onClick={ ()=> createLineItem(product)}>Add to Cart</button>
              ): null
            }
          </div>
        )
      })}
    </div>
  );

  return(
    <div>
      <h2>Products</h2>
      <input placeholder="search by name" value={term||''} onChange={ev => navigate(ev.target.value ? `/products/search/${ev.target.value.toLowerCase()}`: `/products`)}/> 

      {tagsList ? tagsList.filter(tag => tags.find(obj => obj.tag_id === tag.id)).map(obj => <button className='tag-button' onClick={() => setTagId(obj.id)} key={obj.id}>{obj.tag}</button>): null}
      <h3>{bookmarks.length} Bookmarks</h3>
      {/* //products.filter(product => !term || product.name.toLowerCase().indexOf(term.toLowerCase()) !== -1)
//           .map( product => {
//             const cartItem = cartItems.find(lineItem => lineItem.product_id === product.id); */}

      {products.filter(product => !term || product.name.toLowerCase().indexOf(term.toLowerCase()) !== -1).map(product => {
        const cartItem = cartItems.find(lineItem => lineItem.product_id === product.id);
        return (
          <div key={product.id}>
            <h3><Link to={`/products/${product.id}`}>{product.name}</Link>  {`$${(product.price/100).toFixed(2)}`}</h3>  
            <img src={product.image}/>
            {product.description.length > 100 ? <p>{`${product.description.substring(0,150)}...`}</p> : <p>{product.description}</p>}
            {
              auth.id ? (
                cartItem ? <button onClick={ ()=> updateLineItem(cartItem)}>Add Another</button>: <button onClick={ ()=> createLineItem(product)}>Add to Cart</button>
              ): null
            }
          </div>
        )
      })}
    </div>
  )
};

  

  
  
//   return (
//     <div>
//       {tagsList ? tagsList.map(obj => <button onClick={() => setTagId(obj.id)} key={obj.id}>{obj.tag}</button>) : null}

//       <h2>Products</h2>
//       <input placeholder="search by name" value={term||''} onChange={ev => navigate(ev.target.value ? `/products/search/${ev.target.value.toLowerCase()}`: `/products`)}/> 
//       <h3>{bookmarks.length} Bookmarks</h3>
//       <h3>Search by Tag</h3>
      // <ul>
      //    {uniqueTagNames.map((tagName) => (
      //     <li key={tagName}>
      //       <Link to={`/products/tags/${tagName}`}>{tagName}</Link>
      //     </li>
      //   ))}
      //   </ul>

    
//         {
//           products.filter(product => !term || product.name.toLowerCase().indexOf(term.toLowerCase()) !== -1)
//           .map( product => {
//             const cartItem = cartItems.find(lineItem => lineItem.product_id === product.id);
//             return (
//               <div key={ product.id }>
//                 <li>
//                   <h3><Link to={`/products/${product.id}`}>{product.name}</Link>  {`$${(product.price/100).toFixed(2)}`}</h3>
//                 </li>
//                 <img src={product.image}/>
//                 {product.description.length > 100 ? <p>{`${product.description.substring(0,150)}...`}</p> : <p>{product.description}</p>}
//                 {
//                     auth.id ? (
//                       cartItem ? <button onClick={ ()=> updateLineItem(cartItem)}>Add Another</button>: <button onClick={ ()=> createLineItem(product)}>Add to Cart</button>
//                     ): null
//                   }
//                   {
//                   auth.id ? <Bookmark product={ product } bookmark = { bookmarks.find(bookmark => bookmark.product_id === product.id)} createBookmark={  createBookmark } removeBookmark={ removeBookmark }/>: null
//                 }
//               </div>
//             );
//           })
//         }
        
//       </ul>
//     </div>
//   );
// };

export default Products;
