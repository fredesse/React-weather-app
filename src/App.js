import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Search from './Search';
import Dashboard from './Dashboard';
import './App.css';

class App extends Component {

  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/' component={Search}/>
          <Route exact path='/dashboard' render={ (props) => (<Dashboard test="hi" {...props} />)}/>
        </Switch>
      </div>
    );
  }
}

export default App;
// <Route exact path='/' component={Search}/>
// <Route exact path='/dashboard' component={Dashboard}/>
