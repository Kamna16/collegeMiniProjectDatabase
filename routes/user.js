const {Router} = require('express');
const User = require('../models/user')
const router = Router();

router.get('/signIn', (req,res) =>{
    return res.render("signin");
})
router.get('/signUp', (req,res) =>{
    return res.render("signup");
})

router.post('/signIn', async(req,res) =>{
    const {email, password} = req.body;

    try {
        const token = await User.matchPasswordAndGenerateToken(email,password);

        // console.log("Token" , token);
        return res.cookie("token",token).redirect('/'); 
        
    } catch (error) {
        return res.render("signIn",{
            error: "Incorrect Email or Password",
        })
    }
})
router.post('/signUp',async (req,res) =>{
    const { fullname, email, password} = req.body;
    await User.create({
        fullname,
        email,
        password,
    });

    return res.redirect('/'); 
})

router.get('/logout', (req,res) => {
    res.clearCookie("token").redirect("/");
}) 


module.exports = router;