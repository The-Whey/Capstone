import React from 'react';
import { Link, useParams } from 'react-router-dom';

const FilteredProducts = ({ products, tags }) => {
  const { tag } = useParams();
  const filteredProducts = products.filter((product) => {
    const productTags = tags.filter((t) => t.product_id === product.id);
    return productTags.some((t) => t.tag === tag);
  })
  return (
    <div>
      <h2>Products with Tag: {tag}</h2>
      {filteredProducts.map((product) => (
        <div key={product.id}>
          <h3>
            <Link to={`/products/${product.id}`}>{product.name}</Link>
          </h3>
          <h4>{`Price: $${(product.price / 100).toFixed(2)}`}</h4>
          <img src={product.image}/>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FilteredProducts;
