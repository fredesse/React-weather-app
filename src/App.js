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
      displayWeather: false
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
      let lat = this.state.latitude;
      let lon = this.state.longitude;
      this.axiosGETreq(`lat=${lat}&lon=${lon}&APPID=${api_key}`);
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
    let loc = this.state.city;
    this.axiosGETreq(`q=${loc}&APPID=${api_key}`);
  }

  axiosGETreq = (URL) => {
    axios.get(`http://api.openweathermap.org/data/2.5/forecast?${URL}`)
      .then(res => {
        console.log("AXIOS RESPONSE:", res.data);
      });
  }

  render() {
    return (
      <div>
        {
          !this.state.displayWeather && (
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
          )
        }
        {
          this.state.displayWeather && (
            <div>
              <div>
                <div>
                  <button>Back</button>
                  <h2>{this.state.city}</h2>
                </div>
                <div>
                  <button>Celsius</button>
                </div>
              </div>
              <div>
                <div>
                  <h3>DATE</h3>
                  <h4>CURRENT WEATHER</h4>
                </div>
                <div>
                  <div>TEMP</div>
                  <div>ICON</div>
                  <div>TODAY FORECAST</div>
                </div>
                <div>
                  <div>5 DAY FORECAST</div>
                </div>
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

export default App;
// <Route exact path='/' component={Search}/>
// <Route exact path='/dashboard' component={Dashboard}/>
