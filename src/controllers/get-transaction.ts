import express from 'express'
import { dbConnection } from '../dbconnection';


export const getTransaction = async (req: express.Request, res: express.Response) => {
        const sessionToken = req.headers.authorization;
        if (!sessionToken) {
            res.sendStatus(403)
        }else{

            const { id } = req.params
            // console.log(id)
            if (!id) {
                res.status(400).json({ message: "you did not provide all the parameters" })
            } else {
    
                const query = 'SELECT * FROM transactions WHERE id =$1';
                const values = [id.trim()];
    
    
                try {
                    const result = await dbConnection.query(query, values)
                    if (result.rows.length === 0) {
                        res.status(404).json({ message: 'no transaction was found with that id' })
                    }else{

                        res.status(200).json({ transaction: result.rows[0], message: 'transaction was found' })
                    }
    
    
    
    
                } catch (error) {
                    res.status(404).json({ message: 'no transaction was foound with that id' })
                }
    
    
            }
    
        }
}