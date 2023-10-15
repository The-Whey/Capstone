import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GeoapifyContext, GeoapifyGeocoderAutocomplete } from '@geoapify/react-geocoder-autocomplete';
import api from './api';


const Cart = ({ updateOrder, removeFromCart, lineItems, cart, products, updateLineItem, setAddresses, addresses, auth })=> {
  const [addressMode, setAddressMode] = useState(false);
  const [data, setData] = useState({})
  const [checked, setChecked] = useState(false)
  const [nickname, setNickname] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([])
  const geoapifyapikey = '2c1d919212f0470fbaa34d495ad970c2'

  // Update adds 1 to quantity, so i subtract two here to make it subtract 1 instead of adding.
  const minus = (lineItem) => {
    lineItem.quantity -= 2;
    updateLineItem(lineItem)
  }
  let totalPrice = 0;

  const submitOrder = async(addy) => {
    if (!savedAddresses.length){
    const json = {data, user_id: cart.user_id}
    if (nickname) json.nickname = nickname;
    const response = await api.addAddress(json)
    setAddresses([...addresses, response])
    updateOrder({...cart, is_cart: false, address: response.id })
    } else {
    updateOrder({...cart, is_cart: false, address: addy.id })
    }
    setAddressMode(false)
    // when routing is done have this navigate to orders.
  }

  const handlCheck = async() => {
    setChecked(!checked);
  }

  useEffect(() => {
    if(addresses){
      const useraddresses = addresses.filter(addy => addy.user_id === auth.id).filter(addy => addy.nickname)
      setSavedAddresses(useraddresses)
    }
  }, [addresses, auth])

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

  if (addressMode) return !savedAddresses.length ?(
    <div>
      <h3>Where do you want your order shipped?</h3>
      <GeoapifyContext  apiKey={geoapifyapikey}>
        <GeoapifyGeocoderAutocomplete filterByCountryCode={['us']} biasbylocation={true} placeSelect={(value) => setData(value)}/>
      </GeoapifyContext>
      {checked ? <input type='text' placeholder='Home, Work, etc...' value={nickname} onChange={(ev) => setNickname(ev.target.value)}/>: null}
      <div>
        <label>
          <input type='checkbox' value={checked} onChange={handlCheck} />
          Save address for future purchases?
        </label>
      </div>

      <br/>
      <button disabled={!Object.keys(data).length} onClick={() => submitOrder()}>Submit Order</button>
      <button onClick={() => setAddressMode(false)}>Cancel</button>
    </div>
  ): (
    <div>
      <h2>Where should we send your package?</h2>
      {
        savedAddresses.map(addy => {
          return <button onClick={() => submitOrder(addy)} key={addy.id}>{addy.nickname}</button>
        })
      }
      <button onClick={() => setSavedAddresses([])}>Somewhere Else</button>
    </div>
  )
};

export default Cart;
