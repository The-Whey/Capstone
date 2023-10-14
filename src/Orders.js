import React from 'react';
import { Link } from 'react-router-dom';
import api from './api';

const Orders = ({ orders, setorders, products, lineItems, auth, addresses })=> {

  const orderFulfilled = async(id, fulfilled) => {
    const json = {id, fulfilled}
    const response = await api.orderFulfilled(json)
    setorders(orders.map(order => order.id === response.id ? response : order))
  }

  // console.log(addresses)

  return (
    <div>
      <h2>Orders ({orders.length - 1})</h2>
      <ul>
        {
          orders.filter(order => !order.is_cart).map( order => {
            // console.log(order)
            const orderLineItems = lineItems.filter(lineItem => lineItem.order_id === order.id);
            const address = addresses.find(item => item.id === order.address)
            const formattedAddress = address.data.properties.formatted;

            let total = 0;
            return (
              <li key={ order.id }>
                <h4>Order ID: {order.id}</h4>
                <h4>Shipping Address: {formattedAddress}</h4>
                <p>{order.fulfilled ? `Order Fulfilled` : 'order pending'}</p>
                {auth.is_admin ? order.fulfilled ? <button onClick={() => orderFulfilled(order.id, false)}>reopen?</button> : null : null}
                <br/> 
                ({ new Date(order.created_at).toLocaleString() }) 
                <ul>
                  {
                    orderLineItems.map( lineItem => {
                      const product = products.find(product => product.id === lineItem.product_id);
                      if (!product) return null;
                      total += lineItem.quantity * product.price
                      
                      return (
                        <li key={ lineItem.id }>
                          <Link to={`/products/${product.id}`}>{product.name}</Link> ({lineItem.quantity}) at ${(product.price / 100).toFixed(2)} each
                        </li>
                      );
                    })
                    
                  }
                </ul>
                <h4>{`Total Price: $${(total / 100).toFixed(2)}`}</h4>
                {auth.is_admin ? !order.fulfilled ? <button onClick={() => orderFulfilled(order.id, true)}>Mark order as fulfilled</button> : null : null}
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

export default Orders;
