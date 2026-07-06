
import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, GET_DB } from './config/mongodb.js'
import { env } from './config/environment.js'
import { APIs_V1 } from './routes/v1/index.js'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware.js'
import cors from 'cors'
import dns from 'node:dns/promises';
const app = express()

dns.setServers(['1.1.1.1', '1.0.0.1']);
app.use(cors())
app.use(express.json())
const START_SERVER = () => {
    app.get('/', (req, res) => {
        res.send({
            message: 'Thành công'
        })
    })
    app.use('/v1', APIs_V1)
    // Middleware xử lý lỗi tập trung
    app.use(errorHandlingMiddleware)
    app.listen(env.PORT, () => {
        // eslint-disable-next-line no-console, indent
        console.log(`Lắng nghe ở cổng ${env.HOSTNAME}:${process.env.PORT}`)

    })
    exitHook(() => {

        console.log('Exiting app');
    })
}
(async () => {
    try {
        console.log('1. Connecting to MongoDB')
        await CONNECT_DB()
        console.log('2. Connected to MongoDB');
        START_SERVER()
    } catch (error) {
        console.error(error);
        process.exit(0)
    }
})()
// CONNECT_DB()
//     .then(() => console.log('Connected to MogoDB'))
//     .then(() => START_SERVER())
//     .catch(e => {
//         console.error(e)
//         process.exit(0)
//     })
