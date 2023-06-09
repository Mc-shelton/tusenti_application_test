import express from 'express'
import { TransactionEntity } from '../helpers';
import {dbConnection} from '../dbconnection';
import { Encryption } from '../helpers/enc';


export const transaction = async (req: express.Request, res: express.Response) => {
    try {
        const sessionToken = req.headers.authorization;
        if (!sessionToken) {
             res.sendStatus(403)
        }
        const { amount, type, userID } = req.body
        if (!amount || !type || !userID) {
            res.status(400).json({ message: "you did not provide all the parameters" })
        } else {

            try {
                const encryption = new Encryption
                const transaction = new TransactionEntity(amount, type, userID)
                const query = 'INSERT INTO transactions (amount, type, date, userID) VALUES ($1, $2, $3, $4) RETURNING id';
                const values = [transaction.amount, transaction.type,transaction.date, encryption.cipher(transaction.userID)];
                

                try{
                     const result = await dbConnection.query(query,values)
                     res.status(200).json({transaction_id:result.rows[0].id,message:"transaction added successfully"})
                     
                     
                }catch(error){
                    console.error('Error executing sql : ',error)
                    res.status(400).json({message:'error creating transaction'})
                }


            } catch {

                res.status(500).json({ message: "an error occured" })
            }
        }

    } catch (error) {
        console.log('errror : auth', error)
         res.sendStatus(400)
    }
}