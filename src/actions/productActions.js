import axios from 'axios';
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_TOP_LIST_REQUEST,
  PRODUCT_TOP_LIST_SUCCESS,
  PRODUCT_TOP_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_CREATE_REVIEW_FAIL
} from '../constants/productConstents';

import { logout } from './userActions'


export const getTopProducts = () => async (dispatch, getState) => {

  const {
    userLogin: { DEPLOYURL },
  } = getState()

  try {
    dispatch({ type: PRODUCT_TOP_LIST_REQUEST })

    const { data } = await axios.get(`${DEPLOYURL}/products?_sort=rating:desc&_limit=3`);

    dispatch({ type: PRODUCT_TOP_LIST_SUCCESS, payload: data })

  } catch (error) {
    dispatch({
      type: PRODUCT_TOP_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const listProducts = (keyword = '', pageNumber = 1) => async (
  dispatch, getState
) => {

  const {
    userLogin: { DEPLOYURL },
  } = getState()

  try {
    dispatch({ type: PRODUCT_LIST_REQUEST })

    const pageRange = {
      start: (pageNumber - 1) * 10,
      end: pageNumber * 10
    }

    let totalPagesToShow;


    const { data } = await axios.get(
      `${DEPLOYURL}/products?name_contains=${keyword}&_start=${pageRange.start}&_limit=${pageRange.end}`
    )


    // finding total page count for pagination
    if (keyword) {
      let { data } = await axios.get(
        `${DEPLOYURL}/products?name_contains=${keyword}`
      )
      totalPagesToShow = Math.ceil(data.length / 10)
    } else {
      const { data } = await axios.get(
        `${DEPLOYURL}/products`
      )
      totalPagesToShow = Math.ceil(data.length / 10)
    }


    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: {
        products: data,
        pages: totalPagesToShow,
        page: pageNumber
      },
    })
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const listProductDetails = (id) => async (dispatch, getState) => {

  const {
    userLogin: { DEPLOYURL },
  } = getState()

  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST })

    const { data } = await axios.get(`${DEPLOYURL}/products/${id}`)

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const createProductReview = (productId, review) => async (
  dispatch,
  getState
) => {

  const {
    userLogin: { DEPLOYURL },
  } = getState()

  try {
    dispatch({
      type: PRODUCT_CREATE_REVIEW_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const { data: prodect } = await axios.get(`${DEPLOYURL}/products/${productId}`)

    if (prodect.reviews.find(prod => prod.reviewerId === userInfo._id)) {
      dispatch({
        type: PRODUCT_CREATE_REVIEW_FAIL,
        payload: "Product already reviewed!",
      })
      return
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const allReviews = {
      "reviews": [...prodect.reviews, { ...review, name: userInfo.username, reviewerId: userInfo._id }]
    }

    await axios.put(`${DEPLOYURL}/products/${productId}`, allReviews, config)

    dispatch({
      type: PRODUCT_CREATE_REVIEW_SUCCESS,
    })
  } catch (error) {
    console.dir(error)
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: PRODUCT_CREATE_REVIEW_FAIL,
      payload: message,
    })
  }
}

