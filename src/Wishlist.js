import React from 'react'

const Wishlist = ({bookmarks, products}) => {
    console.log(bookmarks)
    console.log(products)

  if (bookmarks.length && products.length) return(
    <div>
        <h2>Wishlist</h2>
    {
        bookmarks.map(bookmark => {
            const product = products.find(obj => obj.id === bookmark.product_id);
            return <h3 key={product.id}>{product.name}</h3>
        })
    }
    </div>

  )  

  return (
    <div>loading</div>
  )
}

export default Wishlist