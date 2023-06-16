const bp = require('body-parser');
const express=require('express');
const app=express();
const userroute=require('../route/user');
const path=require('path');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const { engine }=require('express-handlebars');

app.use(bp.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'..','public')));
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "youcannotbreakthisman",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));
app.engine('hbs',engine({extname:'.hbs',defaultLayout:false}));
app.set('view engine','hbs');
app.set('views','views');
app.use(userroute);
app.listen(3000,()=>{
    console.log("HII");
});