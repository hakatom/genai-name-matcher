const request = require('supertest');
const app = require('../server');

describe('API Endpoints', () => {

    test('POST /api/match should return match result', async () => {
        const res = await request(app)
            .post('/api/match')
            .send({
                name1: 'John Doe',
                name2: 'John Doe'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('match', true);
        expect(res.body).toHaveProperty('score', 1.0);
    });

    test('POST /api/match should handle no match', async () => {
        const res = await request(app)
            .post('/api/match')
            .send({
                name1: 'John Doe',
                name2: 'Alice Smith'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('match', false);
    });

    test('POST /api/match should handle missing data', async () => {
        const res = await request(app)
            .post('/api/match')
            .send({});

        // Should return 400 Bad Request for missing required fields
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('match', false);
        expect(res.body).toHaveProperty('error');
    });
});
