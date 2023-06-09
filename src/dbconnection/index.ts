import { Client } from "pg";
export const dbConnection = new Client({
    user:'postgres',
    host:'localhost',
    database:'testdb',
    password:'Shelton.?',
    port : 5432
})

// const query = `
// CREATE TABLE users(
//     email varchar,
//     firstName varchar,
//     lastName varchar,
//     age int
// );`

// client.query(query,(err,res)=>{
//     if(err){
//         console.error(err)
//         return
//     }
//     console.log('table is created succ')
//     client.end()
// })