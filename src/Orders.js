import React from 'react';
import { Link } from 'react-router-dom';
import api from './api';

const Orders = ({ orders, setorders, products, lineItems, auth, addresses, users })=> {

  const orderFulfilled = async(id, fulfilled) => {
    const json = {id, fulfilled}
    const response = await api.orderFulfilled(json)
    setorders(orders.map(order => order.id === response.id ? response : order))
  }

  // console.log(addresses)

  return (
    <div>
      <h2 className="left-title">Orders ({orders.length - 1})</h2>
      <ul>
        {
          orders.filter(order => !order.is_cart).map( order => {
            // console.log(order)
            const orderLineItems = lineItems.filter(lineItem => lineItem.order_id === order.id);
            const address = addresses.find(item => item.id === order.address)
            const formattedAddress = address.data.properties.formatted;
            const user = users.find(item => item.id === order.user_id)

            let total = 0;
            return (
              <li key={ order.id }>
                <h5>Username: {user.username} </h5>
                <h5>Order ID: {order.id}</h5>
                <h5>Shipping Address: {formattedAddress}</h5>
                ({ new Date(order.created_at).toLocaleString() }) 

                  {
                    orderLineItems.map( lineItem => {
                      const product = products.find(product => product.id === lineItem.product_id);
                      if (!product) return null;
                      total += lineItem.quantity * product.price
                      
                      return (
                        <div key={ lineItem.id }>
                          <Link to={`/products/${product.id}`} className='link-style'>{product.name}</Link> ({lineItem.quantity}) at ${(product.price / 100).toFixed(2)} each
                        </div>
                      );
                    })
                    
                  }

                <p>
                  {order.fulfilled ? `Order Fulfilled ` : 'order pending '}
                  {auth.is_admin ? 
                  order.fulfilled ? 
                  <button onClick={() => orderFulfilled(order.id, false)}>Mark Pending</button> 
                  : <button onClick={() => orderFulfilled(order.id, true)}>Mark Fulfilled</button> 
                  : null}
                </p>
                <h4>{`Total Price: $${(total / 100).toFixed(2)}`}</h4>
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

export default Orders;
