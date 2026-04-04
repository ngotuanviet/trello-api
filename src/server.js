
import express from 'express'
const app = express()
const port = 3000
const hostname = 'localhost'
app.listen(port, hostname, () => {
    // eslint-disable-next-line no-console, indent
    console.log(`Lắng nghe ở cổng ${hostname}:${port}`)

})