'use strict';

const amplitude = 120;
const offset = 100;
const period = 10;
const dx = (2 * Math.PI) / period;
let blueTheta = 0;
let greenTheta = 2 * Math.PI * Math.random();


const sineWave = (frameBuffer) => {
  setInterval(() => {
    // for (let idx = 0; idx < (height * width); idx++) {
    //   ledColors[idx] = [
    //     Math.floor(Math.random() * 255),
    //     Math.floor(Math.random() * 255),
    //     Math.floor(Math.random() * 255),
    //   ];
    // }

    blueTheta += 0.2;
    greenTheta += 0.3;
    let blueX = blueTheta;
    let greenX = greenTheta;

    for (let i = frameBuffer.getWidth(); i >= 0; i--) {
      let blue = offset + Math.round((amplitude * Math.sin(blueX)));
      let green = offset + Math.round((amplitude * Math.sin(greenX)));
      for (let y = 0; y < frameBuffer.getHeight(); y++) {
        frameBuffer.setPixel(i, y, [
          //0,
          // green,
          0,
          green,
          blue,
        ]);
      }
      blueX += dx;
      greenX += dx;
    }
  }, 100);  
};

module.exports = sineWave;