import React, { Component } from 'react';

import Header from './Header'

import CountryGridHooks from './containers/CountryGridHooks'

import './App.css';

import logo from './world.svg'

import 'bootstrap/dist/js/bootstrap.bundle.min.js.map'
import 'bootstrap/dist/css/bootstrap.min.css'


class App extends Component {
  render() {
    return (
      <main className="App">

        <Header title="Welcome to the Country Grid!! :)"
          logo={logo} />

        <CountryGridHooks />

      </main>
    );
  }
}

export default App;
