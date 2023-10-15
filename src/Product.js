import React, {useState} from "react";
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

  const [errorMessage, setErrorMessage] = useState("");

  const handleReviewError = (error) => {
    setErrorMessage(error);
  };

  const handleReviewSubmission = async () => {
    try {
      const response = await api.submitReview(json);
  
      if (response.error) {
        console.error(response.error);
        handleReviewError(response.error); 
      } else {
        setReviews([...reviews, response]);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      handleReviewError("An error occurred while submitting your review.");
    }
  };
  

  return product ? (
    <>
      <h2>{product.name}</h2>
      <h4>{`Price: $${(product.price / 100).toFixed(2)}`}</h4>
      <p>{product.description}</p>
      {productReviews.map((review) => (
        <p key={review.id}>{review.text}</p> 
      ))}
      {errorMessage && <p>{errorMessage}</p>} 
      {auth.id ? (
        cartItem ? (
          <button onClick={() => updateLineItem(cartItem)}>Add Another</button>
        ) : (
          <button onClick={() => createLineItem(product)}>Add to Cart</button>
        )
      ) : null}

      {auth.id && <ReviewForm productId={product.id} onSubmit={handleReviewSubmission} reviews={reviews} setReviews={setReviews} auth={auth} onError={handleReviewError} />}
    </>
  ) : (
    <h2>Loading</h2>
  );
};

export default Product;
