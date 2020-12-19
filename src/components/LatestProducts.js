import React from 'react'
import products from '../assets/products';
import canonImg from '../assets/canon.jpeg';
import { getRs, sortText } from '../helper';

function LatestProducts() {
  return (
    <>
      <div className="container">
        <h2 className='latest-prodct'>LATEST PRODUCTS</h2>
        <div className='products'>
          {products.map(product => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      </div>
    </>
  )
}

function Product({ product }) {
  return (
    <div className="card">
      <div className="card-head">
        <img src={canonImg} alt={product.name} />
      </div>
      <div className="card-body">
        <p className='product-name'>{sortText(product.name, 20)}</p>
        <p className='product-rate'>
          {getRs(product.price)}
        </p>
      </div>
    </div>
  );
}

export default LatestProducts;