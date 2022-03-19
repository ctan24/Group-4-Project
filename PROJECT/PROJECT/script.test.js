const request = require('supertest');
const script = require('./script');

describe("opening port", () => {
    test("if port is listening", async() =>{
        const response = await request('http://localhost:8080').get('/').send({
            
        })
        expect(response.statusCode).toBe(200)
    })
    
})