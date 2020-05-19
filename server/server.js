import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import  cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import mongoose from 'mongoose'

//server side rendering imports
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import {StaticRouter} from 'react-router-dom'
import MainRouter from './../client/MainRouter'
import {SheetsRegistry} from 'react-jss/lib/jss'
import JssProvider from 'react-jss/lib/JssProvider'
import {MuiThemeProvider, createGenerateClassName} from 'material-ui/styles'
import theme from './../styles/theme'

import devBundle from './devBundle' //comment out for production
import Template from './../views/template'
import config from './../config/config'
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'
import postRoutes from './routes/post.routes'

// App connection with express and mongodb
const app = express()
devBundle.compile(app) //comment out for production
const  options = {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}
mongoose.connect(config.mongoUri, options).then(conn => conn).catch(console.error)
const db = mongoose.connection
db.once('open', () => {
    console.log('DataBase Connection Successful')
})

// Express Middlewares
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(compress())
app.use(cors())
app.use(helmet())

//Serving static files
app.use('/dist', express.static(path.join(__dirname, 'dist')))

//Router middlewares
app.use('/', userRoutes)
app.use('/', authRoutes)
app.use('/', postRoutes)

app.get('*', (req, res) => {
    const sheetsRegistry = new SheetsRegistry()
    const generateClassName = createGenerateClassName()

    const context = {}
    const markup = ReactDOMServer.renderToString(
        <StaticRouter location={req.url} context={context}>
            <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
                <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
                    <MainRouter/>
                </MuiThemeProvider>
            </JssProvider>
        </StaticRouter>
    )

    if(context.url){
        res.redirect(303, context.url)
    }
    const css = sheetsRegistry.toString()

    res.status(200).send(Template({markup, css}))
})

app.use((err, req, res, next) => {
    if(err.name === 'UnauthorizedError') {
        res.status(401).json({error: err.name + ": " + err.message})
    }
})

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
})