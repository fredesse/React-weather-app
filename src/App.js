import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

//retrieve the API key and store it as a variable
const api_key = process.env.REACT_APP_API_KEY;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: '',
      longitude: '',
      city: '',
    }
  }

  //get current location of user and call the API
  getLocation = () => {
    let showPosition = (position) => {
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      console.log("STATE", this.state);
      axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${this.state.latitude}&lon=${this.state.longitude}&APPID=${api_key}`)
        .then(res => {
          console.log("LOC RESPONSE: ", res.data);
        })
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
      console.log("DONE!");
    } else {
      alert("Current location is not supported by this browser");
    }
    // let lat = this.state.latitude;
    // let lon = this.state.longitude;

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
        console.log("CITY RESPONSE:", res.data);
      })

  }

  render() {
    return (
>>>>>>> parent of a0d4ce2... Add react router
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
>>>>>>> parent of a0d4ce2... Add react router
=======
>>>>>>> parent of a0d4ce2... Add react router
      </div>
    );
  }
}

export default App;
// <Route exact path='/' component={Search}/>
// <Route exact path='/dashboard' component={Dashboard}/>
