const request = require('supertest');
let server;
let extractSingleNewsFromResponseFunction;

function setup() {
    server = require('./script').server;
    extractSingleNewsFromResponseFunction = require('./script').extractSingleNewsFromResponse;
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