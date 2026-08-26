
import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB } from './config/mongodb.js'
import { env } from './config/environment.js'
import { APIs_V1 } from './routes/v1/index.js'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware.js'
import cors from 'cors'
import dns from 'node:dns/promises';
import { corsOptions } from '~/config/cors.js'
import cookieParser from 'cookie-parser'
const app = express()
// Xử lý socket real-time voi gói socket.io
// https://socket.io/get-started/chat/#integrating-socketio
import socketIo from 'socket.io'
import http from 'http'
import { inviteUserToBoardSocket } from '~/sockets/inviteUserToBoardSocket.js'
dns.setServers(['1.1.1.1', '1.0.0.1']);
app.use(cors(corsOptions))
app.use(express.json())
// Cấu hinh cookie parser
app.use(cookieParser())
const START_SERVER = () => {
    // Fix cache from disk của expressJS
    app.use((req, res, next) => {
        res.set('Cache-Control', 'no-store')
        next()
    })
    app.get('/', (req, res) => {
        res.send({
            message: 'Thành công'
        })
    })
    app.use('/v1', APIs_V1)
    // Middleware xử lý lỗi tập trung
    app.use(errorHandlingMiddleware)

    // Tạo 1 server mới bọc app express để làm real-time với socket.io
    const server = http.createServer(app)
    // Khởi tạo biến io với server và cors
    const io = socketIo(server, { cors: corsOptions })
    io.on('connection', (socket) => {
        // Gọi các socket tuỳ theo tính năng ở đây.
        inviteUserToBoardSocket(socket)
    })
    if (env.BUILD_MODE === 'production') {
        // Dùng server.listen thay vì app.listen vì lúc này server đã bao gom express app và dã config socket.io
        server.listen(env.PORT, () => {
            // eslint-disable-next-line no-console, indent
            console.log(`Lắng nghe ở cổng:${process.env.PORT}`)

        })
    } else {
        server.listen(env.PORT, () => {
            // eslint-disable-next-line no-console, indent
            console.log(`Dev: Lắng nghe ở cổng ${env.HOSTNAME}:${process.env.PORT}`)

        })
    }

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
