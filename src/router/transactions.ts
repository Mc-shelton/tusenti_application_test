import express from 'express'
import { authorize } from '../helpers';
import { transaction } from '../controllers/transaction';
import { getTransaction } from '../controllers/get-transaction';
import { getTransactionByUser } from '../controllers/get-transaction-by-user';
import { getTransactionMonthly } from '../controllers/get-monthly-report';

export default (router: express.Router) => {
    router.post('/transaction', authorize, transaction)
    router.get('/transaction/:id', authorize, getTransaction)
    router.get('/transaction/user/:userId', authorize, getTransactionByUser)
    router.get('/transaction/reports/monthly', authorize, getTransactionMonthly)
};