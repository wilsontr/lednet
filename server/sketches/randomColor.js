'use strict';

const randomColor = (frameBuffer) => {
  setInterval(() => {
    for (let idx = 0; idx < (frameBuffer.getHeight() * frameBuffer.getWidth()); idx++) {
      frameBuffer.setPixelByIndex(idx, [
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
      ]);
    }
  }, 500);  
};

module.exports = randomColor;