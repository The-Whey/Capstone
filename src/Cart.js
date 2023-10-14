import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GeoapifyContext, GeoapifyGeocoderAutocomplete } from '@geoapify/react-geocoder-autocomplete';


const Cart = ({ updateOrder, removeFromCart, lineItems, cart, products, updateLineItem, addAddress })=> {
  const [addressMode, setAddressMode] = useState(false);
  const [address, setAddress] = useState({})
  const geoapifyapikey = '2c1d919212f0470fbaa34d495ad970c2'
  // Update adds 1 to quantity, so i subtract two here to make it subtract 1 instead of adding.
  const minus = (lineItem) => {
    lineItem.quantity -= 2;
    updateLineItem(lineItem)
  }
  let totalPrice = 0;

  const submitOrder = () => {
    addAddress(address)
    // updateOrder({...cart, is_cart: false })
  }


 if (!addressMode) return (
    <div>
      <h2>Cart ({lineItems.filter(lineItem => lineItem.order_id === cart.id && !lineItem.is_cart).reduce((total, lineItem) => total + lineItem.quantity, 0)})</h2>
      <ul>
        {
          lineItems.filter(lineItem=> lineItem.order_id === cart.id).map( lineItem => {
            const product = products.find(product => product.id === lineItem.product_id) || {};
            totalPrice += product.price * lineItem.quantity / 100
            return (
              <li key={ lineItem.id }>
                <Link to={`/products/${product.id}`}>{product.name}</Link>
                ({ lineItem.quantity })
                <button onClick={lineItem.quantity === 1 ? () => removeFromCart(lineItem) 
                  :() => minus(lineItem)}>-</button>
                <button onClick={() => updateLineItem(lineItem)}>+</button>
                {lineItem.quantity > 1 ? <button onClick={ ()=> removeFromCart(lineItem)}>Remove All</button> : null }
                <h4>{`price: $${(lineItem.quantity * product.price / 100).toFixed(2)}`}</h4>
              </li>
            );
          })
        }
      </ul>
      <h4>{`Total Price: $${totalPrice.toFixed(2)}`}</h4>
      {
        lineItems.filter(lineItem => lineItem.order_id === cart.id ).length ? <button onClick={() => setAddressMode(true)}>Create Order</button>: null
      }
    </div>
  );

  if (addressMode) return (
    <div>
      <GeoapifyContext apiKey={geoapifyapikey}>
        <GeoapifyGeocoderAutocomplete  placeSelect={(value) => setAddress(value)}/>
      </GeoapifyContext>
      <button onClick={() => submitOrder()} />
      <button onClick={() => setAddressMode(false)}>Revert</button>
    </div>
  )
};

export default Cart;
