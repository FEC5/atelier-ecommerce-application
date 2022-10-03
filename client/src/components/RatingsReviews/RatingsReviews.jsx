import React from 'react';
import _ from 'underscore';

import RatingsReviewsCSS from './RatingsReviews.module.css';
import ReviewsList from './Reviews/ReviewsList.jsx';
import MoreReviews from './Reviews/MoreReviews.jsx';
import SortOptions from './SortOptions.jsx';
import NewReview from './Reviews/NewReview.jsx';
import RatingsBreakdown from './Breakdowns/RatingsBreakdown.jsx';
import ProductBreakdown from './Breakdowns/ProductBreakdown.jsx';

class RatingsReviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: '',
      reviews: [],
      displayedReviews: [],
      numReviews: 0,
      numDisplayed: 0,
      sortOption: 'relevant',
      metadata: {},
      avgRating: 0,
      pctRecommend: '',
      ratingProportions: {},
      ratingCounts: {},
      selectedRatings: [],
      featureRatings: {
        Size: ['A size too small', '½ a size too small', 'Perfect', '½ a size too big', 'A size too wide'],
        Width: ['Too narrow', 'Slightly narrow', 'Perfect', 'Slightly wide', 'Too wide'],
        Comfort: ['Uncomfortable', 'Slightly uncomfortable', 'Ok', 'Comfortable', 'Perfect'],
        Quality: ['Poor', 'Below average', 'What I expected', 'Pretty great', 'Perfect'],
        Length: ['Runs Short', 'Runs slightly short', 'Perfect', 'Runs slightly long', 'Runs long'],
        Fit: ['Runs Short', 'Runs slightly short', 'Perfect', 'Runs slightly long', 'Runs long'],
      },
    };

    this.updateReviews = this.updateReviews.bind(this);
    this.updateProductName = this.updateProductName.bind(this);
    this.updateMetadata = this.updateMetadata.bind(this);
    this.handleGetReviews = this.handleGetReviews.bind(this);
    this.handleMoreReviews = this.handleMoreReviews.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.calculateRatings = this.calculateRatings.bind(this);
    this.calculatePercentRecommend = this.calculatePercentRecommend.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
  }

  componentDidMount() {
    this.updateReviews();
    this.updateProductName();
    this.updateMetadata();
  }

  handleGetReviews() {
    const { productId, axiosConfig } = this.props;
    const productURL = `/reviews/?sort=relevant&product_id=${productId}&count=1000`;

    const { numDisplayed } = this.state;

    axiosConfig.get(productURL)
      .then((response) => {
        const reviews = response.data.results;
        this.setState({
          reviews,
          displayedReviews: reviews.slice(0, numDisplayed),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleMoreReviews() {
    const { reviews, numReviews, numDisplayed } = this.state;
    const newNumDisplayed = numDisplayed + 2 > numReviews ? numReviews : numDisplayed + 2;
    const newDisplayedReviews = reviews.slice(0, newNumDisplayed);
    this.setState({
      displayedReviews: newDisplayedReviews,
      numDisplayed: newNumDisplayed,
    });
  }

  handleSort(event, ratings) {
    const { productId, axiosConfig } = this.props;
    let { sortOption, selectedRatings } = this.state;
    sortOption = event === undefined ? sortOption : event.target.value;
    selectedRatings = ratings === undefined ? selectedRatings : ratings;
    const productURL = `/reviews/?sort=${sortOption}&product_id=${productId}&count=1000`;

    axiosConfig.get(productURL)
      .then((response) => {
        let reviews = response.data.results;

        // console.log("Handle Sort: ", selectedRatings);
        if (selectedRatings.length > 0) {
          reviews = _.filter(reviews, function(review) {
            return selectedRatings.includes(review.rating)
          });
        }
        const displayedReviews = reviews.slice(0, 2);
        this.setState({
          reviews,
          displayedReviews,
          numReviews: reviews.length,
          numDisplayed: displayedReviews.length,
          sortOption,
          selectedRatings,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateReviews() {
    const { productId, axiosConfig } = this.props;
    const reviewsURL = `/reviews/?sort=relevant&product_id=${productId}&count=1000`;

    axiosConfig.get(reviewsURL)
      .then((response) => {
        const reviews = response.data.results;
        const displayedReviews = response.data.results.slice(0, 2);
        this.setState({
          reviews,
          displayedReviews,
          numReviews: reviews.length,
          numDisplayed: displayedReviews.length,
        });
      })

      .catch((error) => {
        console.log(error);
      });
  }

  updateProductName() {
    const { productId, axiosConfig } = this.props;
    const productNameURL = `/products/${productId}`;

    axiosConfig.get(productNameURL)
      .then((response) => {
        this.setState({ productName: response.data.name });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateMetadata() {
    const { productId, axiosConfig } = this.props;
    const metaURL = `/reviews/meta?product_id=${productId}`;

    axiosConfig.get(metaURL)
      .then((response) => {
        // console.log("Update Metadata Response: ", response.data);
        this.setState({ metadata: response.data });
        this.calculateRatings(response.data);
        this.calculatePercentRecommend(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  calculateRatings(metadata) {
    // console.log("Metadata Ratings: ", metadata.ratings);
    const ratings = [1, 2, 3, 4, 5];
    // const counts = Object.values(metadata.ratings);
    // console.log(metadata.ratings);
    const ratingProportions = {};
    let denominator = 0;
    let numerator = 0;
    for (let i = 0; i < ratings.length; i++) {
      const rating = ratings[i];
      const count = metadata.ratings[rating] !== undefined ? metadata.ratings[rating] : 0;
      denominator += Number(count);
      numerator += Number(rating) * Number(count);
    }
    for (let i = 0; i < ratings.length; i++) {
      const rating = ratings[i];
      const count = metadata.ratings[rating] !== undefined ? metadata.ratings[rating] : 0;
      ratingProportions[rating] = Number(count) / denominator;
    }
    // console.log(numerator, denominator);
    const avgRating = Math.round(10 * (numerator / denominator)) / 10;
    // console.log("Average Rating: ", avgRating);
    // console.log("Average Rating: ", ratingProportions);
    this.setState({ avgRating, ratingProportions, ratingCounts: metadata.ratings });
  }

  calculatePercentRecommend(metadata) {
    const isRecommended = metadata.recommended.true !== undefined
      ? metadata.recommended.true : 0;
    const notRecommended = metadata.recommended.false !== undefined
      ? metadata.recommended.false : 0;
    const denominator = Number(isRecommended) + Number(notRecommended);
    const pctRecommend = (denominator !== 0)
      ? String(Math.round(100 * (isRecommended / denominator))) : 0;
    this.setState({ pctRecommend: `${pctRecommend}%` });
  }

  toggleFilter(event, rating) {
    // console.log(event);
    // console.log(rating);
    let { selectedRatings } = this.state;

    rating = Number(rating);
    if (!selectedRatings.includes(rating)) {
      selectedRatings.push(rating);
    } else {
      selectedRatings = _.filter(selectedRatings, function(num) {return num !== rating} );
    }
    selectedRatings.sort();

    this.setState({ selectedRatings });
    // console.log("Toggle Filter: ", selectedRatings);
    this.handleSort(undefined, selectedRatings);
  }

  render() {
    const {
      axiosConfig, IMGBB_API_KEY, productId, sendInteraction,
    } = this.props;
    const {
      reviews, displayedReviews, numReviews, numDisplayed, productName, metadata,
      avgRating, pctRecommend, ratingProportions, ratingCounts, selectedRatings,
      featureRatings,
    } = this.state;
    return (
      // eslint-disable-next-line max-len
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div className={RatingsReviewsCSS.ratings_section} onClick={(e) => sendInteraction('Ratings and Reviews', e)}>
        <div className={RatingsReviewsCSS.ratings_container} id="read-reviews">
          <div className={RatingsReviewsCSS.ratings_header} data-testid="RatingsReviews-header">
            <h2 className={RatingsReviewsCSS.ratings_reviews_header}>RATINGS & REVIEWS</h2>
          </div>
          <div className={RatingsReviewsCSS.ratings_breakdown_sidebar}>
            <RatingsBreakdown
              toggleFilter={this.toggleFilter}
              handleSort={this.handleSort}
              productId={productId}
              selectedRatings={selectedRatings}
              // metadata={metadata}
              avgRating={avgRating}
              pctRecommend={pctRecommend}
              ratingProportions={ratingProportions}
              ratingCounts={ratingCounts}
            />
          </div>
          <div className={RatingsReviewsCSS.product_breakdown_sidebar}>
            <ProductBreakdown
              // productId={productId}
              characteristics={metadata.characteristics}
              featureRatings={featureRatings}
            />
          </div>
          <div className={RatingsReviewsCSS.sort_options}>
            <SortOptions
              numReviews={numReviews}
              handleSort={this.handleSort}
            />
          </div>
          <div className={RatingsReviewsCSS.reviews_list}>
            <ReviewsList
              axiosConfig={axiosConfig}
              productId={productId}
              reviews={reviews}
              displayedReviews={displayedReviews}
              handleGetReviews={this.handleGetReviews}
            />
          </div>

          {numReviews > 0 ? (
            <div className={RatingsReviewsCSS.review_buttons_container}>
              <div className={RatingsReviewsCSS.review_btn_box}>
                <MoreReviews
                  handleMoreReviews={this.handleMoreReviews}
                  numReviews={numReviews}
                  numDisplayed={numDisplayed}
                />
              </div>
              <div className={RatingsReviewsCSS.review_btn_box}>
                <NewReview
                  axiosConfig={axiosConfig}
                  IMGBB_API_KEY={IMGBB_API_KEY}
                  productName={productName}
                  productId={productId}
                  characteristics={metadata.characteristics}
                  updateReviews={this.updateReviews}
                  featureRatings={featureRatings}
                />
              </div>
            </div>
          ) : (
            <div className={RatingsReviewsCSS.review_buttons_container_no_reviews}>
              <div>
                <p>There are no reviews for this product.</p>
              </div>
              <div>
                <NewReview
                  axiosConfig={axiosConfig}
                  IMGBB_API_KEY={IMGBB_API_KEY}
                  productName={productName}
                  productId={productId}
                  characteristics={metadata.characteristics}
                  updateReviews={this.updateReviews}
                  featureRatings={featureRatings}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default RatingsReviews;
