const express = require('express')
const cors    = require('cors')
const helmet  = require('helmet')
const path    = require('path')
const router  = require('./routes')

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use('/api', router)

module.exports = app
