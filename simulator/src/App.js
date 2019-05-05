import React from 'react';
import { Tile } from './Tile';
import './App.css';

const host = '127.0.0.1:8080';

function App() {
  return (
    <div className="App">
      <Tile host={host} pixelId={0} />
    </div>
  );
}

export default App;
