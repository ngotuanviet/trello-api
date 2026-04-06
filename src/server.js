
import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, GET_DB } from './config/mongodb.js'
import { env } from './config/environment.js'

const app = express()

const START_SERVER = () => {

    app.get('/', async (req, res) => {
        res.send(await GET_DB().listCollections().toArray())
    })
    app.listen(env.PORT, env.HOSTNAME, () => {
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
