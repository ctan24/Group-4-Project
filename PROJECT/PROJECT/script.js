
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const axios = require('axios');

// Configure dotenv package

require('dotenv').config();

// Set up our openweathermap API_KEY

const apiKey = `${process.env.API_KEY}`;
const googleAPIKey = `${process.env.google_API_KEY}`
const Kelvin = 273.15

// Setup our express app and body-parser configurations
// Setup our javascript template view engine
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Setup our default display on launch
app.get('/', function(req, res) {

    // It shall not fetch and display any data in the index page
    res.render('index', { weather: null, error: null });
});

// On a post request, the app shall data from OpenWeatherMap using the given arguments
app.post('/', function(req, res) {

    // Get city name passed in the form
    let city = req.body.city;
    getLocation(city).then(function (response) {
        return getWeather(response);
    }).catch(function () {
        res.render('index', { weather: null, error: 'Error, please try again' });
    }).then(function (response) {
        let weather = response;
        
        // we shall use the data got to set up our output
        let place = `${weather.formatted_address}`,
            weatherTemp = `${weather.current.temp}`,
            weatherIcon = `http://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`,
            weatherDescription = `${weather.current.weather[0].description}`,
            wind = `${weather.current.wind_speed}`,
            humidity = `${weather.current.humidity}`,
            visibility = `${weather.current.visibility}`,
            feelslike = `${weather.current.feels_like}`,
            firstHourly = `${weather.hourly[0].dt}`,
            secondHourly = `${weather.hourly[1].dt}`,
            thirdHourly = `${weather.hourly[2].dt}`,
            firstDaily = `${weather.daily[0].dt}`,
            secondDaily = `${weather.daily[1].dt}`,
            thirdDaily = `${weather.daily[2].dt}`

        // We shall also round off the value of the degrees fahrenheit calculated into two decimal places
        function roundToOne(num) {
            return +(Math.round(num + "e+1") + "e-1");
        }
        
        weatherCelsius = roundToOne(weatherTemp);


        currentPlusOne = new Date(0);
        currentPlusOne.setUTCSeconds(firstHourly);
        currentPlusOne = formatAMPM(currentPlusOne);

        currentPlusTwo = new Date(0);
        currentPlusTwo.setUTCSeconds(secondHourly);
        currentPlusTwo = formatAMPM(currentPlusTwo);

        currentPlusThree = new Date(0);
        currentPlusThree.setUTCSeconds(thirdHourly);
        currentPlusThree = formatAMPM(currentPlusThree);

        weatherPlusOne = `${weather.hourly[0].temp}`;
        hourlyWeatherOne = roundToOne(weatherPlusOne);

        weatherPlusTwo = `${weather.hourly[1].temp}`;
        hourlyWeatherTwo = roundToOne(weatherPlusTwo);

        weatherPlusThree = `${weather.hourly[2].temp}`;
        hourlyWeatherThree = roundToOne(weatherPlusThree);

        weatherTomorrowOne = `${weather.hourly[0].temp}`;
        dailyWeatherOne = roundToOne(weatherTomorrowOne);

        weatherTomorrowTwo= `${weather.hourly[1].temp}`;
        dailyWeatherTwo = roundToOne(weatherTomorrowTwo);

        weatherTomorrowThree = `${weather.hourly[2].temp}`;
        dailyWeatherThree = roundToOne(weatherTomorrowThree);
        
        hourlyIconOne = `http://openweathermap.org/img/wn/${weather.hourly[0].weather[0].icon}@2x.png`,
        hourlyIconTwo = `http://openweathermap.org/img/wn/${weather.hourly[1].weather[0].icon}@2x.png`,
        hourlyIconThree = `http://openweathermap.org/img/wn/${weather.hourly[2].weather[0].icon}@2x.png`,

        dailyIconOne = `http://openweathermap.org/img/wn/${weather.daily[0].weather[0].icon}@2x.png`,
        dailyIconTwo = `http://openweathermap.org/img/wn/${weather.daily[0].weather[0].icon}@2x.png`,
        dailyIconThree = `http://openweathermap.org/img/wn/${weather.daily[0].weather[0].icon}@2x.png`


    
        res.render('index', { weather: weather, place: place, temp: weatherCelsius, 
            icon: weatherIcon, description: weatherDescription, humidity: humidity, wind: wind, visibility: visibility, 
            feelslike: feelslike, currentPlusOne: currentPlusOne, currentPlusTwo: currentPlusTwo, currentPlusThree: currentPlusThree, 
            tempHourlyOne: hourlyWeatherOne, tempHourlyTwo: hourlyWeatherTwo, tempHourlyThree: hourlyWeatherThree, 
            iconOne: hourlyIconOne, iconTwo: hourlyIconTwo, iconThree: hourlyIconThree, 
            tempDailyOne: dailyWeatherOne, tempDailyTwo: dailyWeatherTwo, tempDailyThree: dailyWeatherThree,
            dayIconOne: dailyIconOne, dayIconTwo: dailyIconTwo, dayIconThree: dailyIconThree, error: null });        
    })
})

function formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}





app.listen(8080, function() {
    console.log('Weatherly listening on port 8080!');
});

function getLocation(city) {
    let api = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${googleAPIKey}`;
    let data = {};
    return axios.get(api).then(function(response) {
        if (response.data.status !== 'ZERO_RESULTS') {
            data.formatted_address = response.data.results[0].formatted_address;
            data.latLon = response.data.results[0].geometry.location;
            return data;    
        } else {
            throw new Error("NOT_FOUND_ERROR");
        }
    }).catch(function(err) {
        console.log("ERROR ERROR")
    })
}

function getWeather(location) {
    let part = "minutely"
    let formatted_address = location.formatted_address;
    let lat = location.latLon.lat;
    let lon = location.latLon.lng;
    let api = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${part}&units=metric&appid=${apiKey}`;
    return axios.get(api).then(function(response){
        let data = response.data;
        data.formatted_address = formatted_address;
        console.log()
        return data;
    }).catch(function(err) {
    })
}