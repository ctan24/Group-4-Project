const api = {
    key: "763668160b3a1784171769c2e04d2a3d",
    base: "https://api.openweathermap.org/data/2.5/"
}
console.log("hi"); 
let searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setCity);

function setCity(key){
    if(key.keyCode == 13){      //13 is enter on the keyboard
        getWeather(searchbox.value);
        console.log(searchbox.value);
    }
}

function getWeather(city){
    //fetches data from api and converts to celcius
    fetch(`${api.base}weather?q=${city}&units=metric&APPID=${api.key}`)
        .then(weather => {      //converts result to json
            return weather.json();
        }).then(setWeather);    //passes results to setWeather
}

function setWeather(weather){
    console.log(weather);
    let city = document.querySelector('.city');
    city.innerText = `${weather.name}, ${weather.sys.country}`;

    let now = new Date();
    let date = document.querySelector('.date');
    date.innerText = setDate(now);

    let temp = document.querySelector('.temp');
    temp.innerHTML = `${Math.round(weather.main.temp)}°C`;

    let weatherReport = document.querySelector('.weather');
    weatherReport.innterText = weather.weather[0].main;

    let hilow = document.querySelector('.hi-low');
    hilow.innerText = `${weather.main.temp_min}°C / ${weather.main.temp_max}°C`;
}

function setDate(d){
    let months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
    "Friday", "Saturday"];
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
}