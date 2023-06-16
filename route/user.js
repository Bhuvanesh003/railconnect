const express=require('express');
const app=express();
const path=require('path')
const router=express.Router();
const db=require('../db.js');
const bp=require('body-parser');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
app.use(bp.urlencoded());

router.get('/login',(req,res,next)=>{
    res.status(200).render('login.hbs',{title:"Login"});
});

router.post('/login',async (req,res,next)=>{
    console.log(req.body);
    let dbs=await db.getdatabase();
    let col=dbs.collection('users');
    let emailid=req.body.email;
    const st=await (await col.find({email:emailid})).toArray();
    if(st.length==0)
    {
        res.status(200).render('login.hbs',{title:"Login",error:"Email id does not exists"});
    }
    else
    {
        bcrypt.compare(req.body.pass, st[0].password, function(err, result) {
            console.log("RESULT"+result);
            if(result==true)
            {
                // req.session.user=st[0].name;
                res.status(200).render('home.hbs',{title:"Home",name:st[0].name});
            }
            else
            {
                res.status(200).render('login.hbs',{title:"Login",error:"Enter Valid Credentials"});
            }
        });
    }
});

router.get('/home',(req,res,next)=>{
    // console.log("Home"+req.body.fname);
    res.status(200).render('home.hbs',{title:"Home",name:"admin"});
})

router.post('/home',(req,res,next)=>{
    res.status(200).render('home.hbs',{title:"Home",name:"Admin"});
});

router.get('/security',(req,res,)=>{
    res.status(200).render('security.hbs',{title:"Security"});
})

router.get('/register',(req,res,next)=>{
    res.status(200).render('register.hbs',{title:"Signup"});
});

router.post('/register',async (req,res,next)=>{
    console.log(req.body);
    let dbs=await db.getdatabase();
    let col=dbs.collection('users');
    let emailid=req.body.email;
    const st=await (await col.find({email:emailid})).toArray();
    console.log("DEBUG");
    console.log(st);
    if(st.length > 0)
    {
        res.status(200).render('register.hbs',{title:"Signup",error:"Email Already Exists"});
    }
    else
    {

        var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'bhuvanesh.shiga@gmail.com',
    pass: 'Bhuvi70#',
    clientId: '724982070419-at81pqff1mthfk92hcav6i3s5ghgjm5h.apps.googleusercontent.com',
    clientSecret: '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',
    refreshToken: '1//04BwOjxeDBFQNCgYIARAAGAQSNwF-L9Irba0YcVxs7Vnd386CfrwRjl2nIoCHSSvC-fINfbV93RvziZqNA1oqiBgQop65P6N1Nr8'
  }
});
        var otp=Math.floor(Math.random() * 10000);
        console.log(otp);
        var mailOptions = {
            from: 'bhuvanesh.shiga@gmail.com',
            to: emailid,
            subject: 'Verify your email address - RailConnect',
            text: 'Your OTP for verification ' + otp
          };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });


        res.status(200).render('security.hbs',{title:"Security",otp:otp});

        // HASH A PASSWORD

        
        // const saltRounds = 10;
        // const myPlaintextPassword = req.body.pass;
        // bcrypt.hash(myPlaintextPassword, saltRounds,async function(err, hash) {
            
        //     let data={name:req.body.fname,email:emailid,password:hash};
        //     const st=await col.insertOne(data);
        //     if(st.acknowledged==true)
        //     {
        //         res.status(200).render('home.hbs',{title:"Home",name:req.body.fname});
        //     }
        //     else
        //     {
        //         res.status(500).send('Error Occured');
        //     }
        //     });

    }
});


module.exports=router;