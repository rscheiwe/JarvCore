import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Home'
import Login from './components/Login'

class App extends Component {

  render() {
    return (
      <div className="App" >
        <Router>
          <Route exact path='/' render={Login}/>
        </Router>
        <Router>
          <Route path="/success" component={Home} />
        </Router>
      </div>
    );
  }
}

export default App;
