import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ReviewForm from './ReviewForm';
import Edit from './Edit';

const Product = ({
  products,
  setProducts,
  reviews,
  auth,
  cartItems,
  createLineItem,
  updateLineItem,
  handleReviewSubmission,
  tags,
}) => {
  const [editMode, setEditMode] = useState(false)
  const { id } = useParams();
  const product = products.find((item) => item.id === id);
  if (!product){return <div>Loading</div>}
  const productReviews = reviews ? reviews.filter((review) => review.product_id === id) : [];
  const cartItem = cartItems ? cartItems.find((lineItem) => lineItem.product_id === product?.id) : null;
  const productTags = tags.filter((tag) => tag.product_id === product.id);

  if (product && !editMode) return (
    <>

      <h2>{product.name} {auth.is_admin ? <button onClick={() => setEditMode(true)} >Edit Product</button> : null}</h2>
      <h4>{`Price: $${(product.price / 100).toFixed(2)}`}</h4>
      <img src={product.image}/>
      <p>{product.description}</p>
      {productReviews.map((review) => (
        <p key={review.id}>{review.text}</p> 
      ))}
      <h5>Tags:</h5>
      <ul>
        {productTags.map((tag) => (
          <li key={tag.id}>{tag.tag}</li>
        ))}
      </ul>
      {auth.id ? (
        cartItem ? (
          <button onClick={() => updateLineItem(cartItem)}>Add Another</button>
        ) : (
          <button onClick={() => createLineItem(product)}>Add to Cart</button>
        )
      ) : null}

      {auth.id && <ReviewForm productId={product.id} />}
    </>
  )

  if (product && editMode) return (
    <Edit products={products} setProducts={setProducts} setEditMode={setEditMode}/>
  )
};

export default Product;
