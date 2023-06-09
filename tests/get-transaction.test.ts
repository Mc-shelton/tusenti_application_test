

import request from 'supertest';
import server from '../src';
import { dbConnection } from '../src/dbconnection';

describe('GET /transaction/:id', () => {

    afterAll(async () => {
        // Close the test database and server connection
        server.close();
        await dbConnection.end();
    });

    beforeEach(async () => {
        // Truncate the transactions table before each test
        server.close();

        await dbConnection.query('TRUNCATE TABLE transactions');
    });

    it('should retrieve a transaction by ID', async () => {
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
        const { transaction_id } = createTransactionResponse.body;

        // Retrieve the transaction using its ID
        const getTransactionResponse = await request(server)
            .get(`/transaction/${transaction_id}`)
            .set('authorization', 'eyJhbGciOiJIUzI1NiJ9.dXNlX2NyZWRlbnRpYWxzX2hlcmU.Ze492YV8Bmz8C0y7VEbxCnGc3z48BS7zLisKn0zI4LA')
            // .send({
            //     transactionId: transaction_id
            // })

        expect(getTransactionResponse.statusCode).toBe(200);
        expect(getTransactionResponse.body).toHaveProperty('transaction');
        expect(getTransactionResponse.body.transaction).toHaveProperty('id', transaction_id);
        expect(getTransactionResponse.body).toHaveProperty('message', 'transaction was found');
    });

    it('should return a 404 status when transaction ID does not exist', async () => {
        const nonExistingTransactionId = '496c1056-3bd6-450c-951c-efc9632cfeee';

        const getTransactionResponse = await request(server)
            .get(`/transaction/${nonExistingTransactionId}`)
            .set('authorization', 'eyJhbGciOiJIUzI1NiJ9.dXNlX2NyZWRlbnRpYWxzX2hlcmU.Ze492YV8Bmz8C0y7VEbxCnGc3z48BS7zLisKn0zI4LA')
            .send({
                transactionId: nonExistingTransactionId

            })
        expect(getTransactionResponse.statusCode).toBe(404);
        expect(getTransactionResponse.body).toHaveProperty('message', 'no transaction was found with that id');
    });

    it('should return a 403 status when not providing a session token', async () => {
        const getTransactionResponse = await request(server)
            .get(`/transaction/:id`);

        expect(getTransactionResponse.statusCode).toBe(403);
    });
});
