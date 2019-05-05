import React from 'react';
import { Grid } from './Grid';
import './App.css';

const host = '127.0.0.1:8080';

function App() {
  return (
    <div className="App">
      <Grid host={host} width={3} height={3} />
    </div>
  );
}

export default App;
