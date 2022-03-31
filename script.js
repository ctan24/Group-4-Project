
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const NewsAPI = require('newsapi');
const port = process.env.PORT || 8080;

// Configure dotenv package

require('dotenv').config();

// Set up our openweathermap API_KEY

const apiKey = `${process.env.API_KEY}`;
const googleAPIKey = `${process.env.google_API_KEY}`
const Kelvin = 273.15

const MAX_NUM_NEWS = 1;
const NEWS_API_KEY = `${process.env.NEWS_API_KEY}`
const newsapi = new NewsAPI(NEWS_API_KEY);

// Setup our express app and body-parser configurations
// Setup our javascript template view engine
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Setup our default display on launch
app.get('/', function(req, res) {
    console.log("in get /")
    // It shall not fetch and display any data in the index page
    res.status(200).render('index', { response: null, error: null });
});

// On a post request, the app shall data from OpenWeatherMap using the given arguments
app.post('/', function(req, res) {
    console.log("in post /")
    console.log(req.body);
    // Get city name passed in the form
    let city = req.body.city;
    getLocation(city)
    .then(dataWithFormattedLocation => pipeResponseWithWeather(dataWithFormattedLocation))
    .then(dataWithFormattedLocationAndWeather => pipeResponseWithNews(dataWithFormattedLocationAndWeather, city))
    .then(fullResponse => renderPageWithResponseFromApis(fullResponse, res))
    .catch(error => renderErrorPage(error, res));
})

function renderPageWithResponseFromApis(response, res) {
    console.log("in renderPageWithResponseFromApis")
    // console.log(response);

    // we shall use the data got to set up our output
    let place = `${response.formatted_address}`,
        weatherTemp = `${response.current.temp}`,
        weatherIcon = `http://openweathermap.org/img/wn/${response.current.weather[0].icon}@2x.png`,
        weatherDescription = `${response.current.weather[0].description}`,
        wind = `${response.current.wind_speed}`,
        humidity = `${response.current.humidity}`,
        visibility = `${response.current.visibility}`,
        feelslike = `${response.current.feels_like}`,
        firstHourly = `${response.hourly[0].dt}`,
        secondHourly = `${response.hourly[1].dt}`,
        thirdHourly = `${response.hourly[2].dt}`,
        news = response.news;

    // We shall also round off the value of the degrees fahrenheit calculated into two decimal places
    function roundToOne(num) {
        return +(Math.round(num + "e+1") + "e-1");
    }
    
    weatherCelsius = roundToOne(weatherTemp);

    let currentPlusOne = getFormattedDate(firstHourly);
    let currentPlusTwo = getFormattedDate(secondHourly);
    let currentPlusThree = getFormattedDate(thirdHourly);

    weatherPlusOne = `${response.hourly[0].temp}`;
    hourlyWeatherOne = roundToOne(weatherPlusOne);

    weatherPlusTwo = `${response.hourly[1].temp}`;
    hourlyWeatherTwo = roundToOne(weatherPlusTwo);

    weatherPlusThree = `${response.hourly[2].temp}`;
    hourlyWeatherThree = roundToOne(weatherPlusThree);

    weatherTomorrowOne = `${response.hourly[0].temp}`;
    dailyWeatherOne = roundToOne(weatherTomorrowOne);

    weatherTomorrowTwo= `${response.hourly[1].temp}`;
    dailyWeatherTwo = roundToOne(weatherTomorrowTwo);

    weatherTomorrowThree = `${response.hourly[2].temp}`;
    dailyWeatherThree = roundToOne(weatherTomorrowThree);
    
    hourlyIconOne = `http://openweathermap.org/img/wn/${response.hourly[0].weather[0].icon}@2x.png`,
    hourlyIconTwo = `http://openweathermap.org/img/wn/${response.hourly[1].weather[0].icon}@2x.png`,
    hourlyIconThree = `http://openweathermap.org/img/wn/${response.hourly[2].weather[0].icon}@2x.png`,

    dailyIconOne = `http://openweathermap.org/img/wn/${response.daily[0].weather[0].icon}@2x.png`,
    dailyIconTwo = `http://openweathermap.org/img/wn/${response.daily[0].weather[0].icon}@2x.png`,
    dailyIconThree = `http://openweathermap.org/img/wn/${response.daily[0].weather[0].icon}@2x.png`

    return res.render('index', { response: response, place: place, temp: weatherCelsius, 
        icon: weatherIcon, description: weatherDescription, humidity: humidity, wind: wind, visibility: visibility, 
        feelslike: feelslike, currentPlusOne: currentPlusOne, currentPlusTwo: currentPlusTwo, currentPlusThree: currentPlusThree, 
        tempHourlyOne: hourlyWeatherOne, tempHourlyTwo: hourlyWeatherTwo, tempHourlyThree: hourlyWeatherThree, 
        iconOne: hourlyIconOne, iconTwo: hourlyIconTwo, iconThree: hourlyIconThree, 
        tempDailyOne: dailyWeatherOne, tempDailyTwo: dailyWeatherTwo, tempDailyThree: dailyWeatherThree,
        dayIconOne: dailyIconOne, dayIconTwo: dailyIconTwo, dayIconThree: dailyIconThree, news: news, error: null });
}

function renderErrorPage(error, res) {
    console.log("in renderErrorPage")
    console.log(error);
    return res.render('index', { response: null, error: 'Error, please try again' })
}

function getFormattedDate(time) {
    let formattedTime = new Date(0);
    formattedTime.setUTCSeconds(time);
    formattedTime = formatAMPM(formattedTime);
    return formattedTime;
}

function getLocation(city) {
    let api = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${googleAPIKey}`;
    let data = {};
    return axios.get(api).then(function(response) {
        console.log("IN getLocation success")
        if (response.data.status !== 'ZERO_RESULTS') {
            data.formatted_address = response.data.results[0].formatted_address;
            data.latLon = response.data.results[0].geometry.location;
            return data;    
        } else {
            console.log("No location in getLocation")
            throw new Error("NOT_FOUND_ERROR");
        }
    }).catch(function(err) {
        console.log("ERR IN getLocation")
        console.log(err);
        throw err;
    })
}

function pipeResponseWithWeather(prevResponse) {
    let part = "minutely"
    let formatted_address = prevResponse.formatted_address;
    let lat = prevResponse.latLon.lat;
    let lon = prevResponse.latLon.lng;
    let api = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${part}&units=metric&appid=${apiKey}`;
    return axios.get(api).then(function(response){
        console.log("in pipeResponseWithWeather success")
        let data = response.data;
        return {
            ...data,
            formatted_address
        }
    }).catch(function(err) {
        console.log("in pipeResponseWithWeather error")
        console.log(err);
        throw err;
    })
}

/**
 * Get news based on keyword + dateType
 * @param {*} keyword any string
 * @param {*} dateType can be one of the keys in NEWS_DATE_DURATION_TYPES
 */
function pipeResponseWithNews(prevResponse, keyword) {
    // date format 2022-03-25
    let toDate = new Date();
    let yesterday = new Date();
    let weekAgoDate = new Date();
    let twoWeekAgoDate = new Date();

    yesterday.setDate(toDate.getDate() - 1);
    weekAgoDate.setDate(toDate.getDate() - 7);
    twoWeekAgoDate.setDate(toDate.getDate() - 14);

    // format dates
    toDate = formatDateForNewsApi(toDate);
    yesterday = formatDateForNewsApi(yesterday);
    weekAgoDate = formatDateForNewsApi(weekAgoDate);
    twoWeekAgoDate = formatDateForNewsApi(twoWeekAgoDate);

    let reqArr = [
        newsapi.v2.everything({q: keyword, from: yesterday, to: toDate, language: 'en', sortBy: 'popularity', page: 1}),
        newsapi.v2.everything({q: keyword, from: weekAgoDate, to: toDate, language: 'en', sortBy: 'popularity', page: 1}),
        newsapi.v2.everything({q: keyword, from: twoWeekAgoDate, to: toDate, language: 'en', sortBy: 'popularity', page: 1})
    ]

    return Promise.all(reqArr)
        .then(axios.spread((...responses) => {
            console.log("in pipeResponseWithNews success")
            console.log(keyword);
            let yesterdayNewsResponse = responses[0];
            let weekAgoNewsResponse = responses[1];
            let twoWeekAgoNewsResponse = responses[2];

            let news = {
                yesterday: extractSingleNewsFromResponse(yesterdayNewsResponse.articles),
                week: extractSingleNewsFromResponse(weekAgoNewsResponse.articles),
                twoWeek: extractSingleNewsFromResponse(twoWeekAgoNewsResponse.articles)
            }
            return {
                news,
                ...prevResponse
            }
        }))
        .catch(error => {
            console.log("in pipeResponseWithNews error")
            console.log(`error has occured: ${error.message}. Returning 0 news`)
            return {
                ...prevResponse
            }
        })     
}

const formatDateForNewsApi = (date) => {
    let yr = date.getFullYear();
    // current month
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);

    return `${yr}-${month}-${day}`;
}

function extractSingleNewsFromResponse(newsArr) {
    if (newsArr.length > 0) {
        return newsArr[0];
    }
    
    return {};
}

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

const server = app.listen(port, function() {
    console.log('Weatherly listening on port 8080!');
});

module.exports = {
    server,
    extractSingleNewsFromResponse,
    getLocation
};