import React, { Component } from 'react';
import '../css/App.css';
import '../css/toggleButton.css';
import '../css/dashboard.css';
import axios from 'axios';
import Toggle from 'react-toggle';

import Search from 'react-icons/lib/md/search';
import BackArrow from 'react-icons/lib/md/arrow-back';

import 'weather-icons/css/weather-icons.css';

//retrieve the API key and store it as a variable
const api_key = process.env.REACT_APP_API_KEY;
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const iconList = {
  "01d": 'wi-day-sunny',
  "01n": 'wi-night-clear',
  "02d": 'wi-day-cloudy',
  "02n": 'wi-night-partly-cloudy',
  "03d": 'wi-cloud',
  "03n": 'wi-night-alt-cloudy',
  "04d": 'wi-cloudy',
  "04n": 'wi-night-cloudy',
  "09d": 'wi-showers',
  "09n": 'wi-night-showers',
  "10d": 'wi-rain',
  "10n": 'wi-night-rain',
  "11d": 'wi-thunderstorm',
  "11n": 'wi-night-thunderstorm',
  "13d": 'wi-snow',
  "13n": 'wi-night-snow',
  "50d": 'wi-fog',
  "50n": 'wi-night-fog',
}

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
      fiveDayForecast: []
    }
  }

  //get current location of user and call the API
  getLocation = () => {
    let showPosition = (position) => {
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      let lat = this.state.latitude;
      let lon = this.state.longitude;
      this.axiosGETreq(`lat=${lat}&lon=${lon}&APPID=${api_key}`);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      alert("Current location is not supported by this browser");
    }
  }

  //update state with search value
  handleSearch = (event) => {
    this.setState({
      city: event.target.value
    });
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
        let weatherData = {
          latitude: res.data.city.coord.lat,
          longitude: res.data.city.coord.lon,
          city: res.data.city.name,
          displayWeather: true,
          currentDate: res.data.list[0].dt_txt,
          currentWeatherDesc: res.data.list[0].weather[0].description,
          currentWeatherIcon: res.data.list[0].weather[0].icon,
          currentTemp: res.data.list[0].main.temp,
          forecast: res.data.list
        }
        this.setState({
          latitude: weatherData.latitude,
          longitude: weatherData.longitude,
          city: weatherData.city,
          displayWeather: weatherData.displayWeather,
          currentDate: weatherData.currentDate,
          currentWeatherDesc: weatherData.currentWeatherDesc,
          currentWeatherIcon: weatherData.currentWeatherIcon,
          currentTemp: weatherData.currentTemp,
          forecast: weatherData.forecast
        });
        this.getTodaysTemps();
        this.getFiveDayForecast();
        localStorage.setItem('data', JSON.stringify(weatherData));
      })
      .catch(error => {
        console.log(error);
      });
  }

  //since temps are coming as Kelvins we need to convert them
  calculateTemp = (temp) => {
    if (this.state.tempInCelsius) {
      return Math.round(temp - 273.15) + "℃";
    }
    return Math.round((temp * 9/5) - 459.67) + "℉";
  }

  findDate = () => {
    let date = new Date();
    let day = date.getDate();
    let weekday = date.getDay();
    let month = date.getMonth();
    let year = date.getFullYear();
    return `${days[weekday]}, ${months[month]} ${day} ${year}`
  }

  //get temps for today by looping through the weather data array
  getTodaysTemps = () => {
    let forecast = this.state.forecast;
    let todaysTemps = {};
    for(let i = 0; i < 8; i++) {
      if (forecast[i].dt_txt[12] === "6") {
        this.setState({currentWeatherMorning: forecast[i].main.temp});
        todaysTemps["currentWeatherMorning"] = forecast[i].main.temp;
      }
      if (forecast[i].dt_txt[12] === "2") {
        this.setState({currentWeatherDay: forecast[i].main.temp});
        todaysTemps["currentWeatherDay"] = forecast[i].main.temp;
      }
      if (forecast[i].dt_txt[12] === "8") {
        this.setState({currentWeatherEvening: forecast[i].main.temp});
        todaysTemps["currentWeatherEvening"] = forecast[i].main.temp;
      }
      if (forecast[i].dt_txt[12] === "0") {
        this.setState({currentWeatherNight: forecast[i].main.temp});
        todaysTemps["currentWeatherNight"] = forecast[i].main.temp;
      }
    }
    localStorage.setItem('todaysTemps', JSON.stringify(todaysTemps));
  }

  //get five day forecast array by searching for the 12pm time
  getFiveDayForecast = () => {
    let forecast = this.state.forecast;
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
        weather: [
          {
          icon: this.state.currentWeatherIcon
          }
        ]
      };
      container.unshift(today);
    }
    this.setState({fiveDayForecast: container});
    localStorage.setItem('fiveDayForecast', JSON.stringify(this.state.fiveDayForecast));
  }

  whatDayIsIt = (index) => {
    let date = new Date();
    let weekday = date.getDay();
    return (<p className="forecast-day">{days[weekday + index]}</p>);
  }

  //this sets tempInCelsius to either true or false
  handleTempChange = (e) => {
    this.setState({tempInCelsius: e.target.checked});
    localStorage.setItem('temp', JSON.stringify(e.target.checked));
    this.forceUpdate();
  }

  renderWeatherIcons = (code) => {
    let iconClass = `wi ${iconList[code]} current-weather-icon`;
    return (<i className={iconClass}></i>)
  }

  renderForecastIcons = (code) => {
    let iconClass = `wi ${iconList[code]} forecast-weather-icon`;
    return (<i className={iconClass}></i>)
  }

  capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  componentWillMount = () => {
    const cachedData = JSON.parse(localStorage.getItem('data'));
    const cachedFiveDayForecast = JSON.parse(localStorage.getItem('fiveDayForecast'));
    const cachedTodaysTemps = JSON.parse(localStorage.getItem('todaysTemps'));
    const cachedTempInCelsius = JSON.parse(localStorage.getItem('temp'));

    if (cachedData) {
      //set state with cached data
      this.setState({
        latitude: cachedData.latitude,
        longitude: cachedData.longitude,
        city: cachedData.city,
        displayWeather: cachedData.displayWeather,
        currentDate: cachedData.currentDate,
        currentWeatherDesc: cachedData.currentWeatherDesc,
        currentWeatherIcon: cachedData.currentWeatherIcon,
        currentTemp: cachedData.currentTemp,
        forecast: cachedData.forecast,
        fiveDayForecast: cachedFiveDayForecast,
        currentWeatherMorning: cachedTodaysTemps.currentWeatherMorning,
        currentWeatherDay: cachedTodaysTemps.currentWeatherDay,
        currentWeatherEvening: cachedTodaysTemps.currentWeatherEvening,
        currentWeatherNight: cachedTodaysTemps.currentWeatherNight,
        tempInCelsius: cachedTempInCelsius
      });
    }
  }

  render() {
    return (
      <div>
        {
          !this.state.displayWeather && (
            <div className="search-container">
              <form onSubmit={this.handleSubmit}>
                <input className="search-input" type="text" value={this.state.city} placeholder="City" onChange={this.handleSearch}/>
                <Search size={35} className="search-icon" onClick={ (e) => { this.handleSubmit(e)}} />
              </form>
              <p>or</p>
              <p className="search-curent-loc">use my <a onClick={() => { this.getLocation()}}>current position</a></p>
            </div>
          )
        }
        {
          this.state.displayWeather && (
            <div className="weather-container">
              <div className="upper-section">
                <div className="back-and-city">
                  <BackArrow size={35} onClick={ () => { this.setState({displayWeather: false})}} />
                  <h2 className="city-desktop">{this.state.city}</h2>
                </div>
                <div className="toggle-btn">
                  <label>
                    <Toggle
                      defaultChecked={this.state.tempInCelsius}
                      className='custom-classname'
                      icons={{
                        checked: "℃",
                        unchecked: "℉",
                      }}
                      onChange={this.handleTempChange} />
                  </label>
                </div>
              </div>
              <h2 className="city-mobile">{this.state.city}</h2>
              <div>
                <div className="date-weather">
                  <div className="current-date">{this.findDate()}</div>
                  <div className="current-weather-desc">{this.capitalizeFirstLetter(this.state.currentWeatherDesc)}</div>
                </div>
                <div className="current-weather-data">
                  <div className="current-weather-temp">{this.calculateTemp(this.state.currentTemp)}</div>
                  <div>{this.renderWeatherIcons(this.state.currentWeatherIcon)}</div>
                  <div className="todays-weather-parent">
                    <div className="todays-weather">
                      <div>Morning</div>
                      <div className="time-of-day">{this.calculateTemp(this.state.currentWeatherMorning)}</div>
                    </div>
                    <div className="todays-weather">
                      <div>Day</div>
                      <div>{this.calculateTemp(this.state.currentWeatherDay)}</div>
                    </div>
                    <div className="todays-weather">
                      <div>Evening</div>
                      <div>{this.calculateTemp(this.state.currentWeatherEvening)}</div>
                    </div>
                    <div className="todays-weather">
                      <div>Night</div>
                      <div>{this.calculateTemp(this.state.currentWeatherNight)}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="forecast-list-parent">
                    {this.state.fiveDayForecast.map((forecast, index) => (
                      <div className="forecast-list" key={index.toString()}>
                        {this.whatDayIsIt(index)}
                        {this.renderForecastIcons(forecast.weather[0].icon)}
                        <div className="forecast-temp">{this.calculateTemp(forecast.main.temp)}</div>
                      </div>
                    )
                    )}
                  </div>
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
