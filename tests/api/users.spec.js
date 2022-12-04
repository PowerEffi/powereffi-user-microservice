const request = require('supertest');
const app = require("../../app");

describe('Space test suite', () => {
    it('tests /destinations endpoints', async() => {
        const response = await request().get("/users");
        expect(response.body).toEqual("some String");
        //expect(response.body).toHaveLength(6);
        expect(response.statusCode).toBe(200);
        // Testing a single element in the array
        //expect(response.body).toEqual(expect.arrayContaining(['Earth']));

    });

    // Insert other tests below this line

    // Insert other tests above this line
});