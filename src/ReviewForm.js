import React, { useState, useEffect } from "react";
import api from "./api";

const ReviewForm = ({ productId, auth, existingReview, reviews, setReviews, onError }) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleReviewSubmission = async (ev) => {
    ev.preventDefault()
    try {
      console.log(productId);
      const json = { txt: reviewText, rating, product_id: productId, user_id:auth.id };
      const response = await api.submitReview(json);
      console.log(response);

      if (response.error) {
        console.error(response.error);
        setErrorMessage(response.error);
        onError(response.error);
      } else {
        setReviews([...reviews, response]);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      errorMessage("Error: You've already submitted a review for this product.");
    }
  };

  return (
    <div>
      {hasSubmittedReview ? (
        <p>{errorMessage}</p>
      ) : (
        <form onSubmit={handleReviewSubmission}>
          <label>
            Review:
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            />
          </label>
          <label>
            Rating:
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value, 10))}
              min="1"
              max="5"
              required
            />
          </label>
          <button type="submit">Submit Review</button>
        </form>
      )}
    </div>
  );
};

export default ReviewForm;