import React from 'react';
import { Link } from 'react-router-dom';

const Orders = ({ orders, products, lineItems })=> {
  return (
    <div>
      <h2>Orders</h2>
      <ul>
        {
          orders.filter(order => !order.is_cart).map( order => {
            const orderLineItems = lineItems.filter(lineItem => lineItem.order_id === order.id);
            let total = 0;
            return (
              <li key={ order.id }>
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
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

export default Orders;
