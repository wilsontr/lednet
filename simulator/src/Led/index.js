import React from 'react';
import PropTypes from 'prop-types';
import './Led.css';

export class Led extends React.PureComponent {
  static propTypes = { 
    pixelId: PropTypes.number.isRequired,
    host: PropTypes.string.isRequired,
  };

  state = {
    color: [0, 0, 0],
  };

  componentDidMount() {
    this.connect();
  }

  componentWillUnmount() {
    if (this.ws) {
      this.ws.close();
    }
  }

  connect = () => {
    try {
      const { host } = this.props;
      this.ws = new WebSocket(`ws://${host}`);
      this.ws.onopen = this.handleWebsocketOpen;
      this.ws.onclose = this.handleWebsocketClose;
      this.ws.onmessage = this.handleWebsocketMessage;    
      this.ws.onerror = this.handleWebsocketError;          
    } catch (error) {
      console.error(error);
      // setTimeout(() => {
      //   this.connect();
      // }, 5000);
    }
  }

  waitForConnection = (callback, interval) => {
    if (this.ws.readyState === 1) {
        callback();
    } else {
        var that = this;
        // optional: implement backoff for interval here
        setTimeout(function () {
            that.waitForConnection(callback, interval);
        }, interval);
    }
  }

  handleWebsocketOpen = () => {
    try {
      const { pixelId } = this.props;
      this.waitForConnection(() => {
        this.ws.send(`pixel ${pixelId}`);
      }, 500);
    } catch (error) {
      console.log('sending pixel id', error);
    }
  }

  handleWebsocketClose = event => {
    console.log('websocket close', event);
    setTimeout(() => {
      this.connect();
    }, 5000);
  }  

  handleWebsocketError = event => {
    console.log('websocket error', event);
    // setTimeout(() => {
    //   this.connect();
    // }, 1000);
  }    

  handleWebsocketMessage = event => {
    if (!event) {
      console.log('Malformed websocket event', event);
      return;
    }
    const { data } = event;
    if (data[0] === 'c') {
      const red = parseInt(data.slice(1, 4));
      const green = parseInt(data.slice(4, 7));
      const blue = parseInt(data.slice(7, 10));
      this.setState({ color: [red, green, blue] });
    }
  }

  render() {
    const { color: [ red, green, blue ] } = this.state;
    const colorString = `rgb(${red}, ${green}, ${blue})`;
    return (
      <span className="Led" style={{ backgroundColor: colorString }}>
        &nbsp;
      </span>    
    );
  }
}
