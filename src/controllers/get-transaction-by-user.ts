import express from 'express'
import { dbConnection } from '../dbconnection';
import { Encryption } from '../helpers/enc';


export const getTransactionByUser = async (req: express.Request, res: express.Response) => {
        const sessionToken = req.headers.authorization;
        if (!sessionToken) {
            res.sendStatus(403)
        }else{

            const { userId } = req.params
            if (!userId) {
                res.status(400).json({ message: "you did not provide all the parameters" })
            } else {

                const encryption = new Encryption
                const query = 'SELECT * FROM transactions WHERE userID =$1';
                console.log('this',userId)
                const values = [encryption.cipher(String(userId.trim()))];
    
    
                try {
                    const result = await dbConnection.query(query, values)
                    if (result.rows.length === 0) {
                        res.status(404).json({ message: 'no transaction was found for user with that id' })
                    }else{

                        res.status(200).json({ transaction: result.rows, message: 'transaction was found' })
                    }
    
    
    
    
                } catch (error) {
                    console.log(error)
                    res.status(404).json({ message: 'did not find user with that user ID' })
                }
    
    
            }
    
        }
}