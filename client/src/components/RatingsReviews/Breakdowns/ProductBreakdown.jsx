import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown as faRegCaretDown } from '@fortawesome/free-regular-svg-icons';

import ProductBreakdownCSS from './ProductBreakdown.module.css';

export default class ProductBreakdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { characteristics, featureRatings } = this.props;

    let characteristicsRows = [];
    if ((characteristics !== undefined && Object.keys(characteristics).length > 0)
      && (featureRatings !== undefined && Object.keys(featureRatings).length > 0)) {
      const characteristicNames = Object.keys(characteristics);

      // console.log("Characteristics:");
      // console.log(characteristics);
      // console.log(characteristicNames);

      // console.log("Feature Ratings:")
      // console.log(featureRatings);

      characteristicsRows = characteristicNames.map((name) => {
        const { id, value } = characteristics[name];
        // console.log(name);
        const descriptions = featureRatings[name];
        const greyCharacteristicContainer = `${ProductBreakdownCSS.characteristic_item} ${ProductBreakdownCSS.grey_bar}`;
        // console.log(greyCharacteristicContainer);

        return (
          <div
            className={ProductBreakdownCSS.characteristic_container}
            key={id}
          >
            <div className={ProductBreakdownCSS.characteristicText}>{name}</div>
            <div className={ProductBreakdownCSS.characteristic_row}>
              <div
                className={ProductBreakdownCSS.characteristic_rating}
                style={{ left: `${Math.round(25 * (value - 1))}%` }}
              >
                <FontAwesomeIcon size="2xl" className={ProductBreakdownCSS.caret} icon={faCaretDown} />
              </div>
              <div className={ProductBreakdownCSS.characteristic_bar}>
                <div className={greyCharacteristicContainer} />
                <div className={greyCharacteristicContainer} />
                <div className={greyCharacteristicContainer} />
              </div>
            </div>
            <div className={ProductBreakdownCSS.characteristic_bar}>
              <div className={ProductBreakdownCSS.characteristic_item}>{descriptions[0]}</div>
              <div className={ProductBreakdownCSS.characteristic_item}>{descriptions[2]}</div>
              <div className={ProductBreakdownCSS.characteristic_item}>{descriptions[4]}</div>
            </div>
          </div>
        );
      });
    }

    return (
      <div
        className={ProductBreakdownCSS.breakdown_container}
      >
        {characteristicsRows}
      </div>
    );
  }
}
