import React, { useState, useEffect } from "react";
import api from "./api";

const ReviewForm = ({ productId, auth, existingReview, reviews, setReviews }) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);


  const handleReviewSubmission = async () => {
    //try {
      // Make an API call to submit the review using your API functions
      const json = {txt: reviewText, rating, product_id: productId}
      const response = await api.submitReview(json);

      // If the submission is successful, show a success message to the user
      // update the reviews state or take any other necessary action
       setReviews([...reviews, response]);
    // } catch (error) {
    //   console.error("Error submitting review:", error);
    // }
  };

  useEffect(() => {
    if (existingReview) {
      setHasSubmittedReview(true);
      setReviewText(existingReview.txt);
      setRating(existingReview.rating);
    }
  }, [existingReview]);

  return (
    <div>
      {hasSubmittedReview ? (
        <p>You've already submitted a review for this product.</p>
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