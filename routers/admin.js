const router=require('express').Router()
const regc=require('../controllers/regcontroller')


function handlelogin(req,res,next){
    if(req.session.isAuth){
        next()
    }else{
        res.redirect('/')
    }
}


router.get('/dashboard',handlelogin,regc.dashboard)
router.get('/logout',regc.logout)
router.get('/usermanagement',handlelogin,regc.usermanagement)

router.get('/status/:id',handlelogin,regc.userststusupdate)

router.get('/deleteprofile/:id',handlelogin,regc.deleteprofile)

router.get('/role/:id',handlelogin,regc.roleupdate)


module.exports=router