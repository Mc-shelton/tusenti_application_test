

import request from 'supertest';
import server from '../src';
import { dbConnection } from '../src/dbconnection';
import { Encryption } from '../src/helpers/enc';

const encription = new Encryption
describe('GET /transaction/user/:userid', () => {

    afterAll(async () => {
        // Close the test database and server connection
        server.close();
        await dbConnection.end();
    });

    beforeEach(async () => {
        server.close()
        // Truncate the transactions table before each test
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
        const  userID = 'user123';

        // Retrieve the transaction using its ID
        const getTransactionResponse = await request(server)
            .get(`/transaction/user/${userID}`)
            .set('authorization', 'eyJhbGciOiJIUzI1NiJ9.dXNlX2NyZWRlbnRpYWxzX2hlcmU.Ze492YV8Bmz8C0y7VEbxCnGc3z48BS7zLisKn0zI4LA')
            // .send({
            //     userId: 'user123'
            // })

        expect(getTransactionResponse.statusCode).toBe(200);
        expect(getTransactionResponse.body).toHaveProperty('transaction');
        expect(getTransactionResponse.body.transaction[0]).toHaveProperty('userid' ,encription.cipher(userID));
        expect(getTransactionResponse.body).toHaveProperty('message', 'transaction was found');
    });

    it('should return a 404 status when transaction ID does not exist', async () => {
        const nonExistingTransactionId = 'random_user_123';

        const getTransactionResponse = await request(server)
            .get(`/transaction/user/${nonExistingTransactionId}`)
            .set('authorization', 'eyJhbGciOiJIUzI1NiJ9.dXNlX2NyZWRlbnRpYWxzX2hlcmU.Ze492YV8Bmz8C0y7VEbxCnGc3z48BS7zLisKn0zI4LA')
            
        expect(getTransactionResponse.statusCode).toBe(404);
        expect(getTransactionResponse.body).toHaveProperty('message', 'no transaction was found for user with that id');
    });

    it('should return a 403 status when not providing a session token', async () => {
        const getTransactionResponse = await request(server)
            .get(`/transaction/user/:userid`);

        expect(getTransactionResponse.statusCode).toBe(403);
    });
});
