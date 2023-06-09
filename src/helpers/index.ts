import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import express from 'express'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
dotenv.config()

@Entity('transaction')
export class TransactionEntity {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column({ name: 'amount' })
    amount: number
    @Column({ name: 'type' })
    type: "debit" | "credit";
    @Column({ name: 'date' })
    readonly date: Date
    @Column({ name: 'userID' })
    userID: string

    constructor(amount: number, type: "debit" | "credit", userID: string) {
        this.amount = amount
        this.type = type
        this.userID = userID
        this.date = new Date()
    }
}


export const authorize = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const jwtToken = req.headers.authorization

    const jwtSecrete = process.env.JWT_TOKEN_SECRET


    jwt.verify(jwtToken, jwtSecrete, (err) => {
        if (err) {
            res.status(403).json({ message: 'auhtentication error', err })
        }
        else{

            next()
        }

    })
}
