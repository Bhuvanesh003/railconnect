const express=require('express');
const app=express();
const path=require('path')
const router=express.Router();
const db=require('../db.js');
const bp=require('body-parser');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const session = require('express-session');
app.use(bp.urlencoded());

router.get('/login',(req,res,next)=>{

    if(req.session.email)
    {
        res.status(200).redirect('/home')
    }
    else
    {
        res.status(200).render('login.hbs',{title:"Login"});
    }
});

router.get('/',(req,res,next)=>{
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
                req.session.name=st[0].name;
                req.session.email=st[0].email;
                res.status(200).redirect('/home');
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
    if(req.session.email)
    {
        res.status(200).render('home.hbs',{title:"Home",name:req.session.name});
    }
    else
    {
        res.status(200).redirect('/login');
    }
})

router.get('/logout',(req,res,next)=>{

    if(req.session.email)
    {
        req.session.destroy();
        res.status(200).redirect('/login');
    }
    else
    {
        res.status(200).redirect('/login');
    }
});

router.post('/security',async (req,res,next)=>{

        var otp= req.session.otp;
        await console.log("OTP:"+ otp+"otp4: "+req.body.otp4+"PASS: "+req.session.pass);
        if(req.body.otp4!=otp%10)
        {
          res.status(500).render('security.hbs',{title:"Rail connect",error:"OTP is invalid"});
          return;
        }
        otp=Math.floor(otp/10);
        if(req.body.otp3!=otp%10)
        {
          res.status(500).render('security.hbs',{title:"Rail connect",error:"OTP is invalid"});
          return;
        }
        otp=Math.floor(otp/10);
        if(req.body.otp2!=otp%10)
        {
          res.status(500).render('security.hbs',{title:"Rail connect",error:"OTP is invalid"});
          return;
        }
        otp=Math.floor(otp/10);
        if(req.body.otp1!=otp%10)
        {
          res.status(500).render('security.hbs',{title:"Rail connect",error:"OTP is invalid"});
          return;
        }
        // DB STORE the USER 
        let dbs=await db.getdatabase();
        let col=dbs.collection('users');
        const saltRounds = 10;
        const myPlaintextPassword = req.session.pass;
        var name=req.session.name;
        var email=req.session.email;
        bcrypt.hash(myPlaintextPassword, saltRounds,async function(err, hash) {
            console.log("HASH"+hash);
            let data={name:req.session.name,email:req.session.email,password:hash};
            const st=await col.insertOne(data);
            if(st.acknowledged==true)
            {
                console.log("NAME:"+name);
                req.session.name = name;
                req.session.email = email;
                req.session.pass="";
                req.session.otp="";
                res.status(200).redirect('/home');
            }
            else
            {
                req.session.destroy();
                res.status(500).redirect('/login');
            }
        });
})

router.get('/register',(req,res,next)=>{
    if(req.session.email)
    {
        res.status(200).redirect('/home')
    }
    else
    {
        res.status(200).render('register.hbs',{title:"Signup"});
    }
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
        req.session.email=emailid;
        req.session.name=req.body.fname;
        req.session.pass=req.body.pass;
        console.log(req.session);
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
        const otp = Math.floor(Math.random() * (9999-1000) + 1000);
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
          
        req.session.otp=otp;
        res.status(200).render('security.hbs',{title:"Security"});

        // HASH A PASSWORD

        
        // const saltRounds = 10;
        // const myPlaintextPassword = req.body.pass;
        // bcrypt.hash(myPlaintextPassword, saltRounds,async function(err, hash) {

            // let data={name:req.body.fname,email:emailid,password:hash};
            // const st=await col.insertOne(data);
            // if(st.acknowledged==true)
            // {
            //     res.status(200).render('home.hbs',{title:"Home",name:req.body.fname});
            // }
            // else
            // {
            //     res.status(500).send('Error Occured');
            // }
            // });

    }
});

router.use('/',(req,res,next)=>{
    res.status(200).send("404 PAGE NOT FOUND");
})

module.exports=router;