import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Home'

class App extends Component {

  render() {
    return (
      <div className="App" >
        <Router>
          <Route exact path='/' render={() => (<a href='http://localhost:3000/login' style={{position: "absolute", top: "100px"}}>Log in</a>)}/>
        </Router>
        <Router>
          <Route path="/success" component={Home} />
        </Router>
      </div>
    );
  }
}

export default App;
