import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: '',
      longitude: '',
      city: '',
    }
  }

  getLocation = () => {
    let showPosition = (position) => {
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      console.log("STATE", this.state);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
      console.log("DONE!");
    } else {
      alert("Current location is not supported by this browser");
    }
  }

  handleSearch = (event) => {
    this.setState({
      city: event.target.value
    });
    console.log("CITY", this.state.city);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let data = {

    }
  }

  render() {
    return (
      <div className="">
        <div>
          <form>
            <input type="text" value={this.state.city} placeholder="City" onChange={this.handleSearch}/>
            <input type="submit"/>
          </form>
        </div>
        <div>
          <p>or</p>
        </div>
        <div>
          <p>use my <a onClick={() => { this.getLocation()}}>current position</a></p>
        </div>
      </div>
    );
  }
}

export default App;
