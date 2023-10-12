import React, { useState } from "react";

const ReviewForm = ({ productId, onSubmit }) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a review object with user input
    const newReview = {
      product_id: productId,
      txt: reviewText,
      rating,
    };

    // Call the onSubmit function with the new review data
    onSubmit(newReview);

    // Clear the form inputs
    setReviewText("");
    setRating(0);
  };

  return (
    <form onSubmit={handleSubmit}>
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
  );
};

export default ReviewForm;
