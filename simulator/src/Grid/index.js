import React from 'react';
import PropTypes from 'prop-types';
import { Led } from '../Led';
import './Grid.css';

export class Grid extends React.PureComponent {
  static propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    host: PropTypes.string.isRequired,
  }

  getRows() {
    const { height, width, host } = this.props;
    console.log('height', height, 'width', width);
    const rows = [];
    let pixelId = 0;
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        row.push(
          <Led 
            host={host}
            pixelId={pixelId}
            key={`pixel_${pixelId}`}
          />
        );
        pixelId++;
      }
      rows.push(row);
    }
    return rows;
  }
 
  render() {
    return (
      <span className="Grid">
        {this.getRows()}
      </span>
    );
  } 
}
