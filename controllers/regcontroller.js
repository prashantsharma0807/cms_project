const Reg = require('../models/reg')
const nodemailer = require('nodemailer')


exports.loginpage = (req, res) => {
   res.render('login.ejs', { message: '' })
}

exports.regpage = (req, res) => {
   res.render('reg.ejs', { message: '' })
}

exports.register = async (req, res) => {
   const { email, pass } = req.body
   const emailcheck = await Reg.findOne({ email: email })
   try {
      if (emailcheck == null) {
         const record = new Reg({ email: email, password: pass })
         record.save()
         res.render('reg.ejs', { message: 'Account successfully created' })
      } else {
         res.render('reg.ejs', { message: 'Email is already registered' })
      }
   }
   catch (error) {
      res.render('reg.ejs', { message: error.message })
   }
}

exports.login=async(req,res)=> {
   const {email,pass}=req.body
   try{
   const emailcheck=await Reg.findOne({email:email})
   if (emailcheck!==null) {
      if (emailcheck.password==pass) {
         if(emailcheck.status=='suspended' & emailcheck.email!=='admin@gmail.com'){
            res.render('login.ejs', { message: 'Your account is suspended. Please codinate with Admin' })
         }else{
         req.session.isAuth=true
         req.session.username=email
         req.session.role=emailcheck.role
         if (emailcheck.email=="admin@gmail.com") {
            res.redirect('/admin/dashboard')
         } else {
            res.redirect('/userprofile')
         }
      }} else {
         res.render('login.ejs', { message: 'wrong credentails' })
      }
   } else {
      res.render('login.ejs', { message: 'wrong credentails' })
   }
}catch(error){
   res.render('login.ejs', { message: error.message})
}
}

exports.dashboard=(req,res)=>{
   const username=req.session.username
   res.render('admin/dashboard.ejs',{username})
}

exports.profilepage =async (req, res) => {
   try{
   const loginname = req.session.username
   let test=['default.jpg']
   const record=await Reg.find({img:{$nin:test}})
   res.render('userprofile.ejs', { loginname,record })
}catch(error){
   res.send({message:error.message})
}
}

exports.logout = (req, res) => {
   req.session.destroy()
   res.redirect('/')
}

exports.forgotpage = (req, res) => {
   res.render('forgotform.ejs', { message: '' })
}

exports.forgotlink = async (req, res) => {
   const { email } = req.body
   try{
   let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
         user: 'pks637700@gmail.com', // generated ethereal user
         pass: 'zllgtmaiotxmsesd', // generated ethereal password
      },
   });
   console.log('connected to SMTP server')

   let info = await transporter.sendMail({
      from: 'pks637700@gmail.com', // sender address
      to: email, // list of receivers
      subject: 'Password rest Link:projectexpress', // Subject line
      text: "Please click the below link to REST the password", // plain text body
      html: `<a href=http://localhost:5000/changepassword/${email}>Click to rest</a>`, // html body
   });
   console.log('sent mail')
   res.render('forgotform.ejs', { message: 'Passsword reset Link has been sent your register Email id ' })
}catch(error){
   res.send({message:error.message})
}
}

exports.passwordresetform = (req, res) => {
   res.render('resetform.ejs', { message: '' })
}

exports.restpasswordchange = async (req, res) => {
   const { password } = req.body
   const email = req.params.email
   try{
   const record = await Reg.findOne({ email: email })
   const id = record.id
   await Reg.findByIdAndUpdate(id, { password: password })
   res.render('passwordchangemessage.ejs', { message: 'Successfully Password change please try with new password' })
   }catch(error){
      res.send({message:error.message})
   }
}


exports.logout=(req,res)=>{
   req.session.destroy()
   res.redirect('/')
}
exports.usermanagement=async(req,res)=>{
   const username=req.session.username
   try{
   const record= await Reg.find()
  // console.log(record)
   res.render('admin/usermanagement.ejs',{username,record,message:''})
   }catch(error){
      res.send({message:error.message})
   }

}

exports.userststusupdate=async(req,res)=>{
   const id=req.params.id
   try{
   const record1=await Reg.findById(id)
   let currentStatus=null
   if(record1.status=='suspended'){
      currentStatus='active'
   }else{
      currentStatus='suspended'
   }
   await Reg.findByIdAndUpdate(id,{status:currentStatus})
   const username=req.session.username
   const record= await Reg.find()
   res.render('admin/usermanagement.ejs',{username,record,message:'Successfully updated'})
}catch(error){
   res.send({message:error.message})
}
}

exports.profileupdate=async(req,res)=>{
   try{
   const loginname=req.session.username
   const record=await Reg.findOne({email:loginname})
   res.render('profileupdateform.ejs',{loginname,record,message:''})
   }catch(error){
      res.send({message:error.message})
   }
}

exports.update=async(req,res)=>{
   const{fname,lname,mobile,desc}=req.body
   try{
   const loginname=req.session.username
   const user=await Reg.findOne({email:loginname})
   const id=user.id
   if(req.file){
      const filename=req.file.filename
      await Reg.findByIdAndUpdate(id,{firstname:fname,lastname:lname,mobile:mobile,desc:desc,img:filename})
   }else{
   await Reg.findByIdAndUpdate(id,{firstname:fname,lastname:lname,mobile:mobile,desc:desc})
 }
   const record=await Reg.findOne({email:loginname})
   res.render('profileupdateform.ejs',{loginname,record,message:'Successsfully Updated'})
}catch(error){
   res.send({message:error.message})
}
}

exports.deleteprofile=async(req,res)=>{
   const id=req.params.id
   try{
   await Reg.findByIdAndDelete(id)
   const username=req.session.username
   const record= await Reg.find()
   res.render('admin/usermanagement.ejs',{username,record,message:'Successfully Deleted'})
   }catch(error){
      res.send({message:error.message})
   }

}
exports.singledata=async(req,res)=>{
   const id=req.params.id
   try{
   const loginname=req.session.username
   const singledata=await Reg.findById(id)
   res.render('singledata.ejs',{singledata,loginname,message:''}) 
   }catch(error){
      res.send({message:error.message})
   }
}

exports.roleupdate=async(req,res)=>{
   const id=req.params.id
   try{
   const record1=await Reg.findById(id)
   let newrole=null
   if(record1.role=='free'){
      newrole='subscribed'
   }else{
      newrole='free'
   }
   await Reg.findByIdAndUpdate(id,{role:newrole})
   const username=req.session.username
   const record= await Reg.find()
   res.render('admin/usermanagement.ejs',{username,record,message:'Role has been Successfully updated'})
}catch(error){
   res.send({message:error.message})
}
}


exports.back=(req,res)=>{ 
   res.redirect('/userprofile')
}

exports.resetform=(req,res)=>{
   const loginname = req.session.username
   res.render('passresetform.ejs',{loginname,message:''})
}


 exports.newpass=async(req,res)=>{
   const{cpass,npass}=req.body
   try{
   const loginname=req.session.username
  const record= await Reg.findOne({email:loginname})
  //console.log(record)
  const id=record.id
  let newpassword=null
  if(record.password==cpass){
     newpassword=npass
     }else{
     res.render('passresetform.ejs',{loginname,message:'Please enter old password correctly'})
     }
     await Reg.findByIdAndUpdate(id,{password:newpassword})
     res.render('passresetform.ejs',{loginname,message:'Password successfully Updated'})
   }catch(error){
      res.send({message:error.message})
   }
  } 



