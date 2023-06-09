import express from 'express'
import { dbConnection } from '../dbconnection';


export const getTransactionMonthly = async (req: express.Request, res: express.Response) => {
    const sessionToken = req.headers.authorization;
    if (!sessionToken) {
        res.sendStatus(403)
    } else {

        const { month, year } = req.body
        if (!month || !year) {
            res.status(400).json({ message: "you did not provide all the parameters" })
        } else {

            const startDate = new Date(year, month - 1, 1)
            const endDate = new Date(year, month, 0, 23, 59, 59)

            const query = 'SELECT * FROM transactions WHERE date >=$1 AND date <= $2';
            const values = [startDate, endDate];


            try {
                const result = await dbConnection.query(query, values)
                if (result.rows.length === 0) {
                    res.status(404).json({ message: 'no transaction was found for that month' })
                } else {

                    res.status(200).json({ transaction: result.rows, message: 'transaction was found' })
                }




            } catch (error) {
                res.status(404).json({ message: 'kindly check the month and date format, make it numbers' })
            }


        }

    }
}