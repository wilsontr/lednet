import React from 'react';
import PropTypes from 'prop-types';
import './Tile.css';

export class Tile extends React.PureComponent {
  static propTypes = { 
    pixelId: PropTypes.number.isRequired,
    host: PropTypes.string.isRequired,
  };

  state = {
    color: [0, 0, 0],
  };

  // constructor(props) {
  //   super(props);

  // }

  componentDidMount() {
    this.connect();
  }

  componentWillUnmount() {
    if (this.ws) {
      this.ws.close();
    }
  }

  connect = () => {
    const { host } = this.props;
    this.ws = new WebSocket(`ws://${host}`);
    this.ws.onopen = this.handleWebsocketOpen;
    this.ws.onclose = this.handleWebsocketClose;
    this.ws.onmessage = this.handleWebsocketMessage;    
    this.ws.onerror = this.handleWebsocketError;    
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
    const { pixelId } = this.props;
    this.waitForConnection(() => {
      this.ws.send(`pixel ${pixelId}`);
    }, 20);
  }

  handleWebsocketClose = () => {
    setTimeout(() => {
      this.connect();
    }, 500);
  }  

  handleWebsocketError = () => {
    setTimeout(() => {
      this.connect();
    }, 500);
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
      const blue = parseInt(data.slice(7));
      this.setState({ color: [red, green, blue] });
    }
  }

  render() {
    const { color: [ red, green, blue ] } = this.state;
    const colorString = `rgb(${red}, ${green}, ${blue})`;
    return (
      <span className="Tile" style={{ backgroundColor: colorString }}>
        &nbsp;
      </span>    
    );
  }
}
