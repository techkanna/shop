import React, { useEffect } from 'react'
import { getRs } from '../helper';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { getTopProducts } from "../actions/productActions";
import { Carousel } from 'react-bootstrap'
import Loader from './Loader';
import Message from './Message';

const DEPLOYURL = 'https://dews-shop-api.herokuapp.com'

function MainBanner() {
  const dispatch = useDispatch();
  const storedProducts = useSelector(state => state.productsTopList)
  const { loading, products, error } = storedProducts;

  useEffect(() => {
    dispatch(getTopProducts())
  }, [dispatch])

  if (loading) return <Loader />

  if (error) return <Message variant='danger'>{error}</Message>

  return (
    <Carousel interval={100 * 1000} pause='hover' className='bg-dark' style={{ minHeight: '28rem' }}>
      {products.map(product => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <h2>
              {product.name} ({getRs(product.price)})
              </h2>
            <div className="img-wrap">
              <img src={`${DEPLOYURL}${product.image}`} alt={product.name} />
            </div>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default MainBanner
