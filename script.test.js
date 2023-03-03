const request = require('supertest');
let server;
let extractSingleNewsFromResponseFunction;
let pipeResponseWithWeatherFunction;
let getFormattedDateFunction;
let formatAMPMFunction;
let formatDateForNewsApiFunction;
let getLocation;

function setup() {
    server = require('./script').server;
    extractSingleNewsFromResponseFunction = require('./script').extractSingleNewsFromResponse;
    pipeResponseWithWeatherFunction = require('./script').pipeResponseWithWeather;
    getFormattedDateFunction = require('./script').getFormattedDate;
    formatAMPMFunction = require('./script').formatAMPM;
    formatDateForNewsApiFunction = require('./script').formatDateForNewsApi;
    getLocation = require('./script').getLocation;
}   

function teardown() {
    server.close();
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
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

/**
 * server computer time does not synchronize with local computer time.
 * please do not test TIME 
 */
// describe("Unit Test, testgetFormattedDate", () => {
//     test("Get current time", () => {
//         const mockTime = 1648782000;
//         const expectedTime = '8:00 pm'
    
//         let actualTime = getFormattedDateFunction(mockTime);
//         expect(actualTime).toStrictEqual(expectedTime);
//     })
// })

// describe("Unit Test, tesGetLoc", () => {
//     test("Expect Error when input is empty", () => {
//         const emptyLoc = " ";
//         return getLocation(emptyLoc).catch(error => {
//             expect(error.message).toBe("NOT_FOUND_ERROR");
//         })
//     })
// })


// describe("Unit Test, testGetLoc", () => {
//     test("empty entry should throw an error", () => {
//         const emptyLoc = " ";
//         return getLocation(emptyLoc).catch(error => {
//             expect(error.message).toBe("NOT_FOUND_ERROR");
//         })
//     })

//     test("invalid entry should throw an error", () => {
//         const invalidLoc = "Vancouvertadia";
//         return getLocation(invalidLoc).catch(error => {
//             expect(error.message).toBe("NOT_FOUND_ERROR");
//         })
//     })
// })

describe("Unit Test, formatDateForNewsApi", () => {
    test("Format Date for News API double digit month double digit date", () => {
        const mockDate = new Date("2022/11/28");
        const expectedDate = "2022-11-28";
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
})

describe("Integration Test with mispelled city", () => {
    test("if it still respond if there is 1 missing letter in the city", async() =>{
        const response = await request(server)
            .post('/')
            .type('form')
            .send({city: "Manil"})
        expect(response.statusCode).toBe(200);
    })

    test("if it still respond if city has mixed up letters", async() =>{
        const response = await request(server)
            .post('/')
            .type('form')
            .send({city: "Torotno"})
        expect(response.statusCode).toBe(200);
    })
})




