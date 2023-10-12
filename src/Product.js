import React from "react";
import { useParams } from "react-router-dom";
import ReviewForm from './ReviewForm';
import api from "./api";

const Product = ({
  products,
  reviews,
  setReviews,
  auth,
  cartItems,
  createLineItem,
  updateLineItem,
}) => {
  const { id } = useParams();
  const product = products.find((item) => item.id === id);
  const productReviews = reviews ? reviews.filter((review) => review.product_id === id) : [];
  const cartItem = cartItems ? cartItems.find((lineItem) => lineItem.product_id === product?.id) : null;

  const handleReviewSubmission = async (newReview) => {
    //try {
      // Make an API call to submit the review using your API functions
      const response = await api.submitReview(newReview);
      console.log(response);

      // If the submission is successful, show a success message to the user
      // update the reviews state or take any other necessary action
    //   setReviews([...reviews, newReview]);
    // } catch (error) {
    //   console.error("Error submitting review:", error);
    // }
  };

  return product ? (
    <>
      <h2>{product.name}</h2>
      <h4>{`Price: $${(product.price / 100).toFixed(2)}`}</h4>
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

      {auth.id && <ReviewForm productId={product.id} onSubmit={handleReviewSubmission} reviews={reviews} setReviews={setReviews} />}
    </>
  ) : (
    <h2>Loading</h2>
  );
};

export default Product;
