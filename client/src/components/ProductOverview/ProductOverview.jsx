import React, { useState, useEffect } from 'react';
import postyles from './ProductOverview.module.css';

import axiosConfig from '../../../../axiosConfig.js';

import Nav from './Nav/Nav.jsx';
import Announcements from './Announcements/Announcements.jsx';
import ProductInfo from './ProductInfo/ProductInfo.jsx';
import ProductDescription from './ProductDescription/ProductDescription.jsx';
import Modal from './Modal/Modal.jsx';

export default function ProductOverview({ productId, sendInteraction, theme, toggleTheme }) {
  const [product, setProduct] = useState({ features: [] });
  const [styles, setStyles] = useState([]);
  const [currentStyles, setCurrentStyles] = useState({});
  const [averageRating, setAverageRating] = useState({});

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const productEndpoint = `/products/${productId}`;
    const stylesEndpoint = `/products/${productId}/styles`;
    const reviewsEndpoint = '/reviews/meta';

    const fetchData = async (url, params) => {
      const response = await axiosConfig.get(url, params);
      return response.data;
    };

    // fetchData('/products/65661')
    fetchData(productEndpoint)
      .then((response) => {
        setProduct(response);
      })
      .catch((err) => {
        console.error(err);
      });

    // fetchData('/products/65661/styles')
    fetchData(stylesEndpoint)
      .then((response) => {
        setStyles(response.results);
        setCurrentStyles(response.results[0]);
      })
      .catch((err) => {
        console.error(err);
      });

    fetchData(reviewsEndpoint, { params: { product_id: productId } })
      .then((response) => {
        const total = Object.entries(response.ratings).reduce((prev, [key, value]) => (prev + key * value), 0);
        const count = Object.entries(response.ratings).reduce((prev, [_, value]) => (prev + value * 1), 0);
        setAverageRating(Math.floor((total / count) / 0.25) * 0.25);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    // eslint-disable-next-line max-len
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interaction
    <>
      {showModal && <Modal currentStyles={currentStyles} setShowModal={setShowModal} />}
      <div
        className={postyles.productoverview}
        onClick={(e) => sendInteraction('Product Overview', e)}
      >
        <Nav theme={theme} toggleTheme={toggleTheme} />
        <Announcements />
        <ProductInfo
          averageRating={averageRating}
          productId={productId}
          product={product}
          styles={styles}
          currentStyles={currentStyles}
          setCurrentStyles={setCurrentStyles}
          setShowModal={setShowModal}
        />
        <ProductDescription product={product} />
      </div>
    </>
  );
}
