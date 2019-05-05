"use strict";


class FrameBuffer {
  constructor(width, height) {
    this.pixels = [];
    this.height = height;
    this.width = width;  

    for (let idx = 0; idx < (height * width); idx++) {
      this.pixels[idx] = [0, 0, 0];
    }    
  }

  getPixels() {
    return this.pixels;
  }

  setPixel(x, y, color) {    
    const index = parseInt((y * this.width)) + parseInt(x);
    this.pixels[index] = color;
  }

  setPixelByIndex(index, color) {
    this.pixels[index] = color;
  }

  getPixel(x, y) {
    const index = (y * this.width) + x;
    return this.pixels[index];
  }

  getPixelByIndex(index) {
    return this.pixels[index];
  }

  getHeight() {
    return this.height;
  }

  getWidth() {
    return this.width;
  }
}

module.exports = FrameBuffer;