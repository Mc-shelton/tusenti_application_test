import express from 'express'
import authentication from './transactions'
const router = express.Router()

export default (): express.Router =>{
    authentication(router)
    return router
}
 