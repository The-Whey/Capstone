import React from "react";
import { useParams } from "react-router-dom";

const Product = ({
  products,
  auth,
  cartItems,
  createLineItem,
  updateLineItem,
}) => {
  const { id } = useParams();
  const product = products.filter((item) => item.id === id)[0];
  const cartItem = cartItems.find(
    (lineItem) => lineItem.product_id === product.id
  );
  console.log(product);

  return product ? (
    <>
      <h2>{product.name}</h2>
      <h4>{`Price: $${(product.price / 100).toFixed(2)}`}</h4>
      <p>{product.description}</p>
      {auth.id ? (
        cartItem ? (
          <button onClick={() => updateLineItem(cartItem)}>Add Another</button>
        ) : (
          <button onClick={() => createLineItem(product)}>Add to Cart</button>
        )
      ) : null}
    </>
  ) : (
    <h2>Loading</h2>
  );
};

export default Product;
