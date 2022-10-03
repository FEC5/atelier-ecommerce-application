// eslint-disable-next-line max-classes-per-file
import React from 'react';
import axiosConfig, { IMGBB_API_KEY } from '../../../../axiosConfig.js'; // use this variable in place of axios
import ProductOverview from '../ProductOverview/ProductOverview.jsx';
import Comparison from '../Comparison/Comparison.jsx';
import QA from '../QA/QA.jsx';
import RatingsReviews from '../RatingsReviews/RatingsReviews.jsx';
import Tracker from './Tracker.jsx';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productId: 65633, // Pugs: 65633 // Shoes: 65635 //sales price: 65661
      theme: true,
    };
    this.updateProductId = this.updateProductId.bind(this);
    this.toggleTheme = this.toggleTheme.bind(this);
  }

  // componentDidMount() {
  //   console.log(this.props);
  // }

  updateProductId(id) {
    this.setState({
      productId: Number(id),
    });
  }

  toggleTheme() {
    const { theme } = this.state;
    this.setState({
      theme: !theme,
    });
  }

  render() {
    const { productId, theme } = this.state;
    return (
      <div className={theme ? 'light' : 'dark'}>
        {/*
        <select value={productId} id="id-selector" onChange={(e) => { this.updateProductId(e.target.value); }}>
          <option value="65633">65633</option>
          <option value="65635">65635</option>
          <option value="65640">65640</option>
          <option value="65630">65630</option>
          <option value="65661">65661</option>
        </select>
        <p id="id-display">
          Current Product Id:
          {productId}
        </p>
        */}
        <Tracker
          render={(sendInteraction) => (
            <ProductOverview
              sendInteraction={sendInteraction}
              productId={productId}
              toggleTheme={this.toggleTheme}
              theme={theme}
              key={productId}
            />
          )}
        />
        {/* <Tracker
          render={(sendInteraction) => (
            <Comparison
              sendInteraction={sendInteraction}
              productId={productId}
              updateProductId={this.updateProductId}
            />
          )}
        /> */}
        <Comparison productId={productId} updateProductId={this.updateProductId} />
        <Tracker
          render={(sendInteraction) => (
            <QA
              sendInteraction={sendInteraction}
              productId={productId}
              key={productId}
            />
          )}
        />
        <Tracker
          render={(sendInteraction) => (
            <RatingsReviews
              key={`RR: ${productId}`}
              axiosConfig={axiosConfig}
              IMGBB_API_KEY={IMGBB_API_KEY}
              sendInteraction={sendInteraction}
              productId={productId}
            />
          )}
        />
      </div>
    );
  }
}

export default App;
