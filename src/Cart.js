import React from 'react';

const Cart = ({ updateOrder, removeFromCart, lineItems, cart, products, updateLineItem })=> {

  // Update adds 1 to quantity, so i subtract two here to make it subtract 1 instead of adding.
  const minus = (lineItem) => {
    lineItem.quantity -= 2;
    updateLineItem(lineItem)
  }

  return (
    <div>
      <h2>Cart</h2>
      <ul>
        {
          lineItems.filter(lineItem=> lineItem.order_id === cart.id).map( lineItem => {
            const product = products.find(product => product.id === lineItem.product_id) || {};
            return (
              <li key={ lineItem.id }>
                { product.name }
                ({ lineItem.quantity })
                <button onClick={lineItem.quantity === 1 ? () => removeFromCart(lineItem) 
                  :() => minus(lineItem)}>-</button>
                <button onClick={() => updateLineItem(lineItem)}>+</button>
                {lineItem.quantity > 1 ? <button onClick={ ()=> removeFromCart(lineItem)}>Remove All</button> : null }
              </li>
            );
          })
        }
      </ul>
      {
        lineItems.filter(lineItem => lineItem.order_id === cart.id ).length ? <button onClick={()=> {
          updateOrder({...cart, is_cart: false });
        }}>Create Order</button>: null
      }
    </div>
  );
};

export default Cart;
