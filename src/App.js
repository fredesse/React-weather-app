import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Toggle from 'react-toggle';

//retrieve the API key and store it as a variable
const api_key = process.env.REACT_APP_API_KEY;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: '',
      longitude: '',
      city: '',
      tempInCelsius: true,
      displayWeather: false,
      currentDate: '',
      currentWeatherDesc: '',
      currentTemp: '',
      currentWeatherIcon: '',
      currentWeatherMorning: '',
      currentWeatherDay: '',
      currentWeatherEvening: '',
      currentWeatherNight: '',
      forecast: '',
      fiveDayForecast: ''
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
        this.setState({
          latitude: res.data.city.coord.lat,
          longitude: res.data.city.coord.lon,
          city: res.data.city.name,
          displayWeather: true,
          currentDate: res.data.list[0].dt_txt,
          currentWeatherDesc: res.data.list[0].weather[0].description,
          currentWeatherIcon: res.data.list[0].weather[0].icon,
          currentTemp: res.data.list[0].main.temp,
          forecast: res.data.list
        });
        this.getTodaysTemps();
      });
  }

  calculateTemp = (temp) => {
    if (this.state.tempInCelsius) {
      return Math.round(temp - 273.15) + "℃";
    }
    return Math.round((temp * 9/5) - 459.67) + "℉";
  }

  findDate = () => {
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",]
    let date = new Date();
    let day = date.getDate();
    let weekday = date.getDay();
    let month = date.getMonth();
    let year = date.getFullYear();
    return `${days[weekday]}, ${months[month]} ${day} ${year}`
  }

  getTodaysTemps = () => {
    //console.log(this.state.forecast[0].dt_txt[12]);
    let forecast = this.state.forecast;
    for(let i = 0; i < 8; i++) {
      if (forecast[i].dt_txt[12] === "6") {
        this.setState({currentWeatherMorning: this.calculateTemp(forecast[i].main.temp)});
      }
      if (forecast[i].dt_txt[12] === "2") {
        this.setState({currentWeatherDay: this.calculateTemp(forecast[i].main.temp)});
      }
      if (forecast[i].dt_txt[12] === "8") {
        this.setState({currentWeatherEvening: this.calculateTemp(forecast[i].main.temp)});
      }
      if (forecast[i].dt_txt[12] === "0") {
        this.setState({currentWeatherNight: this.calculateTemp(forecast[i].main.temp)});
      }
    }
    this.getFiveDayForecast(forecast);
  }

  getFiveDayForecast = (forecast) => {
    let container = [];
    for (let i = 0; i < forecast.length; i++) {
      if (forecast[i].dt_txt[12] === "2") {
        container.push(forecast[i]);
      }
    }
    if (container.length === 4) {
      let today = {
        main: {
          temp: this.state.currentTemp
        },
        weather: {
          icon: this.state.currentWeatherIcon
        }
      };
      container.unshift(today);
    }
    this.setState({fiveDayForecast: container});
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
                  <div onClick={ () => { this.setState({displayWeather: false})}}>BACK</div>
                  <h2>{this.state.city}</h2>
                </div>
                <div>
                  <label>
                    <Toggle
                      defaultChecked={this.state.soupIsReady}
                      className='custom-classname'
                      icons={{
                        checked: "ON",
                        unchecked: "OFF",
                      }}
                      onChange={this.handleSoupChange} />
                  </label>
                </div>
              </div>
              <div>
                <div>
                  <h3>{this.findDate()}</h3>
                  <h4>{this.state.currentWeatherDesc}</h4>
                </div>
                <div>
                  <div>{this.calculateTemp(this.state.currentTemp)}</div>
                  <div>{this.state.currentWeatherIcon}</div>
                  <div>
                    <div>
                      <div>Morning</div>
                      <div>{this.state.currentWeatherMorning}</div>
                    </div>
                    <div>
                      <div>Day</div>
                      <div>{this.state.currentWeatherDay}</div>
                    </div>
                    <div>
                      <div>Evening</div>
                      <div>{this.state.currentWeatherEvening}</div>
                    </div>
                    <div>
                      <div>Night</div>
                      <div>{this.state.currentWeatherNight}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div>5 DAY FORECAST</div>
                  <button onClick={ () => { console.log("HEY", this.state.fiveDayForecast)}}>CLICK</button>
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
