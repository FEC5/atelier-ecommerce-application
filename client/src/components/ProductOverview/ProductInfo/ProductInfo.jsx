import React, { useEffect } from 'react';
import piStyles from './ProductInfo.module.css';

import Carousel from '../Carousel/Carousel.jsx';
import Buttons from '../Buttons/Buttons.jsx';
import Selection from '../Selection/Selection.jsx';

import Stars from '../../Stars/Stars.jsx';

export default function ProductInfo(props) {
  const {
    product, styles, setShowModal,
    currentStyles, setCurrentStyles,
  } = props;

  let priceDisplay = (
    <div>
      $
      {currentStyles.original_price}
    </div>
  );

  if (currentStyles.sale_price !== null) {
    priceDisplay = (
      <span>
        <del>
          $
          {currentStyles.original_price}
        </del>
        &nbsp;
        $
        {currentStyles.sale_price}
      </span>
    );
  }

  useEffect(() => {
    //
  }, [product, styles]);

  return (
    <div className={piStyles.productinfo}>
      <Carousel
        data-testid="Carousel"
        currentStyles={currentStyles}
        setShowModal={setShowModal}
      />
      <div className={piStyles.productoptions}>
<<<<<<< HEAD
        <div className={piStyles.starRatings}>
          <button type="submit" className={piStyles.goToReviews} onClick={() => window.scrollTo({ top: 1900, left: 0, behavior: 'smooth' })}>Read all reviews</button>
        </div>
=======
        <div className={piStyles.starRatings}><Stars />&nbsp;<a href="#read-reviews" className={piStyles.reviews}>Read all reviews</a></div>
>>>>>>> master
        <div className={piStyles.productTitle}>
          <h3>{product.category}</h3>
          <h1>{product.name}</h1>
          <h3 className={piStyles.productPrice}>
            {priceDisplay}
          </h3>
        </div>
        <Selection
          styles={styles}
          currentStyles={currentStyles}
          setCurrentStyles={setCurrentStyles}
        />
<<<<<<< HEAD
        <Buttons
          // styles={styles}
          // stylesIndex={stylesIndex}
          // setStyleIndex={setStylesIndex}
          currentStyles={currentStyles}
          // key={currentStyles.style_id}
        />
=======
        <Buttons currentStyles={currentStyles} />
        <div className={piStyles.social}>
          <a href="https://www.facebook.com/" target="_blank"><img src="https://cdn-icons-png.flaticon.com/128/4494/4494475.png" /></a>
          <a href="https://twitter.com/" target="_blank"><img src="https://cdn-icons-png.flaticon.com/128/4494/4494477.png" /></a>
          <a href="https://www.pinterest.com/" target="_blank"><img src="https://cdn-icons-png.flaticon.com/128/145/145808.png" /></a>
        </div>
>>>>>>> master
      </div>
    </div>
  );
}
