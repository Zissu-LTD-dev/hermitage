const express = require('express')
const app = express()
require('dotenv').config() // load .env variables
require('express-async-errors') // error handling for async/await
const morgan = require('morgan') // logger
const path = require('path') 
const helmet = require('helmet') // security
const mongoSanitize = require('express-mongo-sanitize') // security
const xss = require('xss-clean') // security
const cookieParser = require('cookie-parser') // cookie parser
const cors = require('cors') 

// db connection
const connectDB = require('./db/connect.js')

// routes
const { authRouter } = require('./routers/authRouter.js')
const { fileUploadRouter } = require('./routers/fileUploadRouter.js')
const { adminRouter } = require('./routers/adminRouter.js')
const { branchRouter } = require('./routers/branchRouter.js')

// middleware
const {authAdmin, authManager} = require('./middleware/auth.js')

// only for production
app.use(express.static(path.join(__dirname, './client/public'))) 

app.use(express.json());
app.use(helmet())
app.use(mongoSanitize())
app.use(xss())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(cors())

app.use(express.json({limit: '70mb'}));
app.use(express.urlencoded({limit: '70mb', extended: true}));

app.get('/', (req, res) => {
    res.send('API is running...')
})

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/admin/file-upload', authAdmin, fileUploadRouter);
app.use('/api/v1/admin', authAdmin , adminRouter);
app.use('/api/v1/manager', authManager, branchRouter);

// server end db connection
const port = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening on port ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

start()