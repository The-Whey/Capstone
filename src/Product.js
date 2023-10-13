import React from "react";
import { useParams } from "react-router-dom";
import ReviewForm from './ReviewForm';

const Product = ({
  products,
  reviews,
  auth,
  cartItems,
  createLineItem,
  updateLineItem,
}) => {
  const { id } = useParams();
  const product = products.find((item) => item.id === id);
  const productReviews = reviews ? reviews.filter((review) => review.product_id === id) : [];
  const cartItem = cartItems ? cartItems.find((lineItem) => lineItem.product_id === product?.id) : null;

  return product ? (
    <>
      <h2>{product.name}</h2>
      <h4>{`Price: $${(product.price / 100).toFixed(2)}`}</h4>
      <img src={product.image}/>
      <p>{product.description}</p>
      {productReviews.map((review) => (
        <p key={review.id}>{review.text}</p> 
      ))}
      {auth.id ? (
        cartItem ? (
          <button onClick={() => updateLineItem(cartItem)}>Add Another</button>
        ) : (
          <button onClick={() => createLineItem(product)}>Add to Cart</button>
        )
      ) : null}

      {auth.id && <ReviewForm productId={product.id} />}
    </>
  ) : (
    <h2>Loading</h2>
  );
};

export default Product;
