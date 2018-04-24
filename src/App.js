import React, { Component } from 'react';

import Header from './Header'

import CountryGrid from './CountryGrid'

import './App.css';

// import logo from './logo.svg';
import logo from './world.svg'

import 'bootstrap/dist/js/bootstrap.bundle.min.js.map'
import 'bootstrap/dist/css/bootstrap.min.css'

// import $ from 'jquery'
// import bootstrapjs from 'bootstrap'

class App extends Component {
  render() {
    return (
      <div className="App">
        
        <Header title="Welcome to the country grid!! :)"
          logo={logo} />

        <CountryGrid />

      </div>
    );
  }
}

export default App;