const mongoose=require('mongoose')

let now=new Date()


let dateformat=now.toDateString()


const regSchema=mongoose.Schema({
    email:String,
    password:String,
    firstname:String,
    lastname:String,
    mobile:Number,
    desc:String,
    role:{type:String,default:'free'},
    img:{type:String,default:'default.jpg'},
    creationDate:{type:String,default:dateformat},
    status:{type:String,default:'suspended'}
})


module.exports=mongoose.model('reg',regSchema)