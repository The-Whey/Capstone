import React, { useState, useEffect } from "react";
import api from "./api";

const ReviewForm = ({ productId, auth, existingReview, reviews, setReviews, onError }) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleReviewSubmission = async (ev) => {
    ev.preventDefault()
    try {
      const json = { txt: reviewText, rating, product_id: productId, user_id: auth.id};
      const response = await api.submitReview(json);
      setReviews([...reviews, response])
      setErrorMessage('')
    } catch (error) {
      setErrorMessage('You have already submitted a review for this')
    }
  };
  const alreadyReviewed = reviews.filter(review => review.product_id === productId).find(review => review.user_id === auth.id)
  return (
    <div>
      {alreadyReviewed ? (
        <p>You have already reviewed this product.</p>
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