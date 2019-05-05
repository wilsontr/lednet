'use strict';

const amplitude = 120;
const offset = 100;
const period = 10;
const dx = (2 * Math.PI) / period;
const dxGreen = ((Math.PI) / period);// * Math.random();
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

    blueTheta += 0.03;
    greenTheta += 0.04;
    let blueX = blueTheta;
    

    for (let i = frameBuffer.getWidth(); i >= 0; i--) {
      let blue = offset + Math.round((amplitude * Math.sin(blueX)));
      let greenX = greenTheta;
      for (let y = 0; y < frameBuffer.getHeight(); y++) {
        let green = offset + Math.round((amplitude * Math.sin(greenX)));
        frameBuffer.setPixel(i, y, [
          //0,
          // green,
          0,
          green,
          blue,
        ]);
        greenX += dxGreen;
      }
      blueX += dx;      
    }
  }, 33);  
};

module.exports = sineWave;