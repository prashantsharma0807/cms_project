const express=require('express')
const app=express()
require('dotenv').config()
app.use(express.urlencoded({extended:false}))

const mongoose=require('mongoose')
const session=require('express-session')
const adminrouter=require('./routers/admin')
const cmsrouter=require('./routers/cms')
mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`)


app.use(session({
    secret:process.env.KEY,
    resave:false,
    saveUninitialized:false,
    cookie:{maxAge:1000*60*60*24*365}
}))
app.use(cmsrouter)
app.use('/admin',adminrouter)
app.use(express.static('public'))
app.set('view engine','ejs')
app.listen(process.env.PORT)