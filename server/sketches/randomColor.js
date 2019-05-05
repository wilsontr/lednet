'use strict';

const randomColor = (ledColors, width, height) => {
  setInterval(() => {
    for (let idx = 0; idx < (height * width); idx++) {
      ledColors[idx] = [
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
      ];
    }
  }, 500);  
};

module.exports = randomColor;