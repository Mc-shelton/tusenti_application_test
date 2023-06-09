import request from 'supertest';
import server from '../src';
import { dbConnection } from '../src/dbconnection';

describe('GET /transaction/monthly report', () => {

    afterAll(async () => {
        // Close the test database and server connection
        server.close();
        await dbConnection.end();
    });

    beforeEach(async () => {
        // Truncate the transactions table before each test
        server.close()
        await dbConnection.query('TRUNCATE TABLE transactions');
    });

    it('should retrieve a transaction for specified month', async () => {
        // First, create a transaction to retrieve later
        const createTransactionResponse = await request(server)
            .post('/transaction')
            .set('authorization', 'eyJhbGciOiJIUzI1NiJ9.dXNlX2NyZWRlbnRpYWxzX2hlcmU.Ze492YV8Bmz8C0y7VEbxCnGc3z48BS7zLisKn0zI4LA')
            .send({
                amount: 100,
                type: 'debit',
                userID: 'user123',
            });

        expect(createTransactionResponse.statusCode).toBe(200);
        // const { transaction_id } = createTransactionResponse.body;

        // Retrieve the transaction using its ID
        const getTransactionResponse = await request(server)
            .get(`/transaction/reports/monthly`)
            .set('authorization', 'eyJhbGciOiJIUzI1NiJ9.dXNlX2NyZWRlbnRpYWxzX2hlcmU.Ze492YV8Bmz8C0y7VEbxCnGc3z48BS7zLisKn0zI4LA')
            .send({
                "month": 6,
                "year":2023

            })

        expect(getTransactionResponse.statusCode).toBe(200);
        expect(getTransactionResponse.body).toHaveProperty('transaction');
        expect(getTransactionResponse.body.transaction.length).toBeGreaterThan(0)
        expect(getTransactionResponse.body).toHaveProperty('message', 'transaction was found');
    });

    it('should return a 404 status when transaction is not found for the month', async () => {

        const getTransactionResponse = await request(server)
            .get(`/transaction/reports/monthly`)
            .set('authorization', 'eyJhbGciOiJIUzI1NiJ9.dXNlX2NyZWRlbnRpYWxzX2hlcmU.Ze492YV8Bmz8C0y7VEbxCnGc3z48BS7zLisKn0zI4LA')
            .send({
                "month": 62,
                "year":2023

            })
        expect(getTransactionResponse.statusCode).toBe(404);
        expect(getTransactionResponse.body).toHaveProperty('message', 'no transaction was found for that month');
    });

    it('should return a 403 status when not providing a session token', async () => {
        const getTransactionResponse = await request(server)
            .get(`/transaction/reports/monthly`);

        expect(getTransactionResponse.statusCode).toBe(403);
    });
});
