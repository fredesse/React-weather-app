import React, { Component } from 'react';

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Hello world</h1>
        <button onClick={() => { console.log(this.props) }}>CLICK ME</button>
      </div>
    );
  }
}

export default Dashboard;
