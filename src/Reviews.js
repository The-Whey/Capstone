import React from 'react'

const Reviews = ({reviews, users, product}) => {

  return (
    reviews.filter(review => review.product_id === product.id).map(review => {
        const user = users.find(user => user.id === review.user_id)
        return (
          <li key={review.id}>
            <h5>{user.username} - {review.rating} {review.rating > 1 ? 'stars' : 'star'}</h5>
            <p>{review.txt}</p>
          </li>
          )})
  )
}

export default Reviews