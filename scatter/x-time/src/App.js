import './App.css';
import React, { useState } from 'react'
import ScatterPlot from './components/Scatterplot'

function App() {
  var data = require('./graphdata.json');
  var dimensions = {"width": 954, "height": 600}
 
  return (
    <div className="App">
      <h3>Scatterplot</h3>
      <ScatterPlot
       points={data}
       configuration={dimensions}
      />
    </div>
  )
}

export default App;