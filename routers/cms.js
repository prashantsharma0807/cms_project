const router=require('express').Router()
const regc=require('../controllers/regcontroller')
const multer=require('multer')

let storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/upload')
    },
    filename:function(req,file,cb){
        cb(null, Date.now() + file.originalname)
    }
 })

const upload= multer({
    storage:storage,
    limits:{fileSize:4*1024*1024}
})

function handelrole(req,res,next){
    if(req.session.role!=='free'){
        next()
    }else{
        res.send("You don't have subcription to see the Contact Deatils ")
    }
}

function handlelogin(req,res,next){
    if(req.session.isAuth){
        next()
    }else{
        res.redirect('/')
    }
}

router.get('/',regc.loginpage)
router.get('/reg',regc.regpage)
router.post('/reg',regc.register)
router.post('/',regc.login)
router.get('/userprofile',handlelogin,regc.profilepage)

router.get('/logout',regc.logout)

router.get('/forgot',regc.forgotpage)
router.post('/forgot',regc.forgotlink)
router.get('/changepassword/:email',regc.passwordresetform)
router.post('/changepassword/:email',regc.restpasswordchange)

router.get('/profile',handlelogin,regc.profileupdate)
router.post('/profile',upload.single('img'),regc.update)
router.get('/singledata/:id',handlelogin,handelrole,regc.singledata)
router.get('/back',handlelogin,regc.back)
router.get('/passreset',regc.resetform)
router.post('/passreset',regc.newpass)





module.exports=router