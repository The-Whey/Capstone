import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import ReviewForm from './ReviewForm';
import api from "./api";
import Edit from './Edit';

const Product = ({
  products,
  setProducts,
  reviews,
  setReviews,
  auth,
  cartItems,
  createLineItem,
  updateLineItem,
  tags,
  setTags,
  setTagsList,
  tagsList
}) => {
  const [editMode, setEditMode] = useState(false);
  const [addTagMode, setAddTagMode] = useState(false);
  const [newTag, setNewTag] = useState('')
  const { id } = useParams();
  const product = products.find((item) => item.id === id);
  if (!product){return <div>Loading</div>}
  const productReviews = reviews ? reviews.filter((review) => review.product_id === id) : [];
  const cartItem = cartItems ? cartItems.find((lineItem) => lineItem.product_id === product?.id) : null;
  const [errorMessage, setErrorMessage] = useState("");
  let productTags;


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

  const submitTag = async(product) => {
    
  
    try {
      const response = await api.submitTag({
        tag: newTag.toLowerCase(),
        product_id: product.id
      });
      setTags([...tags, response])
    if (!tagsList.find(obj => obj.id === response.tag_id)) {
      setTagsList([...tagsList, {id: response.tag_id, tag: response.tag}])
    }
    } catch (error) {
      console.log(error)
    }
    setNewTag('')
    setAddTagMode(false)
  }

  
  
  if (tags) productTags = tags.filter((tag) => tag.product_id === product.id);


  

  if (product && !editMode) {
    return (
    <>

      <h2>{product.name} {auth.is_admin ? <button onClick={() => setEditMode(true)} >Edit Product</button> : null}</h2>
      <h4>{`Price: $${(product.price / 100).toFixed(2)}`}</h4>
      <img src={product.image}/>
      <p>{product.description}</p>
      {productReviews.map((review) => (
        <p key={review.id}>{review.text}</p> 
      ))}
      {errorMessage && <p>{errorMessage}</p>} 
      <h5>Tags:</h5>

      {addTagMode ? <div><input value={newTag} onChange={(ev) => setNewTag(ev.target.value)}></input><button onClick={() => submitTag(product)}>Submit</button></div> : null}
      <ul>
        {!addTagMode ? productTags.map((tag) => (
          <li key={tag.id}>{tag.tag}</li>
        )): null}
      </ul>
      {auth.is_admin && !addTagMode ? <button onClick={() => setAddTagMode(true)}>Add Tag</button> : null}
      <br/><br/>
      {auth.id ? (
        cartItem ? (
          <button onClick={() => updateLineItem(cartItem)}>Add Another</button>
        ) : (
          <button onClick={() => createLineItem(product)}>Add to Cart</button>
        )
      ) : null}

      {auth.id && <ReviewForm productId={product.id} onSubmit={handleReviewSubmission} reviews={reviews} setReviews={setReviews} auth={auth} onError={handleReviewError} />}
    </>
  )}

  if (product && editMode) {
    return (
    <Edit products={products} setProducts={setProducts} setEditMode={setEditMode}/>
  )}
};

export default Product;
