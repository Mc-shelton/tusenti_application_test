import request from 'supertest';
import { dbConnection } from '../src/dbconnection';
import server from '../src';
// import {Server}from 'http'

describe('POST /transactions', () => {
    afterAll(async () => {
        // Close the test database connection
        server.close();
        await dbConnection.end();
    });

    beforeEach(async () => {
        // Truncate the transactions table before each test
        server.close();

        await dbConnection.query('TRUNCATE TABLE transactions');
    });

    it('should create a new financial transaction', async () => {
        const requestBody = {
            amount: 100,
            type: 'debit',
            userID: 'user123',
        };

        const response = await request(server)
            .post('/transaction')
            .set('authorization','eyJhbGciOiJIUzI1NiJ9.dXNlX2NyZWRlbnRpYWxzX2hlcmU.Ze492YV8Bmz8C0y7VEbxCnGc3z48BS7zLisKn0zI4LA')
            .send(requestBody);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('transaction_id');
        expect(response.body.message).toBe('transaction added successfully');

        // Assert the transaction details in the database
        const queryResult = await dbConnection.query('SELECT * FROM transactions');
        expect(queryResult.rows.length).toBe(1);
        expect(queryResult.rows[0].amount).toBe(requestBody.amount);
        expect(queryResult.rows[0].type).toBe(requestBody.type);
        

        // Cleaning up the database after the test
        await dbConnection.query('DELETE FROM transactions');
    });

    it('should return an error when not providing all parameters', async () => {
        const requestBody = {
            amount: 100,
            // Missing type and userID
        };

        const response = await request(server)
            .post('/transaction')
            .set('authorization','eyJhbGciOiJIUzI1NiJ9.dXNlX2NyZWRlbnRpYWxzX2hlcmU.Ze492YV8Bmz8C0y7VEbxCnGc3z48BS7zLisKn0zI4LA')
            .send(requestBody);

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message', 'you did not provide all the parameters');
    });

    it('should return a 403 status when not providing a session token', async () => {
        const requestBody = {
            amount: 100,
            type: 'debit',
            userID: 'user123',
        };

        const response = await request(server)
            .post('/transaction')
            .send(requestBody);

        expect(response.statusCode).toBe(403);
    });
});
