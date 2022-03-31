const request = require('supertest');
const { getLocation } = require('./script');
let server;
let extractSingleNewsFromResponseFunction;
let pipeResponseWithWeatherFunction;
let getFormattedDateFunction;
let formatAMPMFunction;
let formatDateForNewsApiFunction

function setup() {
    server = require('./script').server;
    extractSingleNewsFromResponseFunction = require('./script').extractSingleNewsFromResponse;
    pipeResponseWithWeatherFunction = require('./script').pipeResponseWithWeather;
    getFormattedDateFunction = require('./script').getFormattedDate;
    formatAMPMFunction = require('./script').formatAMPM;
    formatDateForNewsApiFunction = require('./script').formatDateForNewsApi;
}   

function teardown() {
    server.close();
}

beforeEach(() => {
    setup();
});

afterEach(() => {
    teardown();
});

describe("Unit Test, testExtractSingleNewsFromResponse", () => {
    test("Get valid news from response", () => {
        const firstNews = {name: "firstNews1"};
        const newsArray = [firstNews, {name: "testNews2"}];
        
        let actualNews = extractSingleNewsFromResponseFunction(newsArray);
        expect(actualNews).toStrictEqual(firstNews);
    })
})

describe("Unit Test, testExtractSingleNewsFromResponse", () => {
    test("Get empty object when news empty", () => {
        const newsArray = [];
        const expectedNews = {};
        
        let actualNews = extractSingleNewsFromResponseFunction(newsArray);
        expect(actualNews).toStrictEqual(expectedNews);
    })
})

describe("Unit Test, testgetFormattedDate", () => {
    test("Get current time", () => {
        const mockTime = 1648692182844;
        const expectedTime = '7:03 pm'
    
        let actualTime = getFormattedDateFunction(mockTime);
        expect(actualTime).toStrictEqual(expectedTime);
    })
})

describe("Unit Test, formatDateForNewsApi", () => {
    test("Format Date for News API double digit month double digit date", () => {
        const mockDate = new Date(628021800000);
        const expectedDate = "1989-11-25";
        let actualDate = formatDateForNewsApiFunction(mockDate);

        expect(actualDate).toStrictEqual(expectedDate)
    })

    test("Formate Date for News API single digit month single digit date", () => {
        const mockDate = new Date(2022, 0, 3);
        const expectedDate = "2022-01-03";
        let actualDate = formatDateForNewsApiFunction(mockDate);
        expect(actualDate).toStrictEqual(expectedDate);
    })
})




// describe("Unit Test, testing pipeResponseWithWeather", () => {
//     test("Get valid weather data", () => {
//         const expectedResult = { lat: 40, lon: 50 }
//         const mockData = { formatted_address: 'Vancouver, BC, Canada', latLon: { lat: 40, lng: 50 }, asdf: { asdf: 'asdf'} };
        
        
        
//         axios.get()

//         return pipeResponseWithWeatherFunction(mockDataPromise).then(data => {
//             expect(data).toBe(expectedResult)
//         })
//     })
// })



describe("Integration Test, check if application starts on port 8080", () => {
    test("if port is listening", async() =>{
        const response = await request(server).get('/').send({})
        expect(response.statusCode).toBe(200);
    })
})

describe("Integration Test with keyword Vancouver", () => {
    test("Successful response for POST with keyword Vancouver", async() =>{
        const response = await request(server)
            .post('/')
            .type('form')
            .send({city: "Vancouver"})

        expect(response.statusCode).toBe(200);
    })
<<<<<<< HEAD
})

// More unit tests

describe("Invalid Entry", () => {
    test("if app displays error when user enters invalid countries / mispelled", () => {
        const t = () => {
            getLocation("xx");
        };
        expect(t).toThrow("NOT_FOUND_ERROR");
    })
})


=======


})
>>>>>>> d741475372bc44930c0316cb2f704d04ee8ddead
