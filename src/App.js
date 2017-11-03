import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

//save the API KEY as a new variable
const api_key = process.env.REACT_APP_API_KEY;
//const api_key = '8c7a78853d984985388cdf27af04f4b9';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: '',
      longitude: '',
      city: '',
    }
  }

  //get current location of user
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

  //update state with search value
  handleSearch = (event) => {
    this.setState({
      city: event.target.value
    });
    console.log("CITY", this.state.city);
  }

  //submit a GET request
  handleSubmit = (e) => {
    e.preventDefault();

    //set a new variable with the city value
    let loc = this.state.city;

    axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${loc}&APPID=${api_key}`)
      .then(res => {
        console.log('RESPONSE:', res.data);
      })

  }

  render() {
    return (
      <div className="">
        <div>
          <form onSubmit={this.handleSubmit}>
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
